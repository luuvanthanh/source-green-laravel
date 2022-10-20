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
import Button from '@/components/CommonComponent/Button';
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
const mapStateToProps = ({ HRMstaffInformation, loading }) => ({
  data: HRMstaffInformation.data,
  pagination: HRMstaffInformation.pagination,
  branches: HRMstaffInformation.branches,
  employees: HRMstaffInformation.employees,
  divisions: HRMstaffInformation.divisions,
  positions: HRMstaffInformation.positions,
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
        ...query,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        fullName: query?.fullName,
        employeeId: query?.employeeId ? query?.employeeId.split(',') : undefined,
        date: query.date ? moment(query.date).format(variables.DATE_FORMAT.DATE_AFTER) : moment().format(variables.DATE_FORMAT.DATE_AFTER),
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
      type: 'HRMstaffInformation/GET_DATA',
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
      type: 'HRMstaffInformation/GET_BRANCHES',
      payload: {},
    });
    dispatch({
      type: 'HRMstaffInformation/GET_DIVISIONS',
      payload: {},
    });
    dispatch({
      type: 'HRMstaffInformation/GET_POSITIONS',
      payload: {},
    });
    dispatch({
      type: 'HRMstaffInformation/GET_EMPLOYEES',
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
    const columns = [
      {
        title: 'STT',
        key: 'text',
        width: 60,
        className: 'min-width-60',
        align: 'center',
        render: (text, record, index) =>
          Helper.sttList(
            this.props.pagination?.current_page,
            index,
            this.props.pagination?.per_page,
          ),
      },
      {
        title: 'Mã NV',
        key: 'index',
        className: 'min-width-100',
        width: 100,
        align: 'center',
        render: (record) => <Text size="normal">{record?.code}</Text>,
      },
      {
        title: 'Tên nhân viên',
        key: 'name',
        className: 'min-width-200',
        width: 200,
        render: (record) => <Text size="normal">{record?.fullName}</Text>,
      },
      {
        title: 'Vị trí làm việc',
        key: 'phoneNumber',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.position}</Text>,
      },
      {
        title: 'Ngày bắt đầu làm việc',
        key: 'division',
        className: 'min-width-200',
        width: 200,
        render: (record) => <Text size="normal">{record?.startDateWorking}</Text>,
      },
      {
        title: 'Thời gian thử việc',
        key: 'position',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.startDateProbationary}</Text>,
      },
      {
        title: 'Thời gian kết thúc thử việc',
        key: 'position',
        className: 'min-width-200',
        width: 200,
        render: (record) => <Text size="normal">{record?.endDateProbationary}</Text>,
      },
      {
        title: 'Ngày kết thúc làm việc',
        key: 'position',
        className: 'min-width-200',
        width: 200,
        render: (record) => <Text size="normal">{record.endDateWorking}</Text>,
      },
      {
        title: 'Thâm niên công tác',
        key: 'position',
        className: 'min-width-200',
        width: 200,
        render: (record) => <Text size="normal">{record?.workingSeniority}</Text>,
      },
      {
        title: 'Giới tính',
        key: 'position',
        className: 'min-width-100',
        width: 100,
        render: (record) => <Text size="normal">{record?.gender}</Text>,
      },
      {
        title: 'Ngày sinh',
        key: 'position',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record.dateOfBirth}</Text>,
      },

      {
        title: 'Nơi sinh',
        key: 'position',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.placeOfBirth}</Text>,
      },
      {
        title: 'Số CMND',
        key: 'idCard',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.idCard}</Text>,
      },
      {
        title: 'Ngày cấp',
        key: 'dateOfIssueIdCard',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.dateOfIssueIdCard}</Text>,
      },
      {
        title: 'Nơi cấp',
        key: 'placeOfIssueIdCard',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record.placeOfIssueIdCard}</Text>,
      },
      {
        title: 'Địa chỉ thường trú',
        key: 'permanentAddress',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.permanentAddress}</Text>,
      },
      {
        title: 'Địa chỉ hiện tại',
        key: 'address',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.address}</Text>,
      },
      {
        title: 'Điện thoại',
        key: 'phoneNumber',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.phoneNumber}</Text>,
      },
      {
        title: 'Người phụ thuộc',
        key: 'numberDependentPerson',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.numberDependentPerson}</Text>,
      },
      {
        title: 'Mã số thuế',
        key: 'taxCode',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.taxCode}</Text>,
      },
      {
        title: 'Sổ BHXH',
        key: 'numberSocialInsurance',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.numberSocialInsurance}</Text>,
      },
      {
        title: 'Nơi đăng ký khám bệnh',
        key: 'medicalTreatmentPlace',
        className: 'min-width-200',
        width: 200,
        render: (record) => <Text size="normal">{record?.medicalTreatmentPlace}</Text>,
      },
      {
        title: 'Mã bệnh viện',
        key: 'hospitalCode',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.hospitalCode}</Text>,
      },

      {
        title: 'Email',
        key: 'email',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.email}</Text>,
      },
      {
        title: 'STK ngân hàng',
        key: 'bankNumberOfAccount',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.bankNumberOfAccount}</Text>,
      },
      {
        title: 'Tên người thụ hưởng',
        key: 'beneficiaryName',
        className: 'min-width-200',
        width: 200,
        render: (record) => <Text size="normal">{record?.beneficiaryName}</Text>,
      },
      {
        title: 'Tên ngân hàng',
        key: 'bankName',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.bankName}</Text>,
      },

      {
        title: 'Loại hợp đồng',
        key: 'typeOfContract',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.typeOfContract}</Text>,
      },
      {
        title: 'Ngày bắt đầu HĐ',
        key: 'startDateContract',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.startDateContract}</Text>,
      },
      {
        title: 'Họ và tên vợ/chồng',
        key: 'spouse',
        className: 'min-width-200',
        width: 200,
        render: (record) => <Text size="normal">{record?.spouse}</Text>,
      },
      {
        title: 'Họ và tên con',
        key: 'children',
        className: 'min-width-200',
        width: 200,
        render: (record) => <Text size="normal">{record?.children}</Text>,
      },
      {
        title: 'Số điện thoại liên hệ',
        key: 'phoneNumberContact',
        className: 'min-width-200',
        width: 200,
        render: (record) => <Text size="normal">{record?.phoneNumberContact}</Text>,
      },
    ];
    return columns;
  };

  onChangeExcel = () => {
    const { search } = this.state;
    Helper.exportExcel(
      `/v1/export-excel-report-employee-info`,
      {
        ...search,
      },
      `Baocaohosocanbonhanvien.xlsx`,
    );
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
    } = this.props;

    const { search } = this.state;
    const loading = effects['HRMstaffInformation/GET_DATA'];
    return (
      <>
        <Helmet title="Báo cáo hồ sơ nhân viên" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Báo cáo hồ sơ nhân viên</Text>
            <Button color="primary" icon="export" className="ml-2" onClick={this.onChangeExcel} >
              Xuất Excel
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                positionId: search.positionId || null,
                divisionId: search.divisionId || null,
                branchId: search.branchId || null,
                date: search.date && moment(search.date) || null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
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
                <div className="col-lg-3">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeDate(event, 'date')}
                    type={variables.DATE_PICKER}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-12">
                  <FormItem
                    data={Helper.convertSelectUsers(employees)}
                    name="employeeId"
                    onChange={(event) => this.onChangeSelect(event, 'employeeId')}
                    type={variables.SELECT_MUTILPLE}
                    placeholder="Chọn tất cả nhân viên"
                  />
                </div>
              </div>
            </Form>
            <Table
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              pagination={this.pagination(pagination)}
              childrenColumnName="test"
              params={{
                header: this.header(),
                type: 'table',
              }}
              bordered={false}
              rowKey={(record) => record.fullName}
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
};

export default Index;
