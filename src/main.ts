import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Cookie Finder')
  .setDescription('Cookie finder API')
  .setVersion('1.0')
  .addTag('')
  .build();

const documentFactory = () => SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, documentFactory);

app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 8088);
}
bootstrap();
