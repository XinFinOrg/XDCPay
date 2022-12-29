import React from 'react'
import usePrefix from '../hooks/usePrefix'

export default function withPrefix (Component) {
  return function WrappedComponent (props) {
    const { getXDCAddress, get0xAddress } = usePrefix()
    return <Component {...props} getXDCAddress={getXDCAddress} get0xAddress={get0xAddress}/>
  }
}
