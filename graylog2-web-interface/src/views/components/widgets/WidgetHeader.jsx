import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components/graylog';
import EditableTitle from 'views/components/common/EditableTitle';
import styles from './WidgetHeader.css';
import CustomPropTypes from '../CustomPropTypes';

const WidgetHeader = ({ children, onRename, hideDragHandle, title }) => (
  <div className={styles.widgetHeader}>
    {hideDragHandle || <Icon className={`fa fa-bars widget-drag-handle ${styles.widgetDragHandle}`} />}{' '}
    <EditableTitle disabled={!onRename} value={title} onChange={onRename} />
    <span className={`pull-right ${styles.widgetActionDropdown}`}>
      {children}
    </span>
  </div>
);

WidgetHeader.propTypes = {
  children: CustomPropTypes.OneOrMoreChildren,
  onRename: PropTypes.func,
  hideDragHandle: PropTypes.bool,
  title: PropTypes.node.isRequired,
};

WidgetHeader.defaultProps = {
  children: null,
  onRename: undefined,
  hideDragHandle: false,
};

export default WidgetHeader;
