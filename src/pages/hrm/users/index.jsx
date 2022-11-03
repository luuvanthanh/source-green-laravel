import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { get, debounce } from 'lodash';
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
const mapStateToProps = ({ HRMusers, loading, user }) => ({
  data: HRMusers.data,
  pagination: HRMusers.pagination,
  branches: HRMusers.branches,
  employees: HRMusers.employees,
  divisions: HRMusers.divisions,
  positions: HRMusers.positions,
  defaultBranch: user.defaultBranch,
  loading,
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
      defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
      search: {
        ...query,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        fullName: query?.fullName,
        employeeId: query?.employeeId ? query?.employeeId.split(',') : undefined,
        branchId: query?.branchId || defaultBranch?.id,
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

  /**
   * Function load data
   */
  onLoad = () => {
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'HRMusers/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  };

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'HRMusers/GET_BRANCHES',
      payload: {},
    });
    dispatch({
      type: 'HRMusers/GET_DIVISIONS',
      payload: {},
    });
    dispatch({
      type: 'HRMusers/GET_POSITIONS',
      payload: {},
    });
    dispatch({
      type: 'HRMusers/GET_EMPLOYEES',
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
  header = () => {
    const {
      location: { pathname },
    } = this.props;
    const columns = [
      {
        title: 'Mã ID',
        key: 'index',
        className: 'min-width-70',
        width: 70,
        align: 'center',
        render: (text, record, index) =>
          Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
      },
      {
        title: 'Họ và Tên',
        key: 'name',
        className: 'min-width-200',
        width: 200,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.fileImage)}
            fullName={record.fullName}
          />
        ),
      },
      {
        title: 'Số điện thoại',
        key: 'phoneNumber',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record.phoneNumber}</Text>,
      },
      {
        title: 'Cơ sở',
        key: 'position',
        className: 'min-width-150',
        width: 150,
        render: (record) => (
          <Text size="normal">{get(record, 'positionLevelNow.branch.name')}</Text>
        ),
      },
      {
        title: 'Bộ phận',
        key: 'division',
        className: 'min-width-150',
        width: 150,
        render: (record) => (
          <Text size="normal">{get(record, 'positionLevelNow.division.name')}</Text>
        ),
      },
      {
        title: 'Chức vụ',
        key: 'position',
        className: 'min-width-150',
        width: 150,
        render: (record) => (
          <Text size="normal">{get(record, 'positionLevelNow.position.name')}</Text>
        ),
      },
      {
        key: 'action',
        className: 'min-width-100',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="success"
              ghost
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    return columns;
  };

  render() {
    const {
      data,
      branches,
      employees,
      positions,
      divisions,
      pagination,
      match: { params },
      loading: { effects },
      defaultBranch,
      location: { pathname },
    } = this.props;
    const { search, defaultBranchs } = this.state;
    const loading = effects['HRMusers/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách hồ sơ cán bộ nhân viên" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Nhân viên</Text>
            <Button
              color="success"
              icon="plus"
              onClick={() => history.push(`${pathname}/tao-moi?type=general`)}
            >
              Tạo hồ sơ
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                positionId: search.positionId || null,
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
                    placeholder="Nhập Tên để tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-3">
                  {!defaultBranch?.id && (
                    <FormItem
                      data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                      name="branchId"
                      onChange={(event) => this.onChangeSelect(event, 'branchId')}
                      type={variables.SELECT}
                      allowClear={false}
                    />
                  )}
                  {defaultBranch?.id && (
                    <FormItem
                      data={defaultBranchs}
                      name="branchId"
                      onChange={(event) => this.onChangeSelect(event, 'branchId')}
                      type={variables.SELECT}
                      allowClear={false}
                    />
                  )}
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Chọn tất cả bộ phận' }, ...divisions]}
                    name="divisionId"
                    onChange={(event) => this.onChangeSelect(event, 'divisionId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Chọn tất cả chức vụ' }, ...positions]}
                    name="positionId"
                    onChange={(event) => this.onChangeSelect(event, 'positionId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-12">
                  <FormItem
                    data={Helper.convertSelectUsers(employees)}
                    name="employeeId"
                    onChange={(event) => this.onChangeSelect(event, 'employeeId')}
                    type={variables.SELECT_MUTILPLE}
                    placeholder="Chọn nhân viên"
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
              scroll={{ x: '100%', y: '55vh' }}
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
  positions: PropTypes.arrayOf(PropTypes.any),
  divisions: PropTypes.arrayOf(PropTypes.any),
  employees: PropTypes.arrayOf(PropTypes.any),
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
  positions: [],
  divisions: [],
  employees: [],
  defaultBranch: {},
};

export default Index;
