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
import HelperModules from '../utils/Helper';

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
const mapStateToProps = ({ medicalStudentProblem, loading, user, OPStopStudying }) => ({
  loading,
  data: OPStopStudying.data,
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
        SearchDate: query.SearchDate
          ? moment(query.SearchDate)
          : '',
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
      type: 'OPStopStudying/GET_DATA',
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

  debouncedSearchDateRank = debounce((From, To) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          From,
          To,
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
        key: 'time',
        className: 'min-width-100',
        width: 100,
        render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
      },
      {
        title: 'Họ và tên học sinh',
        key: 'name',
        width: 250,
        className: 'min-width-250',
        render: (record) => <Text size="normal">{record?.fullName}</Text>,
      },
      {
        title: 'Mã HS',
        key: 'id',
        width: 100,
        render: (record) => <Text size="normal">{record?.code}</Text>,
      },
      {
        title: 'Ngày sinh',
        key: 'birthday',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.birthday}</Text>,
      },
      {
        title: 'Số tháng tuổi',
        key: 'age_month',
        width: 150,
        className: 'min-width-150 ',
        render: (record) => <Text size="normal">{record?.age}</Text>,
      },
      {
        title: 'Giới tính',
        key: 'gender',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.sex === 'FEMALE' ? "Nữ" : 'Nam'}</Text>,
      },
      {
        title: 'Học và tên cha',
        key: 'nameParents',
        className: 'min-width-150',
        width: 250,
        render: (record) => record?.father?.fullName,
      },
      {
        title: 'SĐT cha',
        key: 'phoneParents',
        className: 'min-width-150',
        width: 250,
        render: (record) => record?.father?.phone,
      },
      {
        title: 'Học và tên mẹ',
        key: 'nameM',
        className: 'min-width-150',
        width: 250,
        render: (record) => record?.mother?.fullName,
      },
      {
        title: 'Sđt mẹ',
        key: 'phoneM',
        className: 'min-width-150',
        width: 250,
        render: (record) => record?.mother?.phone,
      },
      {
        title: 'Cơ sở',
        key: 'division',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.class?.branch?.name}</Text>,
      },
      {
        title: 'Lớp',
        key: 'class',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.class?.name}</Text>,
      },
      {
        title: 'Ngày vào lớp',
        key: 'cover_class',
        width: 150,
        className: 'min-width-150',
        render: (value, record) =>
          <Text size="normal">
            {Helper.getDate(record.registerDate, variables.DATE_FORMAT.DATE)}
          </Text>
      },
      {
        title: 'Tình trạng',
        key: 'status',
        className: 'min-width-150',
        width: 150,
        render: (record) => HelperModules.tagStatus(record.status),
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
    const { dataIDSearch } = this.state;
    Helper.exportExcelClover(
      `/students/export-to-excel/with-student-status`,
      {
        KeyWord: query?.KeyWord,
        Class: query?.Class,
        StudentStatus: 'STOP_STUDYING ',
        IsStopStudying: 'false',
        branchId: query?.branchId || defaultBranch?.id,
        From: dataIDSearch ? 
          moment(dataIDSearch[0]).format(variables.DATE_FORMAT.DATE_AFTER)
        : "",
        To: dataIDSearch ? 
        moment(dataIDSearch[1]).format(variables.DATE_FORMAT.DATE_AFTER)
         : "",
      },
      `Danhsachbaocaohocsinhnhaphocchinhthuc.xlsx`,
    );
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
        <Helmet title="Danh sách báo cáo học sinh ngưng học" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh sách báo cáo học sinh ngưng học</Text>
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
                    name="date"
                    onChange={(event) => this.onChangeDate(event, 'date')}
                    type={variables.RANGE_PICKER}
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
