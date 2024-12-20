import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ValidationExceptionInterceptor } from './common/exeptions/validation.error.exeption.interceptor';
import { SimpleResponseInterceptor } from './common/exeptions/validation.succes.exeption';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const port = process.env.SERVER_PORT || 6000;

  app.useGlobalInterceptors(new ValidationExceptionInterceptor());
  app.useGlobalInterceptors(new SimpleResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  try {
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      logger.error(`Le port ${port} est déjà utilisé.`);
      process.exit(1);
    } else {
      // logger.error('Erreur lors du démarrage de l\'application:', error);
    }
  }
}

bootstrap();
