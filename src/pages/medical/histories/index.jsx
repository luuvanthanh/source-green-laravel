import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, isEmpty } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import variablesModules from '../utils/variables';

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
const mapStateToProps = ({ medicalHistories, loading }) => ({
  data: medicalHistories.data,
  pagination: medicalHistories.pagination,
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
        actionType: query?.actionType,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        creationTimeFrom: Helper.getStartDate(query?.creationTimeFrom, query?.choose),
        creationTimeTo: Helper.getEndDate(query?.creationTimeTo, query?.choose),
      },
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { query },
    } = this.props;
    if (query !== prevProps?.location?.query && isEmpty(query)) {
      this.initSearch();
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

  initSearch = () => {
    const {
      location: { query },
    } = this.props;
    this.setStateData(
      {
        search: {
          actionType: query?.actionType,
          page: query?.page || variables.PAGINATION.PAGE,
          limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
          creationTimeFrom: Helper.getEndDate(query?.creationTimeFrom, query?.choose),
          creationTimeTo: Helper.getStartDate(query?.creationTimeTo, query?.choose),
        },
      },
      () => {
        this.onLoad();
      },
    );
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
      type: 'medicalHistories/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          creationTimeFrom: Helper.getDate(
            search.creationTimeFrom,
            variables.DATE_FORMAT.DATE_AFTER,
          ),
          creationTimeTo: Helper.getDate(search.creationTimeTo, variables.DATE_FORMAT.DATE_AFTER),
        },
        variables.QUERY_STRING,
      )}`,
    );
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
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDate = (e, type) => {
    this.debouncedSearch(moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type);
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
  header = () => [
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
      title: 'Thời gian',
      key: 'code',
      width: 150,
      className: 'min-width-130',
      render: (record) => (
        <Text size="normal">
          {Helper.getDate(record.creationTime, variables.DATE_FORMAT.DATE_TIME)}
        </Text>
      ),
    },
    {
      title: 'Tên tài khoản',
      key: 'name',
      className: 'min-width-130',
      render: (record) => (
        <Text size="normal">
          {record?.creator?.objectInfo?.fullName || record?.creator?.userName}
        </Text>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      className: 'min-width-130',
      render: (record) => variablesModules.MEDICAL_ACTION_TYPE[`${record.actionType}`],
    },
    {
      title: 'Nội dung',
      key: 'status',
      className: 'min-width-120',
      render: (record) => <Text size="normal">{record.logContent}</Text>,
    },
  ];

  render() {
    const {
      data,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search } = this.state;
    const loading = effects['medicalHistories/GET_DATA'];
    return (
      <>
        <Helmet title="Lịch sử y tế" />
        <div
          className={classnames(styles['content-form'], styles['content-form-medicalHistories'])}
        >
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Lịch sử</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                date: search.creationTimeFrom &&
                  search.creationTimeTo && [
                    moment(search.creationTimeFrom),
                    moment(search.creationTimeTo),
                  ],
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                {/* <div className="col-lg-4">
                  <FormItem
                    name="user_id"
                    data={[]}
                    onChange={(event) => this.onChangeSelect(event, 'user_id')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="actionType"
                    data={[
                      { id: null, name: 'Chọn tất cả' },
                      ...variablesModules.MEDICAL_ACTION_TYPE_STATUS,
                    ]}
                    onChange={(event) => this.onChangeSelect(event, 'actionType')}
                    type={variables.SELECT}
                  />
                </div> */}
                <div className="col-lg-4">
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
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              bordered={false}
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
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
};

export default Index;
