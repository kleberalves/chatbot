import { Mensagem} from '../models/mensagem.model';

import { Recaptcha } from '../models/recaptcha.model';

import { inject } from '@loopback/core';

import {
  AssistantService, AssistantServiceBindings,
} from '.'

import { BindingKey } from '@loopback/context';

export namespace ChatServiceBindings {
  export const SERVICE = BindingKey.create<ChatService>(
    'application.chat',
  );
}

export class ChatService {
  // tslint:disable-next-line:no-any
  public assistant: any;
  public newContext: object;

  constructor(
    @inject(AssistantServiceBindings.SERVICE)
    public assistantService: AssistantService
  ) {

    this.newContext = {
      global: {
        system: {
          turn_count: 1,
          timezone: 'America/Sao_Paulo'
        }
      },
      skills: {
        'main skill': {
          user_defined: {
            "nome": "",
            "email": ""
          }
        }
      }
    };
  }

  async checkRecaptchaAndCreateSession(recaptcha: Recaptcha) {

    const fetch = require('node-fetch');
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    let resposta = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha.response}`, { method: 'POST' })
      .then((res: { json: () => void; }) => res.json())
      // tslint:disable-next-line:no-any
      .catch((error: any) => console.log(error));

    if (resposta && resposta.success !== false) {
      return await this.assistantService.createSession();
    } else {
      return resposta;
    }

  }

  async obterMensagem(mensagem: Mensagem) {

    return await this.resultadoMensagem(mensagem);
   
  }

  async resultadoMensagem(mensagem: Mensagem) {

    let result = await this.assistantService.message(mensagem);

    return result;
  }



}
