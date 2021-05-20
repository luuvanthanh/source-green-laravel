import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Table from '@/components/CommonComponent/Table';

import styles from './index.scss';

let isMounted = true;
/**
 * Set isMounted
 * @param {boolean} value
 * @returns {boolean} value of isMounted
 */
const setIsMounted = (value = true) => {
  isMounted = value;
  return isMounted;
};
/**
 * Get isMounted
 * @returns {boolean} value of isMounted
 */
const getIsMounted = () => isMounted;

@connect(({ user, loading }) => ({ user, loading }))
class ChildrenComponent extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    const { user } = props;
    this.state = {
    };
    setIsMounted(true);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    setIsMounted(false);
  }

  /**
   * Set state properties
   * @param {object} data the data input
   * @param {function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof setStateData
   */
   setStateData = (state, callback) => {
    if (!getIsMounted()) {
      return;
    }
    this.setState(state, callback);
  };

  /**
   * Function header table
   */
   header = () => {
    return [
      {
        title: 'Thời gian',
        key: 'time',
        align: 'center',
        className: 'min-width-100',
        width: 200,
        render: () => '16/05',
      },
      {
        title: 'Vào lớp',
        key: 'getOnBus',
        align: 'center',
        className: 'min-width-100',
        render: (record) => '07:12:12',
      },
      {
        title: 'Ra về',
        key: 'getOffBus',
        align: 'center',
        className: 'min-width-100',
        render: (record) => '07:21:17',
      },
    ];
  };

  render() {
    return (
      <div className={classnames(styles['container-bus'], 'mt20')}>
        <Form>
          <div className="row">
            <div className="col-md-4">
              <FormItem
                name="time"
                type={variables.RANGE_PICKER}
              />
            </div>
          </div>
        </Form>
        <Table
          bordered
          columns={this.header()}
          dataSource={[{id: 1}]}
          // loading={loading}
          pagination={false}
          params={{
            header: this.header(),
            type: 'table',
          }}
          rowKey={(record) => record.id}
          scroll={{ x: '100%' }}
        />
      </div>
    );
  }
}

ChildrenComponent.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

ChildrenComponent.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default ChildrenComponent ;
