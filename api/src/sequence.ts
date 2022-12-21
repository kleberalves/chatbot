import { inject } from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';

import {
  AuthenticationBindings,
  AuthenticateFn,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';

import { MailService, MailServiceBindings } from './services';

const SequenceActions = RestBindings.SequenceActions;

export class AppSequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION) protected authenticateRequest: AuthenticateFn,
    @inject(MailServiceBindings.SERVICE) private mailService: MailService
  ) { }

  async handle(context: RequestContext) {
    try {
      const { request, response } = context;
      const route = this.findRoute(request);

      //call authentication action
      await this.authenticateRequest(request);

      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err:any) {
      if (err) {
        console.log(err.code, err.name, err);
        //this.mailService.enviarErro(err);

        if (
          err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
          err.code === USER_PROFILE_NOT_FOUND
        ) {
          Object.assign(err, { statusCode: 401 /* Unauthorized */ });
        }

        switch (err.name) {
          case "MongoError":
            if (err.code === 11000) {
              Object.assign(err, { statusCode: 409 /* Conflict */ });
            }
            break;

          default:
            //this.mailService.enviarErro(err);
        }
      } else {
        console.log(err, "SEQUENCE");
      }

      this.reject(context, err);
    }
  }
}
