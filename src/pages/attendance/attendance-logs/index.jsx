import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
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
const mapStateToProps = ({ attendanceLogs, loading }) => ({
  loading,
  data: attendanceLogs.data,
  employees: attendanceLogs.employees,
  branches: attendanceLogs.branches,
  pagination: attendanceLogs.pagination,
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
    this.props.dispatch({
      type: 'attendanceLogs/GET_EMPLOYEES',
      payload: {},
    });
    this.props.dispatch({
      type: 'attendanceLogs/GET_BRANCHES',
      payload: {},
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

  /**
   * Function header table
   */
  header = () => [
    {
      title: 'Thời gian',
      key: 'date',
      width: 150,
      className: 'min-width-150',
      render: (record) => Helper.getDate(record.creationTime),
    },
    {
      title: 'Cơ sở',
      key: 'branch',
      className: 'min-width-180',
      width: 180,
      render: (record) => record?.employee?.positionLevelNow?.branch?.name,
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-180',
      width: 180,
      render: (record) => record?.employee?.classTeacher?.class?.name,
    },
    {
      title: 'Nhân viên',
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
    {
      title: 'Lý do',
      key: 'description',
      className: 'min-width-200',
      render: (record) => record.reason,
    },
  ];

  render() {
    const {
      data,
      employees,
      branches,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search } = this.state;
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
                startDate: search.startDate && moment(search.startDate),
                endDate: search.endDate && moment(search.endDate),
                employeeId: search.employeeId || null,
                branchId: search.branchId || null,
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
                <div className="col-lg-3">
                  <FormItem
                    name="branchId"
                    data={[{ id: null, name: 'Tất cả cơ sở' }, ...branches]}
                    onChange={(event) => this.onChangeSelect(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>

                <div className="col-lg-3">
                  <FormItem
                    name="startDate"
                    onChange={(event) => this.onChangeDate(event, 'startDate')}
                    type={variables.DATE_PICKER}
                    disabledDate={(current) => Helper.disabledDateFrom(current, this.formRef)}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="endDate"
                    onChange={(event) => this.onChangeDate(event, 'endDate')}
                    type={variables.DATE_PICKER}
                    disabledDate={(current) => Helper.disabledDateTo(current, this.formRef)}
                    allowClear={false}
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
              bordered={false}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
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
};

export default Index;
