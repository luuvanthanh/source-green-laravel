import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, get } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import stylesModule from './styles.module.scss';


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
const mapStateToProps = ({ medicalStudentProblem, loading, user, HRMEmployeeLeave }) => ({
  loading,
  data: HRMEmployeeLeave.data,
  divisions: HRMEmployeeLeave.divisions,
  branches: HRMEmployeeLeave.branches,
  positions: HRMEmployeeLeave.positions,
  error: medicalStudentProblem.error,
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
        SearchDate: query.SearchDate ? moment(query.SearchDate) : "",
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
   * @returns {void} call this.setState to upSearchDate state
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
    this.props.dispatch({
      type: 'HRMEmployeeLeave/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          SearchDate: Helper.getDate(search.from, variables.DATE_FORMAT.DATE_AFTER),
        },
        variables.QUERY_STRING,
      )}`,
    );
  };

  /**
   * Function load branches
   */
  loadCategories = () => {
    const { dispatch } = this.props;
    const { search } = this.state;
    if (search.branchId) {
      dispatch({
        type: 'medicalStudentProblem/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    dispatch({
      type: 'HRMEmployeeLeave/GET_BRANCHES',
      payload: {},
    });
    dispatch({
      type: 'HRMEmployeeLeave/GET_DIVISIONS',
      payload: {},
    });
    dispatch({
      type: 'HRMEmployeeLeave/GET_POSITIONS',
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
      type: 'medicalStudentProblem/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
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

  debouncedSearchDateRank = debounce((startDate, endDate) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          startDate,
          endDate,
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
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
  onChangeDate = (e) => {
    this.debouncedSearchDateRank(
      moment(e[0]).format(variables.DATE_FORMAT.DATE_AFTER),
      moment(e[1]).format(variables.DATE_FORMAT.DATE_AFTER),
    );
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
        title: 'STT',
        key: 'name',
        width: 80,
        className: 'min-width-80',
        render: (value, _, index) => {
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  <>
                    {value?.name}
                  </> : <> {Helper.serialOrder(search?.page, index, search?.limit)}</>
                }
              </div>
            ),
            props: {},
          };
          if (value?.children && value?.name) {
            obj.props.colSpan = 12;
          }
          return obj;
        },
      },
      {
        title: 'Mã NV',
        key: 'birthDay',
        width: 100,
        className: 'min-width-100',
        render: (value) => {
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  "" : <>{value?.employeeCode}</>
                }
              </div>
            ),
            props: {},
          };
          if (value?.children && value?.name) {
            obj.props.colSpan = 0;
          } else {
            obj.props.colSpan = 1;
          }
          return obj;
        },
      },
      {
        title: 'Tên NV',
        key: 'birthDay',
        width: 250,
        className: 'min-width-250',
        render: (value) => {
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  "" : <>{value?.employeeName}</>
                }
              </div>
            ),
            props: {},
          };
          if (value?.children && value?.name) {
            obj.props.colSpan = 0;
          } else {
            obj.props.colSpan = 1;
          }
          return obj;
        },
      },
      {
        title: 'Chức vụ',
        key: 'birthDay',
        width: 250,
        className: 'min-width-250',
        render: (value) => {
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  "" : <>{value?.position}</>
                }
              </div>
            ),
            props: {},
          };
          if (value?.children && value?.name) {
            obj.props.colSpan = 0;
          } else {
            obj.props.colSpan = 1;
          }
          return obj;
        },
      },
      {
        title: 'Cơ sở',
        key: 'birthDay',
        width: 250,
        className: 'min-width-250',
        render: (value) => {
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  "" : <>{value?.branch}</>
                }
              </div>
            ),
            props: {},
          };
          if (value?.children && value?.name) {
            obj.props.colSpan = 0;
          } else {
            obj.props.colSpan = 1;
          }
          return obj;
        },
      },
      {
        title: 'Bộ phận',
        key: 'birthDay',
        width: 250,
        className: 'min-width-250',
        render: (value) => {
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  "" : <>{value?.division}</>
                }
              </div>
            ),
            props: {},
          };
          if (value?.children && value?.name) {
            obj.props.colSpan = 0;
          } else {
            obj.props.colSpan = 1;
          }
          return obj;
        },
      },
      {
        title: 'Ngày QĐ thôi việc',
        width: 250,
        className: 'min-width-250',
        render: (value) => {
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  "" : <>{Helper.getDate(get(value, 'decisionDate'), variables.DATE_FORMAT.DATE)}</>
                }
              </div>
            ),
            props: {},
          };
          if (value?.children && value?.name) {
            obj.props.colSpan = 0;
          } else {
            obj.props.colSpan = 1;
          }
          return obj;
        },
      },
      {
        title: 'Số QĐ thôi việc',
        width: 250,
        className: 'min-width-250',
        render: (value) => {
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  "" : <>{get(value, 'decisionNumber')}</>
                }
              </div>
            ),
            props: {},
          };
          if (value?.children && value?.name) {
            obj.props.colSpan = 0;
          } else {
            obj.props.colSpan = 1;
          }
          return obj;
        },
      },
      {
        title: 'Ngày thôi việc',
        width: 250,
        className: 'min-width-250',
        render: (value) => {
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  "" : <>{ Helper.getDate(get(value, 'timeApply'), variables.DATE_FORMAT.DATE)}</>
                }
              </div>
            ),
            props: {},
          };
          if (value?.children && value?.name) {
            obj.props.colSpan = 0;
          } else {
            obj.props.colSpan = 1;
          }
          return obj;
        },
      },
      {
        title: 'Ngày kết thúc thanh toán lương',
        width: 250,
        className: 'min-width-250',
        render: (value) => {
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  "" : <>{Helper.getDate(get(value, 'payEndDate'), variables.DATE_FORMAT.DATE)}</>
                }
              </div>
            ),
            props: {},
          };
          if (value?.children && value?.name) {
            obj.props.colSpan = 0;
          } else {
            obj.props.colSpan = 1;
          }
          return obj;
        },
      },
      {
        title: 'Lý do',
        width: 250,
        className: 'min-width-250',
        render: (value) => {
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  "" : <>{value?.reason}</>
                }
              </div>
            ),
            props: {},
          };
          if (value?.children && value?.name) {
            obj.props.colSpan = 0;
          } else {
            obj.props.colSpan = 1;
          }
          return obj;
        },
      },
      {
        title: 'Ghi chú',
        width: 250,
        className: 'min-width-250',
        render: (value) => {
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  "" : <>{get(value, 'note')}</>
                }
              </div>
            ),
            props: {},
          };
          if (value?.children && value?.name) {
            obj.props.colSpan = 0;
          } else {
            obj.props.colSpan = 1;
          }
          return obj;
        },
      },
    ];
    return columns;
  };

  handleCancel = () => this.setStateData({ visible: false });

  render() {
    const {
      data,
      error,
      divisions,
      branches,
      pagination,
      positions,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search, } = this.state;
    const loading = effects['medicalStudentProblem/GET_DATA'];
    return (
      <>
        <Helmet title="Báo cáo danh sách nhân viên thôi việc" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Báo cáo danh sách nhân viên thôi việc</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                branchId: search.branchId || null,
                classId: search.classId || null,
                SearchDate: search.SearchDate && moment(search.SearchDate) || null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeDate(event, 'date')}
                    type={variables.RANGE_PICKER}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                    name="branchId"
                    onChange={(event) => this.onChangeSelect(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Chọn tất cả bộ phận' }, ...divisions]}
                    name="divisionId"
                    placeholder="Chọn bộ phận"
                    onChange={(event) => this.onChangeSelect(event, 'divisionId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, fullName: 'Chọn tất cả nhân viên' }, ...positions]}
                    name="employeeId"
                    options={['id', 'fullName']}
                    placeholder="Chọn nhân viên"
                    onChange={(event) => this.onChangeSelect(event, 'employeeId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
              </div>
            </Form>
            <div className={stylesModule['wrapper-table']}>
              <Table
                columns={this.header(params)}
                dataSource={data}
                loading={loading}
                error={error}
                isError={error.isError}
                defaultExpandAllRows
                childrenColumnName="children"
                bordered
                pagination={this.pagination(pagination)}
                params={{
                  header: this.header(),
                  type: 'table',
                }}
                rowKey={(record) => record?.name || record?.id}
                scroll={{ x: '100%', y: '60vh' }}
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
  branches: PropTypes.arrayOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  divisions: PropTypes.arrayOf(PropTypes.any),
  positions: PropTypes.arrayOf(PropTypes.any),
  defaultBranch: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  branches: [],
  error: {},
  divisions: [],
  positions: [],
  defaultBranch: {},
};

export default Index;