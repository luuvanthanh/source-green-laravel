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
class MedicalComponent extends PureComponent {
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
              <img src={'/images/home/balloons.svg'} alt="notification" className={styles['icon']} />
              <span className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}>Y tế</span>
            </div>
            <p className={classnames('mb0', 'font-size-14')}>15</p>
          </div>
          <Tabs>
            {variablesModules.MEDICAL.map(({ id, name }) => (
              <TabPane tab={name} key={id} />
            ))}
          </Tabs>
          <Scrollbars autoHeight autoHeightMax={window.innerHeight - 335}>
            {
              variablesModules.DATA_MEDICAL.map((item, index) => (
                <div className={styles['content-tab']} key={index}>
                  <div className={classnames('d-flex', 'align-items-center', 'justify-content-between', styles['header-content-tab'])}>
                    <AvatarTable
                      className="full-name-bold"
                      // fileImage={Helper.getPathAvatarJson(fileImage)}
                      fullName={item?.name}
                      size={36}
                    />
                    <p className={classnames('mb0', styles['date'])}>{item?.date}</p>
                  </div>
                  <p className={classnames('mt10', 'mb0', 'font-size-14')}>{item?.description}</p>
                </div>
              ))
            }
          </Scrollbars>
        </div>
      </div>
    );
  }
}

MedicalComponent.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

MedicalComponent.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default MedicalComponent;
