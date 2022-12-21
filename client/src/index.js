import React from 'react';
import ReactDOM from 'react-dom';
import AppChat from './Componentes/AppChat';
import './sass/main.scss';

/*import './fontes/firasans-regular-webfont.ttf';
import './fontes/firasans-regular-webfont.eot';
import './fontes/firasans-regular-webfont.svg';*/

// SP.SOD.executeOrDelayUntilEventNotified(function() {
//     //Executa o React apenas quando carregar as funções no SharePoint
//     ReactDOM.render(<App />, document.getElementById("ChatRoot"));
//   }, "sp.bodyloaded");

ReactDOM.render(
    <AppChat/>,
document.getElementById('WebsiteRoot'));



