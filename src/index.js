import React, { useMemo, useCallback } from 'react'

const MapToComponents = ({
  getKey,
  getType,
  list,
  map,
  meta,
  mapDataToContext = {},
  mapDataToProps = {},
  default: defaultMapping = ({ type }) => {
    throw new Error(`Could not find a component mapping for type "${type}"`)
  },
}) => {
  const keys = useMemo(() => list.map(getKey), [list, getKey])
  const types = useMemo(() => list.map(getType), [list, getType])
  const comps = useMemo(() => types.map(type => map[type] || defaultMapping), [
    types,
    map,
    defaultMapping,
  ])

  const gatherData = useCallback(
    index => ({
      list,
      keys,
      types,
      comps,
      map,
      meta,
      index,
      data: list[index],
      key: keys[index],
      type: types[index],
      Comp: comps[index],
      previousData: list[index - 1],
      previousKey: keys[index - 1],
      previousType: types[index - 1],
      PreviousComp: comps[index - 1],
      nextData: list[index + 1],
      nextKey: keys[index + 1],
      nextType: types[index + 1],
      NextComp: comps[index + 1],
    }),
    [comps, keys, types, meta, list, map],
  )

  const contexts = useMemo(
    () =>
      list.map((_, index) => {
        const fn = mapDataToContext[types[index]]

        return fn ? fn(gatherData(index)) : {}
      }),
    [gatherData, list, mapDataToContext, types],
  )

  const gatherDataForMapDataToProps = useCallback(
    index => ({
      ...gatherData(index),
      contexts,
      context: contexts[index],
      previousContext: contexts[index - 1],
      nextContext: contexts[index + 1],
    }),
    [gatherData, contexts],
  )

  const props = useMemo(
    () =>
      list.map((_, index) => {
        const fn = mapDataToProps[types[index]]

        return fn ? fn(gatherDataForMapDataToProps(index)) : {}
      }),
    [gatherDataForMapDataToProps, list, mapDataToProps, types],
  )

  return props.map((mappedProps, index) =>
    React.createElement(comps[index], { key: keys[index], ...mappedProps }),
  )
}

export default MapToComponents
