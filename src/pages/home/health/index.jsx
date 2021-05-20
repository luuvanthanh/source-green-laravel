import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';

import variablesModules from '../variables';
import styles from '../index.scss';
import EveryDayComponent from './everyDayComponent';
import HistoryComponent from './historyComponent';

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
class HealthComponent extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    const { user } = props;
    this.state = {
      tab: 'everyDay'
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

  tables = (tab) => {
    switch (tab) {
      case 'everyDay':
        return <EveryDayComponent />

      case 'history':
        return <HistoryComponent />

      default:
        return null
    }
  };

  changeTab = (tab) => {
    this.setStateData({ tab });
  }

  render() {
    const { tab } = this.state;
    return (
      <div className={styles['container-bus']}>
        <Tabs onChange={this.changeTab} activeKey={tab}>
          {variablesModules.TABS_HEALTH.map(({ id, name }) => (
            <TabPane tab={name} key={id} />
          ))}
        </Tabs>
        {this.tables(tab)}
      </div>
    );
  }
}

HealthComponent.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

HealthComponent.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default HealthComponent ;
