import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Clients API')
    .setDescription('The clients API description')
    .setVersion('1.0')
    .addTag('clients')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT ?? 8080;
  await app.listen(port, () =>
    console.log(`API is running on PORT: ${port}`),
  );
}
bootstrap();
