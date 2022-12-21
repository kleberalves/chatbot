import { post, requestBody } from '@loopback/rest';
import { Mensagem } from '../models/mensagem.model';
import { Recaptcha } from '../models/recaptcha.model';
import { ChatService, ChatServiceBindings,
  MailService, MailServiceBindings } from '../services';
import { inject } from '@loopback/core';

export class ChatController {


  constructor(@inject(ChatServiceBindings.SERVICE)
            public chatService: ChatService,
            @inject(MailServiceBindings.SERVICE)
            public mailService: MailService) {

  }

  @post('/chat')
  async chat(@requestBody() mensagem: Mensagem): Promise<string> {

    try {
      return await this.chatService.obterMensagem(mensagem);
    }
    catch (er:any) {
      this.mailService.enviarErro(er);
      throw er;
    }
  }

  @post('/session')
  async session(@requestBody() recaptcha: Recaptcha): Promise<string> {

    try {
      return await this.chatService.checkRecaptchaAndCreateSession(recaptcha);
    }
    catch (er:any) {
      this.mailService.enviarErro(er);    
      throw er;
    }

  }


}
