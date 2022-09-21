import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, isEmpty, size, head } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import HelperModules from '../utils/Helper';
import variablesModules from '../utils/variables';

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
const mapStateToProps = ({ timekeepingReport, loading, user }) => ({
  loading,
  data: timekeepingReport.data,
  pagination: timekeepingReport.pagination,
  branches: timekeepingReport.branches,
  classes: timekeepingReport.classes,
  years: timekeepingReport.years,
  defaultBranch: user.defaultBranch,
  user: user.user,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      defaultBranch,
      location: { query },
      user,
    } = props;
    this.state = {
      defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
      dataYear: user ? user?.schoolYear : {},
      search: {
        classId: query?.classId || user?.role === "Teacher" && head(user?.objectInfo?.classTeachers)?.classId,
        fullName: query?.fullName,
        branchId: query?.branchId || defaultBranch?.id,
        schoolYearId: query?.schoolYearId || user?.schoolYear?.id,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        endDate: query?.endDate ? moment(query?.endDate) : moment().endOf('months'),
        startDate: query?.startDate ? moment(query?.startDate) : moment().startOf('months'),
      },
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

  loadCategories = () => {
    const { search } = this.state;
    const { defaultBranch } = this.props;
    this.props.dispatch({
      type: 'timekeepingReport/GET_YEARS',
      payload: {},
    });
    if (search.branchId) {
      this.props.dispatch({
        type: 'timekeepingReport/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    if (!defaultBranch?.id) {
      this.props.dispatch({
        type: 'timekeepingReport/GET_BRANCHES',
        payload: {},
      });
    }
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
      type: 'timekeepingReport/GET_DATA',
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
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchType = debounce((value) => {
    if (value === 'MONTH') {
      this.setStateData(
        (prevState) => ({
          search: {
            ...prevState.search,
            type: value,
            startDate: moment(prevState.search.startDate).startOf('month'),
            endDate: moment(prevState.search.endDate).endOf('month'),
          },
        }),
        () => {
          this.formRef.current.setFieldsValue({
            startDate: moment(this.state.search.startDate).startOf('month'),
            endDate: moment(this.state.search.endDate).endOf('month'),
          });
          this.onLoad();
        },
      );
    } else {
      this.setStateData(
        (prevState) => ({
          search: {
            ...prevState.search,
            type: value,
          },
        }),
        () => this.onLoad(),
      );
    }
  }, 300);

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
          startDate: moment(value).startOf('month'),
          endDate: moment(value).endOf('month'),
        },
      }),
      () => this.onLoad(),
    );
  }, 300);

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchDateRank = debounce((startDate, endDate) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          startDate,
          endDate,
        },
      }),
      () => this.onLoad(),
    );
  }, 200);

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectBranch = (e, type) => {
    this.debouncedSearch(e, type);
    this.props.dispatch({
      type: 'timekeepingReport/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
  };

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
    const {
      years,
      user
    } = this.props;
    if (type === 'schoolYearId') {
      const data = years?.find(i => i.id === e);
      this.setStateData({
        dataYear: data,
      });
      this.setState(
        (prevState) => ({
          search: {
            ...prevState.search,
            startDate: user?.schoolYear?.id === e ? moment().startOf('months') : moment(data?.startDate).startOf('months'),
            endDate: user?.schoolYear?.id === e ? moment().endOf('months') : moment(data?.startDate).endOf('months'),
          },
        }),
      );
      this.formRef.
        current.setFieldsValue({ date: user?.schoolYear?.id === e ? [moment().startOf('months'), moment().endOf('months')] : [moment(data?.startDate).startOf('months'), moment(data?.startDate).endOf('months')], isset_history_care: undefined });
    }
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
   * Function change type
   * @param {object} e value of select
   */
  onChangeType = (e) => {
    this.debouncedSearchType(e);
  };

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDateRank = (e) => {
    this.debouncedSearchDateRank(
      moment(e[0]).format(variables.DATE_FORMAT.DATE_AFTER),
      moment(e[1]).format(variables.DATE_FORMAT.DATE_AFTER),
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
      return (
        <div>
          {HelperModules.getDayOfWeek(moment(item).format('d'))} <br />{' '}
          {moment(item).format('DD-MM')}
        </div>
      );
    }
    return null;
  };

  renderContentDate = (date, record) => {
    const attendance = record.attendance.find(
      (item) =>
        Helper.getDate(item.date, variables.DATE_FORMAT.DATE_AFTER) ===
        Helper.getDate(date, variables.DATE_FORMAT.DATE_AFTER),
    );
    if (attendance) {
      return variablesModules.STATUS_ABSENT_KEY[attendance.status];
    }
    return null;
  };

  renderReality = (items) => {
    if (!isEmpty(items.attendance)) {
      const attendance = items.attendance.filter(
        (item) =>
          item.status === variablesModules.STATUS_ABSENT.HAVE_IN ||
          item?.status === variablesModules.STATUS_ABSENT.HAVE_OUT,
      );
      return size(attendance);
    }
    return null;
  };

  renderAbsents = (items, status) => {
    if (!isEmpty(items.attendance)) {
      const attendance = items.attendance.filter((item) => item.status === status);
      return size(attendance);
    }
    return null;
  };

  exportData = () => {
    const { fullName, branchId, classId } = this.state.search;

    Helper.exportExcel(
      '/v1/export-excel-attendance',
      {
        startDate: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: this.state.search.startDate,
            targetValue: '00:00:00',
          }),
          format: variables.DATE_AFTER,
          isUTC: false,
        }),
        endDate: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: this.state.search.endDate,
            targetValue: '23:59:59',
          }),
          format: variables.DATE_AFTER,
          isUTC: false,
        }),
        excel: true,
        fullName: !isEmpty(fullName) && fullName,
        branchId: !isEmpty(branchId) && branchId,
        classId: !isEmpty(classId) && classId,
      },
      'THDiemdanh.xlsx',
    );
  };

  /**
   * Function header table
   */
  header = () => {
    const { search } = this.state;
    const arrayHeader = [
      {
        title: 'Họ và Tên',
        key: 'fullName',
        className: 'min-width-220',
        width: 220,
        fixed: 'left',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record?.fileImage)}
            fullName={record?.fullName}
          />
        ),
      },
      {
        title: 'Cơ sở',
        key: 'branch',
        className: 'min-width-180',
        width: 180,
        render: (record) => record?.classStudent?.class?.branch?.name,
      },
      {
        title: 'Lớp',
        key: 'class',
        className: 'min-width-180',
        width: 180,
        render: (record) => record?.classStudent?.class?.name,
      },
      {
        title: 'Phép',
        key: 'absents',
        align: 'center',
        className: 'min-width-100',
        width: 100,
        fixed: 'right',
        render: (record) => this.renderAbsents(record, variablesModules.STATUS_ABSENT.ANNUAL_LEAVE),
      },
      {
        title: 'Không phép',
        key: 'unpaidLeave',
        align: 'center',
        className: 'min-width-100',
        width: 100,
        fixed: 'right',
        render: (record) => this.renderAbsents(record, variablesModules.STATUS_ABSENT.UNPAID_LEAVE),
      },
      {
        title: 'Học thực tế',
        key: 'reality',
        align: 'center',
        className: 'min-width-100',
        width: 100,
        fixed: 'right',
        render: (record) => this.renderReality(record),
      },
    ];
    const arrayHeaderDate = Helper.convertArrayDays(search.startDate, search.endDate).map(
      (item, index) => ({
        title: this.renderTitleHeader(index, item),
        key: Helper.convertArrayDays(search.startDate, search.endDate)[index],
        className: classnames('min-width-80', 'max-width-80'),
        width: 80,
        align: 'center',
        render: (record) => (
          <div className={styles['item-schedules']}>{this.renderContentDate(item, record)}</div>
        ),
      }),
    );
    return [...arrayHeader.slice(0, 3), ...arrayHeaderDate, ...arrayHeader.slice(3)];
  };

  render() {
    const {
      classes,
      branches,
      data,
      pagination,
      defaultBranch,
      match: { params },
      years,
      user,
      loading: { effects },
    } = this.props;
    const { search, defaultBranchs, dataYear } = this.state;
    const loading = effects['timekeepingReport/GET_DATA'];

    return (
      <>
        <Helmet title="Tổng hợp điểm danh" />
        <div
          className={classnames(styles['content-form'], styles['content-form-timekeepingReport'])}
        >
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Tổng hợp điểm danh</Text>
            <Button color="success" onClick={this.exportData} icon="export">
              Tải bảng điểm danh tháng
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                date: search.startDate &&
                  search.endDate && [moment(search.startDate), moment(search.endDate)],
                branchId: search.branchId || null,
                classId: search.classId || null,
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
                {!defaultBranch?.id && (
                  <div className="col-lg-3">
                    <FormItem
                      data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                      name="branchId"
                      onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                      type={variables.SELECT}
                      allowClear={false}
                    />
                  </div>
                )}
                {defaultBranch?.id && (
                  <div className="col-lg-3">
                    <FormItem
                      data={defaultBranchs}
                      name="branchId"
                      onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                      type={variables.SELECT}
                      allowClear={false}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <FormItem
                    data={user?.role === "Teacher" ? [...classes?.filter(i => i?.id === head(user?.objectInfo?.classTeachers)?.classId)] : [{ name: 'Chọn tất cả lớp', id: null }, ...classes]}
                    name="classId"
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Chọn tất cả năm học' }, ...years]}
                    name="schoolYearId"
                    onChange={(event) => this.onChangeSelect(event, 'schoolYearId')}
                    type={variables.SELECT}
                    placeholder="Chọn năm học"
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeDateRank(event, 'date')}
                    type={variables.RANGE_PICKER}
                    disabledDate={(current) =>
                      (dataYear?.startDate &&
                        current < moment(dataYear?.startDate).startOf('day')) ||
                      (dataYear?.endDate &&
                        current >= moment(dataYear?.endDate).endOf('day'))
                    }
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%', y: '70vh' }}
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
  branches: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  years: PropTypes.arrayOf(PropTypes.any),
  defaultBranch: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  branches: [],
  years: [],
  classes: [],
  defaultBranch: {},
  user: {},
};

export default Index;
