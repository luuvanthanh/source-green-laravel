import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Form, Tabs } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import { variables } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';

import styles from './index.scss';
import variablesModules from './variables';
import Overview from './overview';
import Application from './application';
import Student from './student';

const { TabPane } = Tabs;
const tables = {
  overview: <Overview />,
  application: <Application />,
  student: <Student />,
};


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

class HomePage extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      branches: [],
      branch: '',
      tab: 'overview'
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.fetchBranches();
  }

  componentWillUnmount() {
    setIsMounted(false);
  }

  fetchBranches = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'categories/GET_BRANCHES',
      callback: (res) => {
        if (res) {
          this.setStateData({
            branches: !_.isEmpty(res?.parsePayload) ? _.concat([{ id: '', name: 'Tất cả lớp'}], res?.parsePayload) : []
          });
        }
      },
    });
  };

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

  fetchClasses = () => {
  }

  changeTab = (tab) => {
    this.setStateData({ tab });
  }

  render() {
    const { branches, branch, tab } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.title}>Lake View</div>
        <div className={styles.flex}>
          <div className="d-flex align-items-center mb30 mt-10">
            <div className={styles['date-header']}>16/05</div>
            <Form layout="vertical" ref={this.formRef} initialValues={{ branch }} >
              <FormItem
                className={classnames('mb0', styles.select)}
                name="branch"
                type={variables.SELECT}
                placeholder="Chọn cơ sở"
                onChange={this.fetchClasses}
                data={!_.isEmpty(branches) ? branches : []}
              />
            </Form>
          </div>
          <div className={styles['custom-tab']}>
            <Tabs
              onChange={this.changeTab}
              activeKey={tab}
            >
              {variablesModules.TABS.map(({ id, name }) => (
                <TabPane tab={name} key={id} />
              ))}
            </Tabs>
          </div>
          {tables[`${tab}`]}
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
};

HomePage.defaultProps = {
  dispatch: {},
};

export default HomePage ;
