import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Form, Tabs } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';

import { variables } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';

import styles from './index.scss';
import variablesModules from './variables';
import Overview from './overview';
import Application from './application';
import Student from './student';

const { TabPane } = Tabs;

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
      classes: [],
      classId: '',
      tab: 'overview'
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.fetchClasses();
  }

  componentWillUnmount() {
    setIsMounted(false);
  }

  fetchClasses = () => {
    const { dispatch, user } = this.props;
    dispatch({
      type: 'categories/GET_CLASSES',
      payload: {
        branch: user?.user?.objectInfo?.positionLevel?.branchId || undefined,
      },
      callback: (res) => {
        if (res) {
          this.setStateData({
            classes: !_.isEmpty(res?.items) ? _.concat([{ id: '', name: 'Tất cả lớp'}], res?.items) : []
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

  handleChangeClass = (classId) => {
    this.setState({ classId });
  }

  changeTab = (tab) => {
    this.setStateData({ tab });
  }

  renderComponent = (tab, classId) => {
    switch(tab) {
      case 'overview':
        return <Overview classId={classId} />;
      case 'application':
        return <Application classId={classId} />;
      case 'student':
        return  <Student classId={classId} />;
      default:
        return <Overview classId={classId} />;
    }
  }

  render() {
    const { classes, classId, tab } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.title}>Lake View</div>
        <div className={styles.flex}>
          <div className="d-flex align-items-center mb30 mt-10">
            <div className={styles['date-header']}>{moment().format(variables.DATE_FORMAT.DATE_MONTH)}</div>
            <Form layout="vertical" ref={this.formRef} initialValues={{ classId }} >
              <FormItem
                className={classnames('mb0', styles.select)}
                name="classId"
                type={variables.SELECT}
                placeholder="Chọn cơ sở"
                onChange={this.handleChangeClass}
                data={!_.isEmpty(classes) ? classes : []}
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
          { this.renderComponent(tab, classId) }
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
};

HomePage.defaultProps = {
  dispatch: {},
  user: {},
};

export default HomePage ;
