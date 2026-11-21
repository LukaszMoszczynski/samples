// A made-up name list for tests, so the public test files hold no real one.
import { hashName } from '../../scripts/banned-names.mjs';

export const FAKE_BANNED = {
  words: new Set([hashName('acmecorp'), hashName('acme studio'), hashName('acmestudio')]),
  prefixes: new Set([hashName('zorbo')]),
  lengths: [5, 8, 10],
};
