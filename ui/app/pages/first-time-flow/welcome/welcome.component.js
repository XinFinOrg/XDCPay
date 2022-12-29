import EventEmitter from 'events'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../components/ui/button'
import { INITIALIZE_CREATE_PASSWORD_ROUTE, INITIALIZE_SELECT_ACTION_ROUTE } from '../../../helpers/constants/routes'
import SiteIcon from '../../../components/ui/site-icon'

export default class Welcome extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    participateInMetaMetrics: PropTypes.bool,
    welcomeScreenSeen: PropTypes.bool,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.animationEventEmitter = new EventEmitter()
  }

  componentDidMount () {
    const { history, participateInMetaMetrics, welcomeScreenSeen } = this.props

    if (welcomeScreenSeen && participateInMetaMetrics !== null) {
      history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)
    } else if (welcomeScreenSeen) {
      history.push(INITIALIZE_SELECT_ACTION_ROUTE)
    }
  }

  handleContinue = () => {
    this.props.history.push(INITIALIZE_SELECT_ACTION_ROUTE)
  }

  render () {
    const { t } = this.context

    return (
      <div className="welcome-page__wrapper">
        <div className="welcome-page">
          <SiteIcon icon="/images/logo/XDCPay.svg" size={120} />
          <div className="welcome-page__header">
            { t('welcome') }
          </div>
          <div className="welcome-page__description">
            <div>{ t('metamaskDescription') }</div>
            <div>{ t('happyToSeeYou') }</div>
          </div>
          <Button
            type="primary"
            className="first-time-flow__button"
            onClick={this.handleContinue}
          >
            { t('getStarted') }
          </Button>
          <div className="footer-section">
            <img src="images/build_it_on.png" height={50} />
            <div className="footer-section-powered">
              <p>Powered By:</p>
              <img src="/images/blocksscan.svg" height={30} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
