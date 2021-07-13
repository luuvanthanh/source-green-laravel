import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Tabs } from 'antd';
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
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import ability from '@/utils/ability';
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
const mapStateToProps = ({ medicalItems, loading }) => ({
  data: medicalItems.data,
  branches: medicalItems.branches,
  classes: medicalItems.classes,
  pagination: medicalItems.pagination,
  error: medicalItems.error,
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
    } = props;
    this.state = {
      search: {
        diseaseName: query?.diseaseName,
        branchId: query?.branchId,
        status: query?.status || variablesModules.STATUS.PENDING,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        creationTimeFrom: Helper.getEndDate(query?.creationTimeFrom, query?.choose),
        creationTimeTo: Helper.getStartDate(query?.creationTimeTo, query?.choose),
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
      type: 'medicalItems/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          creationTimeFrom: Helper.getDate(search.creationTimeFrom, variables.DATE_FORMAT.DATE_AFTER),
          creationTimeTo: Helper.getDate(search.creationTimeTo, variables.DATE_FORMAT.DATE_AFTER),
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
        type: 'medicalItems/GET_CLASSES',
        payload: search,
      });
    }
    dispatch({
      type: 'medicalItems/GET_BRACHES',
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
      type: 'medicalItems/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
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
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectStatus = (e, type) => {
    this.debouncedSearchStatus(e, type);
  };

   /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
    debouncedSearchDateRank = debounce((creationTimeFrom, creationTimeTo) => {
      this.setStateData(
        (prevState) => ({
          search: {
            ...prevState.search,
            creationTimeFrom,
            creationTimeTo,
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
        title: 'Cơ sở',
        key: 'life',
        className: 'min-width-150',
        render: (record) => (
          <Text size="normal">{record?.studentMaster?.student?.class?.branch?.name}</Text>
        ),
      },
      {
        title: 'Lớp',
        key: 'class',
        className: 'min-width-180',
        render: (record) => (
          <Text size="normal">{record?.studentMaster?.student?.class?.name}</Text>
        ),
      },
      {
        title: 'Tiêu đề',
        key: 'title',
        className: 'min-width-200',
        render: (record) => <Text size="normal">{record.diseaseName}</Text>,
      },
      {
        title: 'Phụ huynh',
        key: 'parents',
        width: 200,
        className: 'min-width-200',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(
              record?.studentMaster?.farther?.fileImage || record?.studentMaster?.mother?.fileImage,
            )}
            fullName={
              record?.studentMaster?.farther?.fullName || record?.studentMaster?.mother?.fullName
            }
          />
        ),
      },
      {
        title: 'Dành cho bé',
        key: 'student',
        width: 200,
        className: 'min-width-200',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record?.studentMaster?.student?.fileImage)}
            fullName={record?.studentMaster?.student?.fullName}
          />
        ),
      },
      {
        title: 'Trạng thái',
        key: 'status',
        className: 'min-width-150',
        render: (record) => HelperModules.tagStatus(record.status),
      },
      {
        key: 'actions',
        className: 'min-width-80',
        width: 80,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="success"
              ghost
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
              permission="YTE"
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    return !ability.can('YTE', 'YTE') ? columns.filter((item) => item.key !== 'actions') : columns;
  };

  render() {
    const {
      data,
      error,
      classes,
      branches,
      pagination,
      match: { params },
      loading: { effects },
      location: { pathname },
    } = this.props;
    const { search } = this.state;
    const loading = effects['medicalItems/GET_DATA'];
    return (
      <>
        <Helmet title="Thống kê y tế" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Thống kê y tế</Text>
            <Button
              color="success"
              icon="plus"
              onClick={() => history.push(`/y-te/thong-ke/tao-moi`)}
              permission="YTE"
            >
              Tạo y tế
            </Button>
          </div>
          <div className={classnames(styles['block-table'], styles['block-table-tab'])}>
            <Tabs
              defaultActiveKey={search?.status || variablesModules.STATUS.PENDING}
              onChange={(event) => this.onChangeSelectStatus(event, 'status')}
            >
              {variablesModules.STATUS_TABS.map((item) => (
                <TabPane tab={item.name} key={item.id} />
              ))}
            </Tabs>
            <Form
              initialValues={{
                ...search,
                branchId: search.branchId || null,
                classId: search.classId || null,
                date: search.creationTimeFrom && search.creationTimeTo && [moment(search.creationTimeFrom), moment(search.creationTimeTo)],
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="diseaseName"
                    onChange={(event) => this.onChange(event, 'diseaseName')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả cơ sở ' }, ...branches]}
                    name="branchId"
                    onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả lớp' }, ...classes]}
                    name="classId"
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeDateRank(event, 'date')}
                    type={variables.RANGE_PICKER}
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
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              onRow={(record) => ({
                onClick: () => {
                  history.push(`${pathname}/${record.id}/chi-tiet`);
                },
              })}
              rowKey={(record) => record.id}
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
};

export default Index;
