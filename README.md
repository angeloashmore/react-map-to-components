# react-map-to-components

React component to map a list of data to a component based on its type.

This component is especially useful when processing data from an external source
with a flexible nature, such as [Prismic Slices][prismic-slices] and [WordPress
ACF Flexible Content][wordpress-acf-flexible-content].

[![npm version](https://flat.badgen.net/npm/v/react-map-to-components)](https://www.npmjs.com/package/react-map-to-components)
[![Build Status](https://flat.badgen.net/travis/angeloashmore/react-map-to-components)](https://travis-ci.com/angeloashmore/react-map-to-components)

```sh
npm install --save react-map-to-components
```

# Usage

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

In this example, `MapToComponents` will render a list of components using `list`
by performing the following:

1. For each item in the list, get a key using `getKey`. `getKey` should return a
   unique value for each item in the list, such an an ID or UUID. This value
   will be used as the `key` prop when rendering the component.

   Read why this is necessary on React's [Lists and Keys][react-keys] guide.

2. For each item in the list, get a type using `getType`. `getType` should
   return a string with a property in the `map` object corresponding to a React
   component. If `getType` returns a string without a property in `map`, an
   error will be thrown by default. **The default behavior can be overriden if
   you have a default component to render**.

3. Using the key and type for each item in the list, a component is rendered for
   each item. The component used is determined by the type and component
   key-value mapping in `map`.

```jsx
const App = [
  <Hero key={1} />,
  <CallToAction key={2} />,
  <Footer foo="bar" key={3} />,
]
```

## Providing props to components

In the previous example, notice that an item with type `FooterBlock` would
render `Footer` with the prop `foo="bar"`. By creating a new function component
in `map`, you can provide default props to your components. This is in contrast
to just passing a reference to a component, as is done with `Hero` and
`CallToAction`.

By default, no props **except `key`** are passed to the components.

To pass props to the components using data derived from the object in the list,
you can provide a `mapDataToProps` prop to `MapToComponents`.

### mapDataToProps

To pass dynamic props to your components, provide an object to the
`mapDataToProps` prop. This prop is similar to `map` in that your object should
be a mapping of a list element's type to a function. The function should return
an object of props to provide to the type's component.

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

In the above example, the `Hero` component would receive a `text` prop with the
value `data.text`, where `data` is the element in the list that maps to the
`HeroBlock` type.

Likewise, `CallToAction` would receive a `buttonText` prop, and `Footer` would
receive both `foo` and `year` props.

Each function in `mapDataToProps` has access to the current element, data about
the element such as index, and data about sibling elements. See the
[`mapDataToProps` API](#mapDataToProps2) for a list of all values available.

### mapDataToContext

There may be times where you need to reference data from other elements in the
list, such as the previous or next element, that influences the data you pass to
your component.

Using just `mapDataToProps`, the only way to access a sibiling's derived data
(i.e. data that is dynamically created, not statically available on the element)
is to set it on `mapDataToProp`'s return object. Since all values returned from
`mapDataToProps` are passed to the element's component, this forces the
contextual data to be passed to the component, which may be unwanted.

Data about the next element is also not available yet as the list is mapped
synchronously.

Instead, you can provide a `mapDataToContext` prop to create contextual data
about an element. This works exactly like `mapDataToProps`. The objects returned
from the `mapDataToContext` functions are available to the `mapDataToProps`
functions under the `context` properties.

Unlike `mapDataToProps`, data returned from `mapDataToContext` is not passed to
the component automatically.

Each function in `mapDataToProps` has access to the current element, data about
the element such as index, and data about sibling elements. See the
[`mapDataToContext` API](#mapDataToContext2) for a list of all values available.

## API

### MapToComponents

- **`getKey`**: (Function) Function that returns a unique key for an element in
  the list. Required.
- **`getType`**: (Function) Function that returns the type for an element in the
  list. Required.
- **`list`**: (Array): List of data. This can be an array containing mixed
  types.
- **`map`**: (Object): Object mapping a data type to a React component to be
  rendered.
- **`mapDataToProps`**: (Object) Object mapping a data type to a function
  returning props for the component to be rendered.
- **`mapDataToContext`**: (Object) Object mapping a data type to a function
  returning contextual data for the element.
- **`default`**: (Component) Component to be rendered if an element type is not
  defined in `map`.

### mapDataToProps

Functions in the object passed to `mapDataToProps` are provided an object as
their only argument with the following properties:

#### General

- **`list`**: List of elements.
- **`keys`**: List of keys for each element in `list`.
- **`types`**: List of types for each element in `list`.
- **`comps`**: List of components for each element in `list`.
- **`contexts`**: List of context values for each element in `list`.
- **`map`**: Mapping of types to React components.

#### Element

- **`data`**: The current element.
- **`index`**: The index for the current element.
- **`context`**: The context for the current element.
- **`key`**: The key for the current element.
- **`type`**: The type for the current element.
- **`Comp`**: The component for the current element.

#### Previous element

- **`previousData`**: The previous element.
- **`previousContext`**: The context for the previous element.
- **`previousKey`**: The key for the previous element.
- **`previousType`**: The type for the previous element.
- **`PreviousComp`**: The component for the previous element.

#### Next element

- **`nextData`**: The next element.
- **`nextContext`**: The context for the next element.
- **`nextKey`**: The key for the next element.
- **`nextType`**: The type for the next element.
- **`NextComp`**: The component for the next element.

### mapDataToContext

Same signature as [`mapDataToProps`](#mapDataToProps#2). All `context`
properties will be `undefined` and should not be used.

[prismic-slices]: https://prismic.io/feature/dynamic-layout-content-components
[wordpress-acf-flexible-content]:
  https://www.advancedcustomfields.com/resources/flexible-content/
[react-keys]: https://reactjs.org/docs/lists-and-keys.html#keys
