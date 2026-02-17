const VISUAL_TEST_QUERY_PARAM = 'e2e';
const VISUAL_TEST_QUERY_VALUE = '1';
const VISUAL_TEST_ATTR = 'data-visual-test';

export function isVisualTestMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const queryValue = new URLSearchParams(window.location.search).get(VISUAL_TEST_QUERY_PARAM);
  if (queryValue === VISUAL_TEST_QUERY_VALUE) {
    return true;
  }

  return document.documentElement.hasAttribute(VISUAL_TEST_ATTR);
}
