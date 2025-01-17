/**
 * @jest-environment <rootDir>/test/integration-environment.js
 */
// @flow strict
import * as React from 'react';
import { cleanup, waitForElement, render, fireEvent } from '@testing-library/react';
import { PluginManifest, PluginStore } from 'graylog-web-plugin/plugin';

import { StoreMock as MockStore } from 'helpers/mocking';
import history from 'util/History';
import Routes from 'routing/Routes';
import AppRouter from 'routing/AppRouter';

import viewsBindings from 'views/bindings';

jest.mock('stores/users/CurrentUserStore', () => MockStore(
  ['listen', () => jest.fn()],
  'get',
  ['getInitialState', () => ({
    currentUser: {
      full_name: 'Betty Holberton',
      username: 'betty',
      permissions: [],
    },
  })],
));

jest.mock('util/AppConfig', () => ({
  gl2ServerUrl: jest.fn(() => global.api_url),
  gl2AppPathPrefix: jest.fn(() => ''),
  gl2DevMode: jest.fn(() => false),
  isFeatureEnabled: jest.fn(() => false),
}));
jest.mock('stores/sessions/SessionStore', () => ({
  isLoggedIn: jest.fn(() => true),
  getSessionId: jest.fn(() => 'foobar'),
}));

jest.unmock('logic/rest/FetchProvider');

describe('Create a new view', () => {
  beforeAll(() => {
    PluginStore.register(new PluginManifest({}, viewsBindings));
  });

  afterEach(cleanup);

  it('using Views Page', async () => {
    const { getByTestId, getAllByText } = render(<AppRouter />);
    history.push(Routes.VIEWS.LIST);

    const button = await waitForElement(() => getAllByText('Create new view')[0]);
    fireEvent.click(button);
    await waitForElement(() => getByTestId('toggle-button'));
  });

  it('by going to the new view endpoint', async () => {
    const { getByTestId } = render(<AppRouter />);

    history.push(Routes.EXTENDEDSEARCH);

    await waitForElement(() => getByTestId('toggle-button'));
  });
});
