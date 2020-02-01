import m from 'mithril'
import './style.css'
import { ConstraintsManager, encode, Constraints } from './constraints'
import { copyTextToClipboard } from './utils'

// Below is not working - we were capturing children only from initial render!
// const Card: m.ClosureComponent<{
//   title: string;
// }> = vnode => ({
//   view: () =>
//     m(
//       "div.card",
//       m("h3", vnode.attrs.title),
//       vnode.children,
//     )
// });

const manager = new ConstraintsManager()

const LabeledCheckbox = <T extends keyof Omit<Constraints, 'limits'>>(x: T, name: string): m.Component => ({
  view: () => m('button', {
    class: `${manager.constraints[x] ? 'on' : 'off'}`,
    onclick: () => manager.toggle(x)
  },
  name
  )
})

const LimitGrid = <T extends keyof Omit<Constraints, 'limits'>, S extends keyof Constraints['limits']>(x: T, y: S, name: string, limits: number[]): m.Component => ({
  view: () => m('.limitgrid',
    m('button.title', {
      class: `${manager.constraints[x] ? 'on' : 'off'}`,
      onclick: () => {
        manager.toggle(x)
      }
    }, name),
    limits.map(limit => m('button', {
      class: `${manager.constraints[x] && manager.constraints.limits[y] === limit ? 'on' : 'off'}`,
      onclick: () => {
        if (!manager.constraints[x] || manager.constraints.limits[y] === limit) {
          manager.toggle(x)
        }
        manager.updateLimit(y, limit)
      }
    }, limit))
  )
})

const Hashtag: m.Component = {
  view: () =>
    m('.code',
      m('h3', {
        onclick: (ev: Event) => {
          console.log(ev)
          const node = ev.target as HTMLHeadingElement
          const range = document.createRange()
          range.selectNodeContents(node)
          console.log(node)
          console.log(range)
          const selection = window.getSelection()
          console.log(selection)
          if (selection != null && selection.rangeCount > 0) {
            selection.removeAllRanges()
          }
          selection?.addRange(range)
        }
      }, `#${encode(manager.constraints)}`),
      m('button', { onclick: () => { copyTextToClipboard(`#${encode(manager.constraints)}`) } }, 'Copy'),
      m('a', { href: `https://twitter.com/search?q=%23${encode(manager.constraints)}`, target: '_blank' }, 'Twitter'),
      m('a', { href: `https://www.instagram.com/explore/tags/${encode(manager.constraints)}/`, target: '_blank' }, 'Instagram'))
}

const ConstraintsCard: m.Component = {
  onupdate: function () {
    console.log(`#${encode(manager.constraints)}`)
    history.replaceState(null, '', `#${encode(manager.constraints)}`)
  },
  view: function () {
    return m('article',
      // m('h1', 'Too many choices!'),
      m('button.call', { onclick: () => { manager.random() } }, 'Too many choices!'),
      m(LabeledCheckbox('noHueVariation', 'No hue variation')),
      m(LabeledCheckbox('noSaturationVariation', 'No saturation variation')),
      m(LabeledCheckbox('noValueVariation', 'No color value variation')),
      m(LimitGrid('limitColors', 'colors', 'Max colors', [1, 2, 3, 4, 5, 6])),
      m(LabeledCheckbox('noCircles', 'No circles')),
      m(LabeledCheckbox('noRectangles', 'No rectangles')),
      m(LabeledCheckbox('noLines', 'No lines')),
      m(LabeledCheckbox('noTriangles', 'No triangles')),
      m(LabeledCheckbox('noCurves', 'No curves')),
      m(LabeledCheckbox('noOtherShapes', 'No other shapes')),
      m(LimitGrid('limitShapes', 'shapes', 'Max shapes', [1, 2, 5, 10, 50, 100])),
      m(LabeledCheckbox('noColorRandomness', 'No randomness in color')),
      m(LabeledCheckbox('noPositionRandomness', 'No randomness in positioning')),
      m(LabeledCheckbox('noSizeRandomness', 'No randomness in sizes')),
      m(LabeledCheckbox('noCountRandomness', 'No randomness in count')),
      m(LimitGrid('limitRandomValues', 'randomValues', 'Max random values', [1, 2, 5, 10, 50, 100])),
      m(Hashtag)
      // m('.code', { onclick: () => { copyTextToClipboard(`#${encode(manager.constraints)}`) } }, `#${encode(manager.constraints)}`)
    )
  }
}

const App = {
  view: () =>
    m('main', [
      m(ConstraintsCard),
      m('footer', m('a', { href: 'https://kijowski.dev' }, 'Made by Michał Kijowski'))
    ])
}

m.mount(document.body, App)
