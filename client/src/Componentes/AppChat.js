import React from 'react';
import MessageList from './MessageList';

import DadosApi from '../Servico/DadosApi';
import { ReCaptcha, loadReCaptcha } from 'react-recaptcha-v3'

export default class AppChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posicao: 'right',
            requisicao: '',
            resposta: {},
            texto: '',
            context: null,
            dataSource: [],
            ErrorMessage: '',
            sessionId: '',
            avatar: false,
            disabled: false,
            exibeInput: '',
            loading: false,
            nome: '',
            email: '',
            backImg: '',
            backImgClose: null
        };

        this.inputMsg = React.createRef();

        this.onClick = this.onClick.bind(this);
        this.verifyCallback = this.verifyCallback.bind(this);

        DadosApi.before = () => {
            this.setState({ loading: true });
        };
    }

    async verifyCallback(response) {

        this.setState({ response: response });
        let responseSession = await DadosApi.obterSession(response);
        this.setState({ loading: false });

        if (responseSession && responseSession.data.session_id) {
            this.state.sessionId = responseSession.data.session_id;
            await this.enviarRequisicao();

        } else {
            this.setState({ MensagemErro: "Recaptcha Inválido" });
        }

        return responseSession;
    }

    componentDidMount() {
        loadReCaptcha("6LcxsKoUAAAAANcv1ELzcW54Yh9SWoLuPMdSdStN");
    }

    handleChangeMensagem(event) {
        this.state.texto = event.target.value;
        this.setState(this.state);
    }

    async enviarRequisicao() {

        if (!this.state.loading) {

            if (this.state.context) {
                var request = {
                    texto: this.state.texto,
                    context: this.state.context,
                    sessionId: this.state.sessionId
                }
            } else {
                var request = {
                    texto: '',
                    sessionId: this.state.sessionId,
                    nome: "meu bot",
                    email: "kleber@kleberalves.com.br"
                }

                let divRecaptcha = document.getElementsByClassName("grecaptcha-badge")[0];
                if (divRecaptcha) {
                    divRecaptcha.style.display = "none";
                }
            }


            if (this.state.texto) {
                var data = new Date()
                var formataHora = data.getHours() + ":" + (data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes());
                let dataSource = this.state.dataSource;

                dataSource.push({
                    status: 'read',
                    position: "right",
                    type: 'text',
                    text: this.state.texto,
                    dateString: formataHora
                })

                this.setState({
                    dataSource: dataSource,
                    disabled: true,
                    loading: true
                });

                if (this.inputMsg) {
                    this.inputMsg.current.value = "";
                }
            }


            try {
                this.resposta = await DadosApi.obterResposta(request);
                this.state.context = this.resposta.data.context;

                if (this.state.dataSource.length > 60) {
                    this.state.dataSource.splice(0, 55);
                }

                var data = new Date();
                var formataHora = data.getHours() + ":" + (data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes());

                var valor = '';
                var tipo = '';
                var hora = ''

                if (this.resposta.status >= 400 || this.resposta == undefined) {

                    if (this.resposta.status === 406) {
                        valor = 'Você ficou muito tempo sem interagir comigo, por isso sua sessão expirou. Por favor, inicie novamente a conversa.';
                    } else {
                        valor = 'Estou com algum problema com meus servidores. Tente falar comigo novamente mais tarde!';
                    }
                    tipo = 'text';
                    hora = data;


                    this.state.dataSource.push({
                        position: 'left',
                        type: tipo,
                        text: valor,
                        dateString: formataHora,
                        date: hora,
                    });

                    this.setState({
                        avatar: true,
                        dataSource: this.state.dataSource,
                        context: this.resposta.data.context,
                        disabled: false,
                        loading: false
                    });

                } else {

                    let itemMsgLst = null;
                    this.resposta.data.output.generic.map((item, idx) => {


                        if (this.tentativa) {
                            //Se chegou aqui, significa que a tentativa deu certo pois o generic veio preenchido
                            this.tentativa = null;
                        }

                        if (!itemMsgLst) {
                            itemMsgLst = {
                                position: 'left',
                                type: null,
                                text: null,
                                idx: idx,
                                lstText:[]
                            };
                        }

                        if (item.response_type === 'text') {

                            if (itemMsgLst.idx !== idx) {
                                itemMsgLst.text = itemMsgLst.text + " " + item.text;
                            } else {
                                itemMsgLst.text = item.text;
                            }

                            itemMsgLst.type = 'text'
                        }

                        if (item.response_type === 'option') {

                            if (!itemMsgLst.buttons) {
                                itemMsgLst.buttons = {};
                                itemMsgLst.buttons.items = [];
                            }

                            if (itemMsgLst.text) {
                                itemMsgLst.text = itemMsgLst.text + " " + item.title;
                            } else {
                                itemMsgLst.text = item.title;
                            }

                            itemMsgLst.buttons.items = item.options;
                        }

                        if (item.response_type === 'image') {
                            if (!itemMsgLst.backImg) {
                                this.state.backImg = item.source;
                                itemMsgLst.backImg = item.source;
                            } else {
                                itemMsgLst.miniImg = item.source;
                            }
                        }

                    });

                    if (!itemMsgLst.backImg) {
                        this.setState({ backImgClose: true });
                    } else {
                        this.setState({ backImgClose: null });

                    }

                    
                    if (itemMsgLst.text) {

                        itemMsgLst.text = itemMsgLst.text.replace(/(?:\r\n|\r|\n)/g, ' <br/> ');
                        itemMsgLst.lstText = itemMsgLst.text.split(" ");
                    }
                    //itemMsgLst.text = parse(itemMsgLst.text);

                    this.state.dataSource.push(itemMsgLst);

                    this.setState({
                        avatar: true,
                        dataSource: this.state.dataSource,
                        context: this.resposta.data.context,
                        disabled: false,
                        loading: false
                    });

                }

                this.setState({ loading: false });

            } catch (error) {

                if (!this.tentativa) {
                    this.enviarRequisicao();
                    this.tentativa = true;
                } else {
                    this.state.dataSource.push({ text: "Tive um probleminha para processar a sua mensagem. Pode enviar novamente, por favor?" });


                    this.setState({
                        avatar: true,
                        dataSource: this.state.dataSource,
                        context: this.resposta.data.context,
                        disabled: false,
                        loading: false
                    });
                }

                this.setState({
                    loading: false,
                    ErrorMessage: error
                });
            }
        }
    }

    onClick(text) {
        this.state.texto = text;
        this.enviarRequisicao();
    }

    render() {

        return (<div className="msgChat">
            <div className={this.state.backImgClose ? "backImg close" : "backImg"} style={this.state.backImg ? { backgroundImage: "url('" + this.state.backImg + "')" } : null}></div>
            <div id="boxMessageList">
                <MessageList loading={this.state.loading} onClick={this.onClick} dataSource={this.state.dataSource} />
            </div>
            {this.state.dataSource.length > 0 && <div className="alignInput">
                <textarea ref={this.inputMsg} placeholder="Escreva algo aqui..." rows="1" cols="20" onChange={this.handleChangeMensagem.bind(this)}
                    onKeyPress={(e) => {
                        if (e.shiftKey && e.charCode === 13) {
                            return true;
                        }
                        if (e.charCode === 13) {
                            this.enviarRequisicao()
                            e.preventDefault();
                            return false;
                        }
                    }}>

                </textarea>
                <div className="btnSend" onClick={this.enviarRequisicao.bind(this)} title="Enviar"></div>
            </div>}

            <ReCaptcha sitekey="6LcxsKoUAAAAANcv1ELzcW54Yh9SWoLuPMdSdStN" action='homepage' verifyCallback={this.verifyCallback} />

        </div>);
    }
}

