export class SessionSources {

  constructor(private assistant: any) {
  }

  async createSession(): Promise<any> {
    return await this.assistant.createSession({ assistant_id: process.env.ASSISTANT_ID || '{assistant_id}' });
  }

}
