import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Modal, Avatar, Input, Typography, Form } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import HelperModules from '../utils/Helper';
import PropTypes from 'prop-types';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { UserOutlined } from '@ant-design/icons';
import stylesExchange from '@/assets/styles/Modules/Exchange/styles.module.scss';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import variablesModules from '../utils/variables';

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
const mapStateToProps = ({ exchangeDetails, loading, menu }) => ({
  loading,
  details: exchangeDetails.details,
  error: exchangeDetails.error,
  menuData: menu.menuLeftExchange,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && params?.id) {
      this.formRef.current.setFieldsValue({
        status: details.status,
      });
    }
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

  /**
   * Function load data
   */
  onLoad = () => {
    const {
      location: { pathname },
      match: { params },
      dispatch,
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'exchangeDetails/GET_DATA',
        payload: params,
      });
    }
  };

  /**
   * Function edit items
   * @param {uid} id id of items
   */
  onEdit = (event, record) => {
    this.setStateData((prevState) => ({
      items: prevState.items.map((item) =>
        item.id === record.id
          ? { ...item, isTyping: !item.isTyping }
          : { ...item, isTyping: false },
      ),
    }));
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
    const {
      menuData,
      error,
      details,
      loading: { effects },
    } = this.props;
    const loading = effects['exchangeDetails/GET_DATA'];
    return (
      <Form layout="vertical" ref={this.formRef}>
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <Helmet title="Chi tiết trao đổi" />
          <Breadcrumbs last="Chi tiết trao đổi" menu={menuData} />
          <div
            className={classnames(
              styles['content-form'],
              styles['content-form-children'],
              styles['content-form-details'],
            )}
          >
            {/* DETAILS CONTAINER */}
            <div className={classnames(stylesExchange['details-container'], 'mt-3')}>
              {/* INFO CONTAINER */}
              <div className={classnames(stylesExchange['info-container'])}>
                <p className={stylesExchange['time']}>
                  {Helper.getDate(details.creationTime, variables.DATE_FORMAT.DATE_TIME)}
                </p>
                <h3 className={stylesExchange['title']}>{details.title}</h3>
                <p className={stylesExchange['norm']}>{details.description}</p>
                <div className={stylesExchange['list-image']}>
                  {Helper.isJSON(details.files) &&
                    JSON.parse(details.files).map((item) => (
                      <div className={stylesExchange['image-item']} key={item}>
                        <img src={`${API_UPLOAD}${item}`} className={stylesExchange['image']} />
                      </div>
                    ))}
                </div>
                <hr />
                <div className={stylesExchange['group-user']}>
                  <p className={stylesExchange['norm']}>Người tạo</p>
                  <div className={stylesExchange['user-info']}>
                    <Avatar size={50} shape="square" icon={<UserOutlined />} />
                    <p className={stylesExchange['norm']}>Nguyễn Anh</p>
                  </div>
                </div>
                <hr />
                <div className={stylesExchange['group-user']}>
                  <p className={stylesExchange['norm']}>Dành cho</p>
                  <div className={stylesExchange['user-info']}>
                    <Avatar size={50} shape="square" icon={<UserOutlined />} />
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
                    <FormItem
                      name="status"
                      label="Trạng thái"
                      allowClear={false}
                      data={variablesModules.STATUS_TABS}
                      type={variables.SELECT}
                    />
                  </div>
                </div>
              </div>
              {/* INFO CONTAINER */}
              {/* CHAT CONTAINER */}
              <div className={stylesExchange['chat-container']}>
                <div className={stylesExchange['chat-content']}>
                  {details.feedbacks &&
                    details.feedbacks.map((item, index) => (
                      <div className={stylesExchange['chat-item']} key={item.id}>
                        <div className={stylesExchange['heading']}>
                          <div className={stylesExchange['group-user']}>
                            <div className={stylesExchange['user-info']}>
                              <Avatar size={50} shape="square" icon={<UserOutlined />} />
                              <div className={stylesExchange['info']}>
                                <p className={stylesExchange['norm']}>Nguyễn Thị Mai</p>
                                <p className={stylesExchange['sub-norm']}>Giáo viên - Cơ sở 1</p>
                              </div>
                            </div>
                          </div>
                          <p className={stylesExchange['time']}>
                            {Helper.getDate(item.creationTime, variables.DATE_FORMAT.DATE_TIME)}
                          </p>
                        </div>
                        <div className={stylesExchange['wrapper-content']}>
                          {!item.isTyping && (
                            <>
                              <div className={stylesExchange['content']}>
                                {item.description.length < 20 && item.description}
                                {item.description.length > 20 && (
                                  <Paragraph
                                    ellipsis={{
                                      rows: 2,
                                      expandable: true,
                                      symbol: 'Xem thêm',
                                    }}
                                  >
                                    {item.description}
                                  </Paragraph>
                                )}
                              </div>
                              <div className={stylesExchange['group-button']}>
                                <Button icon="checkmark" color="dash-success"></Button>
                                <Button
                                  icon="edit"
                                  color="dash-yellow"
                                  onClick={(event) => this.onEdit(event, item)}
                                ></Button>
                                <Button
                                  icon="cancel"
                                  color="dash-dark"
                                  onClick={this.onRemove}
                                ></Button>
                              </div>
                            </>
                          )}
                          {item.isTyping && (
                            <>
                              <div className={stylesExchange['content']}>
                                <Input />
                              </div>
                              <div
                                className={classnames(
                                  stylesExchange['group-button'],
                                  stylesExchange['group-button-singal'],
                                )}
                              >
                                <Button color="dash-success">Lưu</Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
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
        </Loading>
      </Form>
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
