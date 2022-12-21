import { WebsiteApiApplication } from './application';
import { ApplicationConfig } from '@loopback/core';
export { WebsiteApiApplication };



export async function main(options: ApplicationConfig = {}) {

  const dotenv = require('dotenv');
  const path = require('path');
  const resultDotenv = dotenv.config({ path: path.resolve(__dirname, '../.env') })
  if (resultDotenv.error) {
    console.log(resultDotenv.error);
  }

  const app = new WebsiteApiApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  //if (process.env.NODE_ENV === 'production') { // [2]

  //}

  return app;
}
