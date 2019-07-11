import { createElement as h } from 'react'
import renderer from 'react-test-renderer'
import MapToComponents from '.'

const defaultProps = {
  getKey: jest.fn().mockImplementation((_, i) => i),
  getType: jest.fn().mockImplementation(x => x),
  list: [1, 2, 'withMapDataToProps', 1],
  map: {
    1: jest.fn().mockReturnValue('Type 1'),
    2: jest.fn().mockReturnValue('Type 2'),
    withMapDataToProps: jest.fn().mockReturnValue('withMapDataToProps'),
  },
  mapDataToContext: {
    withMapDataToProps: jest.fn().mockReturnValue({ mappedContext: true }),
  },
  mapDataToProps: {
    withMapDataToProps: jest.fn().mockReturnValue({ mappedData: true }),
  },
  foo: 'bar',
}

beforeEach(() => jest.clearAllMocks())

test('should provide getKey with item, index, and list', () => {
  const { list } = defaultProps
  const tree = renderer.create(h(MapToComponents, defaultProps))

  expect(defaultProps.getKey).toHaveBeenNthCalledWith(1, list[0], 0, list)
  expect(defaultProps.getKey).toHaveBeenNthCalledWith(2, list[1], 1, list)
  expect(defaultProps.getKey).toHaveBeenNthCalledWith(3, list[2], 2, list)
  expect(defaultProps.getKey).toHaveBeenNthCalledWith(4, list[3], 3, list)
})

test('should provide getType with item, index, and list', () => {
  const { list } = defaultProps
  const tree = renderer.create(h(MapToComponents, defaultProps))

  expect(defaultProps.getType).toHaveBeenNthCalledWith(1, list[0], 0, list)
  expect(defaultProps.getType).toHaveBeenNthCalledWith(2, list[1], 1, list)
  expect(defaultProps.getType).toHaveBeenNthCalledWith(3, list[2], 2, list)
  expect(defaultProps.getType).toHaveBeenNthCalledWith(4, list[3], 3, list)
})

test('should render list using components from map', () => {
  const tree = renderer.create(h(MapToComponents, defaultProps))

  expect(tree.toJSON()).toEqual([
    'Type 1',
    'Type 2',
    'withMapDataToProps',
    'Type 1',
  ])
})

test('should provide only key prop to mapped component by default', () => {
  const tree = renderer.create(
    h(MapToComponents, {
      ...defaultProps,
      mapDataToContext: undefined,
      mapDataToProps: undefined,
    }),
  )

  expect(defaultProps.map[1]).toHaveBeenNthCalledWith(1, { key: 0 })
  expect(defaultProps.map[2]).toHaveBeenNthCalledWith(1, { key: 1 })
  expect(defaultProps.map.withMapDataToProps).toHaveBeenNthCalledWith(1, {
    key: 2,
  })
  expect(defaultProps.map[1]).toHaveBeenNthCalledWith(2, { key: 3 })
})

test('should provide mapped props to mapped component', () => {
  const tree = renderer.create(h(MapToComponents, defaultProps))

  expect(defaultProps.map.withMapDataToProps).toHaveBeenCalledWith({
    key: 2,
    mappedData: true,
  })
})

test('should provide detailed data to mapDataToProps', () => {
  const { list } = defaultProps
  const tree = renderer.create(h(MapToComponents, defaultProps))

  expect(defaultProps.mapDataToProps.withMapDataToProps).toHaveBeenCalledWith({
    list,
    keys: list.map(defaultProps.getKey),
    types: list.map(defaultProps.getType),
    comps: [
      defaultProps.map[1],
      defaultProps.map[2],
      defaultProps.map.withMapDataToProps,
      defaultProps.map[1],
    ],
    contexts: [{}, {}, { mappedContext: true }, {}],
    map: defaultProps.map,
    index: 2,
    data: list[2],
    context: { mappedContext: true },
    key: defaultProps.getKey(list[2], 2, list),
    type: defaultProps.getType(list[2], 2, list),
    Comp: defaultProps.map.withMapDataToProps,
    previousData: list[1],
    previousContext: {},
    previousKey: defaultProps.getKey(list[1], 1, list),
    previousType: defaultProps.getType(list[1], 1, list),
    PreviousComp: defaultProps.map[2],
    nextData: list[3],
    nextContext: {},
    nextKey: defaultProps.getKey(list[3], 3, list),
    nextType: defaultProps.getType(list[3], 3, list),
    NextComp: defaultProps.map[1],
    foo: defaultProps.foo,
  })
})

test('should provide detailed data to mapDataToContext', () => {
  const { list } = defaultProps
  const tree = renderer.create(h(MapToComponents, defaultProps))

  expect(defaultProps.mapDataToContext.withMapDataToProps).toHaveBeenCalledWith(
    {
      list,
      keys: list.map(defaultProps.getKey),
      types: list.map(defaultProps.getType),
      comps: [
        defaultProps.map[1],
        defaultProps.map[2],
        defaultProps.map.withMapDataToProps,
        defaultProps.map[1],
      ],
      contexts: [],
      map: defaultProps.map,
      index: 2,
      data: list[2],
      key: defaultProps.getKey(list[2], 2, list),
      type: defaultProps.getType(list[2], 2, list),
      Comp: defaultProps.map.withMapDataToProps,
      previousData: list[1],
      previousKey: defaultProps.getKey(list[1], 1, list),
      previousType: defaultProps.getType(list[1], 1, list),
      PreviousComp: defaultProps.map[2],
      nextData: list[3],
      nextKey: defaultProps.getKey(list[3], 3, list),
      nextType: defaultProps.getType(list[3], 3, list),
      NextComp: defaultProps.map[1],
      foo: defaultProps.foo,
    },
  )
})

test('should render default mapping if mapping is not available', () => {
  const tree = renderer.create(
    h(MapToComponents, {
      ...defaultProps,
      list: [1, 3],
      default: () => 'default',
    }),
  )

  expect(tree.toJSON()).toEqual(['Type 1', 'default'])
})

test('should throw if component mapping is not available and no default is provided', () => {
  expect(() => {
    renderer
      .create(h(MapToComponents, { ...defaultProps, list: [1, 3] }))
      .toThrowError('could not find a component mapping')
  })
})
