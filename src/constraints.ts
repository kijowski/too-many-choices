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

const emptyConstraints = (): Constraints => ({
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
})

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
  return [colorC === '' ? '' : `c${colorC}`, shapeC === '' ? '' : `s${shapeC}`, randomC === '' ? '' : `r${randomC}`].filter(x => x !== '').join('-')
}

const parse = (input: string): Constraints => {
  const result = emptyConstraints()
  input.replace('#', '').split('-').forEach(fragment => {
    if (fragment.startsWith('c')) {
      if (fragment.includes('H')) {
        result.noHueVariation = true
      }
      if (fragment.includes('S')) {
        result.noSaturationVariation = true
      }
      if (fragment.includes('V')) {
        result.noValueVariation = true
      }
      if (fragment.includes('O')) {
        result.noOpacityVariation = true
      }
      const countMatches = fragment.match(/\d+/)
      if (countMatches != null && countMatches.length > 0) {
        result.limitColors = true
        result.limits.colors = parseInt(countMatches[0], 10)
      }
    }
    if (fragment.startsWith('s')) {
      if (fragment.includes('C')) {
        result.noCircles = true
      }
      if (fragment.includes('R')) {
        result.noRectangles = true
      }
      if (fragment.includes('L')) {
        result.noLines = true
      }
      if (fragment.includes('U')) {
        result.noCurves = true
      }
      if (fragment.includes('T')) {
        result.noTriangles = true
      }
      if (fragment.includes('O')) {
        result.noOtherShapes = true
      }
      const countMatches = fragment.match(/\d+/)
      if (countMatches != null && countMatches.length > 0) {
        result.limitShapes = true
        result.limits.shapes = parseInt(countMatches[0], 10)
      }
    }
    if (fragment.startsWith('r')) {
      if (fragment.includes('C')) {
        result.noColorRandomness = true
      }
      if (fragment.includes('P')) {
        result.noPositionRandomness = true
      }
      if (fragment.includes('S')) {
        result.noSizeRandomness = true
      }
      if (fragment.includes('U')) {
        result.noCountRandomness = true
      }
      const countMatches = fragment.match(/\d+/)
      if (countMatches != null && countMatches.length > 0) {
        result.limitRandomValues = true
        result.limits.randomValues = parseInt(countMatches[0], 10)
      }
    }
  })

  return result
}

export class ConstraintsManager {
  constraints = emptyConstraints()

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

  parse (hash: string): void {
    this.constraints = parse(hash)
  }
}
