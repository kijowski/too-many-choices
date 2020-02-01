export interface Constraints {
  noHueVariation: boolean
  noSaturationVariation: boolean
  noValueVariation: boolean
  noOpacityVariation: boolean
  limitColors: boolean
  noCircles: boolean
  noRectangles: boolean
  noTriangles: boolean
  noCurves: boolean
  noLines: boolean
  noOtherShapes: boolean
  limitShapes: boolean
  noColorRandomness: boolean
  noPositionRandomness: boolean
  noSizeRandomness: boolean
  noCountRandomness: boolean
  limitRandomValues: boolean
  // canvas: 'rectangle' | 'square' | 'circle' | 'ultrawide' | 'ultratall'
  // kind: 'static' | 'animation' | 'loop' | 'interactive'
  limits: {
    colors: number
    shapes: number
    randomValues: number
  }
}

export const encode = (c: Constraints): string => {
  const colorC =
    (c.noHueVariation ? 'H' : '') +
    (c.noSaturationVariation ? 'S' : '') +
    (c.noValueVariation ? 'V' : '') +
    (c.noOpacityVariation ? 'O' : '') +
    (c.limitColors !== false ? c.limits.colors.toFixed() : '')
  const shapeC =
    (c.noCircles ? 'C' : '') +
    (c.noRectangles ? 'R' : '') +
    (c.noTriangles ? 'T' : '') +
    (c.noLines ? 'L' : '') +
    (c.noCurves ? 'U' : '') +
    (c.noOtherShapes ? 'O' : '') +
    (c.limitShapes !== false ? c.limits.shapes.toFixed() : '')
  const randomC =
    (c.noColorRandomness ? 'C' : '') +
    (c.noPositionRandomness ? 'P' : '') +
    (c.noSizeRandomness ? 'S' : '') +
    (c.noCountRandomness ? 'U' : '') +
    (c.limitRandomValues !== false ? c.limits.randomValues.toFixed() : '')
  return (colorC === '' ? '' : `c${colorC}`) + (shapeC === '' ? '' : `s${shapeC}`) + (randomC === '' ? '' : `r${randomC}`)
}
// const encodeGeneralConstraints = (c: GeneralConstraints): string => {
//   let result = ''
//   switch (c.canvas) {
//     case 'rectangle':
//       result += 'r'
//       break
//     case 'circle':
//       result += 'c'
//       break
//     case 'square':
//       result += 's'
//       break
//     case 'ultratall':
//       result += 't'
//       break
//     case 'ultrawide':
//       result += 'w'
//   }
//   switch (c.kind) {
//     case 'static':
//       result += 's'
//       break
//     case 'animation':
//       result += 'a'
//       break
//     case 'loop':
//       result += 'l'
//       break
//     case 'interactive':
//       result += 'i'
//   }
//   return result
// }

export class ConstraintsManager {
  constraints: Constraints = {
    noHueVariation: false,
    noOpacityVariation: false,
    limitColors: false,
    noSaturationVariation: false,
    noValueVariation: false,
    noCircles: false,
    limitShapes: false,
    noCurves: false,
    noLines: false,
    noOtherShapes: false,
    noRectangles: false,
    noTriangles: false,
    limitRandomValues: false,
    noCountRandomness: false,
    noSizeRandomness: false,
    noColorRandomness: false,
    noPositionRandomness: false,
    limits: {
      colors: 1,
      randomValues: 1,
      shapes: 1
    }
  };

  random (): void {
    const keys: Array<(keyof Omit<Constraints, 'limits'>)> =
      Object.keys(this.constraints).filter(x => x !== 'limits') as Array<(keyof Omit<Constraints, 'limits'>)>

    for (const k of keys) {
      this.constraints[k] = Math.random() < 0.2
    }
    this.constraints.limits.colors = [1, 2, 5, 10][Math.floor(Math.random() * 4)]
  }

  updateLimit<T extends keyof Constraints['limits']>(
    x: T,
    y: number
  ): void {
    this.constraints.limits[x] = y
  }

  toggle<T extends keyof Omit<Constraints, 'limits'>>(
    x: T
  ): void {
    this.constraints[x] = !this.constraints[x]
  }
}

// general idea of encoding - the longer the hash the more constrained you are
// or maybe inverse- the shorter the hash the more constrained you are (things in has are permitted)

// COLOR
// black and white
// single color
// limited palette
// monochromatic (no hue change)
// opacity on/off

// White color is a freebie
// H, S, V, O, x where x in 2, 4, 8, 16, 32, 64, 128, 256
// cHSVO1 - no h, no stauration, no value, no opacity - basically this means one color and white
// cH - no hue variation
// cV5 - no value variation, only 5 colors

// SHAPES
// circles: no / unbounded / only
// squares: no /  unbounded / only
// lines: no / unbounded / only
// triangles: no / unbounded / only
// other: no /  unbounded / only
// count: 1 / 3 / 10 / 100 / 500 / unbounded
// encoding: _ - no circles, c - circles, C - only circles
// example: cs10 - max 10 circles and squares, ct - unbounded circles and triangles

// sCSL - no circles, squares and lines
// sSLTO - only circles (no squares, lines, trianges and other)
// sCLTO5 - only 5 squares

// CANVAS or GENERAL
// rectangular / square / ultrawide / ultratall / circular / diptych / triptych
// type: static / loop / animation / interactive
// encoindg: r/s/c/uw/ut/di/tr s/l/a/i

// grs - rectangular static
// guwa - ultrawide animation

// RANDOMNESS
// color: on / off
// positioning: on / off
// sizing: on / off
// count: on/off
// type of randomness: 2 values / 4 values / 10 values / unbounded
// amount of randomness: single value / toggles only /
//

// rCPSS - no color, positioning and sizing randomness, need to be creative if want to use randomness
// rP2 - no positioning only 2 values

// THEME / KEYWORD ?

// RANDOM IDEA for capture
// one time use link/page for capture
// time and/or count limited pages for capture
