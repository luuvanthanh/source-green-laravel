import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Modal, Form, Avatar, Typography } from 'antd';
import classnames from 'classnames';
import { debounce, isEmpty, get } from 'lodash';
import { UserOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import HelperModules from '../utils/Helper';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

const { Paragraph } = Typography;
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
const mapStateToProps = ({ lateEarly, loading }) => ({
  data: lateEarly.data,
  pagination: lateEarly.pagination,
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
        fullName: query?.fullName,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        endDate: HelperModules.getEndDate(query?.endDate, query?.choose),
        startDate: HelperModules.getStartDate(query?.startDate, query?.choose),
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
      type: 'lateEarly/GET_DATA',
      payload: {
        ...search,
        status,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          endDate: Helper.getDate(search.endDate, variables.DATE_FORMAT.DATE_AFTER),
          startDate: Helper.getDate(search.startDate, variables.DATE_FORMAT.DATE_AFTER),
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

  renderDescription = (record) => {
    if (!isEmpty(record)) {
      const lateEarly = record.map((item) => {
        if (!isEmpty(get(item, 'fingerprintTimekeeper'))) {
          return `${get(item, 'fingerprintTimekeeper.name')} - ${Helper.getDate(
            item.attendedAt,
            variables.DATE_FORMAT.DATE_TIME,
          )}`;
        }
        return '';
      });
      return (
        <Paragraph ellipsis={{ rows: 6, expandable: true, symbol: 'Xem thêm' }}>
          {lateEarly.map((item, index) => (
            <div key={index}>
              {item}
              <br />
            </div>
          ))}
        </Paragraph>
      );
    }
    return null;
  };

  /**
   * Function header table
   */
  header = () => {
    const arrayHeader = [
      {
        title: 'STT',
        key: 'index',
        dataIndex: 'id',
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
        title: 'Thời gian',
        key: 'time',
        width: 120,
        className: 'min-width-120',
        render: (record) => Helper.getDate(record?.date, variables.DATE_FORMAT.DATE_AFTER),
      },
      {
        title: 'Họ và Tên',
        key: 'fullName',
        className: 'min-width-150',
        width: 150,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record?.employee?.fileImage)}
            fullName={record?.employee?.fullName}
          />
        ),
      },
      {
        title: 'Loại',
        key: 'type',
        width: 150,
        className: 'min-width-100',
        render: (record) => HelperModules.getLateEarly(get(record, 'lateEarlyConfig.type')),
      },
      {
        title: 'Ca',
        key: 'shift',
        width: 180,
        className: 'min-width-180',
        render: (record) => `${record?.shiftCode} ${record?.timeShift}`,
      },
      {
        title: 'Thời gian',
        key: 'time-config',
        width: 100,
        className: 'min-width-100',
        render: (record) => record?.time,
      },
      {
        title: 'Chi tiết',
        key: 'description',
        className: 'min-width-200',
        render: record => this.renderDescription(get(record, 'timekeeping')),
      },
    ];
    return arrayHeader;
  };

  render() {
    const {
      data,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search } = this.state;
    const loading = effects['lateEarly/GET_DATA'];
    return (
      <>
        <Helmet title="Đi trễ về  sớm" />
        <div className={classnames(styles['content-form'], styles['content-form-lateEarly'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Đi trễ về sớm</Text>
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
                <div className="col-lg-4">
                  <FormItem
                    name="fullName"
                    onChange={(event) => this.onChange(event, 'fullName')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="startDate"
                    onChange={(event) => this.onChangeDate(event, 'startDate')}
                    type={variables.DATE_PICKER}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="endDate"
                    onChange={(event) => this.onChangeDate(event, 'endDate')}
                    type={variables.DATE_PICKER}
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
