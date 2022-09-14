import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, head } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';

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
const mapStateToProps = ({ attendanceLogs, loading, user }) => ({
  loading,
  data: attendanceLogs.data,
  employees: attendanceLogs.employees,
  branches: attendanceLogs.branches,
  classes: attendanceLogs.classes,
  pagination: attendanceLogs.pagination,
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
      search: {
        classId: query?.classId || user?.role === "Teacher" && head(user?.objectInfo?.classTeachers)?.classId,
        branchId: query?.branchId || defaultBranch?.id,
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
      type: 'attendanceLogs/GET_EMPLOYEES',
      payload: {},
    });
    if (search.branchId) {
      this.props.dispatch({
        type: 'attendanceLogs/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    if (!defaultBranch?.id) {
      this.props.dispatch({
        type: 'attendanceLogs/GET_BRANCHES',
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
      type: 'attendanceLogs/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          startDate: Helper.getDate(search.startDate, variables.DATE_FORMAT.DATE_AFTER),
          endDate: Helper.getDate(search.endDate, variables.DATE_FORMAT.DATE_AFTER),
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
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectBranch = (e, type) => {
    this.debouncedSearch(e, type);
    this.props.dispatch({
      type: 'attendanceLogs/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
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

  /**
   * Function header table
   */
  header = () => [
    {
      title: 'Học sinh',
      key: 'branch',
      className: 'min-width-180',
      width: 180,
      render: (record) => record?.attendance?.student?.fullName,
    },
    {
      title: 'Thời gian',
      key: 'date',
      width: 170,
      className: 'min-width-170',
      render: (record) => Helper.getDate(record.creationTime, variables.DATE_FORMAT.DATE_TIME),
    },
    {
      title: 'Cơ sở',
      key: 'branch',
      className: 'min-width-180',
      width: 180,
      render: (record) => record?.employee?.classTeacher?.class?.branch?.name,
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-180',
      width: 180,
      render: (record) => record?.employee?.classTeacher?.class?.name,
    },
    {
      title: 'Hình thức',
      key: 'employee',
      className: 'min-width-180',
      width: 180,
      render: (record) => record?.type === "HANDMADE" ? "Thủ công" : "Tự động",
    },
    {
      title: 'Hình ảnh',
      key: 'employee',
      className: 'min-width-100',
      width: 100,
      render: (record) => <AvatarTable
        fileImage={Helper.getPathAvatarJson(record?.attendance?.student?.fileImage)}
      />
    },
    {
      title: 'Người chấm',
      key: 'employee',
      className: 'min-width-180',
      width: 180,
      render: (record) => record?.employee?.fullName,
    },
    {
      title: 'Hành động',
      key: 'action',
      className: 'min-width-180',
      width: 180,
      render: (record) => record?.action,
    },
  ];

  render() {
    const {
      data,
      employees,
      branches,
      pagination,
      defaultBranch,
      match: { params },
      loading: { effects },
      classes,
      user
    } = this.props;
    const { search, defaultBranchs } = this.state;
    const loading = effects['attendanceLogs/GET_DATA'];
    return (
      <>
        <Helmet title="Lịch sử điểm danh" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Lịch sử điểm danh</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                date: search.startDate &&
                  search.endDate && [moment(search.startDate), moment(search.endDate)],
                employeeId: search.employeeId || null,
                branchId: search.branchId || null,
                classId: search.classId || null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="employeeId"
                    data={[
                      { id: null, name: 'Tất cả nhân viên' },
                      ...Helper.convertSelectUsers(employees),
                    ]}
                    onChange={(event) => this.onChangeSelect(event, 'employeeId')}
                    placeholder="Chọn nhân viên"
                    type={variables.SELECT}
                    allowClear={false}
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
                    data={user?.role === "Teacher" ? [...classes?.filter(i => i?.id === head(user?.objectInfo?.classTeachers)?.classId)] : [{ name: 'Chọn tất cả', id: null }, ...classes]}
                    name="classId"
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeDateRank(event, 'date')}
                    type={variables.RANGE_PICKER}
                  />
                </div>
              </div>
            </Form>
            <Table
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              bordered
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
  employees: PropTypes.arrayOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
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
  employees: [],
  branches: [],
  classes: [],
  defaultBranch: {},
  user: {},
};

export default Index;
