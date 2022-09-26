import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Tabs } from 'antd';
import classnames from 'classnames';
import { debounce, get, isEmpty, head } from 'lodash';
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
import HelperModules from '../utils/Helper';
import variablesModules from '../utils/variables';

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
const mapStateToProps = ({ noteItems, loading, user }) => ({
  loading,
  data: noteItems.data,
  pagination: noteItems.pagination,
  classes: noteItems.classes,
  branches: noteItems.branches,
  defaultBranch: user.defaultBranch,
  years: noteItems.years,
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
      dataYear: user ? user?.schoolYear : {},
      defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
      search: {
        keyWord: query?.keyWord,
        branchId: query?.branchId || defaultBranch?.id,
        classId: query?.classId || user?.role === "Teacher" && head(user?.objectInfo?.classTeachers)?.classId,
        schoolYearId: query?.schoolYearId || user?.schoolYear?.id,
        from: query?.from
          ? query?.from
          : moment(user?.schoolYear?.startDate).format(variables.DATE_FORMAT.DATE_AFTER),
        to: query?.to
          ? query?.to
          : moment(user?.schoolYear?.endDate).format(variables.DATE_FORMAT.DATE_AFTER),
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        status: query?.status || variablesModules.STATUS.CONFIRMING,
      },
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
    this.loadCategories();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { query },
    } = this.props;
    if (query !== prevProps?.location?.query && isEmpty(query)) {
      this.onInitSetSearch();
    }
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
          from: query?.from
            ? moment(query?.from).format(variables.DATE_FORMAT.DATE_AFTER)
            : moment().startOf('months'),
          to: query?.to
            ? moment(query?.to).format(variables.DATE_FORMAT.DATE_AFTER)
            : moment().endOf('months'),
          page: query?.page || variables.PAGINATION.PAGE,
          limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
          status: query?.status || variablesModules.STATUS.CONFIRMING,
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
        type: 'noteItems/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    if (!defaultBranch?.id) {
      this.props.dispatch({
        type: 'noteItems/GET_BRANCHES',
        payload: {},
      });
    }
    this.props.dispatch({
      type: 'noteItems/GET_YEARS',
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
    this.props.dispatch({
      type: 'noteItems/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
        from: Helper.getDate(search.from, variables.DATE_FORMAT.DATE_AFTER),
        to: Helper.getDate(search.to, variables.DATE_FORMAT.DATE_AFTER),
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
  }, 200);

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
      type: 'noteItems/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
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

  /**
   * Function header table
   */
  header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'index',
        align: 'center',
        className: 'min-width-60',
        width: 60,
        render: (text, record, index) =>
          Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
      },
      {
        title: 'Thời gian tạo',
        key: 'creationTime',
        className: 'min-width-150',
        width: 150,
        render: (record) => (
          <Text size="normal">
            {Helper.getDate(record.creationTime, variables.DATE_FORMAT.DATE_TIME)}
          </Text>
        ),
      },
      {
        title: 'Năm học',
        key: 'year',
        width: 180,
        className: 'min-width-180',
        render: (record) => record?.schoolYear?.yearFrom ? <Text size="normal">{record?.schoolYear?.yearFrom} - {record?.schoolYear?.yearTo}</Text> : "",
      },
      {
        title: 'Cơ sở',
        key: 'life',
        width: 180,
        className: 'min-width-180',
        render: (record) => <Text size="normal">{record?.student?.class?.branch?.name}</Text>,
      },
      {
        title: 'Lớp',
        key: 'class',
        width: 180,
        className: 'min-width-180',
        render: (record) => <Text size="normal">{record?.student?.class?.name}</Text>,
      },
      {
        title: 'Tiêu đề',
        key: 'title',
        width: 200,
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record.name}</Text>,
      },
      {
        title: 'Phụ huynh',
        key: 'parents',
        className: 'min-width-200',
        width: 200,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(get(record, 'creator.fileImage'))}
            fullName={get(record, 'creator.fullName')}
          />
        ),
      },
      {
        title: 'Dành cho bé',
        key: 'student',
        className: 'min-width-200',
        width: 200,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(get(record, 'student.fileImage'))}
            fullName={get(record, 'student.fullName')}
          />
        ),
      },
      {
        title: 'Trạng thái',
        key: 'status',
        width: 150,
        className: 'min-width-150',
        render: (record) => HelperModules.tagStatus(record.status),
      },
      {
        key: 'action',
        className: 'min-width-100',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button color="success" onClick={() => history.push(`/ghi-chu/${record.id}/chi-tiet`)}>
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
      classes,
      branches,
      pagination,
      defaultBranch,
      match: { params },
      loading: { effects },
      years,
      user,
    } = this.props;
    const { search, defaultBranchs, dataYear } = this.state;
    const loading = effects['noteItems/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách ghi chú" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh sách ghi chú</Text>
          </div>
          <div className={classnames(styles['block-table'], styles['block-table-tab'])}>
            <Tabs
              activeKey={search?.status || variablesModules.STATUS.NEW}
              onChange={(event) => this.onChangeSelectStatus(event, 'status')}
            >
              {variablesModules.STATUS_TABS.map((item) => (
                <TabPane tab={item.name} key={item.id} />
              ))}
            </Tabs>
            <Form
              initialValues={{
                ...search,
                date: search.from && search.to && [moment(search.from), moment(search.to)],
                branchId: search.branchId || null,
                classId: search.classId || null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="keyWord"
                    onChange={(event) => this.onChange(event, 'keyWord')}
                    placeholder="Nhập từ khóa tìm kiếm theo tên"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                {!defaultBranch?.id && (
                  <div className="col-lg-3">
                    <FormItem
                      data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
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
                    data={user?.role === "Teacher" ? [...classes?.filter(i => i?.id === head(user?.objectInfo?.classTeachers)?.classId)] : [{ name: 'Chọn tất cả lớp', id: null }, ...classes]}
                    name="classId"
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
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
                <div className="col-lg-3">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeDateRank(event, 'date')}
                    type={variables.RANGE_PICKER}
                    disabledDate={(current) =>
                      (dataYear?.startDate &&
                        current < moment(dataYear?.startDate).startOf('day')) ||
                      (dataYear?.endDate &&
                        current >= moment(dataYear?.endDate).endOf('day'))
                    }
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
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
  data: [],
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
