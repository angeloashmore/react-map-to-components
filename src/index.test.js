import React, { createElement as h } from 'react'
import renderer from 'react-test-renderer'
import FlexibleBlocks from '.'

const defaultProps = {
  blocks: [1, 2],
  componentsMap: {
    1: ({ block }) => h('div', null, `Type 1: ${block}`),
    2: ({ block }) => h('div', null, `Type 2: ${block}`),
  },
  getKey: x => x,
  getTypename: x => x,
}

beforeEach(() => {
  jest.spyOn(console, 'error')
  global.console.error.mockImplementation(() => {})
})

afterEach(() => {
  global.console.error.mockRestore()
})

test('typical usage', () => {
  const component = renderer.create(h(FlexibleBlocks, defaultProps))
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('missing mapped component throws', () => {
  const props = { ...defaultProps, componentsMap: {} }
  expect(() =>
    renderer.create(h(FlexibleBlocks, props)),
  ).toThrowErrorMatchingSnapshot()
})
