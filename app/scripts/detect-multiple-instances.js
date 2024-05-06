/**
 * Sets up two-way communication between the
 * mainline version of extension and Flask build
 * in order to detect & warn if there are two different
 * versions running simultaneously.
 */

const MESSAGE_TEXT = 'isRunning';

const showWarning = () =>
  console.warn('Warning! You have multiple instances of MetaMask running!');

/**
 * Handles the ping message sent from other extension.
 * Displays console warning if it's active.
 *
 * @param message - The message received from the other extension
 */
export const onMessageReceived = (message) => {
  if (message === MESSAGE_TEXT) {
    showWarning();
  }
};

/**
 * Sends the ping message sent to other extensions to detect whether it's active or not.
 */
