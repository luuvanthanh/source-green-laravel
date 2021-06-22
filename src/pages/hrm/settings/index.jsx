import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Switch } from 'antd';
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
      search: {
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
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
    this.props.dispatch({
      type: 'schedulesSetting/GET_DATA',
      payload: {
        ...search,
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
          type: 'schedulesSetting/REMOVE',
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
        render: (record) => record.shiftCode,
      },
      {
        title: 'Tên ca',
        key: 'name',
        width: 150,
        className: 'min-width-150',
        render: (record) => record.name,
      },
      {
        title: 'Thời gian',
        key: 'time',
        className: classnames('min-width-120', 'max-width-200'),
        render: (record) =>
          record.shiftDetail.map((item) => {
            const startTime = moment(item.startTime, variables.DATE_FORMAT.TIME_FULL);
            const endTime = moment(item.endTime, variables.DATE_FORMAT.TIME_FULL);
            return (
              <span key={item.id}>
                {item.name && `${item.name}:`}{' '}
                {Helper.getTwoDate(startTime, endTime, variables.DATE_FORMAT.HOUR)} <br />
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
        fixed: 'right',
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
      location: { pathname },
    } = this.props;
    const { search } = this.state;
    const loading = effects['schedulesSetting/GET_DATA'];
    return (
      <>
        <Helmet title="Danh mục ca làm việc" />
        <div
          className={classnames(styles['content-form'], styles['content-form-schedulesSetting'])}
        >
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh mục ca làm việc</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Tạo ca
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-12">
                  <FormItem
                    name="shiftCode"
                    onChange={(event) => this.onChange(event, 'shiftCode')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
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
