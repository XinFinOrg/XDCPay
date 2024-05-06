import React, { useContext, useState, useSelector } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  MetaMetricsEventAccountImportType,
  MetaMetricsEventAccountType,
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import { Box, ButtonLink, Label, Text } from '../../component-library';
import Dropdown from '../../ui/dropdown';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  BlockSize,
  FontWeight,
  JustifyContent,
  Size,
  TextVariant,
} from '../../../helpers/constants/design-system';
import ZENDESK_URLS from '../../../helpers/constants/zendesk-url';
import { useI18nContext } from '../../../hooks/useI18nContext';
import * as actions from '../../../store/actions';

// Subviews
import { getSelectedNetworkClientId, getTokenList } from '../../../selectors';
import { addXDCTokenList } from '../../../helpers/utils/token-util';
import JsonImportView from './json';
import PrivateKeyImportView from './private-key';

export const ImportAccount = ({ onActionComplete }) => {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const trackEvent = useContext(MetaMetricsContext);
  const tokenList = useSelector(getTokenList);
  const networkClientId = useSelector(getSelectedNetworkClientId);
  const menuItems = [t('privateKey'), t('jsonFile')];

  const [type, setType] = useState(menuItems[0]);

  async function importAccount(strategy, importArgs) {
    const loadingMessage = getLoadingMessage(strategy);

    try {
      const { selectedAddress } = await dispatch(
        actions.importNewAccount(strategy, importArgs, loadingMessage),
      );

      const tokenDetails = await addXDCTokenList(selectedAddress, tokenList);

      dispatch(actions.addImportedTokens(tokenDetails, networkClientId));
      const tokenSymbols = [];
      for (const key in tokenDetails) {
        if (Object.prototype.hasOwnProperty.call(tokenDetails, key)) {
          tokenSymbols.push(tokenDetails[key].symbol);
        }
      }

      if (selectedAddress) {
        trackImportEvent(strategy, true);
        dispatch(actions.hideWarning());
        onActionComplete(true);
      } else {
        dispatch(actions.displayWarning(t('importAccountError')));
        return false;
      }
    } catch (error) {
      trackImportEvent(strategy, error.message);
      translateWarning(error.message);
      return false;
    }

    return true;
  }

  function trackImportEvent(strategy, wasSuccessful) {
    const accountImportType =
      strategy === 'Private Key'
        ? MetaMetricsEventAccountImportType.PrivateKey
        : MetaMetricsEventAccountImportType.Json;

    const event = wasSuccessful
      ? MetaMetricsEventName.AccountAdded
      : MetaMetricsEventName.AccountAddFailed;

    trackEvent({
      category: MetaMetricsEventCategory.Accounts,
      event,
      properties: {
        account_type: MetaMetricsEventAccountType.Imported,
        account_import_type: accountImportType,
      },
    });
  }

  function getLoadingMessage(strategy) {
    if (strategy === 'json') {
      return (
        <>
          <Text width={BlockSize.ThreeFourths} fontWeight={FontWeight.Bold}>
            {t('importAccountJsonLoading1')}
          </Text>
          <Text width={BlockSize.ThreeFourths} fontWeight={FontWeight.Bold}>
            {t('importAccountJsonLoading2')}
          </Text>
        </>
      );
    }

    return '';
  }

  /**
   * @param message - an Error/Warning message caught in importAccount()
   * This function receives a message that is a string like:
   * `t('importAccountErrorNotHexadecimal')`
   * `t('importAccountErrorIsSRP')`
   * `t('importAccountErrorNotAValidPrivateKey')`
   * and feeds it through useI18nContext
   */
  function translateWarning(message) {
    if (message && !message.startsWith('t(')) {
      // This is just a normal error message
      dispatch(actions.displayWarning(message));
    } else {
      // This is an error message in a form like
      // `t('importAccountErrorNotHexadecimal')`
      // so slice off the first 3 chars and last 2 chars, and feed to i18n
      dispatch(actions.displayWarning(t(message.slice(3, -2))));
    }
  }

  return (
    <>
      <Text variant={TextVariant.bodySm} marginTop={2}>
        {t('importAccountMsg')}{' '}
        <ButtonLink
          size={Size.inherit}
          href={ZENDESK_URLS.IMPORTED_ACCOUNTS}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('here')}
        </ButtonLink>
      </Text>
      <Box paddingTop={4} paddingBottom={8}>
        <Label
          width={BlockSize.Full}
          marginBottom={4}
          justifyContent={JustifyContent.spaceBetween}
        >
          {t('selectType')}
          <Dropdown
            options={menuItems.map((text) => ({ value: text }))}
            selectedOption={type}
            onChange={(value) => {
              dispatch(actions.hideWarning());
              setType(value);
            }}
          />
        </Label>
        {type === menuItems[0] ? (
          <PrivateKeyImportView
            importAccountFunc={importAccount}
            onActionComplete={onActionComplete}
          />
        ) : (
          <JsonImportView
            importAccountFunc={importAccount}
            onActionComplete={onActionComplete}
          />
        )}
      </Box>
    </>
  );
};

ImportAccount.propTypes = {
  /**
   * Executes when the key is imported
   */
  onActionComplete: PropTypes.func.isRequired,
};
