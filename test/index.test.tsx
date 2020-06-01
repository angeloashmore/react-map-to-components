import * as React from 'react'
import { render, screen } from '@testing-library/react'

import { MapToComponents } from '../src'

const defaultProps = {
  getKey: jest.fn().mockImplementation((item) => item.id),
  getType: jest.fn().mockImplementation((item) => item.type),
  list: [
    { id: 1, type: 'type1' },
    { id: 2, type: 'type2' },
    { id: 3, type: 'withMapDataToProps' },
  ],
  map: {
    type1: (props: Record<string, unknown | undefined>) => (
      <div
        data-testid="type1"
        data-type="type1"
        data-props={Object.keys(props)}
      />
    ),
    type2: (props: Record<string, unknown | undefined>) => (
      <div
        data-testid="type2"
        data-type="type2"
        data-props={Object.keys(props)}
      />
    ),
    withMapDataToProps: (props: Record<string, unknown | undefined>) => (
      <div
        data-testid="withMapDataToProps"
        data-type="withMapDataToProps"
        data-props={Object.keys(props)}
      />
    ),
  },
  mapDataToContext: {
    withMapDataToProps: jest.fn().mockReturnValue({ mappedContext: true }),
  },
  mapDataToProps: {
    withMapDataToProps: jest.fn().mockReturnValue({ mappedData: true }),
  },
  meta: { foo: 'bar' },
}

beforeEach(() => jest.clearAllMocks())

test('should provide getKey with item, index, and list', () => {
  render(<MapToComponents {...defaultProps} />)

  const { list } = defaultProps

  expect(defaultProps.getKey).toHaveBeenNthCalledWith(1, list[0], 0, list)
  expect(defaultProps.getKey).toHaveBeenNthCalledWith(2, list[1], 1, list)
  expect(defaultProps.getKey).toHaveBeenNthCalledWith(3, list[2], 2, list)
})

test('should provide getType with item, index, and list', () => {
  render(<MapToComponents {...defaultProps} />)

  const { list } = defaultProps

  expect(defaultProps.getType).toHaveBeenNthCalledWith(1, list[0], 0, list)
  expect(defaultProps.getType).toHaveBeenNthCalledWith(2, list[1], 1, list)
  expect(defaultProps.getType).toHaveBeenNthCalledWith(3, list[2], 2, list)
})

test('should render list using components from map', () => {
  const { container } = render(<MapToComponents {...defaultProps} />)

  expect(container.children[0]).toHaveAttribute('data-type', 'type1')
  expect(container.children[1]).toHaveAttribute('data-type', 'type2')
  expect(container.children[2]).toHaveAttribute(
    'data-type',
    'withMapDataToProps',
  )
  expect(screen.getByTestId('withMapDataToProps')).toHaveAttribute(
    'data-props',
    'mappedData',
  )
})

test('should render null if list is undefined', () => {
  const { container } = render(
    <MapToComponents {...defaultProps} list={undefined} />,
  )

  expect(container.firstChild).toBeNull()
})

test('should provide no props to mapped component by default', () => {
  render(<MapToComponents {...defaultProps} mapDataToProps={undefined} />)

  expect(screen.getByTestId('type1')).toHaveAttribute('data-props', '')
  expect(screen.getByTestId('type2')).toHaveAttribute('data-props', '')
  expect(screen.getByTestId('withMapDataToProps')).toHaveAttribute(
    'data-props',
    '',
  )
})

test('should use defaultMapDataToProps if mapDataToProps for type is not available', () => {
  render(
    <MapToComponents
      {...defaultProps}
      list={[defaultProps.list[0]]}
      mapDataToProps={undefined}
      defaultMapDataToProps={() => ({ defaultMappedData: true })}
    />,
  )

  expect(screen.getByTestId('type1')).toHaveAttribute(
    'data-props',
    'defaultMappedData',
  )
})

test('should provide detailed data to mapDataToProps', () => {
  render(<MapToComponents {...defaultProps} />)

  const { list } = defaultProps

  expect(defaultProps.mapDataToProps.withMapDataToProps).toHaveBeenCalledWith({
    list,
    keys: list.map(defaultProps.getKey),
    types: list.map(defaultProps.getType),
    comps: [
      defaultProps.map.type1,
      defaultProps.map.type2,
      defaultProps.map.withMapDataToProps,
    ],
    contexts: [undefined, undefined, { mappedContext: true }],
    map: defaultProps.map,
    meta: defaultProps.meta,
    index: 2,
    data: list[2],
    context: { mappedContext: true },
    key: defaultProps.getKey(list[2], 2, list),
    type: defaultProps.getType(list[2], 2, list),
    Comp: defaultProps.map.withMapDataToProps,
    previousData: list[1],
    previousContext: undefined,
    previousKey: defaultProps.getKey(list[1], 1, list),
    previousType: defaultProps.getType(list[1], 1, list),
    PreviousComp: defaultProps.map.type2,
    nextData: undefined,
    nextContext: undefined,
    nextKey: undefined,
    nextType: undefined,
    NextComp: undefined,
  })
})

test('should use defaultMapDataToContext if mapDataToContext for type is not available', () => {
  render(
    <MapToComponents
      {...defaultProps}
      list={[defaultProps.list[0]]}
      defaultMapDataToContext={() => ({ defaultMappedContext: true })}
      mapDataToProps={{ type1: ({ context }) => ({ ...context }) }}
    />,
  )

  expect(screen.getByTestId('type1')).toHaveAttribute(
    'data-props',
    'defaultMappedContext',
  )
})

test('should provide detailed data to mapDataToContext', () => {
  render(<MapToComponents {...defaultProps} />)

  const { list } = defaultProps

  expect(defaultProps.mapDataToContext.withMapDataToProps).toHaveBeenCalledWith(
    {
      list,
      keys: list.map(defaultProps.getKey),
      types: list.map(defaultProps.getType),
      comps: [
        defaultProps.map.type1,
        defaultProps.map.type2,
        defaultProps.map.withMapDataToProps,
      ],
      map: defaultProps.map,
      meta: defaultProps.meta,
      index: 2,
      data: list[2],
      key: defaultProps.getKey(list[2], 2, list),
      type: defaultProps.getType(list[2], 2, list),
      Comp: defaultProps.map.withMapDataToProps,
      previousData: list[1],
      previousKey: defaultProps.getKey(list[1], 1, list),
      previousType: defaultProps.getType(list[1], 1, list),
      PreviousComp: defaultProps.map.type2,
      nextData: undefined,
      nextKey: undefined,
      nextType: undefined,
      NextComp: undefined,
    },
  )
})

test('should render default mapping if mapping is not available', () => {
  render(
    <MapToComponents
      {...defaultProps}
      list={[{ id: 1, type: 'no-mapping' }]}
      default={() => <div data-testid="default" />}
    />,
  )

  expect(screen.getByTestId('default')).toBeInTheDocument()
})

test('should throw if component mapping is not available and no default is provided', () => {
  const noop = () => {
    /* Do nothing */
  }
  const spy = jest.spyOn(console, 'error').mockImplementation(noop)

  expect(() => {
    render(
      <MapToComponents
        {...defaultProps}
        list={[{ id: 1, type: 'no-mapping' }]}
      />,
    )
  }).toThrow('Could not find a component mapping for type "no-mapping"')

  spy.mockRestore()
})
