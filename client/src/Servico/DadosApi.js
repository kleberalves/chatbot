import API from '../Servico/Utils/Api'


async function obterSession(response) {
    if (this.before) {
        this.before();
    }
    try {
          
        return await API.post('session', { response: response });

    } finally {
        if (this.onFinally) {
            this.onFinally();
        }
    }
}

async function boasVindas(sessionId, nome, email) {

    var request = {
        texto: '',
        sessionId: sessionId,
        nome: nome,
        email: email
    }
    if (this.before) {
        this.before();
    }
    try {
        return await API.post('chat', request);
    } finally {
        if (this.onFinally) {
            this.onFinally();
        }
    }
}

async function obterResposta(requisicao) {

    return await API.post('chat', requisicao).catch(function (error) {
        if (error.response) {
            return error.response
        }
    })
}


export let onFinally;
export let before;

export default {
    obterResposta,
    boasVindas,
    obterSession,
    onFinally,
    before
}

