import m from 'mithril'
import './style.css'
import { ConstraintsManager, encode, Constraints } from './constraints'
import { copyTextToClipboard } from './utils'

const manager = new ConstraintsManager()

const LabeledCheckbox: m.Component<{constraint: keyof Omit<Constraints, 'limits'>, name: string}> = ({
  view: vnode => m('button', {
    class: `${manager.constraints[vnode.attrs.constraint] ? 'on' : 'off'}`,
    onclick: (ev: Event) => {
      if (ev.target != null) {
        (ev.target as HTMLButtonElement).blur()
      }
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
        if (ev.target != null) {
          (ev.target as HTMLButtonElement).blur()
        }
        manager.toggle(vnode.attrs.constraint)
      }
    }, vnode.attrs.name),
    vnode.attrs.limits.map(limit => m('button', {
      class: `${manager.constraints[vnode.attrs.constraint] && manager.constraints.limits[vnode.attrs.limitName] === limit ? 'on' : 'off'}`,
      onclick: (ev: Event) => {
        if (ev.target != null) {
          (ev.target as HTMLButtonElement).blur()
        }
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
      return m('.explanation', 'Select some constraints!')
    }

    return m('.code',
      m('h3', {
        onclick: (ev: Event) => {
          const node = ev.target as HTMLHeadingElement
          const range = document.createRange()
          range.selectNodeContents(node)
          const selection = window.getSelection()
          if (selection != null && selection.rangeCount > 0) {
            selection.removeAllRanges()
          }
          selection?.addRange(range)
        }
      }, `#${hashtagValue}`),
      m('button', { onclick: () => { copyTextToClipboard(`#${hashtagValue}`) } }, 'Copy'),
      m('a', { href: `https://twitter.com/search?q=%23${hashtagValue}`, target: '_blank' }, 'Twitter'),
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
          if (ev.target != null) {
            (ev.target as HTMLButtonElement).blur()
          }
          manager.random()
        }
      }, 'Too many choices!'),
      m(LabeledCheckbox, { constraint: 'noHueVariation', name: 'No hue variation' }),
      m(LabeledCheckbox, { constraint: 'noSaturationVariation', name: 'No saturation variation' }),
      m(LabeledCheckbox, { constraint: 'noValueVariation', name: 'No color value variation' }),
      m(LabeledCheckbox, { constraint: 'noOpacityVariation', name: 'No color opacity variation' }),
      m(LimitGrid, { constraint: 'limitColors', limitName: 'colors', name: 'Max colors', limits: [1, 2, 3, 4, 5, 6] }),
      m(LabeledCheckbox, { constraint: 'noCircles', name: 'No circles' }),
      m(LabeledCheckbox, { constraint: 'noRectangles', name: 'No rectangles' }),
      m(LabeledCheckbox, { constraint: 'noLines', name: 'No lines' }),
      m(LabeledCheckbox, { constraint: 'noTriangles', name: 'No triangles' }),
      m(LabeledCheckbox, { constraint: 'noCurves', name: 'No curves' }),
      m(LabeledCheckbox, { constraint: 'noOtherShapes', name: 'No other shapes' }),
      m(LimitGrid, { constraint: 'limitShapes', limitName: 'shapes', name: 'Max shapes', limits: [1, 2, 5, 10, 50, 100] }),
      m(LabeledCheckbox, { constraint: 'noColorRandomness', name: 'No randomness in color' }),
      m(LabeledCheckbox, { constraint: 'noPositionRandomness', name: 'No randomness in positioning' }),
      m(LabeledCheckbox, { constraint: 'noSizeRandomness', name: 'No randomness in sizes' }),
      m(LabeledCheckbox, { constraint: 'noCountRandomness', name: 'No randomness in count' }),
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
