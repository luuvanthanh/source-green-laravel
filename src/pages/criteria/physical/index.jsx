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
const mapStateToProps = ({ criteriaPhysical, loading, user }) => ({
  loading,
  data: criteriaPhysical.data,
  error: criteriaPhysical.error,
  classes: criteriaPhysical.classes,
  branches: criteriaPhysical.branches,
  pagination: criteriaPhysical.pagination,
  students: criteriaPhysical.students,
  subject: criteriaPhysical.subject,
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
        BranchId: query?.BranchId || defaultBranch?.id,
        StudentId: query?.StudentId,
        ClassId: query?.ClassId,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        TimetableActivityDetailId: null,
        FromDate: query?.FromDate,
        ToDate: query?.ToDate,
        date: query?.FromDate &&
          query?.ToDate && [
            moment(query?.FromDate),
            moment(query?.ToDate),
          ],
      },
      loadData: false,
    };
    setIsMounted(true);
  }

  componentDidMount() {
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
      subject,
    } = this.props;
    const idSubject = subject?.find(i => i?.name === "Thể chất");
    this.props.dispatch({
      type: 'criteriaPhysical/GET_DATA',
      payload: {
        BranchId: search?.BranchId,
        StudentId: search?.StudentId,
        ClassId: search?.ClassId,
        page: search?.page || variables.PAGINATION.PAGE,
        limit: search?.limit || variables.PAGINATION.PAGE_SIZE,
        FromDate: search?.FromDate,
        ToDate: search?.ToDate,
        TimetableActivityDetailId: idSubject?.id,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          BranchId: search?.BranchId,
          StudentId: search?.StudentId,
          ClassId: search?.ClassId,
          page: search?.page || variables.PAGINATION.PAGE,
          limit: search?.limit || variables.PAGINATION.PAGE_SIZE,
          FromDate: search?.FromDate,
          ToDate: search?.ToDate,
          TimetableActivityDetailId: idSubject?.id,
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
    if (search?.BranchId) {
      dispatch({
        type: 'criteriaPhysical/GET_CLASSES',
        payload: {
          branch: search?.BranchId,
        },
      });
    }
    if (search?.ClassId) {
      dispatch({
        type: 'criteriaPhysical/GET_STUDENTS',
        payload: {
          classStatus: search?.ClassId,
        },
      });
    }
    dispatch({
      type: 'criteriaPhysical/GET_BRANCHES',
      payload: {},
    });
    dispatch({
      type: 'criteriaPhysical/GET_SUBJECT',
      payload: {},
      callback: (res) => {
        if (res) {
          if (search?.BranchId && search?.StudentId && search?.ClassId && res?.length > 0) {
            this.setStateData({ loadData: true });
            const idSubject = res?.find(i => i?.name === "Thể chất");
            this.props.dispatch({
              type: 'criteriaPhysical/GET_DATA',
              payload: {
                BranchId: search?.BranchId,
                StudentId: search?.StudentId,
                ClassId: search?.ClassId,
                page: search?.page || variables.PAGINATION.PAGE,
                limit: search?.limit || variables.PAGINATION.PAGE_SIZE,
                FromDate: search?.FromDate,
                ToDate: search?.ToDate,
                TimetableActivityDetailId: idSubject?.id,
              },
            });
          }
        }
      }
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
      type: 'criteriaPhysical/GET_CLASSES',
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
    const columns = [
      {
        title: 'Ngày',
        key: 'birthDay',
        width: 150,
        render: (value, record) => {
          if (record?.children) {
            return <Text size="normal">{Helper.getDate(record.date)}</Text>;
          }
          return "";
        },
      },
      {
        title: 'Giờ',
        key: 'name',
        width: 150,
        render: (value, record) => {
          if (record?.children) {
            return "";
          }
          return <Text size="normal">{record?.timetableDetail?.startTime} - {record?.timetableDetail?.endTime}</Text>;
        },
      },
      {
        title: 'Bài học',
        key: 'name',
        width: 150,
        render: (value, record) => {
          if (record?.children) {
            return "";
          }
          return <Text size="normal">{record?.timetableActivityDetail?.name}</Text>;
        },
      },
      {
        title: 'Giáo viên đánh giá',
        key: 'name',
        width: 150,
        render: (value, record) => {
          if (record?.children) {
            return "";
          }
          return "";
        },
      },
      {
        title: 'Năng lực nhận thức',
        key: 'name',
        width: 150,
        render: (value, record) => {
          if (record?.children) {
            return "";
          }
          return <Text size="normal">{record?.awareAbility}</Text>;
        },
      },
      {
        title: 'Năng lực vận động',
        key: 'name',
        width: 150,
        render: (value, record) => {
          if (record?.children) {
            return "";
          }
          return <Text size="normal">{record?.movingAbility}</Text>;
        },
      },
      {
        title: 'Tình huống trẻ',
        key: 'name',
        width: 150,
        render: (value, record) => {
          if (record?.children) {
            return "";
          }
          return <Text size="normal">{record?.situation}</Text>;
        },
      },
      {
        title: 'Mức độ hứng thú buổi học',
        key: 'name',
        width: 200,
        render: (value, record) => {
          if (record?.children) {
            return "";
          }
          return <Text size="normal">{record?.excitementLevel}</Text>;
        },
      },
    ];
    return columns;
  };

  handleCancel = () => this.setStateData({ visible: false });

  onChangeSelectBranch = (e) => {
    this.setState(
      (prevState) => ({
        search: {
          ...prevState.search,
          BranchId: e
        },
      }),
    );
    const { dispatch } = this.props;
    dispatch({
      type: 'criteriaPhysical/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
  };

  onChangeSelect = (e) => {
    this.setState(
      (prevState) => ({
        search: {
          ...prevState.search,
          ClassId: e
        },
      }),
    );
    const { dispatch } = this.props;
    dispatch({
      type: 'criteriaPhysical/GET_STUDENTS',
      payload: {
        class: e,
        classStatus: 'HAS_CLASS',
      },
    });
  };

  onChangeStudents = (e) => {
    this.setState(
      (prevState) => ({
        search: {
          ...prevState.search,
          StudentId: e
        },
      }),
    );
  };

  onChangeDate = (e) => {
    this.setStateData({ loadData: true });
    this.setState(
      (prevState) => ({
        search: {
          ...prevState.search,
          FromDate: moment(e[0]).format(variables.DATE_FORMAT.DATE_AFTER),
          ToDate: moment(e[1]).format(variables.DATE_FORMAT.DATE_AFTER),
        },
      }),
    );
  };

  onChangeData = () => {
    this.onLoad();
  };

  render() {
    const {
      data,
      error,
      classes,
      branches,
      pagination,
      students,
      match: { params },
      loading: { effects },
      defaultBranch,
    } = this.props;
    const { loadData, search, defaultBranchs } = this.state;
    const loading = effects['criteriaPhysical/GET_DATA'];
    return (
      <>
        <Helmet title="Thể chất" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Thể chất</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <div className="card">
              <Form layout="vertical" initialValues={{
                ...search,
                branchId: search.branchId || null,
                Class: search.Class || null,
                SearchDate: (search.SearchDate && moment(search.SearchDate)) || null,
              }}
                ref={this.formRef}>
                <div className="row">
                  <div className="col-lg-10 d-flex">
                    {!defaultBranch?.id &&
                      (
                        <div className="col-lg-3">
                          <FormItem
                            label="Cơ sở"
                            data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                            name="BranchId"
                            onChange={(event) => this.onChangeSelectBranch(event, 'BranchId')}
                            type={variables.SELECT}
                            placeholder="Chọn cơ sở"
                            allowClear={false}
                          />
                        </div>
                      )
                    }
                    {defaultBranch?.id &&
                      (
                        <div className="col-lg-3">
                          <FormItem
                            label="Cơ sở"
                            data={defaultBranchs}
                            name="BranchId"
                            onChange={(event) => this.onChangeSelectBranch(event, 'BranchId')}
                            type={variables.SELECT}
                            placeholder="Chọn cơ sở"
                            allowClear={false}
                          />
                        </div>
                      )
                    }

                    <div className="col-lg-3">
                      <FormItem
                        label="Lớp"
                        data={[{ id: null, name: 'Chọn tất cả lớp' }, ...classes]}
                        name="ClassId"
                        onChange={(event) => this.onChangeSelect(event, 'ClassId')}
                        type={variables.SELECT}
                        placeholder="Chọn lớp"
                        allowClear={false}
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormItem
                        data={[...students]}
                        options={['id', 'fullName']}
                        label="Học sinh"
                        name="StudentId"
                        onChange={(event) => this.onChangeStudents(event, 'StudentId')}
                        allowClear={false}
                        type={variables.SELECT}
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormItem
                        name="date"
                        label="Thời gian truy xuất"
                        type={variables.RANGE_PICKER}
                        onChange={(event) => this.onChangeDate(event, 'date')}
                        allowClear={false}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 d-flex justify-content-end" style={{ marginTop: '30px' }}>
                    {loadData ? (
                      <Button
                        color="success"
                        icon="report"
                        className="ml-4"
                        onClick={this.onChangeData}
                        style={{ width: 'auto' }}
                        loading={loading}
                      >
                        Tải dữ liệu
                      </Button>
                    ) : (
                      <Button
                        color="success"
                        icon="report"
                        className="ml-4"
                        disabled
                        style={{ width: 'auto' }}
                      >
                        Tải dữ liệu
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            </div>
            <div className={stylesModule['wrapper-table']}>
              <Table
                columns={this.header(params)}
                dataSource={loadData ? data : null}
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
                rowKey={(record) => record?.id}
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
  students: PropTypes.arrayOf(PropTypes.any),
  subject: PropTypes.arrayOf(PropTypes.any),
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
  students: [],
  subject: [],
};

export default Index;
