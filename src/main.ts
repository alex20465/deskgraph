import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cert from './helpers/cert';

const { HTTP_PORT = '3000' } = process.env;

async function bootstrap() {
  const result = cert.get();
  console.log(`
----------------------------------- CERTIFICATED FINGERPRINT ----------------------------------
${result.fingerprint}
-----------------------------------------------------------------------------------------------
`);

  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: result.privateKey,
      cert: result.cert,
    },
  });

  await app.listen(parseInt(HTTP_PORT));
}

bootstrap();
