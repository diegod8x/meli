import { HttpException, Injectable } from '@nestjs/common'
import { _satellites } from './satellites'

@Injectable()
export class AppService {

  getLocation(distance: number): any {
    const satelite = _satellites.find(satelite => satelite.distance === distance)
    return satelite.location
  }

  getMessage(msjArray: string[]): string {
    return msjArray.filter(txt => txt !== '').join(' ')
  }

  formatLocation(pointArray: number[]): any {
    return {
      x: pointArray[0],
      y: pointArray[1]
    }
  }

  findTrianglePointC(AB: number, BC: number, AC: number, x_a: number, y_a: number, x_b: number, y_b: number): any {
    const s = 0.5 * (AB + BC + AC) // semi-perimeter
    const area = Math.sqrt(s * (s - AB) * (s - BC) * (s - AC))

    const dy = y_a - y_b,
      dx = x_a - x_b,
      dxy = x_a * y_b - y_a * x_b
    let x_c = 0,
      y_c = 0
    let punto1 = {
      x: x_c,
      y: y_c,
    }
    /*let punto2 = {
      x: x_c,
      y: y_c,
    }*/
    //opcion 1
    y_c = (dxy + dy * x_c - 2 * area) / dx
    x_c = (Math.pow(BC, 2) - Math.pow(AC, 2) - Math.pow(x_b, 2) - Math.pow(y_b, 2) + Math.pow(x_a, 2) + Math.pow(y_a, 2) - 2 * dy * y_c) / (2 * dx)
    punto1 = { x: x_c, y: y_c }

    //opcion 2
    y_c = (dxy + dy * x_c + 2 * area) / dx
    x_c = (Math.pow(BC, 2) - Math.pow(AC, 2) - Math.pow(x_b, 2) - Math.pow(y_b, 2) + Math.pow(x_a, 2) + Math.pow(y_a, 2) - 2 * dy * y_c) / (2 * dx)
    //punto2 = { x: x_c, y: y_c }
    return punto1 //dos posibles respuestas, se deja la primera
  }

  distance2p(p1: any, p2: any): number {
    return parseFloat(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]).toFixed(1))
  }

  satelitePosition(satellite_name: string, body: any): any {
    try {
      const { distance, message } = body
      const satelite = _satellites.find((satelite) => satelite.name === satellite_name)

      const distanceValue = satelite?.distance || distance

      return {
        position: this.formatLocation(this.getLocation(distanceValue)),
        message: this.getMessage(message)
      }

    }
    catch (e) {
      console.log(e)
      throw new HttpException('No hay suficiente información.', 500)
    }
  }


  getMsgPos(body: any): any {
    try {

      const satellites = body.satellites

      if (satellites.length < 2) {

        throw new HttpException('Coordenada o mensaje no pudo ser determinado.', 500)

      } else {

        const sat1 = _satellites.find(sat => sat.name === satellites[0].name)
        const sat2 = _satellites.find(sat => sat.name === satellites[1].name)

        const secret = []

        const AB = this.distance2p(sat1.location, sat2.location)
        const BC = sat1.distance
        const AC = sat2.distance

        satellites.map((satelite: any) => {
          satelite.message.map((msg: string, pos: number) => {
            if (msg !== '') {
              secret[pos] = msg
            }
          })
        })

        const message = this.getMessage(secret)

        if (AB >= BC + AC || message === '') {

          throw new HttpException('Coordenada o mensaje no pudo ser determinado.', 404)

        } else {

          return {
            position: this.findTrianglePointC(AB, BC, AC, sat1.location[0], sat1.location[1], sat2.location[0], sat2.location[1]),
            message
          }

        }
      }

    } catch (e) {
      throw new HttpException('Coordenada o mensaje no pudo ser determinado.', 404)
    }
  }

}