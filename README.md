# react-map-to-components

React component to map a list of data to a component based on its type.

## Status

## Installation

```sh
npm install --save react-map-to-components
```

## Usage

Import the `MapToComponents` component and provide the following props:

- **`getKey`**: Function that returns the key for an element in the list.
  Necessary for React when rendering an array, as in this case.
- **`getType`**: Function that returns the type for an element in the list.
- **`list`**: List of data. This can be an array of any type; data is passed
  directly to the component as the `data` prop.
- **`map`**: Object that maps a data type to a component to be rendered.

The rendered components will receive the following props:

- Any props passed to `MapToComponents` not listed above.
- **`data`**: The element from `list`.
- **`index`**: The index of the element in `list`.
- **`key`**: The key of the element from `list` returned from `props.getType`.
- **`list`**: The original list of data.
- **`type`**: The type of the element from `list` returned from `props.getType`.

### Example

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

const App = () => (
  <div>
    <MapToComponents
      getKey={x => x.id}
      getType={x => x.type}
      list={list}
      map={{
        HeroBlock: Hero,
        CallToActionBlock: CallToAction,
      }}
    />
  </div>
)
```
