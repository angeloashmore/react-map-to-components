# react-map-to-components

React component to map a list of data to a component based on its type.

This component is especially useful when processing data from an external
source with a flexible nature, such as [Prismic
Slices](https://prismic.io/feature/dynamic-layout-content-components) and
[WordPress ACF Flexible
Content](https://www.advancedcustomfields.com/resources/flexible-content/).

## Status

[![npm version](https://badge.fury.io/js/react-map-to-components.svg)](http://badge.fury.io/js/react-map-to-components)
[![Build Status](https://travis-ci.com/angeloashmore/react-map-to-components.svg?branch=master)](https://travis-ci.com/angeloashmore/react-map-to-components)

## Installation

```sh
npm install --save react-map-to-components
```

## How to use

`MapToComponents` takes a list and renders a list of components using a mapping
object. The following example shows the simplest use case.

```jsx
import React from 'react'
import MapToComponents from 'react-map-to-components'

const list = [
  { id: 1, type: 'HeroBlock', text: 'Text for a Hero component' },
  { id: 2, type: 'CallToActionBlock', text: 'Hey', buttonText: 'Call Me' },
  { id: 3, type: 'FooterBlock', year: 2074 },
]

const App = () => (
  <MapToComponents
    getKey={x => x.id}
    getType={x => x.type}
    list={list}
    map={{
      HeroBlock: Hero,
      CallToActionBlock: CallToAction,
      FooterBlock: props => <Footer foo="bar" {...props} />,
    }}
  />
)
```

In this example, `list` is an array of objects. `MapToComponents` will render a
list of components using that list by performing the following:

1. For each item in the list, get a key using `getKey`. `getKey` should return
   a unique value for each item in the list, such an an ID or UUID. This value
   will be used as the `key` prop when rendering the component.

2. For each item in the list, get a type using `getType`. `getType` should
   return a string with a property in the `map` object corresponding to a React
   component. If `getType` returns a string without a property in `map`, an
   error will be thrown by default. **The default behavior can be overriden if
   you have a default component to render**.

3. Using the key and type for each item in the list, a component is rendered
   for each item. The component used is determined by the type and component
   key-value mapping in `map`.

Something like the following would be rendered by `MapToComponents`:

```js
;[<Hero key={1} />, <CallToAction key={2} />, <Footer foo="bar" key={3} />]
```

## Providing props to components

In the previous example, notice that an item with type `FooterBlock` would
render `Footer` with the prop `foo="bar"` and values in `props`. Using this
method, you can provide default props to your components rather than passing
just a reference to a component, as is done with `Hero` and `CallToAction`.

By default, no props **except `key`** are passed to the components.

To pass props to the components using data derived from the object in the list,
you can provide `mapDataToProps` to `MapToComponents`.

```jsx
<MapToComponents
  getKey={x => x.id}
  getType={x => x.type}
  list={list}
  map={{
    HeroBlock: Hero,
    CallToActionBlock: CallToAction,
    FooterBlock: props => <Footer foo="bar" {...props} />,
  }}
  mapDataToProps={{
    HeroBlock: ({ data }) => ({ text: data.text }),
    CallToAction: ({ data }) => ({ buttonText: data.buttonText }),
    FooterBlock: ({ data }) => ({ year: data.year }),
  }}
/>
```

TODO: Write the following:

- Explain data available in `mapDataToProps` functions
- Explain `mapDataToContext`
- Update props table

## Props

NOTE: Outdated list of props below. Please read the source code and tests until
the table is updated.

| Name                 | Type                                 | Description                                                                                                                                              |
| -------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`getKey`**         | `PropTypes.func.isRequired`          | Function that returns the key for an element in the list. A unique key for each element is necessary for React when rendering an array, as in this case. |
| **`getType`**        | `PropTypes.func.isRequired`          | Function that returns the type for an element in the list.                                                                                               |
| **`list`**           | `PropTypes.array`                    | List of data. This can be an array of any type; data is passed directly to the component as the `data` prop.                                             |
| **`map`**            | `PropTypes.objectOf(PropTypes.func)` | Object that maps a data type to a React component to be rendered.                                                                                        |
| **`mapDataToProps`** | `PropTypes.objectOf(PropTypes.func)` | Object that maps a data type to a function that returns an object of props to be passed to the React component.                                          |
| **`default`**        | `PropTypes.func`                     | React component to be rendered if element type is not defined in `map`.                                                                                  |

The rendered components will receive the following props:

| Name                 | Type                                 | Description                                                                 |
| -------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| **`data`**           | `PropTypes.any`                      | The element from `list`.                                                    |
| **`index`**          | `PropTypes.number`                   | The index of the element in `list`.                                         |
| **`key`**            | `PropTypes.any`                      | The key of the element from `list` returned from `getKey`.                  |
| **`list`**           | `PropTypes.array`                    | The original list of data.                                                  |
| **`map`**            | `PropTypes.objectOf(PropTypes.func)` | The original component map.                                                 |
| **`type`**           | `PropTypes.any`                      | The type of the element from `list` returned from `getType`.                |
| **`previous`**       | `PropTypes.any`                      | The previous element from `list`. `undefined` if first element.             |
| **`previousKey`**    | `PropTypes.any`                      | The key of the previous element from `list`. `undefined` if first element.  |
| **`previousType`**   | `PropTypes.any`                      | The type of the previous element from `list`. `undefined` if first element. |
| **`next`**           | `PropTypes.any`                      | The next element from `list`. `undefined` if last element.                  |
| **`nextKey`**        | `PropTypes.any`                      | The key of the next element from `list`. `undefined` if last element.       |
| **`nextType`**       | `PropTypes.any`                      | The type of the next element from `list`. `undefined` if last element.      |
| **`...props`**       | `PropTypes.any`                      | Any props passed to `MapToComponents` not in the first table.               |
| **`...mappedProps`** | `PropTypes.any`                      | Any props returned from the `mapDataToProps` function if provided.          |
