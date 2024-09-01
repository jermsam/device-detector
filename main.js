import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import {getEnhancedFingerprint} from './device.js';

export async function setDeviceInfo(element) {
  const browserInfo = await getEnhancedFingerprint();
  const setDevice = () => {
    let html = ''
   for (const [key, value] of Object.entries(browserInfo)) {
     html += `<p>${key}: ${value}<p>`;
   }
    element.innerHTML = html
  }

  setDevice()
}


document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <div id="device"></div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setDeviceInfo(document.querySelector('#device'))
