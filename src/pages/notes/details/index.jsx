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
                <p className={styles['time']}>10:30, 15/3/2021</p>
                <h3 className={styles['title']}>Giữ ấm cho bé</h3>
                <div className={styles['norm']}>
                  Bé hay bị lạnh, nhờ các cô giúp bé luôn mang áo ấm và tránh bé đứng trước quạt
                  gió.
                </div>
                <div className={styles['list-image']}>
                  <Image.PreviewGroup>
                    {Helper.isJSON(details.files) &&
                      JSON.parse(details.files).map((item, index) => (
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
                        fileImage={
                          Helper.isJSON(get(details, 'creator.objectInfo.fileImage')) &&
                          head(JSON.parse(get(details, 'creator.objectInfo.fileImage')))
                        }
                        fullName="Nguyễn Anh"
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={styles['group-user']}>
                      <p className={styles['norm']}>Dành cho</p>
                      <AvatarTable
                        size={50}
                        fileImage={
                          Helper.isJSON(get(details, 'studentMaster.student.fileImage')) &&
                          head(JSON.parse(get(details, 'studentMaster.student.fileImage')))
                        }
                        fullName="Su beo"
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
                          <p className={styles['norm']}>Lake view</p>
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
                          <p className={styles['norm']}>Preschool</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div>
                  <p className={styles['norm']}>Trạng thái</p>
                  <div className="d-inline-flex">{HelperModules.tagStatus('CLOSED')}</div>
                </div>
              </div>
              {/* INFO CONTAINER */}

              {/* INFO FEEDBACK */}
              <div className={classnames(styles['feedback-container'], 'mt20')}>
                <div className="row">
                  <div className="col-4">
                    <p className={styles['time']}>08:36 - 23/1/2021</p>
                  </div>
                  <div className="cl-8">
                    <p className={styles['norm']}>Nguyễn Thị Vy đã nhận tin</p>
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
