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
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import HelperModules from './utils/Helper';
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
const mapStateToProps = ({ medicalStudentProblem, loading, user, medicalIncidentSituation }) => ({
  loading,
  data: medicalIncidentSituation.data,
  error: medicalStudentProblem.error,
  classes: medicalStudentProblem.classes,
  branches: medicalStudentProblem.branches,
  pagination: medicalStudentProblem.pagination,
  defaultBranch: user.defaultBranch,
  years: medicalStudentProblem.years,
  user: user.user,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      defaultBranch,
      user,
      location: { query },
    } = props;
    this.state = {
      defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
      search: {
        KeyWord: query?.KeyWord,
        schoolYearId: query?.schoolYearId || user?.schoolYear?.id,
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
      type: 'medicalIncidentSituation/GET_DATA',
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
    this.props.dispatch({
      type: 'medicalStudentProblem/GET_YEARS',
      payload: { },
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

  debouncedSearchDateRank = debounce((FromDate, ToDate) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          FromDate,
          ToDate,
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
    const columns = [
      {
        title: 'Thời gian',
        key: 'name',
        width: 300,
        className: 'min-width-300',
        render: (value, record) => {
          if (record?.branch?.name && record?.children) {
            return (
              <Text size="normal">
                {record?.branch?.name}
              </Text>
            );
          }
          if (record?.class?.name && record?.children) {
            return (
              <Text size="normal">
                {record?.class?.name}
              </Text>
            );
          }
          return <Text size="normal">{Helper.getDate(record.creationTime)}</Text>;
        },
      },
      {
        title: 'Học sinh',
        key: 'birthDay',
        width: 250,
        className: 'min-width-250',
        render: (value, record) =>
          <Text size="normal">{record?.student?.fullName}</Text>
      },
      {
        title: 'Cơ sở',
        key: 'birthDay',
        width: 150,
        className: 'min-width-150',
        render: (value, record) => {
          if (record?.branch && record?.children) {
            return "";
          }
          if (record?.class?.name && record?.children) {
            return "";
          }
          return <Text size="normal"> {record?.branch?.name}</Text>;
        }
      },
      {
        title: 'Lớp',
        key: 'birthDay',
        width: 150,
        className: 'min-width-150',
        render: (value, record) => {
          if (record?.branch && record?.children) {
            return "";
          }
          if (record?.class?.name && record?.children) {
            return "";
          }
          return <Text size="normal"> {record?.class?.name}</Text>;
        }
      },
      {
        title: 'Sự cố',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.medicalProblem?.name}</Text>,
      },
      {
        title: 'Vị trí vết thương',
        key: 'InjuryPosition',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.injuryPosition}</Text>,
      },
      {
        title: 'Triệu chứng',
        width: 150,
        key: 'symptom',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.symptom}</Text>,
      },
      {
        title: 'Hình ảnh',
        key: 'fileImage',
        width: 100,
        className: 'min-width-100',
        render: (value, record) => {
          if (record.children) {
            return (
              ""
            );
          }
          return <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.fileImage)}
          />;
        },
      },
      {
        title: 'Nội dung xử lý y tế',
        width: 150,
        key: "handleWay",
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.handleWay}</Text>,
      },
      {
        title: 'Tên giáo viên',
        width: 200,
        key: "teacher.teacher",
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record?.teacher?.name}</Text>,
      },
      {
        title: 'Xác nhận giáo viên',
        width: 150,
        key: "",
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.note}</Text>,
      },
      {
        title: 'Tên NV y tế',
        width: 200,
        key: "handler.fullName",
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record?.handler?.fullName}</Text>,
      },
      {
        title: 'Xác nhận y tế',
        width: 150,
        key: "employeeNote",
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.employeeNote}</Text>,
      },
      {
        title: 'Tên phụ huynh',
        width: 200,
        key: "parent.FullName",
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record?.parent?.fullName}</Text>,
      },
      {
        title: 'Xác nhận phụ huynh',
        width: 200,
        key: "parentReview",
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record?.parentReview}</Text>,
      },
      {
        title: 'Trạng thái xử lý',
        width: 150,
        className: 'min-width-150',
        render: (value, record) => {
          if (record.children) {
            return (
              ""
            );
          }
          return HelperModules.tagStatus(record?.handleStatus);
        },
      },
    ];
    return columns;
  };

  handleCancel = () => this.setStateData({ visible: false });

  render() {
    const {
      data,
      years,
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
        <Helmet title="Báo cáo tình hình sự cố của học sinh" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Báo cáo tình hình sự cố của học sinh</Text>
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
                    name="KeyWord"
                    onChange={(event) => this.onChange(event, 'KeyWord')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
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
                    name="ClassId"
                    onChange={(event) => this.onChangeSelect(event, 'ClassId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
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
                    data={[{ id: null, name: 'Chọn tất cả năm học' }, ...years]}
                    name="schoolYearId"
                    onChange={(event) => this.onChangeSelect(event, 'schoolYearId')}
                    type={variables.SELECT}
                    placeholder="Chọn năm học"
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
                rowKey={(record) =>  record?.id}
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
  classes: PropTypes.arrayOf(PropTypes.any),
  defaultBranch: PropTypes.objectOf(PropTypes.any),
  years :PropTypes.arrayOf(PropTypes.any),
  user:  PropTypes.objectOf(PropTypes.any),
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
  years: [],
  user: {},
};

export default Index;
