import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ExampleComponent extends Component {
  render() {
    const cssHandles = this.props.cssHandles

    return (
      <div
        data-testid="test-div"
        className={Object.values(cssHandles).join(' ')}></div>
    )
  }
}

ExampleComponent.propTypes = {
  cssHandles: PropTypes.arrayOf(PropTypes.string),
}

export default ExampleComponent
