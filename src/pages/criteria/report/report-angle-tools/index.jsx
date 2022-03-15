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
import AvatarTable from '@/components/CommonComponent/AvatarTable';
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
const mapStateToProps = ({ medicalStudentProblem, loading, user, reportAngleTools }) => ({
  loading,
  data: reportAngleTools.data,
  toolGroups: reportAngleTools.toolGroups,
  toolDetails: reportAngleTools.toolDetails,
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
        studentName: query?.studentName,
        branchId: query?.branchId || defaultBranch?.id,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        SearchDate: query.SearchDate ? moment(query.SearchDate) : '',
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
      type: 'reportAngleTools/GET_DATA',
      payload: {
        ...search,
      },
    });
    this.props.dispatch({
      type: 'reportAngleTools/GET_TOOL_GROUPS',
      payload: {
        ...search,
      },
    });
    this.props.dispatch({
      type: 'reportAngleTools/GET_TOOL_DETAILS',
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
    const columns = [
      {
        title: 'Họ và tên',
        key: 'name',
        width: 250,
        render: (value) => {
          const count = value?.children?.length + 1;
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  <Text size="normal">{value?.student?.fullName}</Text> : ""
                }
                {value?.branch ?
                  <Text size="normal">{value?.branch?.name}</Text> : ""
                }
                {value?.class ?
                  <Text size="normal">{value?.class?.name}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.class || value?.branch) {
            obj.props.rowSpan = 1;
            obj.props.colSpan = 1;
          }
          else if (value?.student?.fullName && value?.children) {
            obj.props.rowSpan = count;
          }
          else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Cơ sở',
        key: 'name',
        width: 250,
        render: (value) => {
          const count = value?.children?.length + 1;
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  <Text size="normal">{value?.student?.class?.branch?.name}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.class || value?.branch) {
            obj.props.rowSpan = 1;
            obj.props.colSpan = 1;
          }
          else if (value?.student?.fullName && value?.children) {
            obj.props.rowSpan = count;
          }
          else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Lớp',
        key: 'name',
        width: 250,
        render: (value) => {
          const count = value?.children?.length + 1;
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  <Text size="normal">{value?.student?.class?.name}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.class || value?.branch) {
            obj.props.rowSpan = 1;
            obj.props.colSpan = 1;
          }
          else if (value?.student?.fullName && value?.children) {
            obj.props.rowSpan = count;
          }
          else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Góc giáo cụ',
        key: 'name',
        width: 250,
        render: (value) => {
          const count = value?.children?.length + 1;
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.children ?
                  <Text size="normal">{value?.toolGroup?.name}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.class || value?.branch) {
            obj.props.rowSpan = 1;
            obj.props.colSpan = 1;
          }
          else if (value?.student?.fullName && value?.children) {
            obj.props.rowSpan = count;
          }
          else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Ý nghĩa cuộc sống',
        key: 'name',
        width: 250,
        render: (value) => {
          const count = value?.children?.length + 1;
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{value?.toolGroup?.meanOfLife}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.class || value?.branch) {
            obj.props.rowSpan = 1;
            obj.props.colSpan = 1;
          }
          else if (value?.student?.fullName && value?.children) {
            obj.props.rowSpan = count;
          }
          else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Ngày học giáo cụ',
        key: 'name',
        width: 250,
        render: (value) => {
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{Helper.getDate(value?.reportDate)}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.curriculumReviewGroupByToolGroups) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Thời gian',
        key: 'name',
        width: 250,
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{value?.totalMinutes}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.curriculumReviewGroupByToolGroups) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Giáo cụ',
        key: 'name',
        width: 250,
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{value?.toolDetail?.name}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.curriculumReviewGroupByToolGroups) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Hình ảnh giáo cụ',
        key: 'name',
        width: 250,
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value?.toolDetail ?
                  <AvatarTable
                    fileImage={Helper.getPathAvatarJson(value?.toolDetail?.fileUrl)}
                  />
                  : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.curriculumReviewGroupByToolGroups) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Nội dung giáo cụ',
        key: 'name',
        width: 250,
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value && !value?.children ?
                  <Text size="normal">{value?.toolDetail?.content}</Text>
                  : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.curriculumReviewGroupByToolGroups) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Ý nghĩa giáo cụ',
        key: 'name',
        width: 250,
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{value?.toolDetail?.meanOfLife}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.curriculumReviewGroupByToolGroups) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Kỹ năng đạt được',
        key: 'name',
        width: 250,
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{value?.toolDetail?.skillGained}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.curriculumReviewGroupByToolGroups) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Cấp độ',
        key: 'name',
        width: 250,
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{value?.level}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.curriculumReviewGroupByToolGroups) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Diễn giải cấp độ',
        key: 'name',
        width: 250,
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{value?.levelContent}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.curriculumReviewGroupByToolGroups) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Thời kỳ nhạy cảm',
        key: 'name',
        width: 250,
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{value?.sensitivePeriod?.name}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.curriculumReviewGroupByToolGroups) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Diễn giải thời kỳ nhạy cảm',
        key: 'name',
        width: 250,
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{value?.sensitivePeriod?.explaination}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.curriculumReviewGroupByToolGroups) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Tham gia của phụ huynh',
        key: 'name',
        width: 250,
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{value?.sensitivePeriod?.parentInvolvement}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.curriculumReviewGroupByToolGroups) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Nhận xét của giáo viên',
        key: 'name',
        width: 250,
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{value?.reviewOfTeacher}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.curriculumReviewGroupByToolGroups) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
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
      `/curriculum-reviews/export-excel/group-by-branch`,
      {
        studentName: query?.studentName,
        Class: query?.Class,
        ToolGroupId: query?.ToolGroupId,
        ToolDetailId: query?.ToolDetailId,
        branchId: query?.branchId || defaultBranch?.id,
        FromDate: dataIDSearch ? 
          moment(dataIDSearch[0]).format(variables.DATE_FORMAT.DATE_AFTER)
        : "",
        ToDate: dataIDSearch ? 
        moment(dataIDSearch[1]).format(variables.DATE_FORMAT.DATE_AFTER)
         : "",
      },
      `Baocaoquantrihocsinhtheogocgiaocu.xlsx`,
    );
  };

  render() {
    const {
      data,
      error,
      classes,
      branches,
      toolDetails,
      toolGroups,
      pagination,
      defaultBranch,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search, defaultBranchs } = this.state;
    const loading = effects['medicalStudentProblem/GET_DATA'];
    return (
      <>
        <Helmet title="Báo cáo quản trị học sinh theo góc giáo cụ" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Báo cáo quản trị học sinh theo góc giáo cụ</Text>
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
                <div className="col-lg-2">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeDate(event, 'date')}
                    type={variables.RANGE_PICKER}
                    allowClear={false}
                  />
                </div>
                {!defaultBranch?.id && (
                  <div className="col-lg-2">
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
                  <div className="col-lg-2">
                    <FormItem
                      data={defaultBranchs}
                      name="branchId"
                      onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                      type={variables.SELECT}
                      allowClear={false}
                    />
                  </div>
                )}
                <div className="col-lg-2">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả lớp' }, ...classes]}
                    name="ClassId"
                    onChange={(event) => this.onChangeSelect(event, 'ClassId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-2">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả góc giáo cụ' }, ...toolGroups]}
                    name="ToolGroupId"
                    onChange={(event) => this.onChangeSelect(event, 'ToolGroupId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-2">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả giáo cụ' }, ...toolDetails]}
                    name="ToolDetailId"
                    onChange={(event) => this.onChangeSelect(event, 'ToolDetailId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-2">
                  <FormItem
                    name="studentName"
                    onChange={(event) => this.onChange(event, 'studentName')}
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
  toolDetails: PropTypes.arrayOf(PropTypes.any),
  toolGroups: PropTypes.arrayOf(PropTypes.any),
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
  toolDetails: [],
  toolGroups: [],
};

export default Index;
