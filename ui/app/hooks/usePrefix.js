import { useCallback } from 'react'

export default function usePrefix () {
  const selectedNetwork = 'XDC'

  const get0xAddress = useCallback((address = '') => {
    if (selectedNetwork === 'XDC' || selectedNetwork === 'XDCT') {
      const prefix = 'xdc'
      const start = address?.slice(0, 3)
      return start.toLowerCase() === prefix ? (`0x${address.substring(3)}`) : address
    } else {
      return address
    }
  }, [selectedNetwork])
  const getXDCAddress = useCallback((address = '') => {
    if (selectedNetwork === 'XDC' || selectedNetwork === 'XDCT') {
      const prefix = 'xdc'
      const start = address?.slice(0, 2)
      return start.toLowerCase() === '0x' ? prefix + address.substring(2) : address
    } else {
      return address
    }
  }, [selectedNetwork])

  return {
    get0xAddress,
    getXDCAddress,
  }
}
