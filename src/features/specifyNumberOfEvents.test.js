import path from 'path';
import { loadFeature, defineFeature } from 'jest-cucumber';

const feature = loadFeature(
  path.join(__dirname, 'specifyNumberOfEvents.feature')
);

defineFeature(feature, test => {
  // leave empty for now; run your tests to auto-generate step stubs
});
