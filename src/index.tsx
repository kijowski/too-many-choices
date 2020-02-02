import m from 'mithril'
import './style.css'
import { ConstraintsManager, encode, Constraints } from './constraints'
import { blurButton, selectHeadingTest } from './utils'

const manager = new ConstraintsManager()

const LabeledCheckbox: m.Component<{constraint: keyof Omit<Constraints, 'limits'>, name: string}> = ({
  view: vnode => {
    const { constraint, name } = vnode.attrs
    return m('button',
      {
        class: `${manager.constraints[constraint] ? 'on' : ''}`,
        onclick: (ev: Event) => {
          blurButton(ev)
          manager.toggle(constraint)
        }
      }, name)
  }
})

const LimitGrid: m.Component<{ constraint: keyof Omit<Constraints, 'limits'>, limitName: keyof Constraints['limits'], limits: number[], name: string}> = ({
  view: vnode => {
    const { constraint, limitName, limits, name } = vnode.attrs
    return m('.limitgrid',
      m('button.title',
        {
          class: `${manager.constraints[constraint] ? 'on' : ''}`,
          onclick: (ev: Event) => {
            blurButton(ev)
            manager.toggle(constraint)
          }
        }, name),
      limits.map(limit => m('button', {
        class: `${manager.constraints[constraint] && manager.constraints.limits[limitName] === limit ? 'on' : 'off'}`,
        onclick: (ev: Event) => {
          blurButton(ev)
          if (!manager.constraints[constraint] || manager.constraints.limits[limitName] === limit) {
            manager.toggle(constraint)
          }
          manager.updateLimit(limitName, limit)
        }
      }, limit))
    )
  }
})

const Hashtag: m.Component = {
  view: () => {
    const hashtagValue = encode(manager.constraints)

    return m('.hashtag',
      hashtagValue === '' ? 'Select some constraints or click TOO MANY CHOICES!' : [
        m('h3', { onclick: selectHeadingTest }, `#${hashtagValue}`),
        m('span', 'Happy creating!!!')])
  }
}

const ConstraintsCard: m.Component<{id: string}> = {
  onupdate: () => {
    history.replaceState(null, '', `/#${encode(manager.constraints)}`)
  },
  view: () =>
    m('article',
      m('button.call', {
        onclick: (ev: Event) => {
          blurButton(ev)
          manager.random()
        }
      }, 'Too many choices!'),
      m(LabeledCheckbox, { constraint: 'noHueVariation', name: 'No hue changes' }),
      m(LabeledCheckbox, { constraint: 'noSaturationVariation', name: 'No saturation changes' }),
      m(LabeledCheckbox, { constraint: 'noValueVariation', name: 'No color value changes' }),
      m(LabeledCheckbox, { constraint: 'noOpacityVariation', name: 'No opacity changes' }),
      m(LimitGrid, { constraint: 'limitColors', limitName: 'colors', name: 'Max colors', limits: [1, 2, 3, 4, 5, 6] }),
      m(LabeledCheckbox, { constraint: 'noCircles', name: 'No circles' }),
      m(LabeledCheckbox, { constraint: 'noRectangles', name: 'No rectangles' }),
      m(LabeledCheckbox, { constraint: 'noLines', name: 'No lines' }),
      m(LabeledCheckbox, { constraint: 'noTriangles', name: 'No triangles' }),
      m(LabeledCheckbox, { constraint: 'noCurves', name: 'No curves' }),
      m(LabeledCheckbox, { constraint: 'noOtherShapes', name: 'No other shapes' }),
      m(LimitGrid, { constraint: 'limitShapes', limitName: 'shapes', name: 'Max shapes', limits: [1, 2, 5, 10, 50, 100] }),
      m(LabeledCheckbox, { constraint: 'noColorRandomness', name: 'No random color' }),
      m(LabeledCheckbox, { constraint: 'noPositionRandomness', name: 'No random positions' }),
      m(LabeledCheckbox, { constraint: 'noSizeRandomness', name: 'No random sizes' }),
      m(LabeledCheckbox, { constraint: 'noCountRandomness', name: 'No random counts' }),
      m(LimitGrid, { constraint: 'limitRandomValues', limitName: 'randomValues', name: 'Max random values', limits: [1, 2, 5, 10, 50, 100] }),
      m(Hashtag)
    )
}

const App = {
  oninit: () => {
    manager.parse(window.location.hash)
  },
  view: () =>
    m('main', [
      m(ConstraintsCard),
      m('footer', m('a', { href: 'https://kijowski.dev' }, 'Made by Michał Kijowski'))
    ])
}

m.mount(document.body, App)
