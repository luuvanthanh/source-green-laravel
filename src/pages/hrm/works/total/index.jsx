import React, { PureComponent } from 'react';
import { connect, history, Link } from 'umi';
import { Form, Avatar } from 'antd';
import classnames from 'classnames';
import { isEmpty, head, debounce, get, isInteger } from 'lodash';
import { UserOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import HelperModules from '../../utils/Helper';
import PropTypes from 'prop-types';
import { CHOOSE } from './data.json';

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
const mapStateToProps = ({ works, loading }) => ({
  data: works.data,
  pagination: works.pagination,
  error: works.error,
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
        type: query?.type || 'DATE',
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
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'works/GET_DATA',
      payload: {
        ...search,
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
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchType = debounce((value) => {
    if (value === 'MONTH') {
      this.setStateData(
        (prevState) => ({
          search: {
            ...prevState.search,
            type: value,
            startDate: moment(prevState.search.startDate).startOf('month'),
            endDate: moment(prevState.search.endDate).endOf('month'),
          },
        }),
        () => {
          this.formRef.current.setFieldsValue({
            startDate: moment(this.state.search.startDate).startOf('month'),
            endDate: moment(this.state.search.endDate).endOf('month'),
          });
          this.onLoad();
        },
      );
    } else {
      this.setStateData(
        (prevState) => ({
          search: {
            ...prevState.search,
            type: value,
          },
        }),
        () => this.onLoad(),
      );
    }
  }, 300);

  /**
   * Function change type
   * @param {object} e value of select
   */
  onChangeType = (e) => {
    this.debouncedSearchType(e);
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
      this.changePagination(page, size);
    },
    onShowSizeChange: (current, size) => {
      this.changePagination(current, size);
    },
  });

  renderTitleHeader = (index, item) => {
    if (index !== null && item) {
      return (
        <div>
          {HelperModules.getDayOfWeek(moment(item).format('ddd'))} {moment(item).format('DD-MM')}
        </div>
      );
    }
    return null;
  };

  redirectHistory = (item, record) => {
    return `/lich-lam-viec/lich-su-ra-vao-v2?${Helper.convertParamSearch(
      {
        startDate: Helper.getDate(item),
        endDate: Helper.getDate(item),
        user_id: record.id,
      },
      variables.QUERY_STRING,
    )}`;
  };

  redirectAdditionaltime = (record) => {
    const { search } = this.state;
    return `/cong-them?${Helper.convertParamSearch(
      {
        startDate: Helper.getDate(search.startDate),
        endDate: Helper.getDate(search.endDate),
        search: record.fullName,
      },
      variables.QUERY_STRING,
    )}`;
  };

  redirectSubtractionTime = (record) => {
    const { search } = this.state;
    return `/cong-tru?${Helper.convertParamSearch(
      {
        startDate: Helper.getDate(search.startDate),
        endDate: Helper.getDate(search.endDate),
        search: record.fullName,
      },
      variables.QUERY_STRING,
    )}`;
  };

  renderWorkShift = (record = [], dayOfWeek = Helper.getDate(moment())) => {
    if (!isEmpty(record)) {
      const data = record.find((item) => Helper.getDate(item.date) === Helper.getDate(dayOfWeek));
      if (get(data, 'type')) return data.type;
      if (data)
        return isInteger(data.timekeepingReport)
          ? data.timekeepingReport
          : Helper.toFixed(data.timekeepingReport);
      return '-';
    }
    return '-';
  };

  /**
   * Function header table
   */
  header = () => {
    const {
      location: { pathname },
    } = this.props;
    const { search } = this.state;
    const headerWork = [
      {
        title: 'Công',
        align: 'center',
        children: [
          {
            title: 'Ngày công thực tế',
            key: 'real_work',
            width: 80,
            className: classnames('max-width-80', 'min-width-80'),
            align: 'center',
            render: (record) => record.totalRealTimekeeping,
          },
          {
            title: 'Giờ dư',
            key: 'extra_hour',
            align: 'center',
            width: 80,
            className: classnames('max-width-80', 'min-width-80'),
            render: (record) => record.totalHourRedundantTimekeeping,
          },
        ],
      },
      {
        title: 'Giờ làm thêm',
        align: 'center',
        children: [
          {
            title: 'Tăng cường',
            key: 'hourIncrease',
            align: 'center',
            width: 80,
            className: classnames('max-width-80', 'min-width-80'),
            render: (record) => record.hourIncrease,
          },
          {
            title: 'Tăng ca(Đã nhân đôi)',
            key: 'hourOvertime',
            width: 80,
            className: classnames('max-width-90', 'min-width-90'),
            align: 'center',
            render: (record) => record.hourOvertime,
          },
        ],
      },
      {
        title: 'Công tăng ca đã quy đổi',
        align: 'center',
        children: [
          {
            title: 'Công',
            key: 'workOverTime',
            width: 80,
            className: classnames('max-width-80', 'min-width-80'),
            align: 'center',
            render: (record) => record.workOverTime,
          },
          {
            title: 'Dư',
            key: 'workHourRedundant',
            align: 'center',
            width: 80,
            className: classnames('max-width-80', 'min-width-80'),
            render: (record) => record.workHourRedundant,
          },
        ],
      },
      {
        title: 'Phép',
        align: 'center',
        children: [
          {
            title: 'CĐ ',
            key: 'totalAnnualAbsent',
            width: 80,
            className: classnames('max-width-80', 'min-width-80'),
            align: 'center',
            render: (record) => record.totalAnnualAbsent,
          },
          {
            title: 'C',
            key: 'totalUnpaidAbsent',
            align: 'center',
            width: 80,
            className: classnames('max-width-80', 'min-width-80'),
            render: (record) => record.totalUnpaidAbsent,
          },
          {
            title: 'OFF',
            key: 'totalOffAbsent',
            align: 'center',
            width: 80,
            className: classnames('max-width-80', 'min-width-80'),
            render: (record) => record.totalOffAbsent,
          },
        ],
      },
      {
        title: 'Công thêm',
        align: 'center',
        key: 'additional_time',
        children: [
          {
            title: 'Ngày',
            key: 'total_additional_times',
            align: 'center',
            width: 80,
            className: classnames('max-width-80', 'min-width-80'),
            render: (record) => (
              <Link className={styles['item-schedules']} to={this.redirectAdditionaltime(record)}>
                {record.totalAdditionalTimes}
              </Link>
            ),
          },
          {
            title: 'Giờ',
            key: 'total_additional_hours',
            align: 'center',
            width: 80,
            className: classnames('max-width-80', 'min-width-80'),
            render: (record) => (
              <Link className={styles['item-schedules']} to={this.redirectAdditionaltime(record)}>
                {record.totalAdditionalHours}
              </Link>
            ),
          },
        ],
      },
      {
        title: 'Công trừ',
        align: 'center',
        key: 'additional_time',
        children: [
          {
            title: 'Ngày',
            key: 'total_subtraction_times',
            align: 'center',
            width: 80,
            className: classnames('max-width-80', 'min-width-80'),
            render: (record) => (
              <Link className={styles['item-schedules']} to={this.redirectSubtractionTime(record)}>
                {record.totalSubtractionTimes}
              </Link>
            ),
          },
          {
            title: 'Giờ',
            key: 'total_subtraction_hours',
            align: 'center',
            width: 80,
            className: classnames('max-width-80', 'min-width-80'),
            render: (record) => (
              <Link className={styles['item-schedules']} to={this.redirectSubtractionTime(record)}>
                {record.totalSubtractionHours}
              </Link>
            ),
          },
        ],
      },
      {
        title: 'Công sinh nhật',
        key: 'Thực',
        align: 'center',
        width: 80,
        className: classnames('max-width-80', 'min-width-80'),
        render: (record) => {
          if (record.workBirthday) {
            return isInteger(record.workBirthday)
              ? record.workBirthday
              : parseFloat(record.workBirthday).toFixed(2);
          }
          return null;
        },
      },
      {
        title: 'Công khai báo',
        key: 'totalWorkDeclarations',
        align: 'center',
        width: 80,
        className: classnames('max-width-80', 'min-width-80'),
        render: (record) => parseFloat(record.totalWorkDeclarations).toFixed(2),
      },
      {
        title: 'Thực công',
        key: 'date_work',
        align: 'center',
        width: 80,
        className: classnames('max-width-80', 'min-width-80'),
        render: (record) => record.totalTimekeepingWork,
      },
      {
        title: 'Phiếu ĐK giờ làm thêm',
        key: 'totalWorkHourSupport',
        align: 'center',
        width: 80,
        className: classnames('max-width-80', 'min-width-80'),
        render: (record) => record.totalWorkHourSupport,
      },
      {
        title: 'Giờ dư',
        key: 'date_work',
        align: 'center',
        width: 80,
        className: classnames('max-width-80', 'min-width-80'),
        render: (record) => record.totalHourRedundantWorks,
      },
    ];
    const arrayHeader = [
      {
        title: 'Họ và Tên',
        key: 'fullName',
        className: 'min-width-150',
        width: 150,
        fixed: 'left',
        render: (record) => <Text size="normal">{record.fullName}</Text>,
      },
      {
        title: 'Hình ảnh',
        key: 'name',
        className: 'min-width-100',
        width: 100,
        align: 'center',
        fixed: 'left',
        render: (record) => <Avatar size={40} shape="square" icon={<UserOutlined />} />,
      },
    ];
    const arrayHeaderDate = Helper.convertArrayDays(search.startDate, search.endDate).map(
      (item, index) => {
        const startDate = moment(search.startDate);
        const endDate = moment(search.endDate);
        const currentDate = Helper.convertArrayDays(startDate, endDate)[index];
        return {
          title: this.renderTitleHeader(index, item),
          key: Helper.convertArrayDays(search.startDate, search.endDate)[index],
          className: classnames('min-width-100', 'max-width-100'),
          width: 100,
          align: 'center',
          render: (record) => (
            <Link className={styles['item-schedules']} to={this.redirectHistory(item, record)}>
              {this.renderWorkShift(record.timeKeepingReport, currentDate)}
            </Link>
          ),
        };
      },
    );
    return arrayHeader.concat(arrayHeaderDate).concat(headerWork);
  };

  render() {
    const {
      data,
      error,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search } = this.state;
    const loading = effects['works/GET_DATA'];
    return (
      <>
        <Helmet title="Tổng hợp công" />
        <div className={classnames(styles['content-form'], styles['content-form-works'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Tổng hợp công</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                type: search.type || 'DATE',
                startDate: search.startDate && moment(search.startDate),
                endDate: search.endDate && moment(search.endDate),
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
                    data={CHOOSE}
                    name="type"
                    allowClear={false}
                    onChange={this.onChangeType}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="startDate"
                    onChange={(event) => this.onChangeDate(event, 'startDate')}
                    type={variables.DATE_PICKER}
                  />
                </div>
                <div className="col-lg-3">
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
              error={error}
              isError={error.isError}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              bordered
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
