import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Modal, Avatar, Input, Typography } from 'antd';
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
const mapStateToProps = ({ exchangeAdd, loading }) => ({
  data: exchangeAdd.data,
  pagination: exchangeAdd.pagination,
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

  render() {
    return (
      <>
        <Helmet title="Chi tiết trao đổi" />
        <Breadcrumbs last="Tạo trao đổi" />
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
            <div className={stylesExchange['info-container']}>
              <p className={stylesExchange['time']}>10:30, 15/3/2021</p>
              <h3 className={stylesExchange['title']}>Giữ ấm cho bé</h3>
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
              <div className={stylesExchange['group-user']}>
                <p className={stylesExchange['norm']}>Người tạo</p>
                <div className={stylesExchange['user-info']}>
                  <Avatar size={64} shape="square" icon={<UserOutlined />} />
                  <p className={stylesExchange['norm']}>Nguyễn Anh</p>
                </div>
              </div>
              <hr />
              <div className={stylesExchange['group-user']}>
                <p className={stylesExchange['norm']}>Dành cho</p>
                <div className={stylesExchange['user-info']}>
                  <Avatar size={64} shape="square" icon={<UserOutlined />} />
                  <p className={stylesExchange['norm']}>Su beo</p>
                </div>
              </div>
              <hr />
              <div className={stylesExchange['info-content']}>
                <div className={stylesExchange['info-item']}>
                  <p className={stylesExchange['norm']}>Cơ sở</p>
                  <div className={stylesExchange['content']}>
                    <div className={styles.circle}>
                      <span className={'icon-school'}></span>
                    </div>
                    <p className={stylesExchange['norm']}>Lake view</p>
                  </div>
                </div>
                <div className={stylesExchange['info-item']}>
                  <p className={stylesExchange['norm']}>Lớp</p>
                  <div className={stylesExchange['content']}>
                    <div className={styles.circle}>
                      <span className="icon-open-book"></span>
                    </div>
                    <p className={stylesExchange['norm']}>Preschool</p>
                  </div>
                </div>
              </div>
              <hr />
              <div className={stylesExchange['info-footer']}>
                <div className={stylesExchange['info-item']}>
                  <p className={stylesExchange['norm']}>Trạng thái</p>
                  <div className={stylesExchange['content']}>
                    {HelperModules.tagStatus('PENDING')}
                  </div>
                </div>
                <div className={stylesExchange['info-item']}>
                  <Button type="button" color="success" size="large">
                    Kết thúc
                  </Button>
                </div>
              </div>
            </div>
            {/* INFO CONTAINER */}
            {/* CHAT CONTAINER */}
            <div className={stylesExchange['chat-container']}>
              <div className={stylesExchange['chat-content']}>
                <div className={stylesExchange['chat-item']}>
                  <div className={stylesExchange['heading']}>
                    <div className={stylesExchange['group-user']}>
                      <div className={stylesExchange['user-info']}>
                        <Avatar size={64} shape="square" icon={<UserOutlined />} />
                        <div className={stylesExchange['info']}>
                          <p className={stylesExchange['norm']}>Nguyễn Thị Mai</p>
                          <p className={stylesExchange['sub-norm']}>Giáo viên - Cơ sở 1</p>
                        </div>
                      </div>
                    </div>
                    <p className={stylesExchange['time']}>10:45 - 15/3/2021</p>
                  </div>
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
                    <div className={stylesExchange['group-button']}>
                      <Button icon="checkmark" color="dash-success"></Button>
                      <Button icon="edit" color="dash-yellow"></Button>
                      <Button icon="cancel" color="dash-dark"></Button>
                    </div>
                  </div>
                </div>
                <div className={stylesExchange['chat-item']}>
                  <div className={stylesExchange['heading']}>
                    <div className={stylesExchange['group-user']}>
                      <div className={stylesExchange['user-info']}>
                        <Avatar size={64} shape="square" icon={<UserOutlined />} />
                        <div className={stylesExchange['info']}>
                          <p className={stylesExchange['norm']}>Nguyễn Thị Mai</p>
                          <p className={stylesExchange['sub-norm']}>Giáo viên - Cơ sở 1</p>
                        </div>
                      </div>
                    </div>
                    <p className={stylesExchange['time']}>10:45 - 15/3/2021</p>
                  </div>
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
                    <div className={stylesExchange['group-button']}>
                      <Button icon="checkmark" color="dash-success"></Button>
                      <Button icon="edit" color="dash-yellow"></Button>
                      <Button icon="cancel" color="dash-dark"></Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={stylesExchange['chat-footer']}>
                <div className={stylesExchange['content']}>
                  <Input placeholder="Nhập" />
                  <Button icon="plan" color="dash-success"></Button>
                </div>
              </div>
            </div>
            {/* CHAT CONTAINER */}
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
