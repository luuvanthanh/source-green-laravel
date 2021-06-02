import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Typography } from 'antd';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import { head, get } from 'lodash';
import styles from '@/assets/styles/Common/common.scss';
import PropTypes from 'prop-types';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import stylesExchange from '@/assets/styles/Modules/Exchange/styles.module.scss';
import { variables, Helper } from '@/utils';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
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
const mapStateToProps = ({ communicationsApprove, loading }) => ({
  loading,
  data: communicationsApprove.data,
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
    this.props.dispatch({
      type: 'communicationsApprove/GET_DATA',
      payload: {},
    });
  };

  approve = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'communicationsApprove/UPDATE',
      payload: {
        id: record.id,
        description: record.description,
        status: variablesModules.STATUS.SENT,
      },
      callback: () => {},
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
                  <h3 className={stylesExchange.title}>{item.title}</h3>
                  <p className={stylesExchange.time}>
                    {Helper.getDate(item.creationTime, variables.DATE_FORMAT.DATE_TIME)}
                  </p>
                </div>
                <div className="d-flex">
                  <p className={stylesExchange.norm}>
                    Người tạo: <strong>{item?.creator?.objectInfo?.fullName}</strong>
                  </p>
                  <p className={classnames(stylesExchange.norm, 'ml-4')}>
                    Dành cho: <strong>{item?.student?.fullName}</strong>
                  </p>
                </div>
                <div
                  className={stylesExchange.norm}
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
                <div className={stylesExchange['list-image']}>
                  {Helper.isJSON(item.files) &&
                    JSON.parse(item.files).map((item) => (
                      <div className={stylesExchange['image-item']} key={item}>
                        <img
                          src={`${API_UPLOAD}${item}`}
                          className={stylesExchange.image}
                          alt="imageFile"
                        />
                      </div>
                    ))}
                </div>
                <hr />
                <div className={stylesExchange['chat-content']}>
                  {item.feedbacks.map((itemFeedbacks) => (
                    <div className={stylesExchange['chat-item']} key={itemFeedbacks.id}>
                      {itemFeedbacks.status !== variablesModules.STATUS.SENT && (
                        <div
                          role="presentation"
                          className={stylesExchange['chat-aprrove']}
                          onClick={() => this.approve(itemFeedbacks)}
                        >
                          <span className="icon-checkmark" />
                          <p className={stylesExchange.norm}>Duyệt</p>
                        </div>
                      )}
                      <div className={stylesExchange.heading}>
                        <div className={stylesExchange['group-user']}>
                          <div className={stylesExchange['user-info']}>
                            <AvatarTable
                              size={50}
                              fileImage={
                                Helper.isJSON(get(itemFeedbacks, 'creator.objectInfo.fileImage')) &&
                                head(JSON.parse(get(itemFeedbacks, 'creator.objectInfo.fileImage')))
                              }
                            />
                            <div className={stylesExchange.info}>
                              <p className={stylesExchange.norm}>
                                {itemFeedbacks?.creator?.objectInfo?.fullName}
                              </p>
                              <p className={stylesExchange['sub-norm']}>
                                {variablesModules.NAME_ROLES[item.type]}
                              </p>
                            </div>
                          </div>
                          <div className={stylesExchange['wrapper-content']}>
                            <div className={stylesExchange.content}>
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
                        <p className={stylesExchange.time}>
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
  data: PropTypes.arrayOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  data: [],
  dispatch: {},
};

export default Index;
