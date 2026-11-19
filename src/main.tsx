import { render } from 'preact';
import '@fontsource-variable/hanken-grotesk';
import './styles/app.css';
import { App } from './app';
import { registerPwa } from './pwa';

render(<App />, document.getElementById('app')!);
registerPwa();
