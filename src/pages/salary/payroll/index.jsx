import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Switch } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import moment from 'moment';

const DATA_SOURCE = [
  {
    id: 'CHOT_BANG_LUONG',
    name: 'Chốt bảng công tháng',
  },
  {
    id: 'CHOT_BANG_THUONG_KPI',
    name: 'Chốt bảng thưởng KPI',
  },
  {
    id: 'KHAI_BAO_KHOAN_KHAC',
    name: 'Khai báo các khoản tính lương',
  },
  {
    id: 'TINH_LUONG',
    name: 'Tính lương',
  },
];

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
const mapStateToProps = ({ payroll, loading }) => ({
  data: payroll.data,
  error: payroll.error,
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
        month: query?.month ? moment(query.month) : moment().startOf('months'),
      },
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
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
    if (search.month) {
      this.props.dispatch({
        type: 'payroll/GET_DATA',
        payload: {
          ...search,
        },
      });
      history.push(
        `${pathname}?${Helper.convertParamSearchConvert(
          {
            ...search,
            month: Helper.getDate(search.month, variables.DATE_FORMAT.DATE_AFTER),
          },
          variables.QUERY_STRING,
        )}`,
      );
    }
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
  onChangeDate = (e, type) => {
    this.debouncedSearch(
      moment(e).startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
      type,
    );
  };

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
  onChangeSelectStatus = (e, type) => {
    this.debouncedSearchStatus(e, type);
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
          type: 'payroll/REMOVE',
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

  update = (record, key) => {
    const { dispatch } = this.props;
    if (key === 'CHOT_BANG_LUONG') {
      dispatch({
        type: 'payroll/UPDATE',
        payload: {
          id: record.id,
          isTimesheet: true,
          isBonus: record.isBonus,
          isOther: record.isOther,
        },
        callback: (response) => {
          if (response) {
            this.onLoad();
          }
        },
      });
    }
    if (key === 'CHOT_BANG_THUONG_KPI') {
      dispatch({
        type: 'payroll/UPDATE',
        payload: {
          id: record.id,
          isBonus: true,
          isOther: record.isOther,
          isTimesheet: record.isTimesheet,
        },
        callback: (response) => {
          if (response) {
            this.onLoad();
          }
        },
      });
    }
    if (key === 'KHAI_BAO_KHOAN_KHAC') {
      dispatch({
        type: 'payroll/UPDATE',
        payload: {
          id: record.id,
          isOther: true,
          isBonus: record.isBonus,
          isTimesheet: record.isTimesheet,
        },
        callback: (response) => {
          if (response) {
            this.onLoad();
          }
        },
      });
    }
  };

  updateSalary = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'payroll/UPDATE_SALARY',
      payload: {
        id: record.id,
      },
      callback: (response) => {
        if (response) {
          this.onLoad();
        }
      },
    });
  };

  /**
   * Function header table
   */
  header = () => {
    const { data } = this.props;
    const { search } = this.state;
    const columns = [
      {
        title: 'Tên',
        key: 'name',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.name}</Text>,
      },
      {
        title: 'Chốt và khai báo',
        key: 'name',
        width: 120,
        align: 'center',
        className: 'min-width-120',
        render: (record) => {
          if (record.id === 'CHOT_BANG_LUONG') {
            return (
              <Switch
                checked={data.isTimesheet}
                disabled={data.isTimesheet}
                onChange={() => this.update(data, 'CHOT_BANG_LUONG')}
              />
            );
          }
          if (record.id === 'CHOT_BANG_THUONG_KPI') {
            return (
              <Switch
                checked={data.isBonus}
                disabled={!data.isTimesheet || data.isBonus}
                onChange={() => this.update(data, 'CHOT_BANG_THUONG_KPI')}
              />
            );
          }
          if (record.id === 'KHAI_BAO_KHOAN_KHAC') {
            return (
              <Switch
                checked={data.isOther}
                disabled={!data.isTimesheet || !data.isBonus || data.isOther}
                onChange={() => this.update(data, 'KHAI_BAO_KHOAN_KHAC')}
              />
            );
          }
          if (record.id === 'TINH_LUONG') {
            return (
              <Switch
                checked={data.isSalary}
                disabled={!data.isTimesheet || !data.isBonus || !data.isOther || data.isSalary}
                onChange={() => this.updateSalary(data)}
              />
            );
          }
          return null;
        },
      },
      {
        title: 'Thao tác',
        key: 'action',
        className: 'min-width-80',
        width: 80,
        render: (record) => (
          <div className={styles['list-button']}>
            {record.id === 'CHOT_BANG_LUONG' && (
              <Button
                color="primary"
                onClick={() =>
                  history.push(
                    `/quan-ly-nhan-su/tong-hop-cong?startDate=${Helper.getDate(
                      moment(search.month).startOf('months'),
                      variables.DATE_FORMAT.DATE_AFTER,
                    )}&endDate=${Helper.getDate(
                      moment(search.month).endOf('months'),
                      variables.DATE_FORMAT.DATE_AFTER,
                    )}`,
                  )
                }
              >
                Xem bảng công
              </Button>
            )}
            {record.id === 'CHOT_BANG_THUONG_KPI' && (
              <Button
                color="primary"
                onClick={() =>
                  history.push(
                    `/quan-ly-nhan-su/tong-hop-cong?startDate=${Helper.getDate(
                      moment(search.month).startOf('months'),
                      variables.DATE_FORMAT.DATE_AFTER,
                    )}&endDate=${Helper.getDate(
                      moment(search.month).endOf('months'),
                      variables.DATE_FORMAT.DATE_AFTER,
                    )}`,
                  )
                }
              >
                Xem KPI
              </Button>
            )}
            {record.id === 'KHAI_BAO_KHOAN_KHAC' && (
              <Button
                color="primary"
                onClick={() =>
                  history.push(
                    `/quan-ly-nhan-su/khai-bao-cac-khoan-khac?startDate=${Helper.getDate(
                      moment(search.month).startOf('months'),
                      variables.DATE_FORMAT.DATE_AFTER,
                    )}&endDate=${Helper.getDate(
                      moment(search.month).endOf('months'),
                      variables.DATE_FORMAT.DATE_AFTER,
                    )}`,
                  )
                }
              >
                Xem Khai báo
              </Button>
            )}
            {record.id === 'TINH_LUONG' && (
              <Button
                color="primary"
                onClick={() =>
                  history.push(
                    `/bang-luong/danh-sach?month=${Helper.getDate(
                      moment(search.month).startOf('months'),
                      variables.DATE_FORMAT.DATE_AFTER,
                    )}`,
                  )
                }
              >
                Xem tính lương
              </Button>
            )}
          </div>
        ),
      },
    ];
    return columns;
  };

  render() {
    const {
      error,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search } = this.state;
    const loading = effects['payroll/GET_DATA'];
    return (
      <>
        <Helmet title="Tính lương" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">TÍNH LƯƠNG</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                month: search.month && moment(search.month),
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    name="month"
                    onChange={(event) => this.onChangeDate(event, 'month')}
                    type={variables.MONTH_PICKER}
                    allowClear={false}
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered
              columns={this.header(params)}
              dataSource={DATA_SOURCE}
              loading={loading}
              pagination={false}
              error={error}
              isError={error.isError}
              params={{
                header: this.header(),
                type: 'table',
              }}
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
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  loading: {},
  dispatch: {},
  location: {},
  error: {},
};

export default Index;
