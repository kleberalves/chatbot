import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import * as path from 'path';
import { AppSequence } from './sequence';

// import { StrategyResolverProvider } from './providers/strategy.resolver.provider';
// import { AuthenticateActionProvider } from './providers/authentication.provider';

import {
  AuthenticationComponent,
  registerAuthenticationStrategy
} from '@loopback/authentication';

import {
  AssistantService,
  AssistantServiceBindings,
  ChatService,
  ChatServiceBindings,
  MailService,
  MailServiceBindings,
} from './services'


export class WebsiteApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {

  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(AppSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));
    this.static('/uploads', path.join(__dirname, '../uploads'));


    this.bind(AssistantServiceBindings.SERVICE).toClass(AssistantService);
    this.bind(ChatServiceBindings.SERVICE).toClass(ChatService);
    this.bind(MailServiceBindings.SERVICE).toClass(MailService);

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);

    this.projectRoot = __dirname;

    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };


  }

}
