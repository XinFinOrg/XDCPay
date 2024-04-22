import EventEmitter from 'events';
import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Mascot from '../../../components/ui/mascot';
import Button from '../../../components/ui/button';
import { Text } from '../../../components/component-library';
import CheckBox from '../../../components/ui/check-box';
import Box from '../../../components/ui/box';
import {
  TextVariant,
  AlignItems,
  TextAlign,
  FontWeight,
} from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
  MetaMetricsNetworkEventSource,
} from '../../../../shared/constants/metametrics';
import {
  setFirstTimeFlowType,
  setTermsOfUseLastAgreed,
  setParticipateInMetaMetrics,
  upsertNetworkConfiguration,
  setActiveNetwork,
} from '../../../store/actions';
import {
  ///: BEGIN:ONLY_INCLUDE_IF(build-main,build-beta,build-flask)
  ONBOARDING_METAMETRICS,
  ///: END:ONLY_INCLUDE_IF
  ONBOARDING_SECURE_YOUR_WALLET_ROUTE,
  ONBOARDING_COMPLETION_ROUTE,
  ///: BEGIN:ONLY_INCLUDE_IF(build-mmi)
  ONBOARDING_CREATE_PASSWORD_ROUTE,
  ONBOARDING_IMPORT_WITH_SRP_ROUTE,
  ///: END:ONLY_INCLUDE_IF
} from '../../../helpers/constants/routes';
import { getFirstTimeFlowType, getCurrentKeyring } from '../../../selectors';
import { FirstTimeFlowType } from '../../../../shared/constants/onboarding';
import { ORIGIN_METAMASK } from '../../../../shared/constants/app';
import {
  XDC_APOTHEM_RPC_URL,
  XDC_MAINNET,
  XDC_RPC_URL,
  XDC_TESTNET,
  XDC_TOKEN_IMAGE_URL,
} from '../../../../shared/constants/network';

export default function OnboardingWelcome() {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const history = useHistory();
  const [eventEmitter] = useState(new EventEmitter());
  const currentKeyring = useSelector(getCurrentKeyring);
  const firstTimeFlowType = useSelector(getFirstTimeFlowType);
  const [termsChecked, setTermsChecked] = useState(false);

  // Don't allow users to come back to this screen after they
  // have already imported or created a wallet
  useEffect(() => {
    if (currentKeyring) {
      if (firstTimeFlowType === FirstTimeFlowType.import) {
        history.replace(ONBOARDING_COMPLETION_ROUTE);
      } else {
        history.replace(ONBOARDING_SECURE_YOUR_WALLET_ROUTE);
      }
    }
  }, [currentKeyring, history, firstTimeFlowType]);
  const trackEvent = useContext(MetaMetricsContext);

  const onCreateClick = async () => {
    dispatch(setFirstTimeFlowType(FirstTimeFlowType.create));
    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.OnboardingWalletCreationStarted,
      properties: {
        account_type: 'metamask',
      },
    });
    dispatch(setTermsOfUseLastAgreed(new Date().getTime()));

    ///: BEGIN:ONLY_INCLUDE_IF(build-main,build-beta,build-flask)
    history.push(ONBOARDING_METAMETRICS);
    ///: END:ONLY_INCLUDE_IF

    ///: BEGIN:ONLY_INCLUDE_IF(build-mmi)
    await dispatch(setParticipateInMetaMetrics(false));
    history.push(ONBOARDING_CREATE_PASSWORD_ROUTE);
    ///: END:ONLY_INCLUDE_IF
  };
  const toggleTermsCheck = () => {
    setTermsChecked((currentTermsChecked) => !currentTermsChecked);
  };

  const addXdcNetwork = async () => {
    const networkConfigurationId = await upsertNetworkConfiguration(
      {
        chainId: '0x32',
        rpcUrl: XDC_RPC_URL,
        ticker: 'XDC',
        rpcPrefs: {
          blockExplorerUrl: 'https://xdc.blocksscan.io',
          imageUrl: XDC_TOKEN_IMAGE_URL,
        },
        imageUrl: XDC_TOKEN_IMAGE_URL,
        chainName: XDC_MAINNET,
        nickname: XDC_MAINNET,
        referrer: ORIGIN_METAMASK,
        viewOnly: true,
        source: MetaMetricsNetworkEventSource.CustomNetworkForm,
      },
      {
        setActive: false,
        source: MetaMetricsNetworkEventSource.CustomNetworkForm,
      },
    )();

    await upsertNetworkConfiguration(
      {
        chainId: '0x33',
        rpcUrl: XDC_APOTHEM_RPC_URL,
        ticker: 'TXDC',
        rpcPrefs: {
          blockExplorerUrl: 'https://xdc.blocksscan.io',
          imageUrl: XDC_TOKEN_IMAGE_URL,
        },
        imageUrl: XDC_TOKEN_IMAGE_URL,
        chainName: XDC_TESTNET,
        nickname: XDC_TESTNET,
        referrer: ORIGIN_METAMASK,
        viewOnly: true,
        source: MetaMetricsNetworkEventSource.CustomNetworkForm,
      },
      {
        setActive: false,
        source: MetaMetricsNetworkEventSource.CustomNetworkForm,
      },
    )();

    dispatch(setActiveNetwork(networkConfigurationId));

    // await upsertNetworkConfiguration(
    //   {
    //     chainId: '0x33',
    //     rpcUrl: 'https://erpc.apothem.network',
    //     ticker: 'TXDC',
    //     rpcPrefs: {
    //       blockExplorerUrl: 'https://xdc.blocksscan.io',
    //       imageUrl: './images/logo/XDCPay-full.svg',
    //     },
    //     imageUrl: './images/logo/XDCPay-full.svg',
    //     chainName: 'XDC Apothem Testnet',
    //     nickname: 'XDC Apothem Testnet',
    //     referrer: ORIGIN_METAMASK,
    //     viewOnly: true,
    //     source: MetaMetricsNetworkEventSource.CustomNetworkForm,
    //   },
    //   {
    //     setActive: false,
    //     source: MetaMetricsNetworkEventSource.CustomNetworkForm,
    //   },
    // )();

    dispatch(setActiveNetwork(networkConfigurationId));
  };

  useEffect(() => {
    addXdcNetwork();
  }, []);

  const termsOfUse = t('agreeTermsOfUse', [
    <a
      className="create-new-vault__terms-link"
      key="create-new-vault__link-text"
      href="https://metamask.io/terms.html"
      target="_blank"
      rel="noopener noreferrer"
    >
      {t('terms')}
    </a>,
  ]);

  const onImportClick = async () => {
    dispatch(setFirstTimeFlowType('import'));
    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.OnboardingWalletImportStarted,
      properties: {
        account_type: 'imported',
      },
    });
    dispatch(setTermsOfUseLastAgreed(new Date().getTime()));

    ///: BEGIN:ONLY_INCLUDE_IF(build-main,build-beta,build-flask)
    history.push(ONBOARDING_METAMETRICS);
    ///: END:ONLY_INCLUDE_IF

    ///: BEGIN:ONLY_INCLUDE_IF(build-mmi)
    await dispatch(setParticipateInMetaMetrics(false));
    history.push(ONBOARDING_IMPORT_WITH_SRP_ROUTE);
    ///: END:ONLY_INCLUDE_IF
  };

  return (
    <div className="onboarding-welcome" data-testid="onboarding-welcome">
      {
        ///: BEGIN:ONLY_INCLUDE_IF(build-main,build-beta,build-flask)
        // <Carousel showThumbs={false} showStatus={false} showArrows>
        //   <div>
        //     <Text
        //       variant={TextVariant.headingLg}
        //       as="h2"
        //       textAlign={TextAlign.Center}
        //       fontWeight={FontWeight.Bold}
        //     >
        //       {t('welcomeToMetaMask')}
        //     </Text>
        //     <Text textAlign={TextAlign.Center} marginLeft={6} marginRight={6}>
        //       {t('welcomeToMetaMaskIntro')}
        //     </Text>
        //     <div className="onboarding-welcome__mascot">
        //       <Mascot
        //         animationEventEmitter={eventEmitter}
        //         width="250"
        //         height="250"
        //       />
        //     </div>
        //   </div>
        //   <div>
        //     <Text
        //       variant={TextVariant.headingLg}
        //       as="h2"
        //       textAlign={TextAlign.Center}
        //       fontWeight={FontWeight.Bold}
        //     >
        //       {t('welcomeExploreTitle')}
        //     </Text>
        //     <Text textAlign={TextAlign.Center}>
        //       {t('welcomeExploreDescription')}
        //     </Text>
        //     <div className="onboarding-welcome__image">
        //       <img
        //         src="/images/onboarding-welcome-say-hello.svg"
        //         width="169"
        //         height="237"
        //         alt=""
        //       />
        //     </div>
        //   </div>
        //   <div>
        //     <Text
        //       variant={TextVariant.headingLg}
        //       as="h2"
        //       textAlign={TextAlign.Center}
        //       fontWeight={FontWeight.Bold}
        //     >
        //       {t('welcomeLoginTitle')}
        //     </Text>
        //     <Text textAlign={TextAlign.Center}>
        //       {t('welcomeLoginDescription')}
        //     </Text>
        //     <div className="onboarding-welcome__image">
        //       <img
        //         src="/images/onboarding-welcome-decentralised-apps.svg"
        //         width="327"
        //         height="256"
        //         alt=""
        //       />
        //     </div>
        //   </div>
        // </Carousel>
        ///: END:ONLY_INCLUDE_IF
      }

      {
        ///: BEGIN:ONLY_INCLUDE_IF(build-mmi)
        <div>
          <Text
            variant={TextVariant.headingLg}
            textAlign={TextAlign.Center}
            fontWeight={FontWeight.Bold}
          >
            {t('installExtension')}
          </Text>
          <Text
            textAlign={TextAlign.Center}
            marginTop={2}
            marginLeft={6}
            marginRight={6}
          >
            {t('installExtensionDescription')}
          </Text>
          <div className="onboarding-welcome__mascot">
            <Mascot
              animationEventEmitter={eventEmitter}
              width="250"
              height="250"
            />
          </div>
        </div>
        ///: END:ONLY_INCLUDE_IF
      }

      <ul className="onboarding-welcome__buttons">
        <li>
          <Box
            alignItems={AlignItems.center}
            className="onboarding__terms-of-use"
          >
            <CheckBox
              id="onboarding__terms-checkbox"
              className="onboarding__terms-checkbox"
              dataTestId="onboarding-terms-checkbox"
              checked={termsChecked}
              onClick={toggleTermsCheck}
            />
            <label
              className="onboarding__terms-label"
              htmlFor="onboarding__terms-checkbox"
            >
              <Text variant={TextVariant.bodyMd} marginLeft={2} as="span">
                {termsOfUse}
              </Text>
            </label>
          </Box>
        </li>

        <li>
          <Button
            data-testid="onboarding-create-wallet"
            type="primary"
            onClick={onCreateClick}
            disabled={!termsChecked}
          >
            {
              ///: BEGIN:ONLY_INCLUDE_IF(build-main,build-beta,build-flask)
              t('onboardingCreateWallet')
              ///: END:ONLY_INCLUDE_IF
            }
            {
              ///: BEGIN:ONLY_INCLUDE_IF(build-mmi)
              t('continue')
              ///: END:ONLY_INCLUDE_IF
            }
          </Button>
        </li>
        <li>
          <Button
            data-testid="onboarding-import-wallet"
            type="secondary"
            onClick={onImportClick}
            disabled={!termsChecked}
          >
            {t('onboardingImportWallet')}
          </Button>
        </li>
      </ul>
    </div>
  );
}
