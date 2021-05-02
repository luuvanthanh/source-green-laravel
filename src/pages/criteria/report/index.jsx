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
import C3Chart from 'react-c3js';
import { LEARN, PROGRAM } from './data.json';

var barUsers = {
  data: {
    x: 'x',
    columns: [
      ['x', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'],
      ['Nhân viên', 26, 19, 22, 15, 15],
    ],
    type: 'bar',
    groups: [['Nhân viên']],
    order: 'desc',
    labels: true,
  },
  bar: {
    width: {
      ratio: 0.5,
    },
  },
  axis: {
    x: {
      type: 'category',
    },
    y: {
      label: 'Điểm',
    },
  },
  color: {
    pattern: ['#3B36DD'],
  },
  legend: {
    show: false,
    position: 'inset',
    inset: {
      anchor: 'top-right',
      x: undefined,
      y: undefined,
      step: undefined,
    },
  },
};
const pieData = {
  data: {
    columns: [
      ['Level1', 215],
      ['Level2', 150],
      ['Level3', 75],
      ['Level4', 50],
      ['Level5', 25],
    ],
    type: 'donut',
  },
  donut: {
    title: 'Thống kê',
  },
  pie: {
    label: {
      format(value) {
        return value;
      },
    },
  },
  tooltip: {
    format: {
      value(value) {
        return `${value} điểm`;
      },
    },
  },
  color: {
    pattern: ['#27A600', '#FF8300', '#3B5CAD', '#07CAF4', '#1F86FF'],
  },
  legend: {
    show: true,
    position: 'inset',
    inset: {
      anchor: 'top-right',
      x: undefined,
      y: undefined,
      step: undefined,
    },
  },
};
const BAR = {
  data: {
    x: 'x',
    columns: [
      ['x', 'Tháng 1/2021', 'Tháng 2/2021', 'Tháng 3/2021', 'Tháng 4/2021', 'Tháng 5/2021'],
      ['Đã học', 10, 20, 30, 40, 50],
      ['Đã vắng', 0, 2, 0, 10, 0],
    ],
    type: 'bar',
    order: 'desc',
  },
  axis: {
    x: {
      type: 'category', // this needed to load string x value
    },
    y: {
      label: 'Buổi học',
    },
  },
  color: {
    pattern: ['#3B5CAD', '#FF8300'],
  },
  legend: {
    show: true,
    position: 'inset',
    inset: {
      anchor: 'top-right',
      x: undefined,
      y: undefined,
      step: undefined,
    },
  },
};

const STACKED = {
  data: {
    x: 'x',
    columns: [
      [
        'x',
        'Tháng 1/2021',
        'Tháng 2/2021',
        'Tháng 3/2021',
        'Tháng 4/2021',
        'Tháng 5/2021',
        'Tháng 6/2021',
      ],
      ['data1', 36, 38, 36, 80, 50, 40],
    ],
    types: {
      data1: 'area-spline',
    },
    groups: [['data1']],
  },
  axis: {
    x: {
      type: 'category', // this needed to load string x value
    },
    y: {
      label: 'Buổi học',
    },
  },
  color: {
    pattern: ['#27A600'],
  },
  legend: {
    show: false,
    position: 'inset',
    inset: {
      anchor: 'top-right',
      x: undefined,
      y: undefined,
      step: undefined,
    },
  },
};
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

  /**
   * Function header table
   */
  header = (type = '') => {
    let columns = [
      {
        title: 'Tên giáo cụ',
        key: 'name',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.name}</Text>,
      },
      {
        title: 'Số buổi học',
        key: 'count',
        className: 'min-width-150',
        align: 'center',
        render: (record) => <Text size="normal">{record.count}</Text>,
      },
      {
        title: 'Tổng điểm',
        key: 'total',
        className: 'min-width-150',
        width: 150,
        align: 'center',
        render: (record) => <Text size="normal">{record.total}</Text>,
      },
    ];
    if (type === 'PROGRAM') {
      columns = [
        {
          title: 'Danh sách giáo cụ',
          key: 'name',
          className: 'min-width-150',
          render: (record) => <Text size="normal">{record.name}</Text>,
        },
        {
          title: 'Tổng tiêu chí',
          key: 'total',
          className: 'min-width-150',
          align: 'center',
          render: (record) => <Text size="normal">{record.count}</Text>,
        },
        {
          title: 'Đã hoàn thành',
          key: 'finished',
          className: 'min-width-150',
          width: 150,
          align: 'center',
          render: (record) => <Text size="normal">{record.finished}</Text>,
        },
      ];
    }
    return columns;
  };

  render() {
    const {
      match: { params },
      loading: { effects },
      location: { pathname },
    } = this.props;
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
                    <hr className={styles.dot} />
                    <h3 className={styles['title']}>
                      Giáo cụ nổi bật: Trò chơi thả bóng vào lỗ trên khay gỗ{' '}
                    </h3>
                    <C3Chart {...barUsers} />
                    <hr className={styles.dot} />
                    <h3 className={styles['title']}>Ghi chú gần nhất</h3>
                    <div className={styles['feedback-container']}>
                      <div className={styles['feedback-item']}>
                        <img src="/images/image-default.png" alt="image" className={styles.image} />
                        <span className={styles['date-group']}>20/04/2021 - 10:15</span>
                        <div className={styles['feedback-content']}>
                          <h4 className={styles['title']}>Nguyễn Hồng Ánh</h4>
                          <h3 className={styles['sub-title']}>Giáo viên chủ nhiệm</h3>
                          <p className={styles['norm']}>
                            Bé học nhanh và tiếp thu tốt. Cần cho bé vận động ở nhà nhiều hơn. Và
                            chơi các trò về trí não nhiều hơn.
                          </p>
                        </div>
                      </div>
                      <div className={styles['feedback-item']}>
                        <img src="/images/image-default.png" alt="image" className={styles.image} />
                        <span className={styles['date-group']}>20/04/2021 - 10:15</span>
                        <div className={styles['feedback-content']}>
                          <h4 className={styles['title']}>Nguyễn Hồng Ánh</h4>
                          <h3 className={styles['sub-title']}>Giáo viên chủ nhiệm</h3>
                          <p className={styles['norm']}>
                            Bé học nhanh và tiếp thu tốt. Cần cho bé vận động ở nhà nhiều hơn. Và
                            chơi các trò về trí não nhiều hơn.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles['grid']}>
                  <div className={styles['report-list']}>
                    <h3 className={styles['title']}>Thống kê giáo cụ và điểm theo level học</h3>
                    <C3Chart {...pieData} />
                    <hr className={styles.dot} />
                    <h3 className={styles['title']}>Top các giáo cụ học nhiều</h3>
                    <Table
                      className="mt10"
                      bordered={false}
                      columns={this.header()}
                      dataSource={LEARN}
                      pagination={false}
                      params={{
                        header: this.header(),
                        type: 'table',
                      }}
                      rowKey={(record) => record.id}
                      scroll={{ x: '100%' }}
                    />
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
                    <h3 className={styles['title']}>Chương trình phát triển suy luận cho trẻ</h3>
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
                          <img src="/images/report/puzzle.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tổng số giáo cụ</h3>
                            <p className={styles['norm']}>39</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/alphabet.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tổng số tiêu chí</h3>
                            <p className={styles['norm']}>03</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/level1.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tiêu chí level 1 hoàn thành</h3>
                            <p className={styles['norm']}>39</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/level2.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tiêu chí level 2 hoàn thành</h3>
                            <p className={styles['norm']}>03</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/level3.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tiêu chí level 3 hoàn thành</h3>
                            <p className={styles['norm']}>39</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/level4.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tiêu chí level 4 hoàn thành</h3>
                            <p className={styles['norm']}>03</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/level5.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tiêu chí level 5 hoàn thành</h3>
                            <p className={styles['norm']}>39</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/person.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Giáo cụ hoàn thành đủ level</h3>
                            <p className={styles['norm']}>03</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className={styles.dot} />
                    <Table
                      className="mt10"
                      bordered={false}
                      columns={this.header('PROGRAM')}
                      dataSource={PROGRAM}
                      pagination={false}
                      params={{
                        header: this.header('PROGRAM'),
                        type: 'table',
                      }}
                      rowKey={(record) => record.id}
                      scroll={{ x: '100%' }}
                    />
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
                    <h3 className={styles['title']}>Chương trình phát triển suy luận cho trẻ 2</h3>
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
                          <img src="/images/report/puzzle.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tổng số giáo cụ</h3>
                            <p className={styles['norm']}>39</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/alphabet.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tổng số tiêu chí</h3>
                            <p className={styles['norm']}>03</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/level1.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tiêu chí level 1 hoàn thành</h3>
                            <p className={styles['norm']}>39</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/level2.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tiêu chí level 2 hoàn thành</h3>
                            <p className={styles['norm']}>03</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/level3.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tiêu chí level 3 hoàn thành</h3>
                            <p className={styles['norm']}>39</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/level4.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tiêu chí level 4 hoàn thành</h3>
                            <p className={styles['norm']}>03</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/level5.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Tiêu chí level 5 hoàn thành</h3>
                            <p className={styles['norm']}>39</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/person.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Giáo cụ hoàn thành đủ level</h3>
                            <p className={styles['norm']}>03</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className={styles.dot} />
                    <Table
                      className="mt10"
                      bordered={false}
                      columns={this.header('PROGRAM')}
                      dataSource={PROGRAM}
                      pagination={false}
                      params={{
                        header: this.header('PROGRAM'),
                        type: 'table',
                      }}
                      rowKey={(record) => record.id}
                      scroll={{ x: '100%' }}
                    />
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
                    <h3 className={styles['title']}>Học tập tiếng anh</h3>
                    <p className={styles['sub-title']}>Cập nhật 15/04/2021 - 10:15</p>
                  </div>
                  <Button color="success" size="large" ghost>
                    Chi tiết
                  </Button>
                </div>
                <div className={styles['card-content']}>
                  <div className={styles['report-list']}>
                    <h3 className={styles['title']}>Thống kê chung</h3>
                    <div className="row">
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/learn.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Số buổi đã học</h3>
                            <p className={styles['norm']}>39</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/note.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Số buổi vắng</h3>
                            <p className={styles['norm']}>03</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className={styles.dot} />
                    <h3 className={styles['title']}>Biểu đồ tình hình học tiếp anh</h3>
                    <C3Chart {...BAR} />
                    <hr className={styles.dot} />
                    <h3 className={styles['title']}>Ghi chú gần nhất</h3>
                    <div className={styles['feedback-container']}>
                      <div className={styles['feedback-item']}>
                        <img src="/images/image-default.png" alt="image" className={styles.image} />
                        <span className={styles['date-group']}>20/04/2021 - 10:15</span>
                        <div className={styles['feedback-content']}>
                          <h4 className={styles['title']}>Nguyễn Hồng Ánh</h4>
                          <h3 className={styles['sub-title']}>Giáo viên chủ nhiệm</h3>
                          <p className={styles['norm']}>
                            Bé học nhanh và tiếp thu tốt. Cần cho bé vận động ở nhà nhiều hơn. Và
                            chơi các trò về trí não nhiều hơn.
                          </p>
                        </div>
                      </div>
                      <div className={styles['feedback-item']}>
                        <img src="/images/image-default.png" alt="image" className={styles.image} />
                        <span className={styles['date-group']}>20/04/2021 - 10:15</span>
                        <div className={styles['feedback-content']}>
                          <h4 className={styles['title']}>Nguyễn Hồng Ánh</h4>
                          <h3 className={styles['sub-title']}>Giáo viên chủ nhiệm</h3>
                          <p className={styles['norm']}>
                            Bé học nhanh và tiếp thu tốt. Cần cho bé vận động ở nhà nhiều hơn. Và
                            chơi các trò về trí não nhiều hơn.
                          </p>
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
                    <h3 className={styles['title']}>Kỹ năng xã hội</h3>
                    <p className={styles['sub-title']}>Cập nhật 15/04/2021 - 10:15</p>
                  </div>
                  <Button color="success" size="large" ghost>
                    Chi tiết
                  </Button>
                </div>
                <div className={styles['card-content']}>
                  <div className={styles['report-list']}>
                    <C3Chart {...pieData} />
                    <hr className={styles.dot} />
                    <h3 className={styles['title']}>Ghi chú gần nhất</h3>
                    <div className={styles['feedback-container']}>
                      <div className={styles['feedback-item']}>
                        <img src="/images/image-default.png" alt="image" className={styles.image} />
                        <span className={styles['date-group']}>20/04/2021 - 10:15</span>
                        <div className={styles['feedback-content']}>
                          <h4 className={styles['title']}>Nguyễn Hồng Ánh</h4>
                          <h3 className={styles['sub-title']}>Giáo viên chủ nhiệm</h3>
                          <p className={styles['norm']}>
                            Bé học nhanh và tiếp thu tốt. Cần cho bé vận động ở nhà nhiều hơn. Và
                            chơi các trò về trí não nhiều hơn.
                          </p>
                        </div>
                      </div>
                      <div className={styles['feedback-item']}>
                        <img src="/images/image-default.png" alt="image" className={styles.image} />
                        <span className={styles['date-group']}>20/04/2021 - 10:15</span>
                        <div className={styles['feedback-content']}>
                          <h4 className={styles['title']}>Nguyễn Hồng Ánh</h4>
                          <h3 className={styles['sub-title']}>Giáo viên chủ nhiệm</h3>
                          <p className={styles['norm']}>
                            Bé học nhanh và tiếp thu tốt. Cần cho bé vận động ở nhà nhiều hơn. Và
                            chơi các trò về trí não nhiều hơn.
                          </p>
                        </div>
                      </div>
                    </div>
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
                    <h3 className={styles['title']}>Nhiệt độ</h3>
                    <p className={styles['sub-title']}>Cập nhật 15/04/2021 - 10:15</p>
                  </div>
                  <Button color="success" size="large" ghost>
                    Chi tiết
                  </Button>
                </div>
                <div className={styles['card-content']}>
                  <div className={styles['report-list']}>
                    <h3 className={styles['title']}>Thống kê chung</h3>
                    <div className="row">
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/learn.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Nhiệt độ cao nhất</h3>
                            <p className={styles['norm']}>38,5°C - 03/09/2021</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles['report-item']}>
                          <img src="/images/report/note.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Nhiệt độ cao nhất</h3>
                            <p className={styles['norm']}>35,8°C - 03/01/2021</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className={styles.dot} />
                    <C3Chart {...STACKED} />
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
                    <h3 className={styles['title']}>Pipi-pupu-uống nước</h3>
                    <p className={styles['sub-title']}>Cập nhật 15/04/2021 - 10:15</p>
                  </div>
                  <Button color="success" size="large" ghost>
                    Chi tiết
                  </Button>
                </div>
                <div className={styles['card-content']}>
                  <div className={styles['report-list']}>
                    <div className="row">
                      <div className="col-4">
                        <div className={styles['report-item']}>
                          <img src="/images/report/learn.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Số lần pipi</h3>
                            <p className={styles['norm']}>160</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className={styles['report-item']}>
                          <img src="/images/report/note.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Số lần pupu</h3>
                            <p className={styles['norm']}>80</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className={styles['report-item']}>
                          <img src="/images/report/note.svg" alt="group" />
                          <div className={styles['content']}>
                            <h3 className={styles['title']}>Chai nước uống</h3>
                            <p className={styles['norm']}>45</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <C3Chart {...BAR} />
                  </div>
                </div>
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
