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
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import HelperModules from './utils/Helper';

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
const mapStateToProps = ({ medicalStudentProblem, loading, user }) => ({
  loading,
  data: medicalStudentProblem.data,
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
        date: query.date ? moment(query.date) : moment(),
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
      type: 'medicalStudentProblem/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          date: Helper.getDate(search.from, variables.DATE_FORMAT.DATE_AFTER),
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
        key: 'time',
        className: 'min-width-150',
        width: 150,
        render: (record) => (
          <Text size="normal">
            {Helper.getDate(record?.creationTime, variables.DATE_FORMAT.DATE_TIME)}
          </Text>
        ),
      },
      {
        title: 'Học sinh',
        key: 'student.fullName',
        width: 200,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record?.student?.fileImage)}
            fullName={record?.student?.fullName}
          />
        ),
      },
      {
        title: 'Cơ sở',
        key: 'basis',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.student?.class?.branch?.name}</Text>,
      },
      {
        title: 'Lớp',
        key: 'class',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.student?.class?.name}</Text>,
      },
      {
        title: 'Sự cố',
        key: 'medicalProblem.name',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.medicalProblem?.name}</Text>,
      },
      {
        title: 'Vị trí vết thương',
        key: 'injuryPosition',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.injuryPosition}</Text>,
      },
      {
        title: 'Triệu chứng',
        key: 'symptom',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.symptom}</Text>,
      },
      {
        title: 'Hình ảnh',
        key: 'name',
        width: 100,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record?.fileImage)}
          />
        ),
      },
      {
        title: 'Trạng thái',
        key: 'handleStatus',
        className: 'min-width-150',
        width: 150,
        render: (record) => HelperModules.tagStatus(record?.handleStatus),
      },
      {
        title: 'Cách xử lý',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.handleWay}</Text>,
      },
      {
        title: 'Người xử lý',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.handler?.name}</Text>,
      },
    ];
    return columns;
  };

  handleCancel = () => this.setStateData({ visible: false });

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
        <Helmet title="Danh mục học sinh bị sự cố" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh mục học sinh bị sự cố</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                branchId: search.branchId || null,
                classId: search.classId || null,
                date: search.date && moment(search.date),
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
                    name="classId"
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
                    allowClear={false}
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
              childrenColumnName="noColumn"
              bordered
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id || record?.class?.id}
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