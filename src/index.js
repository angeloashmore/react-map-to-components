import React from 'react'
import PropTypes from 'prop-types'

const MapToComponents = ({
  getKey,
  getType,
  list,
  map,
  mapDataToProps,
  default: defaultMapping,
  ...props
}) =>
  list.map((data, index) => {
    const key = getKey(data, index, list)
    const type = getType(data, index, list)
    const Comp = map.hasOwnProperty(type) ? map[type] : defaultMapping

    const passedProps = {
      key,
      data,
      list,
      index,
      type,
      ...props,
    }

    const previous = list[index - 1]
    const next = list[index + 1]

    if (previous) {
      passedProps.previous = previous
      passedProps.previousKey = getKey(previous, index - 1, list)
      passedProps.previousType = getType(previous, index - 1, list)
    }

    if (next) {
      passedProps.next = next
      passedProps.nextKey = getKey(next, index + 1, list)
      passedProps.nextType = getType(next, index + 1, list)
    }

    let mappedProps = {}
    const compMapDataToProps = mapDataToProps[type]
    if (compMapDataToProps) mappedProps = compMapDataToProps(passedProps)

    return React.createElement(Comp, { ...passedProps, ...mappedProps })
  })

MapToComponents.propTypes = {
  getKey: PropTypes.func.isRequired,
  getType: PropTypes.func.isRequired,
  list: PropTypes.array,
  map: PropTypes.objectOf(PropTypes.func),
  mapDataToProps: PropTypes.objectOf(PropTypes.func),
  default: PropTypes.func,
}

MapToComponents.defaultProps = {
  list: [],
  map: {},
  mapDataToProps: {},
  default: ({ type }) => {
    throw new Error(`Could not find a component mapping for type "${type}"`)
  },
}

export default MapToComponents
