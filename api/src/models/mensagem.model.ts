import { Model, model, property } from '@loopback/repository';

@model()
export class Mensagem extends Model {
  @property({
    type: 'string',
    required: true,
  })
  texto: string;

  @property()
  context?: object;

  @property({
    type: 'string',
  })
  sessionId?: string;

  @property({
    type: 'string'
  })
  nome?: string;

  @property({
    type: 'string'
  })
  email?: string;


  constructor(data?: Partial<Mensagem>) {
    super(data);
  }
}
