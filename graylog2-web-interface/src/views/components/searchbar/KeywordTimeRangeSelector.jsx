import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Col, FormControl, FormGroup, InputGroup, Row } from 'components/graylog';
import Immutable from 'immutable';

import DateTime from 'logic/datetimes/DateTime';
import StoreProvider from 'injection/StoreProvider';

const ToolsStore = StoreProvider.getStore('Tools');

export default class KeywordTimeRangeSelector extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  constructor(props) {
    super(props);

    const { value } = props;
    const keyword = value.get('keyword');

    this.state = {
      value: keyword,
      keywordPreview: Immutable.Map(),
      validationState: keyword === '' ? 'error' : null,
    };

    ToolsStore.testNaturalDate(keyword)
      .then((data) => {
        this.setState({ validationState: null }, () => this._onKeywordPreviewLoaded(data));
      })
      .catch(() => this.setState({ validationState: 'error' }, this._resetKeywordPreview));
  }

  _onKeywordPreviewLoaded = (data) => {
    const from = DateTime.fromUTCDateTime(data.from).toString();
    const to = DateTime.fromUTCDateTime(data.to).toString();
    this.setState({ keywordPreview: Immutable.Map({ from, to }) });
  };

  _resetKeywordPreview = () => {
    this.setState({ keywordPreview: Immutable.Map() });
  };

  _keywordSearchChanged = (event) => {
    const { value } = event.target;
    this.setState({ value });

    if (value === '') {
      this.setState({ validationState: 'error' });
      this._resetKeywordPreview();
    } else {
      ToolsStore.testNaturalDate(value)
        .then((data) => {
          const { onChange } = this.props;
          onChange('keyword', value);
          this.setState({ validationState: null }, () => this._onKeywordPreviewLoaded(data));
        })
        .catch(() => this.setState({ validationState: 'error' }, this._resetKeywordPreview));
    }
  };

  render() {
    const { keywordPreview, validationState, value } = this.state;
    const { disabled } = this.props;
    const { from, to } = keywordPreview.toObject();
    const keywordPreviewElement = keywordPreview.size > 0 && (
      <Alert bsStyle="info" style={{ height: 30, paddingTop: 5, paddingBottom: 5, marginTop: 0 }}>
        <strong style={{ marginRight: 8 }}>Preview:</strong>
        {from} to {to}
      </Alert>
    );
    return (
      <div className="timerange-selector keyword" style={{ width: 650 }}>
        <Row className="no-bm" style={{ marginLeft: 50 }}>
          <Col md={3} style={{ padding: 0 }}>
            <FormGroup controlId="form-inline-keyword" style={{ marginRight: 5, width: '100%' }} validationState={validationState}>
              <InputGroup>
                <FormControl type="text"
                             className="input-sm"
                             name="keyword"
                             disabled={disabled}
                             placeholder="Last week"
                             onChange={this._keywordSearchChanged}
                             required
                             value={value} />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md={8} style={{ paddingRight: 0 }}>
            {keywordPreviewElement}
          </Col>
        </Row>
      </div>
    );
  }
}
