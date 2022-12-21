import { Model, model, property } from '@loopback/repository';

@model()
export class Recaptcha extends Model {

  constructor(data?: Partial<Recaptcha>) {
    super(data);
  }

  @property({ type: 'string', required: true }) response: string;
}
