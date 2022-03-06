const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const Identicon = require('./identicon')
const ethNetProps = require('xdc-net-props')
const Dropdown = require('./dropdown').Dropdown
const DropdownMenuItem = require('./dropdown').DropdownMenuItem
const copyToClipboard = require('copy-to-clipboard')
const actions = require('../../../ui/app/actions')
const connect = require('react-redux').connect
const { MAINNET_CODE } = require('../../../app/scripts/controllers/network/enums')
import { countSignificantDecimals, toChecksumAddress } from '../util'

const tokenCellDropDownPrefix = 'token-cell_dropdown_'

inherits(TokenCell, Component)
function TokenCell () {
  Component.call(this)

  this.state = {
    optionsMenuActive: false,
  }
  this.optionsMenuToggleClassName = 'token-dropdown'
}

TokenCell.prototype.render = function () {
  const { address, symbol, string, network, userAddress, isLastTokenCell, menuToTop, ind,
  } = this.props
  const { optionsMenuActive } = this.state

  const tokenBalanceRaw = Number.parseFloat(string)
  const tokenBalance = tokenBalanceRaw.toFixed(countSignificantDecimals(tokenBalanceRaw, 2))

  
  return (
    h(`li#token-cell_${ind}.token-cell`, {
      style: {
        cursor: Number(network) === MAINNET_CODE ? 'pointer' : 'default',
        borderBottom: isLastTokenCell ? '1px solid #E3E7EB' : '1px solid #E3E7EB',
        padding: '10px 0',
        margin: '0 8px 0 18px',
      },
      onClick: this.view.bind(this, address, userAddress, network),
    }, [

      h(Identicon, {
        diameter: 50,
        address,
        network,
      }),

      h('h3', {
        style: {
          // fontFamily: 'Inter',
          fontSize: '14px',
          fontWeight: '700',
          height: '17px',
          width: '50%',

        },
      }, `${tokenBalance || 0} ${symbol}`),

      h('span', { style: { flex: '1 0 auto' } }),

      h(`div#${tokenCellDropDownPrefix}${ind}.address-dropdown.token-dropdown`,
        {
          style: { cursor: 'pointer', marginTop: '1px', },
          onClick: (event) => {
            event.stopPropagation()
            this.setState({
              optionsMenuActive: !optionsMenuActive,
            })
          },
        },
        this.renderTokenOptions(menuToTop, ind)
      ),

      /*
      h('button', {
        onClick: this.send.bind(this, address),
      }, 'SEND'),
      */
    ])
    
  )
}

TokenCell.prototype.renderTokenOptions = function (menuToTop, ind) {
  const { address, symbol, string, network, userAddress, showSendTokenPage } = this.props
  const { optionsMenuActive } = this.state

  return h(
    Dropdown,
    {
      style: {
        position: 'absolute',
        // marginLeft: menuToTop ? '-273px' : '-263px',
        minWidth: '180px',
        // marginTop: menuToTop ? '-214px' : '30px',
        width: '317px',
        bottom: '18px',
        left: '0'
      },
      isOpen: optionsMenuActive,
      onClickOutside: (event) => {
        const { classList, id: targetID } = event.target
        const isNotToggleCell = !classList.contains(this.optionsMenuToggleClassName)
        const isAnotherCell = targetID !== `${tokenCellDropDownPrefix}${ind}`
        if (optionsMenuActive && (isNotToggleCell || (!isNotToggleCell && isAnotherCell))) {
          this.setState({ optionsMenuActive: false })
        }
      },
    },
    [
      h('div',
        {className: 'token-options-list'},
        [`Token Options`,
        h('img',
          {className: 'token-options-close-icon', src: "/images/Assets/Close.svg"}
        ),]
      ),
    
      h(
        DropdownMenuItem,
        {
          closeMenu: () => {},
          onClick: () => {
            showSendTokenPage(address)
          },
        },
        [
          h('img',
            {className: 'token-options-icon', src: "/images/Assets/Send.svg"},
          ),
        `Send`,]
      ),
      h(
        DropdownMenuItem,
        {
          closeMenu: () => {},
          onClick: () => {
            const { network } = this.props
            const url = ethNetProps.explorerLinks.getExplorerTokenLinkFor(address.replace("0x", "xdc"),userAddress, network,symbol)
            global.platform.openWindow({ url })
          },
        },[
          h('img',
          {className: 'token-options-icon', src: "/images/Assets/ViewOnExplorer.svg"},
          ),
        network==50?`View token on observer`:'View token on block explorer',]
      ),
      h(
        DropdownMenuItem,
        {
          closeMenu: () => {},
          onClick: () => {
            copyToClipboard(address.replace("0x", "xdc"))
          },
        },[
          h('img',
            {className: 'token-options-icon', src: "/images/Assets/CopyClipboard.svg"},
          ),
        'Copy address to clipboard',]
      ),
      h(
        DropdownMenuItem,
        {
          closeMenu: () => {},
          onClick: () => {
            this.props.removeToken({ address, symbol, string, network, userAddress })
          },
        },[
          h('img',
            {className: 'token-options-icon', src: "/images/Assets/Remove.svg"},
          ),
        'Remove',]
      ),
    ]
  )
}

TokenCell.prototype.send = function (address, event) {
  event.preventDefault()
  event.stopPropagation()
  const url = tokenFactoryFor(address)
  navigateTo(url)
}

TokenCell.prototype.view = function (address, userAddress, network, event) {
  const {symbol} = this.props
  const url = ethNetProps.explorerLinks.getExplorerTokenLinkFor(address.replace('0x', 'xdc'), userAddress, network,symbol)
  if (url) {
    navigateTo(url)
  }
}

function navigateTo (url) {
  global.platform.openWindow({ url })
}

function tokenFactoryFor (tokenAddress) {
  return `https://tokenfactory.surge.sh/#/token/${tokenAddress}`
}

const mapDispatchToProps = dispatch => {
  return {
    showSendTokenPage: (tokenAddress) => dispatch(actions.showSendTokenPage(tokenAddress)),
  }

}

module.exports = connect(null, mapDispatchToProps)(TokenCell)

