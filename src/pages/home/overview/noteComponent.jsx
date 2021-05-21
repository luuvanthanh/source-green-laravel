import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Scrollbars } from 'react-custom-scrollbars';
import { Tabs, Modal, Avatar, Image } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import { Helper } from '@/utils';
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
class NoteComponent extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    const { user } = props;
    this.state = {
      visible: false
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

  cancelModal = () => {
    this.setStateData({ visible: false });
  }

  getDetails = () => {
    this.setStateData({ visible: true });
  }

  render() {
    const { visible } = this.state;
    return (
      <>
        <Modal
          className={styles['modal-note']}
          title="Ghi chú"
          visible={visible}
          width={576}
          onCancel={this.cancelModal}
          footer={null}
        >
          <div className={classnames('px15', styles['header-modal'])}>
            <div className="row">
              <div className="col-12 mt20">
                <p className="mb0">10:30, 16/05/2021</p>
                <h5 className="font-size-24 my5">Giữ ấm cho bé</h5>
                <p className="mb0 font-size-16">Bé hay bị lạnh, nhờ các cô giúp bé luôn mang áo ấm và tránh bé đứng trước quạt gió.</p>
                <Image.PreviewGroup>
                  <Image
                    width={110}
                    className="my10"
                    src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                  />
                  <Image
                    width={110}
                    className="my10"
                    src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                  />
                </Image.PreviewGroup>
              </div>
              <div className="col-md-6 py20 border-top">
                <AvatarTable
                  // fileImage={Helper.getPathAvatarJson(fileImage)}
                  fullName={'Bùi Ngọc Thy Nhân'}
                  description={'32 tháng tuổi'}
                  size={50}
                />
              </div>
              <div className="col-md-6 py20 border-top">
                <AvatarTable
                  // fileImage={Helper.getPathAvatarJson(fileImage)}
                  fullName={'Nguyễn Anh'}
                  description={'Phụ huynh'}
                  size={50}
                />
              </div>
              <div className="col-md-6 py20 border-top">
                <div className="d-flex">
                  <Avatar
                    src=""
                    size={50}
                  />
                  <div className="ml10">
                    <p className={classnames('mb0', styles['class'])}>Lớp</p>
                    <p className="font-weight-bold font-size-14 mb0">Preschool 2</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 py20 border-top">
                <div className="d-flex">
                  <Avatar
                    src=""
                    size={50}
                  />
                  <div className="ml10">
                    <p className={classnames('mb0', styles['class'])}>Giáo viên</p>
                    <p className="font-weight-bold font-size-14 mb0">Nguyễn Văn Tuyết, Lê Xuân Thanh, Lê Tiểu Linh</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 py20 border-bottom">
                <p className="mb5">Trạng thái</p>
                <div className={styles['btn-status']}>{Helper.tagStatus('', 'Đã nhận')}</div>
              </div>
              <div className="col-md-6 py20 border-bottom">
                <p className="mb5">Giáo viên đã nhận</p>
                <p className="font-weight-bold">Nguyễn Văn Tuyết lúc 10:35, 15/05/2021</p>
              </div>
            </div>
          </div>
        </Modal>

        <div className={classnames(styles['block-category'])}>
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
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 335}>
              {
                variablesModules.DATA_NOTES.map((item, index) => (
                  <div className={styles['content-tab']} key={index} onClick={this.getDetails}>
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
      </>
    );
  }
}

NoteComponent.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

NoteComponent.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default NoteComponent ;
