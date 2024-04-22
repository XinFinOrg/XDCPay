import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '../../../components/ui/box';
import Typography from '../../../components/ui/typography';
import Button from '../../../components/ui/button';
import {
  FONT_WEIGHT,
  TEXT_ALIGN,
  TypographyVariant,
  AlignItems,
} from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import {
  ONBOARDING_PIN_EXTENSION_ROUTE,
  ONBOARDING_PRIVACY_SETTINGS_ROUTE,
} from '../../../helpers/constants/routes';
import { isBeta } from '../../../helpers/utils/build-types';
import {
  getCurrentChainId,
  getFirstTimeFlowType,
  getSelectedInternalAccount,
  getSelectedNetworkClientId,
  getTokenList,
} from '../../../selectors';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { addXDCTokenList } from '../../../helpers/utils/token-util';
import { addImportedTokens } from '../../../store/actions';

export default function CreationSuccessful() {
  const dispatch = useDispatch();
  const history = useHistory();
  const t = useI18nContext();
  const trackEvent = useContext(MetaMetricsContext);
  const firstTimeFlowType = useSelector(getFirstTimeFlowType);
  const tokenList = useSelector(getTokenList);
  const currentChainId = useSelector(getCurrentChainId);
  const selectedAccount = useSelector(getSelectedInternalAccount);
  const networkClientId = useSelector(getSelectedNetworkClientId);

  const AddTokenToXDC = async () => {
    const tokenDetails = await addXDCTokenList(
      selectedAccount.address,
      tokenList,
    );

    dispatch(addImportedTokens(tokenDetails, networkClientId));
    const tokenSymbols = [];
    for (const key in tokenDetails) {
      if (Object.prototype.hasOwnProperty.call(tokenDetails, key)) {
        tokenSymbols.push(tokenDetails[key].symbol);
      }
    }
  };

  useEffect(() => {
    if (currentChainId === '0x32') {
      console.log('add default token in the account ');
      AddTokenToXDC();
    }
  }, [currentChainId]);

  return (
    <div className="creation-successful" data-testid="creation-successful">
      <Box textAlign={TEXT_ALIGN.CENTER}>
        <img src="./images/tada.png" />
        <Typography
          variant={TypographyVariant.H2}
          fontWeight={FONT_WEIGHT.BOLD}
          margin={6}
        >
          {t('walletCreationSuccessTitle')}
        </Typography>
        <Typography variant={TypographyVariant.H4}>
          {t('walletCreationSuccessDetail')}
        </Typography>
      </Box>
      <Typography
        variant={TypographyVariant.H4}
        boxProps={{ align: AlignItems.flexStart }}
        marginLeft={12}
      >
        {t('remember')}
      </Typography>
      <ul>
        <li>
          <Typography variant={TypographyVariant.H4}>
            {isBeta()
              ? t('betaWalletCreationSuccessReminder1')
              : t('walletCreationSuccessReminder1')}
          </Typography>
        </li>
        <li>
          <Typography variant={TypographyVariant.H4}>
            {isBeta()
              ? t('betaWalletCreationSuccessReminder2')
              : t('walletCreationSuccessReminder2')}
          </Typography>
        </li>
        <li>
          <Typography variant={TypographyVariant.H4}>
            {t('walletCreationSuccessReminder3', [
              <span
                key="creation-successful__bold"
                className="creation-successful__bold"
              >
                {t('walletCreationSuccessReminder3BoldSection')}
              </span>,
            ])}
          </Typography>
        </li>
        <li>
          <Button
            href="https://medium.com/@xdcpay/what-is-a-secret-recovery-phrase-and-how-to-keep-your-crypto-wallet-secure-f22f78ca5a6a"
            target="_blank"
            type="link"
            rel="noopener noreferrer"
          >
            {t('learnMoreUpperCase')}
          </Button>
        </li>
      </ul>
      <Box marginTop={6} className="creation-successful__actions">
        <Button
          type="link"
          onClick={() => history.push(ONBOARDING_PRIVACY_SETTINGS_ROUTE)}
        >
          {t('advancedConfiguration')}
        </Button>
        <Button
          data-testid="onboarding-complete-done"
          type="primary"
          large
          rounded
          onClick={() => {
            trackEvent({
              category: MetaMetricsEventCategory.Onboarding,
              event: MetaMetricsEventName.OnboardingWalletCreationComplete,
              properties: {
                method: firstTimeFlowType,
              },
            });
            history.push(ONBOARDING_PIN_EXTENSION_ROUTE);
          }}
        >
          {t('gotIt')}
        </Button>
      </Box>
    </div>
  );
}
