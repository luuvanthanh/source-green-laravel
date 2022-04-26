import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { get, debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';

const status = [
  { id: 'NEW_REGISTER', name: 'Đăng ký mới' },
  { id: 'TEST_INPUT', name: 'Test đầu vào' },
  { id: 'PENDING_PAYMENT', name: 'Chờ thanh toán' },
  { id: 'CANCEL_REGISTER', name: 'Hủy đăng ký' },
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
const mapStateToProps = ({ crmSaleAdmission, loading }) => ({
  data: crmSaleAdmission.data,
  error: crmSaleAdmission.error,
  pagination: crmSaleAdmission.pagination,
  branches: crmSaleAdmission.branches,
  parents: crmSaleAdmission.parents,
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
        key: query?.key,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
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
      type: 'crmSaleAdmission/GET_DATA',
      payload: {
        ...search,
      },
      callback: (response) => {
        if (response) {
          this.setStateData({
            dataSource: response.parsePayload,
          });
        }
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
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

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'crmSaleAdmission/GET_PARENTS',
      payload: {},
    });
    dispatch({
      type: 'crmSaleAdmission/GET_DISTRICTS',
      payload: {},
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
        render: (text, record, index) =>
          Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
      },
      {
        title: 'Tên học sinh',
        key: 'full_name',
        width: 250,
        render: (record) => <Text size="normal">{get(record, 'studentInfo.full_name')}</Text>,
      },
      {
        title: 'Ngày sinh',
        key: 'birth_day',
        width: 150,
        render: (record) => <Text size="normal">{get(record, 'studentInfo.birth_date')}</Text>,
      },
      {
        title: 'Tháng tuổi',
        key: 'age',
        width: 150,
        render: (value, record) => (
          <div className='d-flex' >
            {record.studentInfo?.age_month}
          </div>
        ),
      },
      {
        title: 'Thời gian đăng ký',
        key: 'time',
        width: 150,
        render: (record) => Helper.getDate(record?.date_register, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Họ tên cha',
        key: 'parents',
        width: 200,
        render: (record) => (
          <>
            {record?.parentInfo?.map((item, index) => (
              <Text size="normal" key={index}>
                {item?.sex === "MALE" ? item?.full_name : ""}
              </Text>
            ))}
          </>
        ),
      },
      {
        title: 'Họ tên mẹ',
        key: 'facility',
        width: 200,
        render: (record) => (
          <>
            {record?.parentInfo?.map((item, index) => (
              <Text size="normal" key={index}>
                {item?.sex === "FEMALE" ? item?.full_name : ""}
              </Text>
            ))}
          </>
        ),
      },
      {
        title: 'Tình trạng',
        key: 'status',
        width: 150,
        render: (record) => (
          <>
            <Text size="normal">
              {record?.register_status === "NEW_REGISTER" ? 'Đăng ký mới' : ""}
              {record?.register_status === "TEST_INPUT" ? 'Test đầu vào' : ""}
              {record?.register_status === "PENDING_PAYMENT" ? 'Chờ thanh toán' : ""}
              {record?.register_status === "CANCEL_REGISTER" ? 'Hủy đăng ký' : ""}
            </Text>
          </>
        ),
      },
      {
        key: 'action',
        width: 100,
        clasName: "min-width-100 max-width-100",
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="success"
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    return columns;
  };

  /**
 * Function change input
 * @param {object} e event of input
 * @param {string} type key of object search
 */
  onChangeDate = (e, type) => {
    if (e) {
      this.debouncedSearch(moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type);
      this.setStateData({ dataIDSearch: e });
    } else {
      this.debouncedSearch(e, type);
      this.setStateData({ dataIDSearch: e });
    }
  };

  render() {
    const {
      parents,
      data,
      match: { params },
      pagination,
      loading: { effects },
      location: { pathname },
    } = this.props;

    const { search } = this.state;
    const loading = effects['crmSaleAdmission/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách học sinh đăng ký nhập học" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Danh sách học sinh đăng ký nhập học</Text>
            <Button
              color="success"
              icon="plus"
              onClick={() => history.push(`${pathname}/tao-moi`)}
              className="ml-2"
            >
              Tạo mới
            </Button>
          </div>
          <div className={styles['block-table']}>
            <Form
              initialValues={{
                ...search,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    name="key"
                    onChange={(event) => this.onChange(event, 'key')}
                    placeholder="Nhập từ khóa"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-2">
                  <FormItem
                    options={['id', 'full_name']}
                    data={[{ full_name: 'Chọn tất cả phụ huynh lead', id: null }, ...parents,]}
                    name="customer_lead_id"
                    onChange={(event) => this.onChangeSelect(event, 'customer_lead_id')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn phụ huynh lead"
                  />
                </div>
                <div className="col-lg-2">
                  <FormItem
                    name="date_register"
                    onChange={(event) => this.onChangeDate(event, 'date_register')}
                    type={variables.DATE_REGISTERS_DAY}
                  />
                </div>
                <div className="col-lg-2">
                  <FormItem
                    name="birth_date"
                    onChange={(event) => this.onChangeDate(event, 'birth_date')}
                    type={variables.DATE_REGISTERS_BIRTHDAY}
                  />
                </div>
                <div className="col-lg-2">
                  <FormItem
                    data={[{ name: 'Chọn tất cả tình trạng', id: null }, ...status,]}
                    name="register_status"
                    onChange={(event) => this.onChangeSelect(event, 'register_status')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn tình trạng"
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered={false}
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
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  parents: PropTypes.arrayOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  parents: [],
  data: [],
};

export default Index;
