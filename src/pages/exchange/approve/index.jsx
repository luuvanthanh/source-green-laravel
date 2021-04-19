import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Modal, Avatar, Typography } from 'antd';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import PropTypes from 'prop-types';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { UserOutlined } from '@ant-design/icons';
import stylesExchange from '@/assets/styles/Modules/Exchange/styles.module.scss';
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
const mapStateToProps = ({ exchangeApprove, loading }) => ({
  loading,
  data: exchangeApprove.data,
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
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'exchangeApprove/GET_DATA',
      payload: {},
    });
  };

  approve = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'exchangeApprove/UPDATE',
      payload: {
        id: record.id,
        description: record.description,
        status: variablesModules.STATUS.SENT,
      },
      callback: (response) => {},
    });
  };

  render() {
    const { data } = this.props;
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
            {data.map((item) => (
              <div
                className={classnames(
                  stylesExchange['info-container'],
                  stylesExchange['info-aprrove-container'],
                )}
                key={item.id}
              >
                <div className="d-flex justify-content-between">
                  <h3 className={stylesExchange['title']}>{item.title}</h3>
                  <p className={stylesExchange['time']}>
                    {Helper.getDate(item.creationTime, variables.DATE_FORMAT.DATE_TIME)}
                  </p>
                </div>
                <div className="d-flex">
                  <p className={stylesExchange['norm']}>
                    Người tạo: <strong>Nguyễn Anh</strong>
                  </p>
                  <p className={classnames(stylesExchange['norm'], 'ml-4')}>
                    Dành cho: <strong>Su Beo</strong>
                  </p>
                </div>
                <div
                  className={stylesExchange['norm']}
                  dangerouslySetInnerHTML={{ __html: item.description }}
                ></div>
                <div className={stylesExchange['list-image']}>
                  {Helper.isJSON(item.files) &&
                    JSON.parse(item.files).map((item) => (
                      <div className={stylesExchange['image-item']} key={item}>
                        <img src={`${API_UPLOAD}${item}`} className={stylesExchange['image']} />
                      </div>
                    ))}
                </div>
                <hr />
                <div className={stylesExchange['chat-content']}>
                  {item.feedbacks.map((itemFeedbacks) => (
                    <div className={stylesExchange['chat-item']} key={itemFeedbacks.id}>
                      {itemFeedbacks.status !== variablesModules.STATUS.SENT && (
                        <div
                          className={stylesExchange['chat-aprrove']}
                          onClick={() => this.approve(itemFeedbacks)}
                        >
                          <span className="icon-checkmark"></span>
                          <p className={stylesExchange['norm']}>Duyệt</p>
                        </div>
                      )}
                      <div className={stylesExchange['heading']}>
                        <div className={stylesExchange['group-user']}>
                          <div className={stylesExchange['user-info']}>
                            <Avatar size={50} shape="square" icon={<UserOutlined />} />
                            <div className={stylesExchange['info']}>
                              <p className={stylesExchange['norm']}>Nguyễn Thị Mai</p>
                              <p className={stylesExchange['sub-norm']}>Giáo viên - Cơ sở 1</p>
                            </div>
                          </div>
                          <div className={stylesExchange['wrapper-content']}>
                            <div className={stylesExchange['content']}>
                              {itemFeedbacks.description.length < 20 && itemFeedbacks.description}
                              {itemFeedbacks.description.length > 20 && (
                                <Paragraph
                                  ellipsis={{
                                    rows: 2,
                                    expandable: true,
                                    symbol: 'Xem thêm',
                                  }}
                                >
                                  {itemFeedbacks.description}
                                </Paragraph>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className={stylesExchange['time']}>
                          {Helper.getDate(item.creationTime, variables.DATE_FORMAT.DATE_TIME)}
                        </p>
                      </div>
                      <hr />
                    </div>
                  ))}
                </div>
              </div>
            ))}

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
