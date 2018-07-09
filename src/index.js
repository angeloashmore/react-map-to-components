import React from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'

const MapToComponents = ({ getKey, getType, list, map, ...props }) =>
  list.map((data, index) => {
    const key = getKey(data, index, list)
    const type = getType(data, index, list)
    const Comp = map[type]

    invariant(Comp, `Could not find a component mapping for type "${type}".`)

    return React.createElement(Comp, { key, data, index, ...props })
  })

MapToComponents.propTypes = {
  getKey: PropTypes.func.isRequired,
  getType: PropTypes.func.isRequired,
  list: PropTypes.array,
  map: PropTypes.objectOf(PropTypes.func),
}

MapToComponents.defaultProps = {
  list: [],
  map: {},
}

export default MapToComponents
