import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Modal, Typography, Form, message, Select, Image } from 'antd';
import { ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { isEmpty, get, head } from 'lodash';
import { Helmet } from 'react-helmet';

import Button from '@/components/CommonComponent/Button';
import PropTypes from 'prop-types';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { UserOutlined } from '@ant-design/icons';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import variablesModules from '../utils/variables';
import HelperModules from '../utils/Helper';
import { Scrollbars } from 'react-custom-scrollbars';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import styles from './styles.module.scss';

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
const mapStateToProps = ({ notesDetails, loading, menu, user }) => ({
  loading,
  user: user.user,
  error: notesDetails.error,
  menuData: menu.menuLeftNotes,
  details: notesDetails.details,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      description: null,
      objects: {},
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.loadDetails();
  }

  componentWillUnmount() {
    setIsMounted(false);
  }

  loadDetails = () => {
    const {
      match: { params },
    } = this.props;
    this.props.dispatch({
      type: 'notesDetails/GET_DATA',
      payload: params,
    });
  };

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
    const {
      error,
      details,
      menuData,
      loading: { effects },
    } = this.props;
    const loading = effects['notesDetails/GET_DATA'];
    return (
      <div className="pr20 pl20">
        <Helmet title="Chi tiết ghi chú" />
        <Breadcrumbs last="Chi tiết ghi chú" menu={menuData} />
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <Loading loading={loading} isError={error.isError} params={{ error }}>
              {/* DETAILS CONTAINER */}
              <div className={classnames(styles['info-container'])}>
                <p className={styles['time']}>
                  {Helper.getDate(details?.confirmedTime, variables.DATE_FORMAT.DATE_TIME)}
                </p>
                <h3 className={styles['title']}>{details?.name}</h3>
                <div
                  className={styles['norm']}
                  dangerouslySetInnerHTML={{ __html: details.description }}
                ></div>
                <div className={styles['list-image']}>
                  <Image.PreviewGroup>
                    {Helper.isJSON(details.fileImage) &&
                      JSON.parse(details.fileImage).map((item, index) => (
                        <Image
                          width={80}
                          height={80}
                          src={`${API_UPLOAD}${item}`}
                          key={index}
                          preview={{
                            maskClassName: 'customize-mask',
                            mask: <EyeOutlined className="mr5" />,
                          }}
                        />
                      ))}
                  </Image.PreviewGroup>
                </div>
                <hr />
                <div className="row">
                  <div className="col-6">
                    <div className={styles['group-user']}>
                      <p className={styles['norm']}>Phụ huynh</p>
                      <AvatarTable
                        size={50}
                        fileImage={head(
                          (Helper.isJSON(
                            get(details, 'student.studentParents[0].parent.fileImage'),
                          ) ||
                            Helper.isJSON(
                              get(details, 'student.studentParents[0].farther.fileImage'),
                            )) &&
                            JSON.parse(
                              get(details, 'student.studentParents[0].parent.fileImage') ||
                                get(details, 'student.studentParents[0].farther.fileImage'),
                            ),
                        )}
                        fullName={
                          get(details, 'student.studentParents[0].parent.fullName') ||
                          get(details, 'student.studentParents[0].farther.fullName')
                        }
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={styles['group-user']}>
                      <p className={styles['norm']}>Dành cho</p>
                      <AvatarTable
                        size={50}
                        fileImage={
                          Helper.isJSON(get(details, 'student.fileImage')) &&
                          head(JSON.parse(get(details, 'student.fileImage')))
                        }
                        fullName={get(details, 'student.fullName')}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-6">
                    <div className={styles['info-content']}>
                      <div className={styles['info-item']}>
                        <p className={styles['norm']}>Cơ sở</p>
                        <div className={styles['content']}>
                          <div className={styles.circle}>
                            <span className={'icon-school'}></span>
                          </div>
                          <p className={styles['norm']}>{details?.student?.class?.branch?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={styles['info-content']}>
                      <div className={styles['info-item']}>
                        <p className={styles['norm']}>Lớp</p>
                        <div className={styles['content']}>
                          <div className={styles.circle}>
                            <span className="icon-open-book"></span>
                          </div>
                          <p className={styles['norm']}>{details?.student?.class?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div>
                  <p className={styles['norm']}>Trạng thái</p>
                  <div className="d-inline-flex">{HelperModules.tagStatus(details.status)}</div>
                </div>
              </div>
              {/* INFO CONTAINER */}

              {/* INFO FEEDBACK */}
              <div className={classnames(styles['feedback-container'], 'mt20')}>
                <div className="row">
                  <div className="col-4">
                    <p className={styles['time']}>
                      {Helper.getDate(details?.confirmedTime, variables.DATE_FORMAT.DATE_TIME)}
                    </p>
                  </div>
                  <div className="col-8">
                    <p className={styles['norm']}>{details?.employee?.fullName} đã nhận tin</p>
                  </div>
                </div>
              </div>
              {/* INFO FEEDBACK */}
            </Loading>
          </div>
        </div>
      </div>
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
