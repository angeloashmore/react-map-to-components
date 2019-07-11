import React from 'react'

const MapToComponents = React.memo(
  ({
    getKey,
    getType,
    list = [],
    map = {},
    mapDataToContext = {},
    mapDataToProps = {},
    default: defaultMapping = ({ type }) => {
      throw new Error(`Could not find a component mapping for type "${type}"`)
    },
    ...extraProps
  }) => {
    const keys = list.map(getKey)
    const types = list.map(getType)
    const comps = types.map(type => map[type] || defaultMapping)
    let contexts = []

    const gatherData = index => ({
      list,
      keys,
      types,
      comps,
      contexts,
      map,
      index,
      data: list[index],
      context: contexts[index],
      key: keys[index],
      type: types[index],
      Comp: comps[index],
      previousData: list[index - 1],
      previousContext: contexts[index - 1],
      previousKey: keys[index - 1],
      previousType: types[index - 1],
      PreviousComp: comps[index - 1],
      nextData: list[index + 1],
      nextContext: contexts[index + 1],
      nextKey: keys[index + 1],
      nextType: types[index + 1],
      NextComp: comps[index + 1],
      ...extraProps,
    })

    contexts = list.map((_, index) => {
      const fn = mapDataToContext[types[index]]

      return fn ? fn(gatherData(index)) : {}
    })

    const props = list.map((_, index) => {
      const fn = mapDataToProps[types[index]]

      return fn ? fn(gatherData(index)) : {}
    })

    return props.map((mappedProps, index) =>
      comps[index]({ key: keys[index], ...mappedProps }),
    )
  },
)

export default MapToComponents
