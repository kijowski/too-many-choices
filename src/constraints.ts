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
      const enable = Math.random() < 0.2
      this.constraints[k] = enable
      if (enable) {
        switch (k) {
          case 'limitColors':
            this.constraints.limits.colors = [1, 2, 3, 4, 5, 6][Math.floor(Math.random() * 6)]
            break
          case 'limitRandomValues':
            this.constraints.limits.randomValues = [1, 2, 5, 10, 50, 100][Math.floor(Math.random() * 6)]
            break
          case 'limitShapes':
            this.constraints.limits.shapes = [1, 2, 5, 10, 50, 100][Math.floor(Math.random() * 6)]
            break
          default:
            break
        }
      }
    }
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
    if (hash.startsWith('#')) {
      this.constraints = parse(hash)
    } else {
      this.constraintsFromWord(hash)
    }
  }

  constraintsFromWord (word: string): void {
    // 32 bits of entropy needed
    // 14 bits for no... constraints
    // 6 bits per limit
    const y = hashCode(word)
    this.constraints.noCircles = (y & 1 << 0) !== 0
    this.constraints.noColorRandomness = (y & 1 << 1) !== 0
    this.constraints.noCountRandomness = (y & 1 << 2) !== 0
    this.constraints.noCurves = (y & 1 << 3) !== 0
    this.constraints.noHueVariation = (y & 1 << 4) !== 0
    this.constraints.noLines = (y & 1 << 5) !== 0
    this.constraints.noOpacityVariation = (y & 1 << 6) !== 0
    this.constraints.noOtherShapes = (y & 1 << 7) !== 0
    this.constraints.noPositionRandomness = (y & 1 << 8) !== 0
    this.constraints.noRectangles = (y & 1 << 9) !== 0
    this.constraints.noSaturationVariation = (y & 1 << 10) !== 0
    this.constraints.noSizeRandomness = (y & 1 << 11) !== 0
    this.constraints.noTriangles = (y & 1 << 12) !== 0
    this.constraints.noValueVariation = (y & 1 << 13) !== 0
    this.constraints.limitColors = (y & 1 << 14) !== 0
    for (let i = 0; i < 6; i++) {
      if ((y & 1 << 14 + i) !== 0) {
        this.constraints.limits.colors = [1, 2, 3, 4, 5, 6][i]
      }
    }
    this.constraints.limitRandomValues = (y & 1 << 20) !== 0
    for (let i = 0; i < 6; i++) {
      if ((y & 1 << 20 + i) !== 0) {
        this.constraints.limits.randomValues = [1, 2, 5, 10, 50, 100][i]
      }
    }
    this.constraints.limitShapes = (y & 1 << 26) !== 0
    for (let i = 0; i < 6; i++) {
      if ((y & 1 << 26 + i) !== 0) {
        this.constraints.limits.shapes = [1, 2, 5, 10, 50, 100][i]
      }
    }
  }
}

const hashCode = (s: string): number => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0)
