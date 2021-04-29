import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Modal, Form } from 'antd';
import classnames from 'classnames';
import { isEmpty, head, debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import common from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import styles from './styles.modules.scss';

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
const mapStateToProps = ({ report, loading }) => ({
  data: report.data,
  pagination: report.pagination,
  loading,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
    } = props;
    this.state = {};
    setIsMounted(true);
  }

  // componentDidMount() {
  //   this.onLoad();
  // }

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
      match: { params },
      data,
      pagination,
      loading: { effects },
      location: { pathname },
    } = this.props;
    const loading = effects['report/GET_DATA'];
    const loadingSubmit = effects['report/ADD'] || effects['report/UPDATE'];
    return (
      <>
        <Helmet title="Danh sách tiêu chí - đánh giá" />
        <div className={classnames(common['content-form'], common['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Báo cáo tổng quát trẻ</Text>
          </div>
          <div className={styles['card-container']}>
            <div className={classnames(styles['profiles-container'], 'd-flex')}>
              <div className={styles['image-container']}>
                <img src="/images/image-default.png" alt="image" className={styles.image} />
              </div>
              <div className={styles['profiles-content']}>
                <h3 className={styles['title']}>Nguyễn Thị Linh</h3>
                <div className={styles['profiles-info']}>
                  <div className={styles['info-item']}>
                    <p className={styles['label']}>Năm sinh</p>
                    <h4 className={styles['name']}>22/04/2019 (32 tháng tuổi)</h4>
                  </div>
                  <div className={styles['info-item']}>
                    <p className={styles['label']}>Cơ sở</p>
                    <h4 className={styles['name']}>Lake View</h4>
                  </div>
                  <div className={styles['info-item']}>
                    <p className={styles['label']}>Lớp</p>
                    <h4 className={styles['name']}>Presschool</h4>
                  </div>
                  <div className={styles['info-item']}>
                    <p className={styles['label']}>Ngày vào học</p>
                    <h4 className={styles['name']}>15/02/2020</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt20">
            <div className="col-lg-6">
              <div className={styles['card-container']}>
                <div
                  className={classnames(
                    styles['card-header'],
                    'd-flex justify-content-between align-items-center',
                  )}
                >
                  <div>
                    <h3 className={styles['title']}>Điểm danh xe bus</h3>
                    <p className={styles['sub-title']}>Cập nhật 15/04/2021 - 10:15</p>
                  </div>
                  <Button color="success" size="large" ghost>
                    Chi tiết
                  </Button>
                </div>
                <div className={styles['card-content']}>
                  <div className={styles['report-list']}>
                    <div className="row">
                      <div className="col-12">
                        <div className={styles['report-item']}>
                          <img src="/images/report/group.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Điểm đón</h3>
                            <p className={styles['norm']}>Số 45 Hoàng Hoa Thám, Hồ Chí Minh</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/books.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Số ngày đi học</h3>
                            <p className={styles['norm']}>100</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/note.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Số ngày vắng</h3>
                            <p className={styles['norm']}>05</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className={styles['card-container']}>
                <div
                  className={classnames(
                    styles['card-header'],
                    'd-flex justify-content-between align-items-center',
                  )}
                >
                  <div>
                    <h3 className={styles['title']}>Điểm danh đến lớp</h3>
                    <p className={styles['sub-title']}>Cập nhật 15/04/2021 - 10:15</p>
                  </div>
                  <Button color="success" size="large" ghost>
                    Chi tiết
                  </Button>
                </div>
                <div className={styles['card-content']}>
                  <div className={styles['report-list']}>
                    <div className="row">
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/books.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Số ngày đi học</h3>
                            <p className={styles['norm']}>100</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/note.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Số ngày vắng</h3>
                            <p className={styles['norm']}>05</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/happy.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Số ngày vắng có phép</h3>
                            <p className={styles['norm']}>04</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/sad.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Số ngày vắng không phép</h3>
                            <p className={styles['norm']}>01</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classnames(styles['card-container'], 'mt20')}>
            <div
              className={classnames(
                styles['card-header'],
                'd-flex justify-content-between align-items-center',
              )}
            >
              <div>
                <h3 className={styles['title']}>Học tập giáo cụ</h3>
                <p className={styles['sub-title']}>Cập nhật 15/04/2021 - 10:15</p>
              </div>
              <Button color="success" size="large" ghost>
                Chi tiết
              </Button>
            </div>
            <div className={styles['card-content']}>
              <div className={styles['grid-card']}>
                <div className={styles['grid']}>
                  <div className={styles['report-list']}>
                    <h3 className={styles['title']}>Thống kê chung</h3>
                    <div className="row">
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/total.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tổng loại giáo cụ</h3>
                            <p className={styles['norm']}>20</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/learn.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tổng điểm đạt được</h3>
                            <p className={styles['norm']}>440</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles['grid']}></div>
              </div>
            </div>
          </div>
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
