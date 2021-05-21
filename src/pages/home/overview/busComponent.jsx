import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Scrollbars } from 'react-custom-scrollbars';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import AvatarTable from '@/components/CommonComponent/AvatarTable';

import styles from '../index.scss';
import variablesModules from '../variables';

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
class BusComponent extends PureComponent {
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

  render() {
    return (
      <div className={classnames(styles['block-category'])}>
        <div className={styles['body-tab']}>
          <div className={styles['header-tab']}>
            <div>
              <img src={'/images/home/road.svg'} alt="notification" className={styles['icon']} />
              <span className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}>Bus</span>
            </div>
          </div>
          <div className="mt50">
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 335}>
              <div className={styles['content-bus']}>
                {variablesModules.DATA_BUS.map((item, index) => {
                  if (index === 0) {
                    return (
                      <div key={index} className={classnames(styles['content-tab'], styles['bus'], 'width-100p', 'mb12')}>
                        <div className={classnames('d-flex', 'align-items-center', 'justify-content-between', styles['header-content-tab'])}>
                          <AvatarTable
                            // fileImage={Helper.getPathAvatarJson(fileImage)}
                            fullName={item.name}
                            size={24}
                          />
                          <p className={classnames('mb0', 'font-size-30', 'font-weight-bold', 'text-black')}>{item.number}</p>
                        </div>
                      </div>
                    )
                  }
                  return (
                    <div key={index} className={styles['half-width']}>
                      <AvatarTable
                        // fileImage={Helper.getPathAvatarJson(fileImage)}
                        size={30}
                      />
                      <p className={classnames('mt15', 'mb0', 'font-size-13', 'text-black')}>{item.name}</p>
                      <p className={classnames('mb0', 'font-size-30', 'font-weight-bold', 'text-black', 'mt-auto', styles['number'])}>{item.number}</p>
                    </div>
                  )
                })}
              </div>
            </Scrollbars>
          </div>
        </div>
      </div>
    );
  }
}

BusComponent.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

BusComponent.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default BusComponent;
