import React, { useMemo, useCallback } from 'react'

const DefaultComp: React.FC<{ type: string }> = ({ type }) => {
  throw new Error(`Could not find a component mapping for type "${type}"`)
}

export interface Ctx<ComponentMap, DataElement, Meta> {
  list: DataElement[]
  keys: React.Key[]
  types: (keyof ComponentMap)[]
  comps: React.ComponentType[]
  map: ComponentMap
  meta?: Meta
  index: number
  data: DataElement
  key: React.Key
  type: keyof ComponentMap
  Comp: React.ComponentType
  previousData?: DataElement
  previousKey?: React.Key
  previousType?: keyof ComponentMap
  PreviousComp?: React.ComponentType
  nextData?: DataElement
  nextKey?: React.Key
  nextType?: keyof ComponentMap
  NextComp?: React.ComponentType
}

export interface CtxWithContext<ComponentMap, DataElement, Meta, Context>
  extends Ctx<ComponentMap, DataElement, Meta> {
  contexts: (Context | undefined)[]
  context?: Context
  previousContext?: Context
  nextContext?: Context
}

export type MapDataToContextFn<ComponentMap, DataElement, Meta, Context> = (
  ctx: Ctx<ComponentMap, DataElement, Meta>,
) => Context | undefined

export type MapDataToPropsFn<
  ComponentMap,
  DataElement,
  Meta,
  Context,
  Props
> = (
  ctx: CtxWithContext<ComponentMap, DataElement, Meta, Context>,
) => Props | undefined

export interface MapToComponentsProps<
  ComponentMap extends Record<string, React.ComponentType> = Record<
    string,
    React.ComponentType
  >,
  DataElement = any,
  Meta = any,
  Context = any,
  Props = any
> {
  getKey: <T>(data: T, index: number, list: T[]) => React.Key
  getType: <T>(data: T, index: number, list: T[]) => keyof ComponentMap
  list?: DataElement[]
  map: ComponentMap
  meta?: Meta
  mapDataToContext?: Partial<
    Record<
      keyof ComponentMap,
      MapDataToContextFn<ComponentMap, DataElement, Meta, Context>
    >
  >
  mapDataToProps?: Partial<
    Record<
      keyof ComponentMap,
      MapDataToPropsFn<ComponentMap, DataElement, Meta, Context, Props>
    >
  >
  default?: React.ComponentType
  defaultMapDataToContext?: MapDataToContextFn<
    ComponentMap,
    DataElement,
    Meta,
    Context
  >
  defaultMapDataToProps?: MapDataToPropsFn<
    ComponentMap,
    DataElement,
    Meta,
    Context,
    Props
  >
}

const MapToComponents = <
  ComponentMap extends Record<string, React.ComponentType>,
  DataElement,
  Meta,
  Context,
  Props
>(
  props: MapToComponentsProps<ComponentMap, DataElement, Meta, Context, Props>,
): React.ReactElement => {
  const {
    getKey,
    getType,
    list = [],
    map,
    meta,
    mapDataToContext,
    mapDataToProps,
    default: defaultMapping = DefaultComp,
    defaultMapDataToContext,
    defaultMapDataToProps,
  } = props

  const keys = useMemo(() => list.map(getKey), [list, getKey])
  const types = useMemo(() => list.map(getType), [list, getType])
  const comps = useMemo(
    () => types.map((type) => map[type] || defaultMapping),
    [types, map, defaultMapping],
  )

  const gatherData = useCallback(
    (index: number): Ctx<ComponentMap, DataElement, Meta> => ({
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
        const fn = mapDataToContext?.[types[index]] || defaultMapDataToContext

        return fn ? fn(gatherData(index)) : undefined
      }),
    [gatherData, list, mapDataToContext, types],
  )

  const gatherDataForMapDataToProps = useCallback(
    (
      index: number,
    ): CtxWithContext<ComponentMap, DataElement, Meta, Context> => ({
      ...gatherData(index),
      contexts,
      context: contexts[index],
      previousContext: contexts[index - 1],
      nextContext: contexts[index + 1],
    }),
    [gatherData, contexts],
  )

  const propsList = useMemo(
    () =>
      list.map((_, index) => {
        const fn = mapDataToProps?.[types[index]] || defaultMapDataToProps

        return fn ? fn(gatherDataForMapDataToProps(index)) : undefined
      }),
    [gatherDataForMapDataToProps, list, mapDataToProps, types],
  )

  return React.createElement(
    React.Fragment,
    null,
    propsList.map((mappedProps, index) =>
      React.createElement(comps[index], { key: keys[index], ...mappedProps }),
    ),
  )
}

export default MapToComponents
