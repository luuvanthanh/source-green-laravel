import React, { PureComponent } from 'react';
import { connect } from 'umi';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './index.scss';
import { Tabs } from 'antd';
import _ from 'lodash';
import variablesModules from './variables';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

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
class Overview extends PureComponent {
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
      <div className="row">
        <div className="col-md-6 col-xl-3 mt30">
          <div className={styles['body-tab']}>
            <div className={styles['header-tab']}>
              <div>
                <img src={'/images/home/speech.svg'} alt="notification" className={styles['icon']} />
                <span className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}>Ghi chú</span>
              </div>
              <p className={classnames('mb0', 'font-size-14')}>15</p>
            </div>
            <Tabs>
              {variablesModules.NOTE.map(({ id, name }) => (
                <TabPane tab={name} key={id} />
              ))}
            </Tabs>
            {
              variablesModules.DATA_NOTES.map((item, index) => (
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
          </div>
        </div>

        <div className="col-md-6 col-xl-3 mt30">
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
          </div>
        </div>

        <div className="col-md-6 col-xl-3 mt30">
          <div className={styles['body-tab']}>
            <div className={styles['header-tab']}>
              <div>
                <img src={'/images/home/road.svg'} alt="notification" className={styles['icon']} />
                <span className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}>Bus</span>
              </div>
            </div>
            <div className={styles['content-bus']}>
              {variablesModules.DATA_BUS.map((item, index) => {
                if (index === 0) {
                  return (
                    <div key={index} className={classnames(styles['content-tab'], styles['bus'], 'mt50', 'width-100p')}>
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
          </div>
        </div>

        <div className="col-md-6 col-xl-3 mt30">
          <div className={styles['body-tab']}>
            <div className={styles['header-tab']}>
              <div>
                <img src={'/images/home/note.svg'} alt="notification" className={styles['icon']} />
                <span className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}>Điểm danh vào lớp</span>
              </div>
            </div>
            <div className={classnames(styles['content-bus'], styles['mt-38'])}>
              {variablesModules.ATTENDANCE.map((item, index) =>
                <div key={index} className={styles['half-width']}>
                  <AvatarTable
                    // fileImage={Helper.getPathAvatarJson(fileImage)}
                    size={30}
                  />
                  <p className={classnames('mt15', 'mb0', 'font-size-13', 'text-black')}>{item.name}</p>
                  <p className={classnames('mb0', 'font-size-30', 'font-weight-bold', 'text-black', 'mt-auto', styles['number'])}>{item.number}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Overview.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Overview.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default Overview ;
