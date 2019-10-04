import PropTypes from 'prop-types';
import React from 'react';

import Navigation from 'components/navigation/Navigation';
import Spinner from 'components/common/Spinner';
import Footer from 'components/layout/Footer';
import connect from 'stores/connect';
import StoreProvider from 'injection/StoreProvider';

import AppErrorBoundary from './AppErrorBoundary';
import { ScratchpadProvider } from './context/ScratchpadProvider';
import Scratchpad from '../components/common/Scratchpad';

import 'stylesheets/jquery.dynatable.css';
import 'stylesheets/typeahead.less';
import 'c3/c3.css';
import 'dc/dc.css';

const CurrentUserStore = StoreProvider.getStore('CurrentUser');

const App = ({ children, currentUser: { currentUser }, location }) => {
  if (!currentUser) {
    return <Spinner />;
  }

  return (
    <ScratchpadProvider>
      <Navigation requestPath={location.pathname}
                  fullName={currentUser.full_name}
                  loginName={currentUser.username}
                  permissions={currentUser.permissions} />
      <div id="scroll-to-hint" style={{ display: 'none' }} className="alpha80">
        <i className="fa fa-arrow-up" />
      </div>
      <Scratchpad />
      <AppErrorBoundary>
        {children}
      </AppErrorBoundary>
      <Footer />
    </ScratchpadProvider>
  );
};

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
  currentUser: PropTypes.shape({
    currentUser: PropTypes.shape({
      full_name: PropTypes.string,
      username: PropTypes.string,
      permissions: PropTypes.array,
    }),
  }),
  location: PropTypes.object.isRequired,
};

App.defaultProps = {
  currentUser: undefined,
};

export default connect(App, { currentUser: CurrentUserStore });
