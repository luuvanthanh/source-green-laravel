import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Modal, Form, Tabs, Avatar, Switch } from 'antd';
import classnames from 'classnames';
import { isEmpty, head, debounce } from 'lodash';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import HelperModules from '../utils/Helper';
import variablesModules from '../utils/variables';
import PropTypes from 'prop-types';

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
const { confirm } = Modal;
const mapStateToProps = ({ schedulesSetting, loading }) => ({
  data: schedulesSetting.data,
  pagination: schedulesSetting.pagination,
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
      visible: false,
      search: {
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
      objects: {},
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
    const { search, status } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'schedulesSetting/GET_DATA',
      payload: {
        ...search,
        status,
      },
    });
    history.push(`${pathname}?${Helper.convertParamSearchConvert(search, variables.QUERY_STRING)}`);
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
  changePagination = (page, limit) => {
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
  pagination = (pagination) => ({
    size: 'default',
    total: pagination?.total,
    pageSize: pagination?.per_page,
    defaultCurrent: pagination?.current_page,
    hideOnSinglePage: pagination?.total_pages <= 1 && pagination?.per_page <= 10,
    showSizeChanger: variables.PAGINATION.SHOW_SIZE_CHANGER,
    pageSizeOptions: variables.PAGINATION.PAGE_SIZE_OPTIONS,
    onChange: (page, size) => {
      this.onSearch(page, size);
    },
    onShowSizeChange: (current, size) => {
      this.onSearch(current, size);
    },
  });

  /**
   * Function reset form
   */
  onResetForm = () => {
    if (this.formRef) {
      this.formRef.current.resetFields();
      this.setStateData({
        objects: {},
      });
    }
  };

  /**
   * Function close modal
   */
  handleCancel = () => {
    this.setStateData({ visible: false });
    this.onResetForm();
  };

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  onFinish = () => {
    const { objects } = this.state;
    this.formRef.current.validateFields().then((values) => {
      this.props.dispatch({
        type: !isEmpty(objects) ? 'schedulesSetting/UPDATE' : 'schedulesSetting/ADD',
        payload: {
          ...values,
          id: objects.id,
        },
        callback: (response, error) => {
          if (response) {
            this.handleCancel();
            this.onLoad();
          }
          if (error) {
            if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
              error?.validationErrors.forEach((item) => {
                this.formRef.current.setFields([
                  {
                    name: head(item.members),
                    errors: [item.message],
                  },
                ]);
              });
            }
          }
        },
      });
    });
  };

  /**
   * Function remove items
   * @param {uid} id id of items
   */
  onRemove = (id) => {
    const { dispatch, pagination } = this.props;
    confirm({
      title: 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content: 'Dữ liệu này đang được sử dụng, nếu xóa dữ liệu này sẽ ảnh hưởng tới dữ liệu khác?',
      onOk() {
        dispatch({
          type: 'schedulesSetting/REMOVE',
          payload: {
            id,
            pagination: {
              limit: 10,
              page:
                pagination.total % pagination.per_page === 1
                  ? pagination.current_page - 1
                  : pagination.current_page,
            },
          },
        });
      },
      onCancel() {},
    });
  };

  /**
   * Function remove items
   * @param {uid} id id of items
   */
  onChangeSwitch = (record, checked) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'schedulesSetting/UPDATE_CONFIG',
      payload: {
        ...record,
        status: checked ? variablesModules.STATUS_SHIFT.ON : variablesModules.STATUS_SHIFT.OFF,
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
    return [
      {
        title: 'STT',
        key: 'text',
        width: 60,
        className: 'min-width-60',
        align: 'center',
        render: (text, record, index) =>
          Helper.sttList(
            this.props.pagination?.current_page,
            index,
            this.props.pagination?.per_page,
          ),
      },
      {
        title: 'Mã ca',
        key: 'shiftCode',
        width: 150,
        className: 'min-width-150',
        render: (record) => record.shift_code,
      },
      {
        title: 'Thời gian',
        key: 'time',
        className: classnames('min-width-120', 'max-width-200'),
        render: (record) =>
          record.shiftDetail.map((item) => {
            const startTime = moment(item.start_time, variables.DATE_FORMAT.TIME_FULL);
            const endTime = moment(item.end_time, variables.DATE_FORMAT.TIME_FULL);
            return (
              <span key={item.id}>
                {Helper.getTwoDate(startTime, endTime, variables.DATE_FORMAT.HOUR)} &nbsp;&nbsp;
              </span>
            );
          }),
      },
      {
        title: 'Mô tả',
        key: 'description',
        className: 'min-width-200',
        render: (record) => record.description,
      },
      {
        title: '',
        key: 'lock',
        className: 'min-width-150',
        width: 150,
        render: (record) => (
          <div className={styles['table-switch']}>
            <Switch
              checked={record.status === variablesModules.STATUS_SHIFT.ON}
              onChange={(event) => this.onChangeSwitch(record, event)}
            />
            <span>
              {record.status === variablesModules.STATUS_SHIFT.ON ? 'Đang bật' : 'Đang khóa'}
            </span>
          </div>
        ),
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="edit"
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
            />
            <Button color="danger" icon="remove" onClick={() => this.onRemove(record.id)} />
          </div>
        ),
      },
    ];
  };

  render() {
    const {
      data,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search } = this.state;
    const loading = effects['schedulesSetting/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách cấu hình ca" />
        <div
          className={classnames(styles['content-form'], styles['content-form-schedulesSetting'])}
        >
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh sách cấu hình ca</Text>
            <Button
              color="success"
              icon="plus"
              onClick={() => history.push(`/diem-danh/cau-hinh/tao-moi`)}
            >
              Tạo ca
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                productType: search.productType || null,
                startDate: search.startDate && moment(search.startDate),
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-12">
                  <FormItem
                    name="shift_code"
                    onChange={(event) => this.onChange(event, 'shift_code')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
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
