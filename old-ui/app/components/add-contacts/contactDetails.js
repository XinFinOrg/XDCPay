const React = require('react')
const connect = require('react-redux').connect
const actions = require('../../../../ui/app/actions')
import Identicon from '../../../../ui/app/components/identicon'

const CopyButton = require('../copy/copy-button')

const TransactionList = require('../transaction-list')
const {valuesFor} = require('../../util')

class ContactDetails extends React.Component {

  render () {
    const state = this.props
    const contactObj = state.viewContactObj
    const {
      transactions,
      unapprovedMsgs,
      network,
      shapeShiftTxList,
      conversionRate,
    } = this.props
    const transactionAddress = contactObj.address.replace("xdc","0x")
    const currentContactTxn = transactions.filter((txnObj) => txnObj.txParams.to === transactionAddress)

    function shorten(b, amountL = 7, /*amountR = 4,*/ stars = 3) {
      return `${b.slice(0, amountL)}${'.'.repeat(stars)}${b.slice(
        b.length - 4,
        b.length,
      )}`
    }
    
    return (
      <div
        className="flex-column flex-grow"
        style={{maxHeight: '585px', overflowY: 'auto'}}
      >
        <div
          className="section-title flex-row"
          style={{
            paddingBottom: '17px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <img src="/images/Assets/BackArrow.svg"
               style={{marginLeft: '17px', cursor: 'pointer'}}
               onClick={() => state.dispatch(actions.Contacts())}
          />
          <h2 style={{fontFamily: 'Inter-bold', marginLeft: '30px'}}>
            Contact Details
          </h2>
          <div
            style={{
              color: '#2149B9',
              fontSize: '15px',
              marginRight: '22px',
              fontFamily: 'Inter-Medium',
              cursor: 'pointer',
            }}
            onClick={() => state.dispatch(actions.viewContact(contactObj))}
          >
            Edit
          </div>
        </div>
        <div style={{padding:'0 0 29px 0'}}>
          <div style={{borderBottom: '1px solid #E3E7EB'}}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Identicon
                overflow="none"
                address={contactObj.address.replace("xdc","0x")}
                diameter={69}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'inherit',
                }}
              />
            </div>
            <div style={{display: 'grid', justifyContent: 'center'}}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginTop: '5px',
                  color: '#2a2a2a',

                }}
              >
                {contactObj.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#848484',
                  marginTop: '16px',
                  fontFamily: 'Inter-Medium',
                }}
              >
                Wallet Address
              </div>
              <div style={{display: 'flex', justifyContent: 'center',alignItems:'baseline' ,wordBreak:'break-all',padding:'0 0 24px 0px '}}>
                <div style={{fontSize:'14px',fontFamily:'Inter-Medium' }}>{shorten(contactObj.address)}</div>
                <CopyButton value={contactObj.address} isWhite={true}/>
              </div>
            </div>
          </div>
          <div>
            <TransactionList

              transactions={currentContactTxn}
              network={network}
              unapprovedMsgs={unapprovedMsgs}
              conversionRate={conversionRate}
              address={contactObj.address}
              shapeShiftTxList={shapeShiftTxList}
            />
          </div>
        </div>
      </div>
    )
  }
}

module.exports = connect(mapStateToProps)(ContactDetails)

function mapStateToProps (state) {
  return {
    metamask: state.metamask,
    warning: state.appState.warning,
    viewContactObj: state.appState.currentViewContactObj,
    network: state.metamask.network,
    networkList: [
      ...state.metamask.networkList,
      ...state.metamask.frequentRpcList,
    ],
    unapprovedMsgs: valuesFor(state.metamask.unapprovedMsgs),
    shapeShiftTxList: state.metamask.shapeShiftTxList,
    transactions: state.metamask.selectedAddressTxList || [],
    conversionRate: state.metamask.conversionRate,
    currentCurrency: state.metamask.currentCurrency,
  }
}
