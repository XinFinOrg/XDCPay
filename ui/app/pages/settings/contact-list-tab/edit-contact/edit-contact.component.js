import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import Identicon from '../../../../components/ui/identicon'
import Button from '../../../../components/ui/button/button.component'
import TextField from '../../../../components/ui/text-field'
import { isValidAddress } from '../../../../helpers/utils/util'
import PageContainerFooter from '../../../../components/ui/page-container/page-container-footer'
import withPrefix from '../../../../hoc/withPrefix'

class EditContact extends PureComponent {

  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    addToAddressBook: PropTypes.func,
    removeFromAddressBook: PropTypes.func,
    history: PropTypes.object,
    name: PropTypes.string,
    address: PropTypes.string,
    chainId: PropTypes.string,
    memo: PropTypes.string,
    viewRoute: PropTypes.string,
    listRoute: PropTypes.string,
    setAccountLabel: PropTypes.func,
    showingMyAccounts: PropTypes.bool.isRequired,
    getXDCAddress: PropTypes.func,
    get0xAddress: PropTypes.func,
  }

  static defaultProps = {
    name: '',
    memo: '',
  }

  state = {
    newName: this.props.name,
    newAddress: this.props.getXDCAddress(this.props.address),
    newMemo: this.props.memo,
    error: '',
  }

  render () {
    const { t } = this.context
    const {
      address,
      addToAddressBook,
      chainId,
      history,
      listRoute,
      memo,
      name,
      removeFromAddressBook,
      setAccountLabel,
      showingMyAccounts,
      viewRoute,
      get0xAddress,
    } = this.props

    if (!address) {
      return <Redirect to={{ pathname: listRoute }} />
    }

    return (
      <div className="settings-page__content-row address-book__edit-contact">
        <div className="settings-page__header address-book__header--edit">
          <Identicon address={address} diameter={60} />
          {
            showingMyAccounts
              ? null
              : (
                <Button
                  type="link"
                  className="settings-page__address-book-button"
                  onClick={async () => {
                    await removeFromAddressBook(chainId, get0xAddress(address))
                  }}
                >
                  {t('deleteAccount')}
                </Button>
              )
          }
        </div>
        <div className="address-book__edit-contact__content">
          <div className="address-book__view-contact__group">
            <div className="address-book__view-contact__group__label">
              { t('userName') }
            </div>
            <TextField
              type="text"
              id="nickname"
              placeholder={this.context.t('addAlias')}
              value={this.state.newName}
              onChange={(e) => this.setState({ newName: e.target.value })}
              fullWidth
              margin="dense"
            />
          </div>

          <div className="address-book__view-contact__group">
            <div className="address-book__view-contact__group__label">
              { t('ethereumPublicAddress') }
            </div>
            <TextField
              type="text"
              id="address"
              value={this.state.newAddress}
              error={this.state.error}
              onChange={(e) => this.setState({ newAddress: e.target.value })}
              fullWidth
              margin="dense"
            />
          </div>

          <div className="address-book__view-contact__group">
            <div className="address-book__view-contact__group__label--capitalized">
              { t('memo') }
            </div>
            <TextField
              type="text"
              id="memo"
              placeholder={memo}
              value={this.state.newMemo}
              onChange={(e) => this.setState({ newMemo: e.target.value })}
              fullWidth
              margin="dense"
              multiline
              rows={3}
              classes={{
                inputMultiline: 'address-book__view-contact__text-area',
                inputRoot: 'address-book__view-contact__text-area-wrapper',
              }}
            />
          </div>
        </div>
        <PageContainerFooter
          cancelText={this.context.t('cancel')}
          onSubmit={async () => {
            if (this.state.newAddress !== '' && get0xAddress(this.state.newAddress) !== get0xAddress(address)) {
              // if the user makes a valid change to the address field, remove the original address
              if (isValidAddress(get0xAddress(this.state.newAddress))) {
                await removeFromAddressBook(chainId, get0xAddress(address))
                await addToAddressBook(get0xAddress(this.state.newAddress), this.state.newName || name, this.state.newMemo || memo)
                if (showingMyAccounts) {
                  setAccountLabel(get0xAddress(this.state.newAddress), this.state.newName || name)
                }
                history.push(listRoute)
              } else {
                this.setState({ error: this.context.t('invalidAddress') })
              }
            } else {
              // update name
              await addToAddressBook(get0xAddress(address), this.state.newName || name, this.state.newMemo || memo)
              if (showingMyAccounts) {
                setAccountLabel(get0xAddress(address), this.state.newName || name)
              }
              history.push(listRoute)
            }
          }}
          onCancel={() => {
            history.push(`${viewRoute}/${get0xAddress(address)}`)
          }}
          submitText={this.context.t('save')}
          submitButtonType="confirm"
        />
      </div>
    )
  }
}
export default withPrefix(EditContact)
