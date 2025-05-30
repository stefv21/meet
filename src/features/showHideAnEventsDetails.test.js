import path from 'path';
import { loadFeature, defineFeature } from 'jest-cucumber';

const feature = loadFeature(
  path.join(__dirname, 'src', 'features', 'showHideAnEventsDetails.feature')
);

defineFeature(feature, test => {
  // leave this empty for now…
});
