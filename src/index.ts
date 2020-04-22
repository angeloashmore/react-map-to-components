import React, { useMemo, useCallback } from 'react'

type DefaultCompProps = {
  type: string
}

const DefaultComp = ({ type }: DefaultCompProps) => {
  throw new Error(`Could not find a component mapping for type "${type}"`)
}

/**
 * Collection of data about an individual list item and its surrounding
 * context.
 */
export interface Ctx<
  ComponentMap extends Record<string, React.ComponentType> = Record<
    string,
    React.ComponentType
  >,
  DataElement = any,
  Meta = any
> {
  /** List of elements. */
  list: DataElement[]
  /** List of keys for each element in `list`. */
  keys: React.Key[]
  /** List of types for each element in `list`. */
  types: (keyof ComponentMap)[]
  /** List of components for each element in `list`. */
  comps: React.ComponentType[]
  /** Mapping of types to React components. */
  map: ComponentMap
  /** Data provided to the `meta` prop. */
  meta?: Meta
  /** Index of the current element. */
  index: number
  /** The current element. */
  data: DataElement
  /** Key of the current element. */
  key: React.Key
  /** Type of the current element. */
  type: keyof ComponentMap
  /** Component for the current element. */
  Comp: React.ComponentType
  /** The previous element. */
  previousData?: DataElement
  /** Key of the previous element. */
  previousKey?: React.Key
  /** Type of the previous element. */
  previousType?: keyof ComponentMap
  /** Component for the previous element. */
  PreviousComp?: React.ComponentType
  /** The next element. */
  nextData?: DataElement
  /** Key of the next element. */
  nextKey?: React.Key
  /** Type of the next element. */
  nextType?: keyof ComponentMap
  /** Component for the next element. */
  NextComp?: React.ComponentType
}

/**
 * Collection of data about an individual list item and its surrounding
 * context. Includes context properties from `mapDataToContext`.
 */
export interface CtxWithContext<
  ComponentMap extends Record<string, React.ComponentType> = Record<
    string,
    React.ComponentType
  >,
  DataElement = any,
  Meta = any,
  Context = any
> extends Ctx<ComponentMap, DataElement, Meta> {
  /** List of context values for each element in `list`. */
  contexts: (Context | undefined)[]
  /** Context for the current element. */
  context?: Context
  /** Context for the previous element. */
  previousContext?: Context
  /** Context for the next element */
  nextContext?: Context
}

/**
 * Function mapping an element in `list` and its surrounding context to
 * contextual data for the element's `mapDataToContext` function.
 */
export type MapDataToContextFn<
  ComponentMap extends Record<string, React.ComponentType> = Record<
    string,
    React.ComponentType
  >,
  DataElement = any,
  Meta = any,
  Context = any
> = (ctx: Ctx<ComponentMap, DataElement, Meta>) => Context | undefined

/**
 * Function mapping an element in `list` and its surrounding context to props
 * for the component to be rendered.
 */
export type MapDataToPropsFn<
  ComponentMap extends Record<string, React.ComponentType> = Record<
    string,
    React.ComponentType
  >,
  DataElement = any,
  Meta = any,
  Context = any,
  Props = any
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
  /** Function that maps an element to a unique key. */
  getKey: <T>(data: T, index: number, list: T[]) => React.Key
  /** Function that maps an element to a type. */
  getType: <T>(data: T, index: number, list: T[]) => keyof ComponentMap
  /** List of data to map to components. Can contain mixed types. */
  list?: DataElement[]
  /** Object mapping a data type to a React component to be rendered. */
  map: ComponentMap
  /**
   * Arbitrary data that is made available to functions in `mapDataToProps` and
   * `mapDataToProps`.
   * */
  meta?: Meta
  /**
   * Function mapping an element in `list` and its surrounding context to
   * contextual data for the element's `mapDataToContext` function.
   */
  mapDataToContext?: Partial<
    Record<
      keyof ComponentMap,
      MapDataToContextFn<ComponentMap, DataElement, Meta, Context>
    >
  >
  /**
   * Function mapping an element in `list` and its surrounding context to props
   * for the component to be rendered.
   */
  mapDataToProps?: Partial<
    Record<
      keyof ComponentMap,
      MapDataToPropsFn<ComponentMap, DataElement, Meta, Context, Props>
    >
  >
  /** Component to be rendered if an element type is not defined in `map`. */
  default?: React.ComponentType
  /**Function used to determine context for a type not defined in `mapDataToContext`. */
  defaultMapDataToContext?: MapDataToContextFn<
    ComponentMap,
    DataElement,
    Meta,
    Context
  >
  /** Function used to determine props for a type not defined in `mapDataToProps`. */
  defaultMapDataToProps?: MapDataToPropsFn<
    ComponentMap,
    DataElement,
    Meta,
    Context,
    any
  >
}

export const MapToComponents = <
  Meta = any,
  ComponentMap extends Record<string, React.ComponentType> = Record<
    string,
    React.ComponentType
  >,
  DataElement = any,
  Context = any,
  Props = any
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
        const fn = mapDataToContext?.[types[index]] ?? defaultMapDataToContext

        return fn ? fn(gatherData(index)) : undefined
      }),
    [gatherData, list, mapDataToContext, types, defaultMapDataToContext],
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
        const fn = mapDataToProps?.[types[index]] ?? defaultMapDataToProps

        return fn ? fn(gatherDataForMapDataToProps(index)) : undefined
      }),
    [
      gatherDataForMapDataToProps,
      list,
      mapDataToProps,
      types,
      defaultMapDataToProps,
    ],
  )

  return React.createElement(
    React.Fragment,
    null,
    propsList.map((mappedProps, index) => {
      const comp = comps[index]
      const type = types[index]
      const isDefault = comp === defaultMapping

      return React.createElement(
        comp,
        Object.assign(
          { key: keys[index], ...mappedProps },
          isDefault ? { type } : undefined,
        ),
      )
    }),
  )
}

export default MapToComponents
