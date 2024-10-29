import EventEmitter from 'events';
import React, { useState } from 'react';
import Button from '../button';
import ButtonGroup from '../button-group';

const containerStyle = {
  height: '600px',
  width: '357px',
  border: '1px solid black',
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const buttonStyle = {
  marginTop: '16px',
};

export default {
  title: 'Components/UI/Mascot',
};

export const DefaultStory = () => {
  const [clickToLookMode, setClickToLookMode] = useState(false);

  return (
    <div
      style={containerStyle}
      onClick={(event) => {
        const isButtonClick = event.target.classList.contains(
          'button-group__button',
        );
        if (clickToLookMode && !isButtonClick) {
        }
      }}
    >
      {/* <Mascot
        animationEventEmitter={animationEventEmitter}
        width="120"
        height="120"
        followMouse={followMouseMode}
        lookAtTarget={clickedTarget}
        lookAtDirection={lookAtDirection}
      /> */}

      <img
        src="./images/logo/XDCPay-full.svg"
        className="info-tab__logo"
        alt="MetaMask Logo"
      />
      <div style={buttonStyle}>
        <ButtonGroup
          style={{ width: '300px', flexFlow: 'column' }}
          defaultActiveButtonIndex={4}
        >
          <Button
            onClick={() => {
              setClickToLookMode(false);
            }}
          >
            Follow Mouse mode
          </Button>
          <Button
            onClick={() => {
              setClickToLookMode(true);
            }}
          >
            Look a clicked location mode
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

DefaultStory.storyName = 'Default';
