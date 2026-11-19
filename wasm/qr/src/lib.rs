//! QR encoder for the browser, compiled to WebAssembly without wasm-bindgen.
//!
//! ABI (all numbers are i32/u32):
//!   alloc(len) -> ptr            reserve `len` bytes for the input text
//!   dealloc(ptr, len)            free them again
//!   encode(ptr, len, ecc) -> n   encode UTF-8 text; ecc 0..=3 = L, M, Q, H.
//!                                n > 0: modules per side; n < 0: error (see ERR_*)
//!   modules_ptr() -> ptr         n*n bytes, 1 = dark, row by row
//!   version() -> v               QR version 1..=40 of the last code
//!   svg_path(margin) -> len      build an SVG path of the dark modules, shifted by
//!   svg_ptr() -> ptr             `margin`; read `len` ASCII bytes at svg_ptr()
//!   capacity(ecc) -> bytes       how many UTF-8 bytes fit at this level (byte mode)
//!
//! The module buffer and the path live in statics and are overwritten by the next call.

use qrcodegen::{QrCode, QrCodeEcc, QrSegment, Version};
use std::fmt::Write;

pub const ERR_TOO_LONG: i32 = -1;
pub const ERR_BAD_ECC: i32 = -2;
pub const ERR_EMPTY: i32 = -3;

struct State {
    modules: Vec<u8>,
    size: i32,
    version: i32,
    svg: String,
}

static mut STATE: State = State { modules: Vec::new(), size: 0, version: 0, svg: String::new() };

#[allow(static_mut_refs)]
fn state() -> &'static mut State {
    // Single-threaded wasm: no concurrent access.
    unsafe { &mut STATE }
}

fn ecc_of(n: u32) -> Option<QrCodeEcc> {
    Some(match n {
        0 => QrCodeEcc::Low,
        1 => QrCodeEcc::Medium,
        2 => QrCodeEcc::Quartile,
        3 => QrCodeEcc::High,
        _ => return None,
    })
}

/// Encodes `text` and stores the modules. Returns the side length or an error code.
pub fn encode_str(text: &str, ecc: u32) -> i32 {
    let Some(ecl) = ecc_of(ecc) else { return ERR_BAD_ECC };
    if text.is_empty() {
        return ERR_EMPTY;
    }
    // Mode selection (numeric / alphanumeric / byte) is automatic. The chosen level is
    // kept as is (no boosting), so what the person picked is what the code carries.
    let segs = QrSegment::make_segments(text);
    let qr = match QrCode::encode_segments_advanced(&segs, ecl, Version::MIN, Version::MAX, None, false) {
        Ok(qr) => qr,
        Err(_) => return ERR_TOO_LONG,
    };
    let s = state();
    let size = qr.size();
    s.modules.clear();
    s.modules.reserve((size * size) as usize);
    for y in 0..size {
        for x in 0..size {
            s.modules.push(qr.get_module(x, y) as u8);
        }
    }
    s.size = size;
    s.version = qr.version().value() as i32;
    size
}

/// SVG path of the dark modules, horizontal runs merged into one rectangle each.
pub fn build_svg_path(margin: u32) -> &'static str {
    let s = state();
    s.svg.clear();
    let n = s.size as usize;
    let m = margin as usize;
    for y in 0..n {
        let row = &s.modules[y * n..(y + 1) * n];
        let mut x = 0;
        while x < n {
            if row[x] == 1 {
                let start = x;
                while x < n && row[x] == 1 {
                    x += 1;
                }
                let _ = write!(s.svg, "M{} {}h{}v1h-{}z", start + m, y + m, x - start, x - start);
            } else {
                x += 1;
            }
        }
    }
    &s.svg
}

/// Largest number of UTF-8 bytes that fit at this level in byte mode (version 40).
pub fn byte_capacity(ecc: u32) -> i32 {
    // ISO/IEC 18004 table 7, version 40, byte mode.
    match ecc {
        0 => 2953,
        1 => 2331,
        2 => 1663,
        3 => 1273,
        _ => ERR_BAD_ECC,
    }
}

// ── wasm exports ─────────────────────────────────────────────────────────────

#[no_mangle]
pub extern "C" fn alloc(len: usize) -> *mut u8 {
    let mut buf = Vec::<u8>::with_capacity(len.max(1));
    let ptr = buf.as_mut_ptr();
    std::mem::forget(buf);
    ptr
}

/// # Safety
/// `ptr`/`len` must come from `alloc` and not be freed twice.
#[no_mangle]
pub unsafe extern "C" fn dealloc(ptr: *mut u8, len: usize) {
    drop(Vec::from_raw_parts(ptr, 0, len.max(1)));
}

/// # Safety
/// `ptr..ptr+len` must be a readable buffer from `alloc`.
#[no_mangle]
pub unsafe extern "C" fn encode(ptr: *const u8, len: usize, ecc: u32) -> i32 {
    let bytes = std::slice::from_raw_parts(ptr, len);
    match std::str::from_utf8(bytes) {
        Ok(text) => encode_str(text, ecc),
        Err(_) => ERR_EMPTY,
    }
}

#[no_mangle]
pub extern "C" fn modules_ptr() -> *const u8 {
    state().modules.as_ptr()
}

#[no_mangle]
pub extern "C" fn version() -> i32 {
    state().version
}

#[no_mangle]
pub extern "C" fn svg_path(margin: u32) -> usize {
    build_svg_path(margin).len()
}

#[no_mangle]
pub extern "C" fn svg_ptr() -> *const u8 {
    state().svg.as_ptr()
}

#[no_mangle]
pub extern "C" fn capacity(ecc: u32) -> i32 {
    byte_capacity(ecc)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn encodes_url() {
        let n = encode_str("https://example.com", 1);
        assert_eq!(n, 25); // version 2
        assert_eq!(state().version, 2);
        // Finder pattern corner is dark, the separator next to it light.
        assert_eq!(state().modules[0], 1);
        assert_eq!(state().modules[7], 0);
    }

    #[test]
    fn rejects_bad_input() {
        assert_eq!(encode_str("", 1), ERR_EMPTY);
        assert_eq!(encode_str("x", 9), ERR_BAD_ECC);
        let long = "é".repeat(2000); // 4000 bytes
        assert_eq!(encode_str(&long, 3), ERR_TOO_LONG);
    }

    #[test]
    fn capacity_is_exact() {
        let fits = "a".repeat(byte_capacity(3) as usize);
        assert!(encode_str(&fits, 3) > 0);
        let over = "a".repeat(byte_capacity(3) as usize + 1);
        assert_eq!(encode_str(&over, 3), ERR_TOO_LONG);
    }

    #[test]
    fn svg_merges_runs() {
        encode_str("HELLO", 0);
        let p = build_svg_path(4).to_string();
        // Top-left finder: 7 dark modules in a row at (4,4).
        assert!(p.starts_with("M4 4h7v1h-7z"));
    }
}
