import { BindingKey } from '@loopback/context';
import { Mensagem } from '../models/mensagem.model';
import { HttpErrors } from '@loopback/rest';

export namespace AssistantServiceBindings {
  export const SERVICE = BindingKey.create<AssistantService>(
    'services.assistant',
  );
}

export class AssistantService {

  AssistantV2: any;
  assistant: any;
  constructor(
  ) {

    this.AssistantV2 = require('watson-developer-cloud/assistant/v2'); // watson sdk
    this.assistant = new this.AssistantV2({ version: '2018-11-08' });
  }

  // tslint:disable-next-line:no-any
  async createSession(): Promise<any> {
    return await this.assistant.createSession({ assistant_id: process.env.ASSISTANT_ID });
  }

  async message(mensagem: Mensagem): Promise<any> {

    if (mensagem.context && (mensagem.context as any).global) {
      (mensagem.context as any).global.system.turn_count += 1;
    } else {
      mensagem.context = {
        global: {
          system: {
            turn_count: 1,
            timezone: 'America/Sao_Paulo'
          }
        }, skills: {
          'main skill': {
            user_defined: {
              "nome": mensagem.nome,
              "email": mensagem.email
            }
          }
        }
      }
    }

    var payload = {
      assistant_id: process.env.ASSISTANT_ID,
      session_id: mensagem.sessionId,
      input: {
        message_type: 'text',
        text: mensagem.texto,
        options: {
          return_context: true
        }
      },
      context: mensagem.context
    };

    try {
      return await this.assistant.message(payload);
    }
    catch (ex:any) {
      if (ex.message.indexOf("NotFound: session id") == 0) {
        throw new HttpErrors.NotAcceptable("Sessão expirada");
      }
      throw ex;
    }
  }


}
