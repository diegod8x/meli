import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'
import { FixRequest, SecretRequest, SplitRequest } from './requests'
import { Request } from 'express'

@ApiTags('TopSecretController')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('topsecret')
  @ApiOperation({
    summary: 'Obtener la ubicación de la nave y el mensaje que emite',
    description: `
    Se establecen los siguientes puntos cardinales para una correcta triangulación: 
    ■ Kenobi: [-100, -100]
    ■ Skywalker: [100, -100]
    ■ Sato: [50, 80] 
    Pruébalo con este ejemplo: \n {"satellites":[{"name":"kenobi","distance":100,"message":["este","","","mensaje","",""]},{"name":"sato","distance":142.7,"message":["este","","un","","",""]},{"name":"skywalker","distance":115.5,"message":["","es","","","secreto"]}]}
    `
  })
  getMsgPos(@Body() body: SecretRequest): string {
    return this.appService.getMsgPos(body)
  }

  @ApiOperation({
    summary: 'Obtener la posición y mensaje recibido',
    description: `
    Se establecen los siguientes puntos cardinales para una correcta triangulación: 
    ■ Kenobi: [-100, -100]
    ■ Skywalker: [100, -100]
    ■ Sato: [50, 80] 
    Pruébalo con este ejemplo: \n {"name":"kenobi","message":["este","","","mensaje","",""]}    
    `
  })
  @Get('topsecret_split/:satellite_name')
  getSatelitePosition(
    @Param('satellite_name') satellite_name: string, @Query('body') body: FixRequest, @Req() req: Request
  ): string {

    const dataBody = Object.entries(req.body).length ? req.body : JSON.parse(<string><unknown>body)  //swagger fix -> body in GET    
    return this.appService.satelitePosition(satellite_name, dataBody)
  }


  @ApiOperation({
    summary: 'Obtener la posición y mensaje recibido',
    description: `
    Se establecen los siguientes puntos cardinales para una correcta triangulación: 
    ■ Kenobi: [-100, -100]
    ■ Skywalker: [100, -100]
    ■ Sato: [50, 80] 
    Pruébalo con este ejemplo: \n {"name":"kenobi","message":["este","","","mensaje","",""]}
    `
  })
  @Post('topsecret_split/:satellite_name')
  postSatelitePosition(
    @Param('satellite_name') satellite_name: string, @Body() body: SplitRequest
  ): string {
    return this.appService.satelitePosition(satellite_name, body)
  }

}
