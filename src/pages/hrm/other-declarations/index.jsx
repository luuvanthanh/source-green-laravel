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
const mapStateToProps = ({ otherDeclarations, loading }) => ({
  data: otherDeclarations.data,
  pagination: otherDeclarations.pagination,
  paramaterValues: otherDeclarations.paramaterValues,
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
        fullName: query?.fullName,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        startDate: query?.startDate
          ? moment(query?.startDate)
          : moment().startOf('month').subtract(1, 'months').add(24, 'days'),
        endDate: query?.endDate
          ? moment(query?.endDate)
          : moment().startOf('month').add(1, 'days'),
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

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'otherDeclarations/GET_PARAMATER_VALUES',
      payload: {},
    });
  };

  /**
   * Function load data
   */
  onLoad = () => {
    const { search, status } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'otherDeclarations/GET_DATA',
      payload: {
        ...search,
        status,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          endDate: Helper.getDateSearch(search.endDate, variables.DATE_FORMAT.DATE_AFTER),
          startDate: Helper.getDateSearch(search.startDate, variables.DATE_FORMAT.DATE_AFTER),
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
  pagination = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        this.changePagination(response);
      },
    });

  /**
   * Function remove items
   * @param {uid} id id of items
   */
  onRemove = (id) => {
    const { dispatch } = this.props;
    const self = this;
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'otherDeclarations/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) self.onLoad();
          },
        });
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
        title: 'Các tháng đã khai báo',
        key: 'time',
        className: 'min-width-200',
        width: 200,
        render: (record) => Helper.getDate(record.time, variables.DATE_FORMAT.MONTH_FULL) || record?.employee?.fullName,
      },
      {
        title: 'Số công chuẩn',
        key: 'numberOfWorkdays',
        className: 'min-width-150',
        width: 150,
        render: (record) => record.numberOfWorkdays,
      },
      {
        title: 'Tổng tăng giảm theo tháng',
        key: 'numberOfWorkdays',
        className: 'min-width-200',
        width: 200,
        render: (record) => {
          if (record?.children) {
            return "";
          }
          const a = record?.detail?.find(i => i?.type === 'OtherDeclarationDetail');
          return (
            <>
              {Helper.getPrice(a?.total) || "0 đ"}
            </>
          );
        },
      },
      {
        title: 'Tổng tăng giảm theo hợp đồng',
        key: 'numberOfWorkdays',
        className: 'min-width-200',
        width: 200,
        render: (record) => {
          if (record?.children) {
            return "";
          }
          const a = record?.detail?.find(i => i?.type === 'ChangeContractParameter');
          return (
            <>
              {Helper.getPrice(a?.total) || "0 đ"}
            </>
          );
        },
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        render: (record) => {
          if (record.otherDeclarationDetail) {
            return (
              <div className={styles['list-button']}>
                <Button
                  color="primary"
                  icon="edit"
                  onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
                />
                <Button color="danger" icon="remove" onClick={() => this.onRemove(record.id)} />
              </div>
            );
          }
          return null;
        },
      },
    ];

    return columns;
  };

  render() {
    const {
      data,
      pagination,
      match: { params },
      loading: { effects },
      location: { pathname },
    } = this.props;
    const { search } = this.state;
    console.log(data);
    const loading = effects['otherDeclarations/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách khai báo các khoản khác" />
        <div
          className={classnames(styles['content-form'], styles['content-form-otherDeclarations'])}
        >
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh sách khai báo các khoản khác</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Tạo mới
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                startDate: search.startDate ? moment(search.startDate) : null,
                endDate: search.endDate ? moment(search.endDate) : null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="fullName"
                    onChange={(event) => this.onChange(event, 'fullName')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="startDate"
                    onChange={(event) => this.onChangeDate(event, 'startDate')}
                    type={variables.MONTH_YEAR_PICKER}
                    disabledDate={(current) => Helper.disabledDateFrom(current, this.formRef)}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="endDate"
                    onChange={(event) => this.onChangeDate(event, 'endDate')}
                    type={variables.MONTH_YEAR_PICKER}
                    disabledDate={(current) => Helper.disabledDateTo(current, this.formRef)}
                    allowClear={false}
                  />
                </div>
              </div>
            </Form>
            <div className={stylesModule['wrapper-table']}>
              <Table
                bordered
                columns={this.header(params)}
                dataSource={data}
                loading={loading}
                pagination={this.pagination(pagination)}
                childrenColumnName="children"
                params={{
                  header: this.header(),
                  type: 'table',
                }}
                rowKey={(record) => record.id}
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
