import React from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'

const renderBlock = ({
  componentsMap,
  getKey,
  getTypename,
  ...props
}) => block => {
  const key = getKey(block)
  const typename = getTypename(block)
  const Comp = componentsMap[typename]

  invariant(
    Comp,
    `Could not find a component mapping for block type "${typename}".`,
  )

  return React.createElement(Comp, { key, block, ...props })
}

const FlexibleBlocks = ({ blocks, ...props }) => blocks.map(renderBlock(props))

FlexibleBlocks.displayName = 'FlexibleBlocks'

FlexibleBlocks.propTypes = {
  blocks: PropTypes.array,
  componentsMap: PropTypes.objectOf(PropTypes.func),
  getKey: PropTypes.func,
  getTypename: PropTypes.func.isRequired,
}

FlexibleBlocks.defaultProps = {
  blocks: [],
  componentsMap: {},
  getKey: x => (typeof x === 'object' ? x.id : undefined),
}

export default FlexibleBlocks
