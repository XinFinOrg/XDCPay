import { connect } from 'react-redux'
import {
  getCurrentNetwork,
  getSendTo,
  getSendToNickname,
  getAddressBookEntry,
} from '../../../../selectors'
import EnsInput from './ens-input.component'
import withPrefix from '../../../../hoc/withPrefix'

export default withPrefix(connect(
  (state) => {
    const selectedAddress = getSendTo(state)
    return {
      network: getCurrentNetwork(state),
      selectedAddress,
      selectedName: getSendToNickname(state),
      contact: getAddressBookEntry(state, selectedAddress),
    }
  },
)(EnsInput))
