import m from 'mithril'
import './style.css'
import { ConstraintsManager, encode, Constraints } from './constraints'
import { blurButton } from './utils'

const manager = new ConstraintsManager()

const LabeledCheckbox: m.Component<{constraint: keyof Omit<Constraints, 'limits'>, name: string}> = ({
  view: vnode => m('button', {
    class: `${manager.constraints[vnode.attrs.constraint] ? 'on' : 'off'}`,
    onclick: (ev: Event) => {
      blurButton(ev)
      manager.toggle(vnode.attrs.constraint)
    }
  },
  vnode.attrs.name
  )
})

const LimitGrid: m.Component<{ constraint: keyof Omit<Constraints, 'limits'>, limitName: keyof Constraints['limits'], limits: number[], name: string}> = ({
  view: vnode => m('.limitgrid',
    m('button.title', {
      class: `${manager.constraints[vnode.attrs.constraint] ? 'on' : 'off'}`,
      onclick: (ev: Event) => {
        blurButton(ev)
        manager.toggle(vnode.attrs.constraint)
      }
    }, vnode.attrs.name),
    vnode.attrs.limits.map(limit => m('button', {
      class: `${manager.constraints[vnode.attrs.constraint] && manager.constraints.limits[vnode.attrs.limitName] === limit ? 'on' : 'off'}`,
      onclick: (ev: Event) => {
        blurButton(ev)
        if (!manager.constraints[vnode.attrs.constraint] || manager.constraints.limits[vnode.attrs.limitName] === limit) {
          manager.toggle(vnode.attrs.constraint)
        }
        manager.updateLimit(vnode.attrs.limitName, limit)
      }
    }, limit))
  )
})

const Hashtag: m.Component = {
  view: () => {
    const hashtagValue = encode(manager.constraints)

    if (hashtagValue === '') {
      return m('.explanation', 'Select some constraints or click TOO MANY CHOICES!')
    }

    return m('.code',
      m('h3', `#${hashtagValue}`),
      m('a', { href: `https://twitter.com/search?q=%23${hashtagValue}`, target: '_blank' }, 'Twitter'),
      m('a', { href: `https://www.reddit.com/r/generative/search/?q=%23${hashtagValue}&restrict_sr=1`, target: '_blank' }, 'Reddit'),
      m('a', { href: `https://www.instagram.com/explore/tags/${hashtagValue}/`, target: '_blank' }, 'Instagram'))
  }
}

const ConstraintsCard: m.Component<{id: string}> = {
  onupdate: function () {
    history.replaceState(null, '', `/#${encode(manager.constraints)}`)
  },
  view: function (vnode) {
    return m('article',
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
