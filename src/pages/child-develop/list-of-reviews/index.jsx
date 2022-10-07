import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Tabs } from 'antd';
import classnames from 'classnames';
import { debounce, isEmpty, head } from 'lodash';
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
// import HelperModules from './utils/Helper';
import variablesModules from './utils/variables';

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
const mapStateToProps = ({ listOfReviews, loading, user }) => ({
  loading,
  data: listOfReviews.data,
  pagination: listOfReviews.pagination,
  classes: listOfReviews.classes,
  branches: listOfReviews.branches,
  defaultBranch: user.defaultBranch,
  years: listOfReviews.years,
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
        type: 'listOfReviews/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    if (!defaultBranch?.id) {
      this.props.dispatch({
        type: 'listOfReviews/GET_BRANCHES',
        payload: {},
      });
    }
    this.props.dispatch({
      type: 'listOfReviews/GET_YEARS',
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
      type: 'listOfReviews/GET_DATA',
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
      type: 'listOfReviews/GET_CLASSES',
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
    const {
      location: { pathname },
    } = this.props;
    const columns = [
      {
        title: 'STT ',
        key: 'index',
        width: 80,
        fixed: 'left',
        render: (text, record, index) =>
          Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
      },
      {
        title: 'Thời gian duyệt',
        key: 'name',
        width: 250,
        render: (record) => record?.full_name,
      },
      {
        title: 'Loại đánh giá',
        key: 'email',
        width: 200,
        render: (record) => record?.email,
      },
      {
        title: 'Cơ sở',
        key: 'phone',
        width: 150,
        render: (record) => record?.phone,
      },
      {
        title: 'Lớp',
        key: 'status',
        className: 'min-width-150',
        width: 150,
        render: (record) => record?.phone,
      },
      {
        title: 'Học sinh',
        key: 'status',
        className: 'min-width-150',
        width: 150,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.file_image)}
            fullName={record?.full_name}
          />
        ),
      },
      {
        key: 'action',
        width: 80,
        fixed: 'right',
        render: (record) => (
          <div className="d-flex flex-row-reverse">
            <Button
              color="success"
              className="ml5"
              icon="redo2"
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
            />
            {/* {
              record?.status === 'NOT_MOVE' && (
                <Button color="danger" icon="remove" onClick={() => this.onRemove(record.id)} />
              )
            } */}
          </div>
        ),
      },
    ];
    return columns;
  };

  onSelectChange = (e) => {
    this.setStateData((prevState) => ({
      dataSource: prevState?.dataSource?.map((item) => ({
        ...item,
        isActive: !!e.includes(item.id),
      })),
    }));
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
    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: (record) => ({
        disabled: record.status === 'MOVE',
        name: record.status,
      }),
    };
    const { search, defaultBranchs } = this.state;
    const loading = effects['listOfReviews/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách đánh giá đã duyệt" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh sách đánh giá đã duyệt</Text>
            <div className='d-flex'>
              <Button color="primary" icon="redo2" className="ml-2" onClick={this.onChangeExcel}>
                Gửi đánh giá đã chọn
              </Button>
              <Button
                color="success"
                icon="redo2"
                className="ml-2"
              >
                Gửi tất cả
              </Button>
            </div>
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
                    data={[{ id: null, name: 'Chọn tất cả năm học' }, ...years]}
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
                    data={user?.role === "Teacher" ? [...classes?.filter(i => i?.id === head(user?.objectInfo?.classTeachers)?.classId)] : [{ name: 'Chọn tất cả lớp', id: null }, ...classes]}
                    name="classId"
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="keyWord"
                    onChange={(event) => this.onChange(event, 'keyWord')}
                    placeholder="Nhập từ khóa tìm kiếm theo tên"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered={false}
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              rowSelection={{ ...rowSelection }}
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
