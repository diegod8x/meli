import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from '@nestjs/common'

async function bootstrap() {

  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('')
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Fuego de Quasar')
    .setDescription('API MELI')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/documentation', app, document)

  await app.listen(3000)
  Logger.log(`Api corriendo en: ${await app.getUrl()}`)
  Logger.log(`Documentación en: ${await app.getUrl()}/documentation`)
}
bootstrap()
