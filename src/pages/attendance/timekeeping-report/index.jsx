import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, isEmpty, size } from 'lodash';
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
const mapStateToProps = ({ timekeepingReport, loading }) => ({
  data: timekeepingReport.data,
  pagination: timekeepingReport.pagination,
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
        type: query?.type || 'DATE',
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
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'timekeepingReport/GET_DATA',
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
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchMonth = debounce((value) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          startDate: moment(value).startOf('month'),
          endDate: moment(value).endOf('month'),
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

  onChangeMonth = (e) => {
    this.debouncedSearchMonth(e);
  };

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
    showTotal: (total, [start, end]) => `Hiển thị ${start}-${end} trong ${total}`,
  });

  renderTitleHeader = (index, item) => {
    if (index !== null && item) {
      return (
        <div>
          {HelperModules.getDayOfWeek(moment(item).format('d'))} <br />{' '}
          {moment(item).format('DD-MM')}
        </div>
      );
    }
    return null;
  };

  renderContentDate = (date, record) => {
    const attendance = record.attendance.find(
      (item) =>
        Helper.getDate(item.date, variables.DATE_FORMAT.DATE_AFTER) ===
        Helper.getDate(date, variables.DATE_FORMAT.DATE_AFTER),
    );
    if (attendance) {
      return variablesModules.STATUS_ABSENT_KEY[attendance.status];
    }
    return null;
  };

  renderReality = (items) => {
    if (!isEmpty(items.attendance)) {
      const attendance = items.attendance.filter(
        (item) =>
          item.stauts === variablesModules.STATUS_ABSENT.HAVE_IN ||
          variablesModules.STATUS_ABSENT.HAVE_OUT,
      );
      return size(attendance);
    }
    return null;
  };

  renderAbsents = (items) => {
    if (!isEmpty(items.attendance)) {
      const attendance = items.attendance.filter(
        (item) =>
          item.stauts === variablesModules.STATUS_ABSENT.ANNUAL_LEAVE ||
          variablesModules.STATUS_ABSENT.UNPAID_LEAVE,
      );
      return size(attendance);
    }
    return null;
  };

  /**
   * Function header table
   */
  header = () => {
    const { search } = this.state;
    const arrayHeader = [
      {
        title: 'Họ và Tên',
        key: 'fullName',
        className: 'min-width-220',
        width: 220,
        fixed: 'left',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record?.fileImage)}
            fullName={record?.fullName}
          />
        ),
      },
      {
        title: 'Cơ sở',
        key: 'branch',
        className: 'min-width-180',
        width: 180,
        render: (record) => record?.classStudent?.class?.branch?.name,
      },
      {
        title: 'Lớp',
        key: 'class',
        className: 'min-width-180',
        width: 180,
        render: (record) => record?.classStudent?.class?.name,
      },
      {
        title: 'Định mức học',
        key: 'allowances',
        align: 'center',
        className: 'min-width-100',
        width: 100,
        fixed: 'right',
        render: (record) => record?.class?.name,
      },
      {
        title: 'Phép',
        key: 'absents',
        align: 'center',
        className: 'min-width-100',
        width: 100,
        fixed: 'right',
        render: (record) => this.renderAbsents(record),
      },
      {
        title: 'Học thực tế',
        key: 'reality',
        align: 'center',
        className: 'min-width-100',
        width: 100,
        fixed: 'right',
        render: (record) => this.renderReality(record),
      },
    ];
    const arrayHeaderDate = Helper.convertArrayDays(search.startDate, search.endDate).map(
      (item, index) => ({
        title: this.renderTitleHeader(index, item),
        key: Helper.convertArrayDays(search.startDate, search.endDate)[index],
        className: classnames('min-width-80', 'max-width-80'),
        width: 80,
        align: 'center',
        render: (record) => (
          <div className={styles['item-schedules']}>{this.renderContentDate(item, record)}</div>
        ),
      }),
    );
    return [...arrayHeader.slice(0, 3), ...arrayHeaderDate, ...arrayHeader.slice(3)];
  };

  render() {
    const {
      data,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search } = this.state;
    const loading = effects['timekeepingReport/GET_DATA'];
    return (
      <>
        <Helmet title="Tổng hợp điểm danh" />
        <div
          className={classnames(styles['content-form'], styles['content-form-timekeepingReport'])}
        >
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Tổng hợp điểm danh</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                date: search.date ? moment(search.date) : null,
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
                    data={variables.CHOOSE}
                    name="type"
                    allowClear={false}
                    onChange={this.onChangeType}
                    type={variables.SELECT}
                  />
                </div>
                {search.type === 'DATE' && (
                  <>
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
                  </>
                )}
                {search.type === 'MONTH' && (
                  <>
                    <div className="col-lg-3">
                      <FormItem
                        name="startDate"
                        onChange={this.onChangeMonth}
                        type={variables.MONTH_PICKER}
                      />
                    </div>
                  </>
                )}
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
              scroll={{ x: '100%', y: '70vh' }}
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
