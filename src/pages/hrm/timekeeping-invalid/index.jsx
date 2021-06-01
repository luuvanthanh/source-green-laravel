import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, get, isEmpty } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import HelperModules from '../utils/Helper';

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
const mapStateToProps = ({ timekeepingInvalid, loading }) => ({
  data: timekeepingInvalid.data,
  pagination: timekeepingInvalid.pagination,
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
        endDate: HelperModules.getEndDate(query?.endDate, query?.choose),
        startDate: HelperModules.getStartDate(query?.startDate, query?.choose),
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
    const { search, status } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'timekeepingInvalid/GET_DATA',
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
    locale: { items_per_page: variables.PAGINATION.PER_PAGE_TEXT },
    onChange: (page, size) => {
      this.changePagination(page, size);
    },
    onShowSizeChange: (current, size) => {
      this.changePagination(current, size);
    },
  });

  renderDescription = (record) => {
    if (!isEmpty(record)) {
      const timekeeping = record.map((item) => {
        if (!isEmpty(get(item, 'fingerprintTimekeeper'))) {
          return `${get(item, 'fingerprintTimekeeper.name')} - ${Helper.getDateLocal(
            item.attendedAt,
            variables.DATE_FORMAT.DATE_TIME,
          )}`;
        }
        return Helper.getDateLocal(item.attendedAt, variables.DATE_FORMAT.DATE_TIME);
      });
      return timekeeping.map((item, index) => (
        <span key={index}>
          {item}
          <br />
        </span>
      ));
    }
    return null;
  };

  /**
   * Function header table
   */
  header = () => [
    {
      title: 'STT',
      key: 'text',
      width: 80,
      className: 'min-width-80',
      align: 'center',
      render: (text, record, index) =>
        record.responseInvalid &&
        Helper.sttList(this.props.pagination?.current_page, index, this.props.pagination?.per_page),
    },
    {
      title: 'Nhân viên',
      key: 'fullName',
      className: 'min-width-200',
      width: 200,
      render: (record) =>
        record.responseInvalid && (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record?.fileImage)}
            fullName={record?.fullName}
          />
        ),
    },
    {
      title: 'Ngày',
      key: 'date',
      className: 'min-width-120',
      width: 120,
      render: (record) =>
        !record.responseInvalid && Helper.getDate(record.date, variables.DATE_FORMAT.DATE),
    },
    {
      title: 'Ca làm việc',
      key: 'shift',
      className: 'min-width-200',
      width: 200,
      render: (record) => {
        if (!record.responseInvalid) {
          return (
            <div>
              {get(record, 'shift[0].shiftCode')}
              <br />
              {get(record, 'shift[0].name') || get(record, 'shift[0].shiftCode')}:
              <br />
              {get(record, 'shift[0].startTime')} - {get(record, 'shift[0].endTime')}
              <br />
              {get(record, 'shift[1].name') || get(record, 'shift[1].shiftCode')}:
              <br />
              {get(record, 'shift[1].startTime')} - {get(record, 'shift[1].endTime')}
            </div>
          );
        }
        return null;
      },
    },
    {
      title: 'Chi tiết',
      key: 'description',
      className: 'min-width-200',
      width: 200,
      render: (record) => !record.responseInvalid && this.renderDescription(record.timekeeping),
    },
    {
      title: 'Giờ vào',
      key: 'checkIn',
      className: 'min-width-100',
      width: 100,
      render: (record) => !record.responseInvalid && record.checkIn,
    },
    {
      title: 'Giờ ra',
      key: 'checkOut',
      className: 'min-width-100',
      width: 100,
      render: (record) => !record.responseInvalid && record.checkOut,
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
    const loading = effects['timekeepingInvalid/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách không xác định công" />
        <div
          className={classnames(styles['content-form'], styles['content-form-timekeepingInvalid'])}
        >
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh sách không xác định công</Text>
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
                    disabledDate={(current) => Helper.disabledDateFrom(current, this.formRef)}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="endDate"
                    onChange={(event) => this.onChangeDate(event, 'endDate')}
                    type={variables.DATE_PICKER}
                    disabledDate={(current) => Helper.disabledDateTo(current, this.formRef)}
                    allowClear={false}
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
              childrenColumnName="responseInvalid"
              defaultExpandAllRows
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.date || record.id}
              scroll={{ x: '100%', y: '80vh' }}
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
