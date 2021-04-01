import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Modal, Avatar, Input, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import HelperModules from '../utils/Helper';
import PropTypes from 'prop-types';
import Breadcrumbs from '@/components/LayoutComponents/Exchange/Breadcrumbs';
import { UserOutlined } from '@ant-design/icons';
import stylesExchange from '@/assets/styles/Modules/Exchange/styles.module.scss';

const { Paragraph } = Typography;
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
const { confirm } = Modal;
const mapStateToProps = ({ exchangeApprove, loading }) => ({
  data: exchangeApprove.data,
  pagination: exchangeApprove.pagination,
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
    setIsMounted(true);
  }

  componentDidMount() {}

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
   * Function remove items
   * @param {uid} id id of items
   */
  onRemove = () => {
    confirm({
      title: 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content: 'Bạn có chắc muốn xóa trao đổi của Nguyễn Thị Mai không?',
      onOk() {},
      onCancel() {},
    });
  };

  render() {
    return (
      <>
        <Helmet title="Trao đổi cần duyệt" />
        <Breadcrumbs last="Trao đổi cần duyệt" />
        <div
          className={classnames(
            styles['content-form'],
            styles['content-form-children'],
            styles['content-form-details'],
          )}
        >
          {/* DETAILS CONTAINER */}
          <div className={stylesExchange['details-container']}>
            {/* INFO CONTAINER */}
            <div className={classnames(stylesExchange['info-container'], stylesExchange['info-aprrove-container'])}>
              <div className="d-flex justify-content-between">
                <h3 className={stylesExchange['title']}>Giữ ấm cho bé</h3>
                <p className={stylesExchange['time']}>10:30, 15/3/2021</p>
              </div>
              <div className="d-flex">
                <p className={stylesExchange['norm']}>
                  Người tạo: <strong>Nguyễn Anh</strong>
                </p>
                <p className={classnames(stylesExchange['norm'], 'ml-4')}>
                  Dành cho: <strong>Su Beo</strong>
                </p>
              </div>
              <p className={stylesExchange['norm']}>
                Bé hay bị lạnh, nhờ các cô giúp bé luôn mang áo ấm và tránh bé đứng trước quạt gió.
              </p>
              <div className={stylesExchange['list-image']}>
                <div className={stylesExchange['image-item']}>
                  <img src="/images/slice/image_01.png" className={stylesExchange['image']} />
                </div>
                <div className={stylesExchange['image-item']}>
                  <img src="/images/slice/image_01.png" className={stylesExchange['image']} />
                </div>
                <div className={stylesExchange['image-item']}>
                  <img src="/images/slice/image_01.png" className={stylesExchange['image']} />
                </div>
                <div className={stylesExchange['image-item']}>
                  <img src="/images/slice/image_01.png" className={stylesExchange['image']} />
                </div>
                <div className={stylesExchange['image-item']}>
                  <img src="/images/slice/image_01.png" className={stylesExchange['image']} />
                </div>
                <div className={stylesExchange['image-item']}>
                  <img src="/images/slice/image_01.png" className={stylesExchange['image']} />
                </div>
              </div>
              <hr />
              <div className={stylesExchange['chat-content']}>
                <div className={stylesExchange['chat-item']}>
                  <div className={stylesExchange['chat-aprrove']}>
                    <span className="icon-checkmark"></span>
                    <p className={stylesExchange['norm']}>Duyệt</p>
                  </div>
                  <div className={stylesExchange['heading']}>
                    <div className={stylesExchange['group-user']}>
                      <div className={stylesExchange['user-info']}>
                        <Avatar size={64} shape="square" icon={<UserOutlined />} />
                        <div className={stylesExchange['info']}>
                          <p className={stylesExchange['norm']}>Nguyễn Thị Mai</p>
                          <p className={stylesExchange['sub-norm']}>Giáo viên - Cơ sở 1</p>
                          <div className={stylesExchange['wrapper-content']}>
                            <div className={stylesExchange['content']}>
                              <Paragraph
                                ellipsis={{
                                  rows: 2,
                                  expandable: true,
                                  symbol: 'Xem thêm',
                                }}
                              >
                                Đã mặc áo cho bé. Ba mẹ yên tâm nhé
                              </Paragraph>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className={stylesExchange['time']}>10:45 - 15/3/2021</p>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
            {/* INFO CONTAINER */}
          </div>
          {/* DETAILS CONTAINER */}
        </div>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
};

export default Index;
