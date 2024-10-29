import React from 'react';
import InstitutionalEntityDonePage from '.';

export default {
  title: 'Components/Institutional/InstitutionalEntityDonePage',
  component: InstitutionalEntityDonePage,
  args: {
    history: {
      push: () => {
        /**/
      },
    },
    mostRecentOverviewPage: 'test',
    location: {
      state: {
        imgSrc: './images/logo/XDCPay-full.svg',
        title: 'title',
        description: 'description',
      },
    },
  },
};

export const DefaultStory = (args) => <InstitutionalEntityDonePage {...args} />;

DefaultStory.storyName = 'InstitutionalEntityDonePage';
