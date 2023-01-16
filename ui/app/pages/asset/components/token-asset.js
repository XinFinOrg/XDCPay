import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import TransactionList from '../../../components/app/transaction-list'
import { TokenOverview } from '../../../components/app/wallet-overview'
import { getCurrentNetworkId, getSelectedIdentity } from '../../../selectors/selectors'
import { DEFAULT_ROUTE } from '../../../helpers/constants/routes'
import { showModal } from '../../../store/actions'

import AssetNavigation from './asset-navigation'
import TokenOptions from './token-options'
import { getBlockExplorerUrlForAddress } from '../../../helpers/utils/transactions.util'

export default function TokenAsset ({ token }) {
  const dispatch = useDispatch()
  const network = useSelector(getCurrentNetworkId)
  const selectedAccountName = useSelector((state) => getSelectedIdentity(state).name)
  const history = useHistory()

  return (
    <>
      <AssetNavigation
        accountName={selectedAccountName}
        assetName={token.symbol}
        onBack={() => history.push(DEFAULT_ROUTE)}
        optionsButton={(
          <TokenOptions
            onRemove={() => dispatch(showModal({ name: 'HIDE_TOKEN_CONFIRMATION', token }))}
            onViewEtherscan={() => {
              global.platform.openTab({ url: getBlockExplorerUrlForAddress(network, token.address) })
            }}
            tokenSymbol={token.symbol}
          />
        )}
      />
      <TokenOverview className="asset__overview" token={token} />
      <TransactionList tokenAddress={token.address} />
    </>
  )
}

TokenAsset.propTypes = {
  token: PropTypes.shape({
    address: PropTypes.string.isRequired,
    decimals: PropTypes.number,
    symbol: PropTypes.string,
  }).isRequired,
}
