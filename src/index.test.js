import React from 'react'
import renderer from 'react-test-renderer'
import MapToComponents from '.'

const defaultProps = {
  getKey: (_, i) => i,
  getType: x => x,
  list: [1, 2, 1],
  map: {
    1: () => 'Type 1',
    2: () => 'Type 2',
  },
  mapDataToProps: {
    withMapDataToProps: ({ data }) => ({ mappedData: data }),
  },
}

test('should provide getKey with item, index, and list', () => {
  const { list: defaultList } = defaultProps
  let allArgs = {}

  const tree = renderer.create(
    <MapToComponents
      {...defaultProps}
      getKey={(item, index, list) => {
        allArgs[index] = { item, index, list }
        return index
      }}
    />,
  )

  expect(allArgs).toEqual({
    0: { item: 1, index: 0, list: [...defaultList] },
    1: { item: 2, index: 1, list: [...defaultList] },
    2: { item: 1, index: 2, list: [...defaultList] },
  })
})

test('should provide getType with item, index, and list', () => {
  const { list: defaultList } = defaultProps
  let allArgs = {}

  const tree = renderer.create(
    <MapToComponents
      {...defaultProps}
      getType={(item, index, list) => {
        allArgs[index] = { item, index, list }
        return item
      }}
    />,
  )

  expect(allArgs).toEqual({
    0: { item: 1, index: 0, list: defaultList },
    1: { item: 2, index: 1, list: defaultList },
    2: { item: 1, index: 2, list: defaultList },
  })
})

test('should render list using components from map', () => {
  const tree = renderer.create(<MapToComponents {...defaultProps} />)

  expect(tree.toJSON()).toEqual(['Type 1', 'Type 2', 'Type 1'])
})

test('should provide map value with collection of props', () => {
  let mapValueProps

  const tree = renderer.create(
    <MapToComponents
      {...defaultProps}
      map={{
        1: () => null,
        2: props => {
          mapValueProps = props
          return null
        },
      }}
    />,
  )

  expect(mapValueProps).toEqual({
    data: 2,
    list: defaultProps.list,
    index: 1,
    type: 2,
    next: 1,
    nextKey: 2,
    nextType: 1,
    previous: 1,
    previousKey: 0,
    previousType: 1,
  })
})

test('should provide map value with any extra props', () => {
  let mapValueProps

  const tree = renderer.create(
    <MapToComponents
      {...defaultProps}
      map={{
        1: () => null,
        2: props => {
          mapValueProps = props
          return null
        },
      }}
      arbitraryData="arbitraryData"
    />,
  )

  expect(mapValueProps.arbitraryData).toBe('arbitraryData')
})

test('should render default mapping if mapping is not available', () => {
  const tree = renderer.create(
    <MapToComponents
      {...defaultProps}
      list={[1, 3]}
      default={({ data }) => `default for ${data}`}
    />,
  )

  expect(tree.toJSON()).toEqual(['Type 1', 'default for 3'])
})

test('should throw if component mapping is not available and no default is provided', () => {
  expect(() => {
    renderer
      .create(<MapToComponents {...defaultProps} list={[1, 3]} />)
      .toThrowError('Could not find a component mapping')
  })
})
