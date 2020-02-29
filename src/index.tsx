import m from 'mithril'
import { ConstraintsManager, encode, Constraints } from './constraints'
import { blurButton, selectHeadingTest } from './utils'

const manager = new ConstraintsManager()

const LabeledCheckbox: m.Component<{constraint: keyof Omit<Constraints, 'limits'>, name: string}> = ({
  view: vnode => {
    const { constraint, name } = vnode.attrs
    const constraintState = manager.constraints[constraint]
    const display = constraintState ? `No ${name.toLocaleLowerCase()}` : name
    return m('button',
      {
        class: `${constraintState ? 'on' : ''}`,
        onclick: (ev: Event) => {
          blurButton(ev)
          manager.toggle(constraint)
          history.replaceState(null, '', `/#${encode(manager.constraints)}`)
        }
      }, display)
  }
})

const LimitGrid: m.Component<{ constraint: keyof Omit<Constraints, 'limits'>, limitName: keyof Constraints['limits'], limits: number[], name: string}> = ({
  view: vnode => {
    const { constraint, limitName, limits, name } = vnode.attrs
    const constraintState = manager.constraints[constraint]
    const display = constraintState ? name : `No ${name.toLocaleLowerCase()}`
    return m('.limitgrid',
      m('button.title',
        {
          class: `${constraintState ? 'on' : ''}`,
          onclick: (ev: Event) => {
            blurButton(ev)
            manager.toggle(constraint)
            history.replaceState(null, '', `/#${encode(manager.constraints)}`)
          }
        }, display),
      limits.map(limit => m('button', {
        class: `${constraintState && manager.constraints.limits[limitName] === limit ? 'on' : 'off'}`,
        onclick: (ev: Event) => {
          blurButton(ev)
          if (!constraintState || manager.constraints.limits[limitName] === limit) {
            manager.toggle(constraint)
          }
          manager.updateLimit(limitName, limit)
          history.replaceState(null, '', `/#${encode(manager.constraints)}`)
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
  oninit: vnode => {
    const word = vnode.attrs.id ?? ''
    manager.parse(word)
    history.replaceState(null, '', `/${word}`)
  },
  view: () =>
    m('article',
      m('button.call', {
        onclick: async (ev: Event) => {
          blurButton(ev)
          manager.random()
          const word = await m.request<string>({
            method: 'GET',
            url: '/api/random-word'
          })
          manager.parse(word)
          history.replaceState(null, '', `/${word}`)
          // history.replaceState(null, '', `/#${encode(manager.constraints)}`)
        }
      }, 'Too many choices!'),
      m(LabeledCheckbox, { constraint: 'noHueVariation', name: 'Hue changes' }),
      m(LabeledCheckbox, { constraint: 'noSaturationVariation', name: 'Saturation changes' }),
      m(LabeledCheckbox, { constraint: 'noValueVariation', name: 'Color value changes' }),
      m(LabeledCheckbox, { constraint: 'noOpacityVariation', name: 'Opacity changes' }),
      m(LimitGrid, { constraint: 'limitColors', limitName: 'colors', name: 'Max colors', limits: [1, 2, 3, 4, 5, 6] }),
      m(LabeledCheckbox, { constraint: 'noCircles', name: 'Circles' }),
      m(LabeledCheckbox, { constraint: 'noRectangles', name: 'Rectangles' }),
      m(LabeledCheckbox, { constraint: 'noLines', name: 'Lines' }),
      m(LabeledCheckbox, { constraint: 'noTriangles', name: 'Triangles' }),
      m(LabeledCheckbox, { constraint: 'noCurves', name: 'Curves' }),
      m(LabeledCheckbox, { constraint: 'noOtherShapes', name: 'Other shapes' }),
      m(LimitGrid, { constraint: 'limitShapes', limitName: 'shapes', name: 'Max shapes', limits: [1, 2, 5, 10, 50, 100] }),
      m(LabeledCheckbox, { constraint: 'noColorRandomness', name: 'Random color' }),
      m(LabeledCheckbox, { constraint: 'noPositionRandomness', name: 'Random positions' }),
      m(LabeledCheckbox, { constraint: 'noSizeRandomness', name: 'Random sizes' }),
      m(LabeledCheckbox, { constraint: 'noCountRandomness', name: 'Random counts' }),
      m(LimitGrid, { constraint: 'limitRandomValues', limitName: 'randomValues', name: 'Max random vals', limits: [1, 2, 5, 10, 50, 100] }),
      m(Hashtag)
    )
}

const routes: m.RouteDefs = {}

routes['/'] = {
  view: () =>
    m('main', [
      m(ConstraintsCard, { id: window.location.hash }),
      m('footer', m('a', { href: 'https://kijowski.dev' }, 'Made by Michał Kijowski'))
    ])
}

routes['/:id'] = {
  view: () =>
    m('main', [
      m(ConstraintsCard, { id: m.route.param('id') }),
      m('footer', m('a', { href: 'https://kijowski.dev' }, 'Made by Michał Kijowski'))
    ])
}

m.route.prefix = ''

m.route(document.body, '/', routes)
