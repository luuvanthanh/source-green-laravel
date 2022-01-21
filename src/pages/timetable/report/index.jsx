import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Select } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import Button from '@/components/CommonComponent/Button';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import stylesModule from './styles.module.scss';

const { Option } = Select;
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
const mapStateToProps = ({ timeTablesReport, loading, user }) => ({
  loading,
  data: timeTablesReport.data,
  error: timeTablesReport.error,
  event: timeTablesReport.event,
  pagination: timeTablesReport.pagination,
  defaultBranch: user.defaultBranch,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      defaultBranch,
      location: { query },
    } = props;
    this.state = {
      search: {
        KeyWord: query?.KeyWord,
        branchId: query?.branchId || defaultBranch?.id,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        date: query.date ? moment(query.date) : moment(),
      },
      dataIDSearch: [],
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
    this.loadCategories();
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
    // this.props.dispatch({
    //     type: 'timeTablesReport/GET_DATA',
    //     payload: {
    //         ...search,
    //     },
    // });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          date: Helper.getDate(search.from, variables.DATE_FORMAT.DATE_AFTER),
        },
        variables.QUERY_STRING,
      )}`,
    );
  };

  /**
   * Function load event
   */
  loadCategories = () => {
    const { dispatch } = this.props;
    const { search } = this.state;
    if (search.branchId) {
      dispatch({
        type: 'timeTablesReport/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    dispatch({
      type: 'timeTablesReport/GET_EVENTS',
      payload: {},
    });
  };

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearch = debounce((value, type) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          [`${type}`]: value,
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
        },
      }),
      () => this.onLoad(),
    );
  }, 300);

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChange = (e, type) => {
    this.debouncedSearch(e.target.value, type);
  };

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelect = (e, type) => {
    this.debouncedSearch(e, type);
  };

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectBranch = (e, type) => {
    const { dispatch } = this.props;
    this.debouncedSearch(e, type);
    dispatch({
      type: 'timeTablesReport/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
  };

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectSearch = (e) => {
    this.setStateData({ dataIDSearch: e });
  };

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSearch = () => {
    const { dispatch } = this.props;
    const { dataIDSearch } = this.state;
    dispatch({
      type: 'timeTablesReport/GET_DATA',
      payload: {
        dataIDSearch,
      },
    });
  };

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeExcel = () => {
    const { dataIDSearch } = this.state;
    Helper.exportExcelClover(
      `/event-timetable-attendances/export-to-excel/${dataIDSearch}`,
      {},
      `Thongkebaocao.xlsx`,
    );
  };

  /**
   * Function set pagination
   * @param {integer} page page of pagination
   * @param {integer} size size of pagination
   */
  changePagination = ({ page, limit }) => {
    this.setState(
      (prevState) => ({
        search: {
          ...prevState.search,
          page,
          limit,
        },
      }),
      () => {
        this.onLoad();
      },
    );
  };

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDate = (e, type) => {
    this.debouncedSearch(moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type);
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  pagination = (pagination) => {
    const {
      location: { query },
    } = this.props;
    return Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        this.changePagination(response);
      },
    });
  };

  /**
   * Function header table
   */
  header = () => {
    const { search } = this.state;
    const columns = [
      {
        title: 'STT ',
        key: 'index',
        width: 100,
        fixed: 'left',
        render: (text, record, index) => {
          if (record?.parentEventTimetableAttendances) {
            return null;
          }
          return Helper.serialOrder(search?.page, index, search?.limit);
        },
      },
      {
        title: 'Phụ huynh',
        key: 'parent.fullName',
        width: 200,
        render: (record) => {
          if (record?.parentEventTimetableAttendances) {
            return record?.class?.name;
          }
          return record?.parent?.fullName;
        },
      },
      {
        title: 'Học sinh',
        key: 'student.fullName',
        width: 200,
        render: (record) => <Text size="normal">{record?.student?.fullName}</Text>,
      },
      {
        title: 'Cơ sở',
        key: 'basis',
        width: 200,
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record?.student?.class?.branch?.name}</Text>,
      },
      {
        title: 'Lớp',
        key: 'class',
        width: 200,
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record?.student?.class?.name}</Text>,
      },
      {
        title: 'Nhận thông báo sự kiện',
        key: 'noticedAmount',
        width: 200,
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record?.noticedAmount}</Text>,
      },
      {
        title: 'Xác nhận tham gia',
        key: 'willJoinAmount',
        width: 200,
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record?.willJoinAmount}</Text>,
      },
      {
        title: 'Đã tham gia',
        key: 'joinedAmount',
        width: 200,
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record?.joinedAmount}</Text>,
      },
    ];
    return columns;
  };

  handleCancel = () => this.setStateData({ visible: false });

  render() {
    const {
      data,
      error,
      event,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const loading = effects['timeTablesReport/GET_DATA'];
    return (
      <>
        <Helmet title="Thống kê báo cáo phụ huynh tham gia sự kiện" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Thống kê báo cáo phụ huynh tham gia sự kiện</Text>
          </div>
          <div className={stylesModule['wrapper-top']}>
            <h3 className={stylesModule.title}>Sự kiện</h3>
            <div className={stylesModule.content}>
              <Select
                showSearch
                placeholder="Chọn sự kiện"
                style={{ width: 200 }}
                onChange={(e) => this.onChangeSelectSearch(e)}
                className="w-100"
              >
                {event.map((item, index) =>
                  item?.eventTimetables?.map((i) => (
                    <Option value={i?.id} key={index}>
                      {i?.title}
                    </Option>
                  )),
                )}
              </Select>

              <Button color="success" icon="plus" className="ml-4" onClick={this.onChangeSearch}>
                Tải dữ liệu
              </Button>
            </div>
          </div>

          <div className={stylesModule['wrapper-table']}>
            <div className="d-flex justify-content-between align-items-center pt20 pl20 pr20">
              <h3 className={stylesModule.title} color="dark">
                Chi tiết báo cáo tổng các khoản phải nộp{' '}
              </h3>
              <Button color="primary" icon="export" className="ml-2" onClick={this.onChangeExcel}>
                Xuất Excel
              </Button>
            </div>
            <div className={classnames(styles['block-table'])}>
              <Table
                columns={this.header(params)}
                dataSource={data}
                loading={loading}
                error={error}
                isError={error.isError}
                childrenColumnName="parentEventTimetableAttendances"
                bordered
                pagination={this.pagination(pagination)}
                params={{
                  header: this.header(),
                  type: 'table',
                }}
                rowKey={(record) => record?.class?.id || record?.class?.name}
                scroll={{ x: '100%' }}
              />
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
  event: PropTypes.arrayOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  defaultBranch: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  event: [],
  error: {},
  defaultBranch: {},
};

export default Index;
