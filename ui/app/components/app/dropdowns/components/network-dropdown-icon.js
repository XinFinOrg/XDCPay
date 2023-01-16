import PropTypes from 'prop-types'
import React from 'react'
import Identicon from '../../../ui/identicon/identicon.component'

function NetworkDropdownIcon (props) {
  const {
    backgroundColor,
    isSelected,
    innerBorder,
    diameter,
    loading,
  } = props

  return loading
    ? (
      <span
        className="pointer network-indicator"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <img alt="" style={{ width: '27px' }} src="images/loading.svg" />
      </span>
    )
    : (
      <div className={`menu-icon-circle${isSelected ? '--active' : ''}`}>
        <Identicon
          image="./images/xdc_logo.svg"
          diameter={diameter}
        />
      </div>
    )
}

NetworkDropdownIcon.defaultProps = {
  backgroundColor: undefined,
  loading: false,
  innerBorder: 'none',
  diameter: 16,
  isSelected: false,
}

NetworkDropdownIcon.propTypes = {
  backgroundColor: PropTypes.string,
  loading: PropTypes.bool,
  innerBorder: PropTypes.string,
  diameter: PropTypes.number,
  isSelected: PropTypes.bool,
}

export default NetworkDropdownIcon
