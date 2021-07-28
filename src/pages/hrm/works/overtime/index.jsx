import React, { PureComponent } from 'react';
import { connect, history, Link } from 'umi';
import { Form, Tooltip } from 'antd';
import classnames from 'classnames';
import { isEmpty, debounce, get, isInteger, omit } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Button from '@/components/CommonComponent/Button';

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
const mapStateToProps = ({ worksOvertime, loading }) => ({
  data: worksOvertime.data,
  pagination: worksOvertime.pagination,
  error: worksOvertime.error,
  holidays: worksOvertime.holidays,
  branches: worksOvertime.branches,
  divisions: worksOvertime.divisions,
  employees: worksOvertime.employees,
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
    this.state = {
      search: {
        fullName: query?.fullName,
        branchId: query?.branchId,
        divisionId: query?.divisionId,
        employeeId: query?.employeeId ? query?.employeeId.split(',') : undefined,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        endDate: query?.endDate
          ? moment(query?.endDate)
          : moment().startOf('month').add(24, 'days'),
        startDate: query?.startDate
          ? moment(query?.startDate)
          : moment().startOf('month').subtract(1, 'months').add(25, 'days'),
      },
      downloading: false,
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.loadCategories();
    this.onLoad();
    this.loadHolidays();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.search.startDate !== prevState.search.startDate &&
      this.state.search.endDate !== prevState.search.endDate
    ) {
      this.loadHolidays();
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

  loadCategories = () => {
    this.props.dispatch({
      type: 'worksOvertime/GET_BRANCHES',
      payload: {},
    });
    this.props.dispatch({
      type: 'worksOvertime/GET_DIVISIONS',
      payload: {},
    });
    this.props.dispatch({
      type: 'worksOvertime/GET_EMPLOYEES',
      payload: {},
    });
  };

  loadHolidays = () => {
    const { search } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'worksOvertime/GET_HOLIDAYS',
      payload: {
        name: Helper.getDate(search.endDate, variables.DATE_FORMAT.YEAR),
      },
    });
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
      type: 'worksOvertime/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          endDate: Helper.getDate(search.endDate, variables.DATE_FORMAT.DATE_AFTER),
          startDate: Helper.getDate(search.startDate, variables.DATE_FORMAT.DATE_AFTER),
        },
        variables.QUERY_STRING,
      )}`,
    );
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
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDate = (e, type) => {
    this.debouncedSearch(moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type);
  };

  onChangeMonth = (e) => {
    this.debouncedSearchMonth(e);
  };

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchMonth = debounce((value) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          startDate: moment(value).startOf('month').subtract(1, 'months').add(25, 'days'),
          endDate: moment(value).startOf('month').add(24, 'days'),
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
        },
      }),
      () => {
        this.onLoad();
      },
    );
  }, 300);

  /**
   * Function change type
   * @param {object} e value of select
   */
  onChangeType = (e) => {
    this.debouncedSearchType(e);
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
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  pagination = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        this.changePagination(response);
      },
    });

  renderTitleHeader = (index, item) => {
    if (index !== null && item) {
      return <div>{moment(item).format('DD')}</div>;
    }
    return null;
  };

  exportExcel = async () => {
    const { search } = this.state;
    this.setStateData({ downloading: true });
    await Helper.exportExcel(
      `/v1/work-hours-summary-export`,
      {
        ...omit(search, 'page', 'limit'),
        startDate: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: search.startDate,
            targetValue: '00:00:00',
          }),
          isUTC: false,
        }),
        endDate: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: search.endDate,
            targetValue: '23:59:59',
          }),
          isUTC: false,
        }),
      },
      `BangCongNgoaiGio_${Helper.getDate(search.endDate, variables.DATE_FORMAT.MONTH_FULL)}.xlsx`,
    );
    this.setStateData({ downloading: false });
  };

  redirectHistory = (item, record, user) =>
    `/quan-ly-nhan-su/phieu-dang-ky-gio-lam-them?${Helper.convertParamSearchConvert(
      {
        startDate: Helper.getDate(item, variables.DATE_FORMAT.DATE_AFTER),
        endDate: Helper.getDate(item, variables.DATE_FORMAT.DATE_AFTER),
        fullName: user.fullName,
      },
      variables.QUERY_STRING,
    )}`;

  renderworksOvertimehift = (
    record = [],
    dayOfWeek = Helper.getDate(moment(), variables.DATE_FORMAT.DATE_AFTER),
    user = {},
  ) => {
    const { holidays } = this.props;
    const holiday = holidays.find(
      (item) =>
        Helper.getDate(item.date, variables.DATE_FORMAT.DATE_AFTER) ===
        Helper.getDate(dayOfWeek, variables.DATE_FORMAT.DATE_AFTER),
    );
    if (moment(dayOfWeek).isoWeekday() >= 6) {
      return (
        <Link
          to={this.redirectHistory(dayOfWeek, record, user)}
          className={classnames(styles['item-schedules'], [styles[`cell-heading-weekend`]])}
        >
          -
        </Link>
      );
    }
    if (user.dateOff && moment(user.dateOff).isBefore(moment(dayOfWeek))) {
      return (
        <div
          to={this.redirectHistory(dayOfWeek, record, user)}
          className={classnames(styles['item-schedules'], {
            [styles[`cell-heading-weekend`]]: moment(dayOfWeek).isoWeekday() >= 6,
            [styles[`cell-heading-holidays`]]: !!holiday,
            [styles[`cell-heading-dateoff`]]: true,
          })}
        >
          -
        </div>
      );
    }
    if (holiday) {
      return (
        <Tooltip
          title={
            <div className={styles['tooltip-container']}>
              <strong>Nghỉ lễ: </strong>
              <br />
              {holiday.name}
            </div>
          }
          color="#00B24D"
        >
          <Link
            to={this.redirectHistory(dayOfWeek, record, user)}
            className={classnames(styles['item-schedules'], {
              [styles[`cell-heading-holidays`]]: !!holiday,
              [styles[`cell-heading-weekend`]]: moment(dayOfWeek).isoWeekday() >= 6,
            })}
          >
            L
          </Link>
        </Tooltip>
      );
    }
    if (!isEmpty(record)) {
      const data = record.find((item) => Helper.getDate(item.date) === Helper.getDate(dayOfWeek));
      if (get(data, 'type')) {
        return (
          <Link
            to={this.redirectHistory(dayOfWeek, record, user)}
            className={classnames(styles['item-schedules'], {
              [styles[`cell-heading-weekend`]]: moment(dayOfWeek).isoWeekday() >= 6,
              [styles[`cell-heading-kc`]]: data.type === 'KC',
            })}
          >
            {data.type}
          </Link>
        );
      }
      if (data) {
        return (
          <Link
            to={this.redirectHistory(dayOfWeek, record, user)}
            className={classnames(styles['item-schedules'], {
              [styles[`cell-heading-weekend`]]: moment(dayOfWeek).isoWeekday() >= 6,
            })}
          >
            {isInteger(data.value) ? data.value : Helper.toFixed(data.value)}
          </Link>
        );
      }
      return (
        <Link
          to={this.redirectHistory(dayOfWeek, record, user)}
          className={classnames(styles['item-schedules'], {
            [styles[`cell-heading-weekend`]]: moment(dayOfWeek).isoWeekday() >= 6,
          })}
        >
          -
        </Link>
      );
    }
    return (
      <Link
        to={this.redirectHistory(dayOfWeek, record, user)}
        className={classnames(styles['item-schedules'], {
          [styles[`cell-heading-weekend`]]: moment(dayOfWeek).isoWeekday() >= 6,
        })}
      >
        -
      </Link>
    );
  };

  /**
   * Function header table
   */
  header = () => {
    const { search } = this.state;
    const headerWork = [
      {
        title: 'Tổng cộng (Giờ)',
        key: 'date_work',
        align: 'center',
        width: 100,
        className: classnames('max-width-100', 'min-width-100', 'col-fixed-100'),
        render: (record) => Helper.toFixed(record.totalWorkHourSummary),
      },
    ];
    const arrayHeader = [
      {
        title: 'Nhân viên',
        key: 'fullName',
        className: 'min-width-200 col-fixed-200',
        width: 200,
        fixed: 'left',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.fileImage)}
            fullName={record.fullName}
          />
        ),
      },
      {
        title: 'Bộ phận',
        key: 'division',
        align: 'center',
        width: 120,
        fixed: 'left',
        className: classnames('max-width-120', 'min-width-120', 'col-fixed-120'),
        render: (record) => record?.positionLevelNow?.division?.name,
      },
    ];

    const arrayMonth = Helper.treeDate(
      Helper.convertArrayDays(search.startDate, search.endDate),
    ).map((itemMonth) => ({
      title: Helper.getDate(itemMonth.month, variables.DATE_FORMAT.MONTH_NAME),
      key: itemMonth.month,
      children: itemMonth.data.map((item, index) => ({
        title: this.renderTitleHeader(index, item),
        key: Helper.convertArrayDays(search.startDate, search.endDate)[index],
        className: classnames('min-width-50', 'max-width-50', 'pt-0', 'pb-0', 'pl-0', 'pr-0'),
        width: 50,
        align: 'center',
        render: (record) => this.renderworksOvertimehift(record.workHourSummary, item, record),
      })),
    }));
    return arrayHeader.concat(arrayMonth).concat(headerWork);
  };

  render() {
    const {
      data,
      error,
      employees,
      pagination,
      match: { params },
      loading: { effects },
      divisions,
      branches,
    } = this.props;
    const { search, downloading } = this.state;
    const loading = effects['worksOvertime/GET_DATA'];
    return (
      <>
        <Helmet title="Chấm công ngoài giờ" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">CHẤM CÔNG NGOÀI GIỜ</Text>
            {!isEmpty(data) && (
              <Button
                color="success"
                icon="export"
                size="large"
                onClick={this.exportExcel}
                loading={downloading}
              >
                Tải bảng công ngoài giờ
              </Button>
            )}
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                date: search.endDate && moment(search.endDate),
                divisionId: search.divisionId || null,
                branchId: search.branchId || null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="fullName"
                    onChange={(event) => this.onChange(event, 'fullName')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeMonth(event, 'date')}
                    type={variables.MONTH_PICKER}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả cơ sở' }, ...branches]}
                    name="branchId"
                    onChange={(event) => this.onChangeSelect(event, 'branchId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả bộ phận' }, ...divisions]}
                    name="divisionId"
                    onChange={(event) => this.onChangeSelect(event, 'divisionId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-12">
                  <FormItem
                    data={Helper.convertSelectUsers(employees)}
                    name="employeeId"
                    onChange={(event) => this.onChangeSelect(event, 'employeeId')}
                    type={variables.SELECT_MUTILPLE}
                    placeholder="Chọn tất cả"
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              error={error}
              isError={error.isError}
              className="table-work"
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%', y: '60vh' }}
            />
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
  error: PropTypes.objectOf(PropTypes.any),
  holidays: PropTypes.arrayOf(PropTypes.any),
  divisions: PropTypes.arrayOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  employees: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  error: {},
  holidays: [],
  divisions: [],
  branches: [],
  employees: [],
};

export default Index;
