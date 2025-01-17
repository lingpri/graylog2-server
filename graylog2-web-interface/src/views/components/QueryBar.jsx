// @flow strict
import React from 'react';
import PropTypes from 'prop-types';
// $FlowFixMe: imports from core need to be fixed in flow
import { withRouter } from 'react-router';

import connect from 'stores/connect';
import { TitlesActions } from 'views/stores/TitlesStore';
import { ViewActions } from 'views/stores/ViewStore';
import NewQueryActionHandler from 'views/logic/NewQueryActionHandler';
import onSaveView from 'views/logic/views/OnSaveViewAction';
import onSaveAsView from 'views/logic/views/OnSaveAsViewAction';
import { QueriesActions } from 'views/stores/QueriesStore';
import { QueryIdsStore } from 'views/stores/QueryIdsStore';
import { QueryTitlesStore } from 'views/stores/QueryTitlesStore';
import { ViewMetadataStore } from 'views/stores/ViewMetadataStore';
import { ViewStatesActions } from 'views/stores/ViewStatesStore';
import QueryTabs from './QueryTabs';
import CustomPropTypes from './CustomPropTypes';

const onTitleChange = (queryId, newTitle) => TitlesActions.set('tab', 'title', newTitle);

const onSelectQuery = queryId => (queryId === 'new' ? NewQueryActionHandler() : ViewActions.selectQuery(queryId));

const onCloseTab = (queryId, currentQuery, queries) => {
  if (queries.size === 1) {
    return Promise.resolve();
  }
  let promise;
  if (queryId === currentQuery) {
    const currentQueryIdIndex = queries.indexOf(queryId);
    const newQueryIdIndex = Math.min(0, currentQueryIdIndex - 1);
    const newQuery = queries.remove(queryId).get(newQueryIdIndex);
    promise = ViewActions.selectQuery(newQuery);
  } else {
    promise = Promise.resolve();
  }
  return promise.then(() => QueriesActions.remove(queryId)).then(() => ViewStatesActions.remove(queryId));
};

const QueryBar = ({ children, queries, queryTitles, router, viewMetadata }) => {
  const { activeQuery } = viewMetadata;
  const childrenWithQueryId = React.Children.map(children, child => React.cloneElement(child, { queryId: activeQuery }));
  const selectQueryAndExecute = queryId => onSelectQuery(queryId);
  return (
    <QueryTabs queries={queries}
               selectedQuery={activeQuery}
               titles={queryTitles}
               onSelect={selectQueryAndExecute}
               onTitleChange={onTitleChange}
               onSaveView={view => onSaveView(view, router)}
               onSaveAsView={view => onSaveAsView(view, router)}
               onRemove={queryId => onCloseTab(queryId, activeQuery, queries)}>
      {childrenWithQueryId}
    </QueryTabs>
  );
};

QueryBar.propTypes = {
  children: CustomPropTypes.node,
  queries: PropTypes.object.isRequired,
  queryTitles: PropTypes.object.isRequired,
  router: PropTypes.any.isRequired,
  viewMetadata: PropTypes.shape({
    activeQuery: PropTypes.string.isRequired,
  }).isRequired,
};

QueryBar.defaultProps = {
  children: null,
};

export default withRouter(connect(QueryBar, { queries: QueryIdsStore, queryTitles: QueryTitlesStore, viewMetadata: ViewMetadataStore }));
