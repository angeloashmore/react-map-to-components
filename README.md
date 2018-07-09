# react-map-to-components

React component to map a list of data to a component based on its type.

## Status

## Installation

```sh
npm install --save react-map-to-components
```

## Example

```js
// App.js

import React from 'react'
import MapToComponents from 'react-map-to-components'

// Components to which data is mapped
import Hero from './Hero'
import CallToAction from './CallToAction'

const list = [
  { id: 1, type: 'HeroBlock', text: 'Text for a Hero component' },
  { id: 2, type: 'CallToActionBlock', text: 'Hey', buttonText: 'Call Me' },
  { id: 3, type: 'FooterBlock', year: 2074 },
]

const App = () =>
  <MapToComponents
    getKey={x => x.id}
    getType={x => x.type}
    list={list}
    map={{
      HeroBlock: Hero,
      CallToActionBlock: CallToAction,
    }}
  />
```

## Props

| Name          | Type                                 | Description                                                                                                                                              |
| ------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`getKey`**  | `PropTypes.func.isRequired`          | Function that returns the key for an element in the list. A unique key for each element is necessary for React when rendering an array, as in this case. |
| **`getType`** | `PropTypes.func.isRequired`          | Function that returns the type for an element in the list.                                                                                               |
| **`list`**    | `PropTypes.array`                    | List of data. This can be an array of any type; data is passed directly to the component as the `data` prop.                                             |
| **`map`**     | `PropTypes.objectOf(PropTypes.func)` | Object that maps a data type to a React component to be rendered.                                                                                        |

The rendered components will receive the following props:

| Name        | Type               | Description                                                        |
| ----------- | ------------------ | ------------------------------------------------------------------ |
| **`data`**  | `PropTypes.any`    | The element from `list`.                                           |
| **`index`** | `PropTypes.number` | The index of the element in `list`.                                |
| **`key`**   | `PropTypes.any`    | The key of the element from `list` returned from `props.getType`.  |
| **`list`**  | `PropTypes.array`  | The original list of data.                                         |
| **`type`**  | `PropTypes.any`    | The type of the element from `list` returned from `props.getType`. |
