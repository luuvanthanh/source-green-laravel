import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Scrollbars } from 'react-custom-scrollbars';
import { Tabs, Modal, Avatar, Image, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Table from '@/components/CommonComponent/Table';

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
      visible: false,
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

  cancelModal= () => {
    this.setStateData({ visible: false });
  }

  getDetails = () => {
    this.setStateData({ visible: true });
  }

  /**
   * Function header table
   */
   header = () => {
    const images = [
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    ]
    return [
      {
        title: 'Thời gian uống',
        key: 'creationTime',
        className: 'min-width-140',
        width: 140,
        render: (record) => 'Sau ăn sáng'
      },
      {
        title: 'Thuốc',
        key: 'image',
        className: 'min-width-300',
        width: 300,
        render: (record) => (
          <div className="d-flex align-items-center">
            <Image.PreviewGroup>
              {
                images.map((item, index) => (
                  <div className={styles['group-image']} key={index}>
                    <Image
                      width={42}
                      src={item}
                      data-viewmore={`+${images.length - 1}`}
                    />
                  </div>
                ))
              }
            </Image.PreviewGroup>
            <p className="mb0 ml10">Siro Prosan</p>
          </div>
        ),
      },
      {
        title: 'Đơn vị',
        key: 'position',
        className: 'min-width-120',
        width: 120,
        render: (record) => 'Chai'
      },
      {
        title: 'Liều lượng',
        key: 'amount',
        className: 'min-width-120',
        width: 120,
        render: (record) => '5 ml'
      },
      {
        title: 'Ghi chú',
        key: 'note',
        className: 'min-width-300',
        width: 300,
        render: (record) => '',
      },
      {
        title: 'Nhận thuốc',
        key: 'getMedicine',
        align: 'center',
        className: 'min-width-120',
        render: () => <Checkbox />,
      },
      {
        title: 'Cho thuốc',
        key: 'giveMedicine',
        align: 'center',
        className: 'min-width-120',
        render: () => <Checkbox />,
      },
      {
        title: 'Ghi chú',
        key: 'noteAll',
        rowSpan: 2,
        className: 'min-width-300',
        width: 300,
        render: (value, row, index) => {
          const obj = {
            children: 'Cho bé uống thuốc đúng giờ',
            props: {
              rowSpan: index === 0 ? 2 : 0
            }
          };
          return obj;
        }
      },
    ];
  };

  render() {
    const { visible, tab } = this.state;
    return (
      <>
        <Modal
          className={styles['modal-student-detail']}
          visible={visible}
          title="Y tế"
          width={"90%"}
          onCancel={this.cancelModal}
          footer={null}
        >
          <div className={classnames('p20', 'border-bottom', styles['header-modal'])}>
            <div className="row">
              <div className="col-lg-3 mt10">
                <AvatarTable
                  // fileImage={Helper.getPathAvatarJson(fileImage)}
                  fullName={'Bùi Ngọc Thy Nhân'}
                  description={'32 tháng tuổi'}
                  size={50}
                />
              </div>
              <div className="col-lg-3 mt10">
                <AvatarTable
                  // fileImage={Helper.getPathAvatarJson(fileImage)}
                  fullName={'Nguyễn Anh'}
                  description={'Phụ huynh'}
                  size={50}
                />
              </div>
              <div className="col-lg-2 mt10">
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
              <div className="col-lg-4 mt10">
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
            </div>
          </div>
          <div className="p20">
            <div className="row">
              <div className="col-md-6 col-lg-3">
                <p className="mb20">Thời gian gửi: <span className="font-weight-bold">07:05, 16/05/2021</span></p>
              </div>
              <div className="col-md-6 col-lg-3">
                <p className="mb20">Tên bệnh: <span className="font-weight-bold">Ho</span></p>
              </div>
              <div className="col-md-6 col-lg-3">
                <p className="mb20">Vị trí đặt thuốc: <span className="font-weight-bold">Trong balo trẻ</span></p>
              </div>
              <div className="col-md-6 col-lg-3">
                <p className="mb20">Nhân viên y tế: <span className="font-weight-bold">Phạm Thị Tiên</span></p>
              </div>
            </div>
            <Table
              bordered
              columns={this.header()}
              dataSource={[{id: 1}, {id: 2}]}
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
        </Modal>
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
