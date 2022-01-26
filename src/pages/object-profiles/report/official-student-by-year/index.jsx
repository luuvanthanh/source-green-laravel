import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
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
const mapStateToProps = ({ medicalStudentProblem, loading, user, OPOfficialStudentYear }) => ({
  loading,
  data: OPOfficialStudentYear.data,
  error: medicalStudentProblem.error,
  classes: medicalStudentProblem.classes,
  branches: medicalStudentProblem.branches,
  pagination: medicalStudentProblem.pagination,
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
      defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
      search: {
        KeyWord: query?.KeyWord,
        branchId: query?.branchId || defaultBranch?.id,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        SearchDate: query.SearchDate ? moment(query.SearchDate) : '',
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
      type: 'OPOfficialStudentYear/GET_DATA',
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
      type: 'medicalStudentProblem/GET_BRACHES',
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

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDate = (e, type) => {
    this.debouncedSearch(moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type);
    this.setStateData({ dataIDSearch: e });
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
        key: 'index',
        width: 100,
        render: (value, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
      },
      {
        title: 'Họ và tên',
        key: 'fullName',
        width: 250,
        render: (value, record) => <Text size="normal">{record?.fullName}</Text>,
      },
      {
        title: 'Mã học sinh',
        key: 'code',
        width: 150,
        render: (value, record) => <Text size="normal">{record?.code}</Text>,
      },
      {
        title: 'Ngày sinh',
        key: 'dayOfBirth',
        width: 150,
        render: (value, record) => <Text size="normal">{Helper.getDate(record.dayOfBirth)}</Text>,
      },
      {
        title: 'Số tháng tuổi',
        key: 'age',
        width: 150,
        render: (value, record) => <Text size="normal">{record.age}</Text>,
      },
      {
        title: 'Giới tính',
        key: 'sex',
        width: 150,
        render: (value, record) => (
          <Text size="normal">{record?.sex === 'MALE' ? 'Nam' : 'Nữ'}</Text>
        ),
      },
      {
        title: 'Họ và tên cha',
        key: 'father?.fullName',
        width: 150,
        render: (value, record) => <Text size="normal">{record?.father?.fullName}</Text>,
      },
      {
        title: 'Sđt cha',
        key: 'father?.phone',
        width: 150,
        render: (value, record) => <Text size="normal">{record?.father?.phone}</Text>,
      },
      {
        title: 'Họ và tên mẹ',
        key: 'mother?.fullName',
        width: 150,
        render: (value, record) => <Text size="normal">{record?.mother?.fullName}</Text>,
      },
      {
        title: 'Sđt mẹ',
        key: 'mother?.fullName',
        width: 150,
        render: (value, record) => <Text size="normal">{record?.mother?.fullName}</Text>,
      },
      {
        title: 'Cơ sở',
        key: 'branch?.name',
        width: 150,
        render: (value, record) => <Text size="normal">{record?.branch?.name}</Text>,
      },
      {
        title: 'Lớp',
        key: 'class?.name',
        width: 150,
        render: (value, record) => <Text size="normal">{record?.class?.name}</Text>,
      },
      {
        title: 'Ngày vào lớp',
        key: 'registerDate',
        width: 150,
        render: (value, record) => (
          <Text size="normal">
            {' '}
            {Helper.getDate(record.registerDate, variables.DATE_FORMAT.DATE)}
          </Text>
        ),
      },
      {
        title: 'Năm học',
        key: 'code',
        width: 150,
      },
    ];
    return columns;
  };

  handleCancel = () => this.setStateData({ visible: false });

  onChangeExcel = () => {
    const {
        defaultBranch,
        location: { query },
      } = this.props;
    Helper.exportExcelClover(`/students/export-to-excel/by-condition`, {
        KeyWord: query?.KeyWord,
        branchId: query?.branchId || defaultBranch?.id,
    }, `Baocaothongke.xlsx`);
  };

  render() {
    const {
      data,
      error,
      classes,
      branches,
      pagination,
      defaultBranch,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search, defaultBranchs } = this.state;
    const loading = effects['medicalStudentProblem/GET_DATA'];
    return (
      <>
        <Helmet title="Báo cáo thống kê số lượng học sinh nhập học chính thức theo năm" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">
              Báo cáo thống kê số lượng học sinh nhập học chính thức theo năm
            </Text>
            <Button color="primary" icon="export" className="ml-2" onClick={this.onChangeExcel}>
              Xuất Excel
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                branchId: search.branchId || null,
                Class: search.Class || null,
                SearchDate: (search.SearchDate && moment(search.SearchDate)) || null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả năm học' }]}
                    name="year"
                    onChange={(event) => this.onChangeSelect(event, 'year')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                {!defaultBranch?.id && (
                  <div className="col-lg-3">
                    <FormItem
                      data={[{ id: null, name: 'Tất cả cơ sở ' }, ...branches]}
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
                    data={[{ id: null, name: 'Tất cả lớp' }, ...classes]}
                    name="Class"
                    onChange={(event) => this.onChangeSelect(event, 'Class')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="KeyWord"
                    onChange={(event) => this.onChange(event, 'KeyWord')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
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
                rowKey={(record) => record?.branch?.name || record?.id}
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
  branches: PropTypes.arrayOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
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
  classes: [],
  defaultBranch: {},
};

export default Index;
