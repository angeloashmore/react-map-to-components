import React, { useMemo, useCallback } from 'react'

interface Ctx<ComponentMap, DataElement, Meta> {
  list: DataElement[]
  keys: React.Key[]
  types: keyof ComponentMap[]
  comps: React.ComponentType[]
  map: ComponentMap
  meta: Meta
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

interface CtxWithContext<ComponentMap, DataElement, Context, Meta>
  extends Ctx<ComponentMap, DataElement, Meta> {
  contexts: Context[]
  context: Context
  previousContext?: Context
  nextContext?: Context
}

type MapDataToContextFn<ComponentMap, DataElement, Meta> = (
  ctx: Ctx<ComponentMap, DataElement, Meta>,
) => any

type MapDataToPropsFn<
  ComponentMap,
  DataElement,
  Context extends ReturnType<
    MapDataToContextFn<ComponentMap, DataElement, Meta>
  >,
  Meta
> = (ctx: CtxWithContext<ComponentMap, DataElement, Context, Meta>) => any

interface MapToComponentsProps<ComponentMap, DataElement, Context, Meta> {
  getKey: (data: DataElement, index: number, list: DataElement[]) => React.Key
  getType: (
    data: DataElement,
    index: number,
    list: DataElement[],
  ) => keyof ComponentMap
  list: DataElement[]
  map: ComponentMap
  meta: Meta
  mapDataToContext: Record<
    keyof ComponentMap,
    MapDataToContextFn<ComponentMap, DataElement, Meta>
  >
  mapDataToProps: Record<
    keyof ComponentMap,
    MapDataToPropsFn<ComponentMap, DataElement, Context, Meta>
  >
  default: React.ComponentType
  defaultMapDataToContext: MapDataToContextFn<ComponentMap, DataElement, Meta>
  defaultMapDataToProps: MapDataToPropsFn<
    ComponentMap,
    DataElement,
    Context,
    Meta
  >
}

const DefaultComp: React.FC<{ type: string }> = ({ type }) => {
  throw new Error(`Could not find a component mapping for type "${type}"`)
}

const MapToComponents = <
  ComponentMap extends Record<string, React.ComponentType>,
  DataElement,
  Context,
  Meta
>({
  getKey,
  getType,
  list = [],
  map = {},
  meta,
  mapDataToContext,
  mapDataToProps,
  default: defaultMapping = DefaultComp,
  defaultMapDataToContext,
  defaultMapDataToProps,
}: MapToComponentsProps<
  ComponentMap,
  DataElement,
  Context,
  Meta
>): React.ReactNodeArray => {
  const keys = useMemo(() => list.map(getKey), [list, getKey])
  const types = useMemo(() => list.map(getType), [list, getType])
  const comps = useMemo(() => types.map(type => map[type] || defaultMapping), [
    types,
    map,
    defaultMapping,
  ])

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

  const contexts: Context[] = useMemo(
    () =>
      list.map((_, index) => {
        const fn = mapDataToContext[types[index]] || defaultMapDataToContext

        return fn ? fn(gatherData(index)) : {}
      }),
    [gatherData, list, mapDataToContext, types],
  )

  const gatherDataForMapDataToProps = useCallback(
    (
      index: number,
    ): CtxWithContext<ComponentMap, DataElement, Context, Meta> => ({
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
        const fn = mapDataToProps[types[index]] || defaultMapDataToProps

        return fn ? fn(gatherDataForMapDataToProps(index)) : {}
      }),
    [gatherDataForMapDataToProps, list, mapDataToProps, types],
  )

  return props.map((mappedProps, index) =>
    React.createElement(comps[index], { key: keys[index], ...mappedProps }),
  )
}

export default MapToComponents
