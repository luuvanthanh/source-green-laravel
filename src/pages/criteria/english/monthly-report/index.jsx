import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Tabs } from 'antd';
import classnames from 'classnames';
import { debounce, head, size, isEmpty } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import ability from '@/utils/ability';

import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
// import HelperModules from './utils/Helper';
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
const mapStateToProps = ({ EnglishMonthlyReport, loading, user }) => ({
  loading,
  pagination: EnglishMonthlyReport.pagination,
  classes: EnglishMonthlyReport.classes,
  branches: EnglishMonthlyReport.branches,
  assessmentPeriod: EnglishMonthlyReport.assessmentPeriod,
  defaultBranch: user.defaultBranch,
  years: EnglishMonthlyReport.years,
  dataType: EnglishMonthlyReport.dataType,
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
      data: [],
      dataYear: user ? user?.schoolYear : {},
      search: {
        key: query?.key,
        branchId: query?.branchId || defaultBranch?.id,
        classId: query?.classId || user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER && head(user?.objectInfo?.classTeachers)?.classId,
        schoolYearId: query?.schoolYearId || user?.schoolYear?.id,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        status: query?.status || head(variablesModules.STATUS_TABS)?.id,
        scriptReviewId: query?.scriptReviewId,
        month: query.month
          ? moment(query.month).format(variables.DATE_FORMAT.DATE_AFTER)
          : moment().startOf('month').format('YYYY-MM-DD'),
      },
      idSent: undefined,
    };
    setIsMounted(true);
  }

  componentDidMount() {
    // this.onLoad();
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
          key: query?.key,
          branchId: query?.branchId,
          classId: query?.classId,
          page: query?.page || variables.PAGINATION.PAGE,
          limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
          status: query?.status || variablesModules.STATUS.PENDING_APPROVED,
          month: moment(query.month) || null
        },
      },
      () => {
        this.onLoad();
        this.formRef.current.resetFields();
      },
    );
  };

  loadCategories = () => {
    const { defaultBranch, location: { query } } = this.props;
    const { search } = this.state;
    if (search.branchId) {
      this.props.dispatch({
        type: 'EnglishMonthlyReport/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    if (!defaultBranch?.id) {
      this.props.dispatch({
        type: 'EnglishMonthlyReport/GET_BRANCHES',
        payload: {},
      });
    }
    this.props.dispatch({
      type: 'EnglishMonthlyReport/GET_YEARS',
      payload: {},
    });
    this.props.dispatch({
      type: 'EnglishMonthlyReport/GET_DATA_TYPE',
      payload: {},
    });
    if (query?.scriptReviewId || (search?.branchId && search?.classId)) {
      this.props.dispatch({
        type: 'EnglishMonthlyReport/GET_ASSESS',
        payload: {
          schoolYearId: search.schoolYearId,
          classId: search.classId,
          branchId: search.branchId,
          type: "QUARTER_REPORT",
        },
        callback: (response) => {
          if (head(response.parsePayload)) {
            this.setStateData({
              dataAssess: response.parsePayload?.map(i => ({
                ...i,
                name: i?.nameAssessmentPeriod?.name,
              })),
            });
          }
        },
      });
    }
    if (search?.branchId && search?.classId && !search?.checkLoad) {
      this.onLoad();
    }
  };

  /**
   * Function load data
   */
  onLoad = () => {
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    const status = search?.status;
    if (!isEmpty(variablesModules.STATUS_TABS)) {
      this.props.dispatch({
        type: 'EnglishMonthlyReport/GET_DATA',
        payload: {
          ...search,
          status: variablesModules.STATUS_SEARCH?.[status],
          nameAssessmentPeriodId: undefined,
          month: search?.status === head(variablesModules.STATUS_TABS)?.id ? undefined : search?.month,

        },
        callback: (response) => {
          if (response) {
            this.setStateData({
              data: response.parsePayload?.map(i => ({
                ...i,
                month: search?.month,
              })),
            });
          }
        },
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
      // () => this.onLoad(),
    );
  }, 300);

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchStatus = debounce((value, type) => {
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
  },);

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchDateRank = debounce((from, to) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          from,
          to,
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
    const {
      years,
    } = this.props;
    if (type === 'schoolYearId') {
      const data = years?.find(i => i.id === e);
      this.setStateData({
        dataYear: data,
      });
      this.setState(
        (prevState) => ({
          search: {
            ...prevState.search,
            from: moment(data?.startDate).format(variables.DATE_FORMAT.DATE_AFTER),
            to: moment(data?.endDate).format(variables.DATE_FORMAT.DATE_AFTER),
          },
        }),
      );
      this.formRef.current.setFieldsValue({ date: [moment(data?.startDate), moment(data?.endDate)], isset_history_care: undefined });
    }
    this.formRef.current.setFieldsValue({ month: undefined });
    this.setState(
      (prevState) => ({
        search: {
          ...prevState.search,
          month: undefined,
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
      type: 'EnglishMonthlyReport/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
    this.setState(
      (prevState) => ({
        search: {
          ...prevState.search,
          classId: undefined,
          month: undefined,
        },
      }),
    );
    this.formRef.current.setFieldsValue({ classId: undefined, month: undefined });
  };

  onChangeSelectAssess = (e) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          scriptReviewId: e,
        },
      }),
    );
    this.setStateData({
      data: [],
    });
  };

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectStatus = (e, type) => {
    const {
      loading: { effects },
    } = this.props;
    const { search } = this.state;
    if (search?.schoolYearId && search?.month && search?.branchId && search?.classId && !(effects['EnglishMonthlyReport/GET_DATA'])) {
      this.debouncedSearchStatus(e, type);
    }
  };

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDate = (e, type) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          checkLoad: true,
        },
      }),
    );
    this.debouncedSearch(moment(e).startOf('month').format('YYYY-MM-DD'), type);
  };

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDateRank = (e) => {
    this.debouncedSearchDateRank(
      moment(e[0]).format(variables.DATE_FORMAT.DATE_AFTER),
      moment(e[1]).format(variables.DATE_FORMAT.DATE_AFTER),
    );
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

  onClickAddReview = (type) => {
    const { data, search } = this.state;
    const { dispatch } = this.props;
    const self = this;
    dispatch({
      type: 'EnglishMonthlyReport/ADD_REVIEW',
      payload: {
        id: data?.filter((item) => item?.isActive)?.map((item) => item.id),
        status: type === 'all' ? true : null,
        schoolYearId: type === 'all' ? search?.schoolYearId : null,
        branchId: type === 'all' ? search?.branchId : null,
        classId: type === 'all' ? search?.classId : null,
      },
      callback: (response) => {
        if (response) {
          self.onLoad();
        }
      },
    });
  };

  onFormEdit = (record) => {
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;

    if (search?.status === 'NOT_REVIEW' && ability.can('WEB_TIENGANH_DANHGIATHANG_CHUADANHGIA_CREATE', 'WEB_TIENGANH_GUIDANHGIATHANG_CHUAGUI_UPDATE')) {
      return (
        <Button
          icon="edit"
          className={stylesModule.edit}
          onClick={(e) => { e.stopPropagation(); history.push(`${pathname}/${record.id}/add?month=${search?.month}`); }}
        />
      );
    }
    if (search?.status === 'NOT_YET_CONFIRM' && ability.can('WEB_TIENGANH_GUIDANHGIATHANG_CHUADUYET_UPDATE', 'WEB_TIENGANH_GUIDANHGIATHANG_CHUADUYET_UPDATE')) {
      return (
        <Button
          icon="edit"
          className={stylesModule.edit}
          onClick={(e) => { e.stopPropagation(); history.push(`${pathname}/${head(record.monthlyComment)?.id}/confirmed`); }}
        />
      );
    }
    return "";
  };

  onFormSent = (record) => {
    const { search, idSent, data } = this.state;
    const {
      loading: { effects }
    } = this.props;
    const dataActive = data?.filter((item) => item.isActive);
    if (effects['EnglishMonthlyReport/ADD_SENT'] && ((record?.id === idSent) || dataActive?.find(i => record?.id === i.id))) {
      return <div className={stylesModule['lds-ring']}><div /><div /><div /><div /></div>;
    }
    if (
      search?.status === variablesModules.STATUS.NOT_YET_CONFIRM &&
      ability.can('WEB_TIENGANH_GUIDANHGIATHANG_CHUADUYET_UPDATE', 'WEB_TIENGANH_GUIDANHGIATHANG_CHUADUYET_UPDATE')
    ) {
      return (
        <Button
          icon="checkmark"
          onClick={(e) => { e.stopPropagation(); this.addSent('one', record); }}
          className={stylesModule.check}
        />
      );
    }
    if (
      search?.status === variablesModules.STATUS.NOT_YET_SEND &&
      ability.can('WEB_TIENGANH_GUIDANHGIATHANG_CHUAGUI_UPDATE', 'WEB_TIENGANH_GUIDANHGIATHANG_CHUAGUI_UPDATE')
    ) {
      return (
        <Button
          icon="checkmark"
          onClick={(e) => { e.stopPropagation(); this.addSent('one', record); }}
          className={stylesModule.check}
        />
      );
    }
    return "";

  };

  addSent = (type, record) => {
    const { search, data } = this.state;
    const {
      user,
    } = this.props;
    this.setStateData(
      {
        idSent: record?.id,
      },);
    if (type === 'one') {
      this.props.dispatch({
        type: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? 'EnglishMonthlyReport/ADD_CONFIRM' : 'EnglishMonthlyReport/ADD_SENT',
        payload: {
          studentId: [record?.id],
          scriptReviewId: head(record?.monthlyComment)?.scriptReviewId,
          id: head(record?.monthlyComment)?.id,
          schoolYearId: search.schoolYearId,
          month: search?.month,
          newStatus: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? 'CONFIRMED' : 'SENT',
          oldStatus: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? "NOT_YET_CONFIRM" : "CONFIRMED",
          teacherManagementId: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? user?.objectInfo?.id : undefined,
          teacherSentId: search?.status === variablesModules.STATUS.NOT_YET_SEND ? user?.objectInfo?.id : undefined,
        },
        callback: (response) => {
          if (response) {
            this.onLoad();
          }
        },
      });
    }
    if (type === 'much') {
      this.props.dispatch({
        type: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? 'EnglishMonthlyReport/ADD_CONFIRMED_ALL' : 'EnglishMonthlyReport/ADD_SENT_ALL',
        payload: {
          studentId: data?.filter(i => i?.isActive)?.map(i => i.id),
          scriptReviewId: data?.filter(i => i?.isActive)?.map(i => head(i.monthlyComment)?.id),
          id: data?.filter(i => i?.isActive)?.map(i => head(i.monthlyComment)?.id),
          schoolYearId: search.schoolYearId,
          month: search?.month,
          newStatus: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? 'CONFIRMED' : 'SENT',
          oldStatus: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? "NOT_YET_CONFIRM" : "CONFIRMED",
          teacherManagementId: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? user?.objectInfo?.id : undefined,
          teacherSentId: search?.status === variablesModules.STATUS.NOT_YET_SEND ? user?.objectInfo?.id : undefined,
        },
        callback: (response) => {
          if (response) {
            this.onLoad();
          }
        },
      });
    }
    if (type === 'allConfirmed') {
      this.props.dispatch({
        type: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? 'EnglishMonthlyReport/ADD_CONFIRMED_ALL' : 'EnglishMonthlyReport/ADD_SENT_ALL',
        payload: {
          studentId: data?.map(i => i.id),
          id: data?.map(i => head(i.monthlyComment)?.id),
          schoolYearId: search.schoolYearId,
          month: search?.month,
          newStatus: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? 'CONFIRMED' : 'SENT',
          oldStatus: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? "NOT_YET_CONFIRM" : "CONFIRMED",
          teacherManagementId: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? user?.objectInfo?.id : undefined,
          teacherSentId: search?.status === variablesModules.STATUS.NOT_YET_SEND ? user?.objectInfo?.id : undefined,
        },
        callback: (response) => {
          if (response) {
            this.onLoad();
          }
        },
      });
    }

    if (type === 'send') {
      this.props.dispatch({
        type: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? 'EnglishMonthlyReport/ADD_CONFIRM' : 'EnglishMonthlyReport/ADD_SENT',
        payload: {
          schoolYearId: search.schoolYearId,
          month: search?.month,
          newStatus: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? 'CONFIRMED' : 'SENT',
          oldStatus: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? "NOT_YET_CONFIRM" : "CONFIRMED",
          teacherManagementId: search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? user?.objectInfo?.id : undefined,
          teacherSentId: search?.status === variablesModules.STATUS.NOT_YET_SEND ? user?.objectInfo?.id : undefined,
        },
        callback: (response) => {
          if (response) {
            this.onLoad();
          }
        },
      });
    }

  };

  reportTime = (value) => {
    const { search } = this.state;
    if (search?.status === variablesModules.STATUS_SEARCH.REVIEWED) {
      return Helper.getDate(head(value?.monthlyComment)?.creationTime, variables.DATE_FORMAT.DATE_TIME);
    }
    if (search?.status === variablesModules.STATUS_SEARCH.NOT_YET_CONFIRM) {
      return Helper.getDate(head(value?.monthlyComment)?.reportTime, variables.DATE_FORMAT.DATE_TIME);
    }
    if (search?.status === variablesModules.STATUS_SEARCH.CONFIRMED) {
      return Helper.getDate(head(value?.monthlyComment)?.confirmationTime, variables.DATE_FORMAT.DATE_TIME);
    }
    if (search?.status === variablesModules.STATUS_SEARCH.NOT_YET_SEND) {
      return Helper.getDate(head(value?.monthlyComment)?.confirmationTime, variables.DATE_FORMAT.DATE_TIME);
    }
    return (
      Helper.getDate(head(value?.monthlyComment)?.lastModificationTime, variables.DATE_FORMAT.DATE_TIME)
    );
  }

  titleTime = () => {
    const { search } = this.state;
    if (search?.status === variablesModules.STATUS.NOT_YET_SEND || search?.status === variablesModules.STATUS.CONFIRMED) {
      return "Confirmation time";
    }
    if (search?.status === variablesModules.STATUS.SENT) {
      return "Send time";
    }
    return "Report time";
  };

  header = () => {

    const { search } = this.state;

    const columns = [
      ...(search?.status === "NOT_REVIEW" ?
        [{
          title: 'NO',
          key: 'text',
          width: 60,
          align: 'center',
          render: (text, record, index) =>
            Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
        },] : []),
      ...(search?.status !== "NOT_REVIEW" ?
        [{
          title: this.titleTime(),
          key: 'text',
          width: 150,
          render: (record) => this.reportTime(record),
        },] : []),
      {
        title: 'Center',
        key: 'email',
        width: 200,
        className: 'min-width-200',
        render: (record) => record?.branch?.name,
      },
      {
        title: 'Class',
        key: 'Class',
        width: 200,
        className: 'min-width-200',
        render: (record) => record?.classes?.name,
      },
      {
        title: 'Student',
        key: 'class',
        className: 'min-width-150',
        width: 200,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record?.fileImage)}
            fullName={record?.fullName}
          />
        ),
      },
      {
        title: 'Monthly comment',
        key: 'Assessment',
        className: 'min-width-200',
        width: 200,
        render: (record) => Helper.getDate(record?.month, variables.DATE_FORMAT.MONTH_FULL_ENGLISH)
      },
      {
        key: 'action',
        className: 'min-width-100',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={stylesModule['wraper-container-monthlyComment']}>
            <div className={stylesModule['list-button']} >
              {this.onFormEdit(record)}
              {this.onFormSent(record)}
            </div>
          </div>
        ),
      },
    ];
    return columns;
  };

  onSelectChange = (e) => {
    this.setStateData((prevState) => ({
      data: prevState?.data?.map((item) => ({
        ...item,
        isActive: !!e.includes(item.id),
      })),
    }));
  };

  onLoadStudents = () => {
    const { search } = this.state;
    this.props.dispatch({
      type: 'EnglishMonthlyReport/GET_DATA_STUDENTS',
      payload: {
        ...search,
        branch: search?.branchId,
        class: search?.classId,
        studentStatus: 'OFFICAL',
      },
      callback: (response) => {
        if (response) {
          this.setStateData({
            data: response.items?.map(i => ({
              ...i,
            })),
          });
        }
      },
    });
  };


  onChangeSearch = () => {
    this.onLoad();
    // this.onLoadStudents();
  };

  formBtnHeader = () => {
    const {
      loading: { effects },
    } = this.props;
    const { search } = this.state;
    const { data } = this.state;

    if (ability.can('WEB_TIENGANH_GUIDANHGIATHANG_CHUADUYET_UPDATE', 'WEB_TIENGANH_GUIDANHGIATHANG_CHUADUYET_UPDATE') ||
      ability.can('WEB_TIENGANH_GUIDANHGIATHANG_CHUAGUI_UPDATE', 'WEB_TIENGANH_GUIDANHGIATHANG_CHUAGUI_UPDATE')
    ) {
      if (search?.status === head(variablesModules.STATUS_TABS)?.id ||
        (search?.status === variablesModules.STATUS.REVIEWED) ||
        (search?.status === variablesModules.STATUS.SENT) ||
        (search?.status === variablesModules.STATUS.CONFIRMED)) {

        return <div className='d-flex'>
          <Button
            disabled={!size(data?.filter((item) => item.isActive))}
            color="primary"
            icon="redo2"
            className="ml-2"
            onClick={() => this.addSent('much')}
            loading={effects['EnglishMonthlyReport/ADD_CONFIRMED_ALL'] || effects['EnglishMonthlyReport/ADD_SENT_ALL'] || effects['EnglishMonthlyReport/ADD_CONFIRM']}
          >
            {search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? "Accept selected reviews" : "Send selected reviews"}
          </Button>
          <Button
            color="success"
            icon="redo2"
            className="ml-2"
            disabled={!data?.length > 0}
            loading={effects['EnglishMonthlyReport/ADD_CONFIRMED_ALL'] || effects['EnglishMonthlyReport/ADD_SENT_ALL'] || effects['EnglishMonthlyReport/ADD_CONFIRM']}
            onClick={() => this.addSent(search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? 'allConfirmed' : "allConfirmed")}
          >
            {search?.status === variablesModules.STATUS.NOT_YET_CONFIRM ? "Accept all" : "Send all"}
          </Button>
        </div>;
      }
    }
    return "";
  };

  render() {
    const {
      classes,
      branches,
      pagination,
      defaultBranch,
      match: { params },
      location: { pathname },
      loading: { effects },
      years,
      user,
    } = this.props;
    const { data, dataYear } = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: (record) => ({
        disabled: record.status === 'MOVE',
        name: record.status,
      }),
    };
    const { search, defaultBranchs } = this.state;
    const loading = effects['EnglishMonthlyReport/GET_DATA'];
    return (
      <>
        <Helmet title="Monthly comment" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Monthly comment</Text>
            {
              this.formBtnHeader()
            }
          </div>
          <div className={classnames(styles['block-table'], styles['block-table-tab'], 'pt20')}>
            <Form
              initialValues={{
                ...search,
                date: search.from && search.to && [moment(search.from), moment(search.to)],
                branchId: search.branchId || null,
                classId: search.classId || null,
                month: search.month && moment(search.month) || null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    data={[...years]}
                    name="schoolYearId"
                    onChange={(event) => this.onChangeSelect(event, 'schoolYearId')}
                    type={variables.SELECT}
                    placeholder="Chọn năm học"
                    allowClear={false}
                  />
                </div>
                {!defaultBranch?.id && (
                  <div className="col-lg-3">
                    <FormItem
                      data={[...branches]}
                      name="branchId"
                      placeholder="Select branch"
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
                      placeholder="Select branch"
                      onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                      type={variables.SELECT}
                      allowClear={false}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <FormItem
                    data={user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER ? [...classes?.filter(i => i?.id === head(user?.objectInfo?.classTeachers)?.classId)] : [...classes]}
                    name="classId"
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
                    placeholder="Select class"
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="month"
                    onChange={(event) => this.onChangeDate(event, 'month')}
                    type={variables.MONTH_PICKER}
                    allowClear={false}
                    disabledDate={(current) =>
                      (dataYear?.startDate &&
                        current < moment(dataYear?.startDate).startOf('day')) ||
                      (dataYear?.endDate &&
                        current >= moment(dataYear?.endDate).endOf('day'))
                    }
                    language={variables.LANGUAGE.ENGLISH}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="key"
                    onChange={(event) => this.onChange(event, 'key')}
                    type={variables.INPUT_SEARCH}
                    placeholder="Enter keyword"
                  />
                </div>
                <div className='col-lg-3'>
                  {
                    search?.schoolYearId && search?.month && search?.branchId && search?.classId ?
                      <Button color="success" icon="report" onClick={this.onChangeSearch}>
                        Load data
                      </Button>
                      :
                      <Button color="success" icon="report" disabled >
                        Load data
                      </Button>
                  }
                </div>
              </div>
              <Tabs
                activeKey={search?.status || head(variablesModules.STATUS_TABS)?.id}
                onChange={(event) => this.onChangeSelectStatus(event, 'status')}
              >
                {variablesModules.STATUS_TABS.map((item) => (
                  <TabPane tab={`${item.name}`} key={item.id} />
                ))}
              </Tabs>
            </Form>
            <Table
              bordered={false}
              description="No data"
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              rowSelection={
                search?.status === head(variablesModules.STATUS_TABS)?.id ||
                  search?.status === variablesModules.STATUS.REVIEWED ||
                  search?.status === variablesModules.STATUS.SENT ||
                  search?.status === head(variablesModules.STATUS_TABS)?.id ||
                  search?.status === variablesModules.STATUS.CONFIRMED ? null : { ...rowSelection }}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              onRow={(record) => ({
                onClick: () => {
                  if (search.status === variablesModules.STATUS.REVIEWED) {
                    history.push(`${pathname}/${head(record.monthlyComment)?.id}/detail?type=done-review`);
                  }
                  if (search.status === variablesModules.STATUS.CONFIRMED) {
                    history.push(`${pathname}/${head(record.monthlyComment)?.id}/detail?type=done-confirmed`);
                  }
                  if (search.status === variablesModules.STATUS.NOT_YET_SEND) {
                    history.push(`${pathname}/${head(record.monthlyComment)?.id}/detail?type=done`);
                  }
                  if (search.status === variablesModules.STATUS.SENT) {
                    history.push(`${pathname}/${head(record.monthlyComment)?.id}/detail?type=send`);
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
  pagination: PropTypes.objectOf(PropTypes.any),
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
  pagination: {},
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
