import { strict as assert } from 'assert';
import browser from 'webextension-polyfill';
import sinon from 'sinon';
import {
  PLATFORM_CHROME,
  PLATFORM_EDGE,
  METAMASK_BETA_CHROME_ID,
  METAMASK_PROD_CHROME_ID,
  METAMASK_FLASK_CHROME_ID,
  METAMASK_MMI_PROD_CHROME_ID,
  METAMASK_MMI_BETA_CHROME_ID,
} from '../../shared/constants/app';
import { onMessageReceived } from './detect-multiple-instances';
import * as util from './lib/util';

describe('multiple instances running detector', function () {
  const PING_MESSAGE = 'isRunning';

  let sendMessageStub = sinon.stub();

  beforeEach(async function () {
    sinon.replace(browser, 'runtime', {
      sendMessage: sendMessageStub,
      id: METAMASK_BETA_CHROME_ID,
    });

    sinon.stub(util, 'getPlatform').callsFake((_) => {
      return PLATFORM_CHROME;
    });
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('onMessageReceived', function () {
    beforeEach(function () {
      sinon.spy(console, 'warn');
    });

    it('should print warning message to on ping message received', async function () {
      onMessageReceived(PING_MESSAGE);

      assert(
        console.warn.calledWithExactly(
          'Warning! You have multiple instances of MetaMask running!',
        ),
      );
    });

    it('should not print warning message if wrong message received', async function () {
      onMessageReceived(PING_MESSAGE.concat('wrong'));

      assert(console.warn.notCalled);
    });
  });
});
