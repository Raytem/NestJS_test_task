import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { configureSwagger } from './swagger/configure-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = +config.get<string>('APP_PORT');

  configureSwagger(app);

  await app.listen(port);
}
bootstrap();
