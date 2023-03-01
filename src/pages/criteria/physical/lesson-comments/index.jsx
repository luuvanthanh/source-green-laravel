import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Tabs } from 'antd';
import classnames from 'classnames';
import { debounce, head, size } from 'lodash';
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
import variablesModules from './utils/variables';
import stylesModule from './styles.module.scss';

const { TabPane } = Tabs;
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
const mapStateToProps = ({ PhysicalLessonComments, loading, user }) => ({
  data: PhysicalLessonComments.data,
  dataNoFeedback: PhysicalLessonComments.dataNoFeedback,
  loading,
  pagination: PhysicalLessonComments.pagination,
  paginationNoFeedback: PhysicalLessonComments.paginationNoFeedback,
  classes: PhysicalLessonComments.classes,
  branches: PhysicalLessonComments.branches,
  assessmentPeriod: PhysicalLessonComments.assessmentPeriod,
  defaultBranch: user.defaultBranch,
  years: PhysicalLessonComments.years,
  dataType: PhysicalLessonComments.dataType,
  user: user.user,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
      defaultBranch,
      user
    } = props;
    this.state = {
      defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
      dataSelected: [],
      summaryStatus: undefined,
      search: {
        keyWord: query?.keyWord,
        branchId: query?.branchId || defaultBranch?.id,
        classId: query?.classId || user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER && head(user?.objectInfo?.classTeachers)?.classId,
        schoolYearId: user?.schoolYear?.id,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        date: query?.date && moment(query?.date).format(variables.DATE_FORMAT.DATE_AFTER) || null,
        status: query?.status || variablesModules.STATUS.NOT_FEEDBACK,
      }
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

  onInitSetSearch = () => {
    const {
      location: { query },
    } = this.props;
    this.setStateData(
      {
        search: {
          keyWord: query?.keyWord,
          branchId: query?.branchId,
          classId: query?.classId,
          page: query?.page || variables.PAGINATION.PAGE,
          limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
          status: query?.status || variablesModules.STATUS.NOT_FEEDBACK,
          date: moment(query?.date).format(variables.DATE_FORMAT.DATE_AFTER) || null
        },
      },
      () => {
        this.onLoad();
        this.formRef.current.resetFields();
      },
    );
  };

  loadCategories = () => {
    const { defaultBranch } = this.props;
    const { search } = this.state;
    if (search.branchId) {
      this.props.dispatch({
        type: 'PhysicalLessonComments/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    if (!defaultBranch?.id) {
      this.props.dispatch({
        type: 'PhysicalLessonComments/GET_BRANCHES',
        payload: {},
      });
    }
    this.props.dispatch({
      type: 'PhysicalLessonComments/GET_YEARS',
      payload: {},
    });
    this.props.dispatch({
      type: 'PhysicalLessonComments/GET_DATA_TYPE',
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

    if (search.status === variablesModules.STATUS.NOT_FEEDBACK &&
      search?.classId && search?.schoolYearId && search?.date
    ) {
      this.props.dispatch({
        type: 'PhysicalLessonComments/GET_DATA_NO_FEEDBACK',
        payload: {
          ...search,
          branchId: undefined,
          status: undefined,
        },
        callback: (response) => {
          if (response?.items) {
            this.props.dispatch({
              type: 'PhysicalLessonComments/GET_SUMMARY_STATUS',
              payload: {
                ...search,
                status: undefined,
                page: undefined,
                limit: undefined
              },
              callback: (response) => {
                if (response) {
                  this.setStateData(
                    (prevState) => ({
                      ...prevState,
                      summaryStatus: response,
                    })
                  );
                }
              },
            });
          }
        }
      });
    }
    if ((search.status === variablesModules.STATUS.DID_FEEDBACK ||
      search.status === variablesModules.STATUS.NOT_APPROVED_FEEDBACK ||
      search.status === variablesModules.STATUS.APPROVED_FEEDBACK) &&
      search?.classId && search?.schoolYearId && search?.date
    ) {
      this.props.dispatch({
        type: 'PhysicalLessonComments/GET_DATA',
        payload: {
          ...search,
          branchId: undefined,
          hasApproved: search.status === variablesModules.STATUS.DID_FEEDBACK,
          status: search?.status === variablesModules.STATUS.APPROVED_FEEDBACK ?
            variablesModules.STATUS.APPROVED_FEEDBACK : variablesModules.STATUS.DID_FEEDBACK
        },
        callback: (response) => {
          if (response?.items) {
            this.props.dispatch({
              type: 'PhysicalLessonComments/GET_SUMMARY_STATUS',
              payload: {
                ...search,
                hasApproved: search.status === variablesModules.STATUS.DID_FEEDBACK,
                status: search?.status === variablesModules.STATUS.APPROVED_FEEDBACK ?
                  variablesModules.STATUS.APPROVED_FEEDBACK : variablesModules.STATUS.DID_FEEDBACK,
                page: undefined,
                limit: undefined
              },
              callback: (response) => {
                if (response) {
                  this.setStateData(
                    (prevState) => ({
                      ...prevState,
                      summaryStatus: response,
                    })
                  );
                }
              },
            });
          }
        }
      });
    }
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
      }),
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
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchStatus = debounce((value, type) => {
    if (value === variablesModules.STATUS.NOT_FEEDBACK) {
      this.setStateData(
        (prevState) =>
        ({
          search: {
            ...prevState.search,
            [`${type}`]: value,
            status: value,
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
          },
        }),
        () => this.onLoad(),
      );
    }
    if (value === variablesModules.STATUS.DID_FEEDBACK ||
      value === variablesModules.STATUS.NOT_APPROVED_FEEDBACK ||
      value === variablesModules.STATUS.APPROVED_FEEDBACK) {
      this.setStateData(
        (prevState) => ({
          search: {
            ...prevState.search,
            schoolYearId: prevState?.search?.schoolYearId,
            status: value,
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
          },
        }),
        () => this.onLoad(),
      );
    }
  }, 200);

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
   *
   */

  onChangeSelect = (e, type) => {
    this.setState(
      (prevState) => ({
        search: {
          ...prevState.search,
        },
      }),
    );
    this.debouncedSearch(e, type);
  };

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectBranch = (e, type) => {
    this.debouncedSearch(e, type);
    this.props.dispatch({
      type: 'PhysicalLessonComments/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
    this.setState(
      (prevState) => ({
        search: {
          ...prevState.search,
          classId: undefined,
          date: undefined,
        },
      }),
    );
    this.formRef.current.setFieldsValue({ classId: undefined, date: undefined });
  };

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectStatus = (e, type) => {
    this.debouncedSearchStatus(e, type);
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

  renderActions = (record) => {
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    return (<>
      {
        (search?.status === variablesModules.STATUS.NOT_FEEDBACK || search?.status === variablesModules.STATUS.NOT_APPROVED_FEEDBACK) && (
          <Button
            icon="edit"
            className={stylesModule.edit}
            onClick={(e) => {
              e.stopPropagation();
              if (search?.status === variablesModules.STATUS.NOT_FEEDBACK) {
                history.push(`${pathname}/${record.id}/add?type=${search?.status}&studentId=${record?.student?.id}&physicalStudyProgramSessionId=${record?.physicalStudyProgramSessionId}&classId=${record?.class?.id}&schoolYearId=${search?.schoolYearId}&date=${search?.date}`);
              }
              if (search?.status === variablesModules.STATUS.NOT_APPROVED_FEEDBACK) {
                history.push(`${pathname}/${record.id}/add?type=${search?.status}`);
              }
            }}
          />
        )
      }
      {
        search?.status === variablesModules.STATUS.NOT_APPROVED_FEEDBACK && (
          <Button
            icon="checkmark"
            className={stylesModule.edit}
            onClick={(e) => { e.stopPropagation(); this.onApproveFeedback(record?.id); }}
          />
        )
      }
      {
        search?.status === variablesModules.STATUS.APPROVED_FEEDBACK && (
          <Button
            icon="excel"
            className={stylesModule.edit}
            onClick={(e) => { e.stopPropagation(); history.push(`${pathname}/${record.id}/detail?type=${search?.status}`); }}
          />
        )
      }
    </>);
  };

  header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'stt',
        width: 60,
        align: 'center',
        render: (text, record, index) =>
          Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
      },
      {
        title: 'Cơ sở',
        key: 'branch',
        width: 200,
        className: 'min-width-200',
        render: (record) => record?.branch?.name || record?.class?.branch?.name,
      },
      {
        title: 'Lớp',
        key: 'class',
        width: 200,
        className: 'min-width-200',
        render: (record) => record?.class?.name,
      },
      {
        title: 'Học sinh',
        key: 'student',
        className: 'min-width-150',
        width: 200,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record?.student?.fileImage)}
            fullName={record?.student?.fullName}
          />
        ),
      },
      ...(this?.state?.search?.status !== variablesModules.STATUS.NOT_FEEDBACK ?
        [{
          title: 'Ngày nhận xét',
          key: 'commentdate',
          className: 'min-width-200',
          width: 200,
          render: (record) => Helper.getDate(record?.joinedDate, variables.DATE_FORMAT.DATE)
        }] : []),
      ...(this?.state?.search?.status === variablesModules.STATUS.DID_FEEDBACK ?
        [{
          title: 'Thời gian nhận xét',
          key: 'commentdate',
          className: 'min-width-200',
          width: 200,
          render: (record) => Helper.getDate(record?.creationTime, variables.DATE_FORMAT.DATE_TIME)
        }] : []),
      ...(this?.state?.search?.status === variablesModules.STATUS.APPROVED_FEEDBACK ?
        [{
          title: 'Thời gian duyệt',
          key: 'browsingtime',
          className: 'min-width-200',
          width: 200,
          render: (record) => Helper.getDate(record?.approvedDate, variables.DATE_FORMAT.DATE_TIME)
        },] : []),
      ...(this?.state?.search?.status !== variablesModules.STATUS.DID_FEEDBACK ?
        [{
          key: 'action',
          className: 'min-width-100',
          width: 100,
          fixed: 'right',
          render: (record) => (
            <div className={stylesModule['wraper-container-quarterReport']}>
              <div className={stylesModule['list-button']} >
                {this.renderActions(record)}
              </div>
            </div>
          ),
        }] : [])
    ];
    return columns;
  };

  onSelectChange = (e) => {
    this.setStateData((prevState) => ({
      ...prevState,
      dataSelected: e,
    }));
  };

  onChangeSearch = () => {
    this.onLoad();
  };

  onApproveFeedbacks = (isAll) => {
    this.props.dispatch({
      type: 'PhysicalLessonComments/APPROVE_FEEDBACK',
      payload: {
        isAll,
        listIdApprove: this?.state.dataSelected
      },
      callback: (response) => {
        if (response) {
          this.onLoad();
        }
      },
    });
  }

  onApproveFeedback = (id) => {
    this.props.dispatch({
      type: 'PhysicalLessonComments/APPROVE_FEEDBACK',
      payload: {
        listIdApprove: [id]
      },
      callback: (response) => {
        if (response) {
          this.onLoad();
        }
      },
    });
  }

  render() {
    const {
      data,
      dataNoFeedback,
      classes,
      branches,
      pagination,
      paginationNoFeedback,
      defaultBranch,
      match: { params },
      location: { pathname },
      loading: { effects },
      years,
      user,
    } = this.props;
    const rowSelection = {
      onChange: this.onSelectChange
    };
    const { search, defaultBranchs, summaryStatus } = this.state;
    const loading = effects['PhysicalLessonComments/GET_DATA'];
    return (
      <>
        <Helmet title="Nhận xét tiết học" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Nhận xét tiết học</Text>
            {
              search?.status === variablesModules.STATUS.NOT_APPROVED_FEEDBACK && (
                <div className='d-flex'>
                  <Button
                    disabled={!size(this?.state?.dataSelected)}
                    color="primary"
                    icon="accept"
                    className="ml-2"
                    loading={effects['PhysicalLessonComments/APPROVE_FEEDBACK']}
                    onClick={() => this.onApproveFeedbacks()}>
                    Duyệt nhận xét đã chọn
                  </Button>
                  <Button
                    color="success"
                    icon="accept"
                    className="ml-2"
                    loading={effects['PhysicalLessonComments/APPROVE_FEEDBACK']}
                    disabled={!size(data)}
                    onClick={() => this.onApproveFeedbacks(true)}
                  >
                    Duyệt tất cả
                  </Button>
                </div>
              )
            }
          </div>
          <div className={classnames(styles['block-table'], styles['block-table-tab'], 'pt20')}>
            <Form
              initialValues={{
                ...search,
                date: search?.date && moment(search?.date),
                branchId: search.branchId || null,
                classId: search.classId || null
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-2">
                  <FormItem
                    data={[...years]?.filter(i => i?.id === user?.schoolYear?.id)}
                    name="schoolYearId"
                    type={variables.SELECT}
                    placeholder="Chọn năm học"
                    allowClear={false}
                    disabled
                  />
                </div>
                {!defaultBranch?.id && (
                  <div className="col-lg-2">
                    <FormItem
                      data={[...branches]}
                      name="branchId"
                      placeholder="Chọn cơ sở"
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
                      placeholder="Chọn cơ sở"
                      onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                      type={variables.SELECT}
                      allowClear={false}
                    />
                  </div>
                )}
                <div className="col-lg-2">
                  <FormItem
                    data={[...classes]}
                    name="classId"
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
                    placeholder="Chọn lớp"
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-2">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeDate(event, 'date')}
                    type={variables.DATE_PICKER}
                    allowClear={false}
                    disabledDate={(current) => current && (current < moment(user?.schoolYear?.startDate) || current > moment(user?.schoolYear?.endDate))}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="keyWord"
                    onChange={(event) => this.onChange(event, 'keyWord')}
                    type={variables.INPUT_SEARCH}
                    placeholder="Từ khóa"
                  />
                </div>
              </div>
              <Tabs
                activeKey={search?.status || variablesModules.STATUS.NOT_FEEDBACK}
                onChange={(event) => this.onChangeSelectStatus(event, 'status')}
              >
                {variablesModules.STATUS_TABS_REVIEWS.map((item) => (
                  <TabPane tab={`${item.name} ${summaryStatus ? `(${summaryStatus[item.keySummary]})` : ''}`} key={item.id} />
                ))}
              </Tabs>
            </Form>
            <Table
              bordered={false}
              columns={this.header(params)}
              dataSource={search.status === variablesModules.STATUS.NOT_FEEDBACK ? dataNoFeedback : data}
              loading={loading}
              rowSelection={
                search?.status === variablesModules.STATUS.NOT_APPROVED_FEEDBACK ? { ...rowSelection } : null}
              pagination={this.pagination(search.status === variablesModules.STATUS.NOT_FEEDBACK ? paginationNoFeedback : pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              onRow={(record) => ({
                onClick: () => {
                  if (search.status === variablesModules.STATUS.DID_FEEDBACK) {
                    history.push(`${pathname}/${record?.id}/detail?type=DID_FEEDBACK`);
                  }
                  if (search.status === variablesModules.STATUS.APPROVED_FEEDBACK) {
                    history.push(`${pathname}/${record?.id}/detail?type=APPROVED_FEEDBACK`);
                  }
                },
              })}
              rowKey={(record) => record.id}
              scroll={{ x: '100%', y: '60vh' }}
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
  dataNoFeedback: PropTypes.arrayOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  paginationNoFeedback: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  defaultBranch: PropTypes.objectOf(PropTypes.any),
  years: PropTypes.arrayOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  dataNoFeedback: [],
  pagination: {},
  paginationNoFeedback: {},
  loading: {},
  dispatch: {},
  location: {},
  classes: [],
  branches: [],
  defaultBranch: {},
  years: [],
  user: {},
};

export default Index;
