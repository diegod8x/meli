import { ApiProperty } from '@nestjs/swagger'

export class SplitRequest {
  @ApiProperty()
  readonly name: string
  @ApiProperty()
  readonly message: []
}

export class FixRequest {
  @ApiProperty({
    description: 'Dado que Swagger no permite enviar un body a través de GET, se crea este campo funcional que recibe un json como string',
  })
  readonly body: string
}

export class SecretMsgRequest {
  @ApiProperty()
  readonly name: string
  @ApiProperty()
  readonly distance: number
  @ApiProperty()
  readonly message: []

}

export class SecretRequest {
  @ApiProperty({
    type: () => [SecretMsgRequest]
  })
  readonly satellites: SecretMsgRequest[]
}