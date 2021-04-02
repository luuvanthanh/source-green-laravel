import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Modal, Form, Checkbox, Tooltip, Avatar } from 'antd';
import classnames from 'classnames';
import { isEmpty, head, debounce, get } from 'lodash';
import { Helmet } from 'react-helmet';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import { RRule, RRuleSet } from 'rrule';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import HelperModules from '../utils/Helper';
import PropTypes from 'prop-types';
import stylesChildren from './styles.modules.scss';
import { REPEAT } from './data.json';

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
const mapStateToProps = ({ schedulesChildren, loading }) => ({
  data: schedulesChildren.data,
  category: schedulesChildren.category,
  pagination: schedulesChildren.pagination,
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();
  formRefShift = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
    } = props;
    this.state = {
      search: {
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        end_date: HelperModules.getEndDate(query?.end_date, query?.choose),
        start_date: HelperModules.getStartDate(query?.start_date, query?.choose),
      },
      user: {},
      dayOfWeek: moment(),
      visible: false,
      visibleSchedule: false,
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
      type: 'schedulesChildren/GET_CATEGORY',
      callback: () => {},
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
      type: 'schedulesChildren/GET_DATA',
      payload: {
        ...search,
        status,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
        end_date: Helper.getDate(search.end_date, variables.DATE_FORMAT.DATE_AFTER),
        start_date: Helper.getDate(search.start_date, variables.DATE_FORMAT.DATE_AFTER),
      }),
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
    hideOnSinglePage: pagination?.total_pages <= 1,
    showSizeChanger: true,
    onChange: (page, size) => {
      this.onLoadData(page, size);
    },
    onShowSizeChange: (current, size) => {
      this.onLoadData(current, size);
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
   * Function reset form
   */
  onReset = () => {
    const { category } = this.props;
    this.setState(
      {
        visible: false,
      },
      () => {
        this.formRefShift.current.resetFields();
      },
    );
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
        type: !isEmpty(objects) ? 'schedulesChildren/UPDATE' : 'schedulesChildren/ADD',
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

  onShowModal = (dayOfWeek, record, user) => {
    this.setStateData({
      user,
      dayOfWeek,
      visible: true,
    });
  };

  onRemove = (record, user) => {
    this.setState({
      user,
      schedule: record,
      visibleSchedule: true,
    });
  };

  cancelSchedule = () => {
    this.setState({
      user: {},
      schedule: {},
      visibleSchedule: false,
    });
  };

  cancelModal = () => {
    this.setStateData(
      {
        user: {},
        visible: false,
      },
      () => {
        this.formRefShift.current.resetFields();
      },
    );
  };

  renderTitleHeader = (index, item) => {
    if (index !== null && item) {
      return (
        <div
          className={classnames(stylesChildren['cell-heading'], {
            [stylesChildren[`cell-heading-weekend`]]: moment(item).isoWeekday() >= 6,
          })}
        >
          {HelperModules.getDayOfWeek(moment(item).format('ddd'))} {moment(item).format('DD-MM')}
        </div>
      );
    }
    return null;
  };

  onConvertItemRRule = (item) => {
    const { search } = this.state;
    if (!isEmpty(item)) {
      const rule = new RRuleSet();
      rule.rrule(
        new RRule({
          freq: RRule[item.scheduleRepeat.repeat_by?.toUpperCase()],
          interval: item.scheduleRepeat.interval || 1,
          byweekday: item.by_week_day
            ? RRule[item.scheduleRepeat.by_week_day[0]?.toUpperCase()]
            : null,
          dtstart: new Date(Helper.getDate(item.start_date, variables.DATE_FORMAT.DATE_AFTER)),
          until:
            moment(item.end_date).diff(moment(search.end_date), 'days', true) > 0
              ? new Date(Helper.getDate(search.end_date, variables.DATE_FORMAT.DATE_AFTER))
              : new Date(Helper.getDate(item.end_date, variables.DATE_FORMAT.DATE_AFTER)),
        }),
      );
      if (!isEmpty(item.scheduleException)) {
        item.scheduleException.forEach((itemScheduleException) => {
          rule.exdate(
            new Date(Helper.getDate(itemScheduleException.date, variables.DATE_FORMAT.DATE_AFTER)),
          );
        });
      }
      return rule.all();
    }
    return [];
  };

  renderWorkShift = (record = [], dayOfWeek = moment(), user = {}) => {
    if (!isEmpty(record)) {
      let dataRRule = [];
      record.forEach((item) => {
        if (!item.scheduleRepeat) {
          dataRRule = [...dataRRule, item];
        } else {
          const itemRRulle = this.onConvertItemRRule(item);
          dataRRule = dataRRule.concat(
            itemRRulle.map((itemRRule) => ({ ...item, start_date: itemRRule })),
          );
        }
      });
      if (!isEmpty(dataRRule)) {
        const data = dataRRule.find(
          (item) =>
            moment(get(item, 'start_date')).format(variables.DATE_FORMAT.DATE_AFTER) ===
            moment(dayOfWeek).format(variables.DATE_FORMAT.DATE_AFTER),
        );
        if (!isEmpty(data)) {
          return (
            <Tooltip
              title={
                <div className={stylesChildren['tooltip-container']}>
                  <strong>Ca {get(data, 'shift.shift_code')}:</strong>
                  <br />
                  {!isEmpty(get(data, 'shift.shiftDetail')) &&
                    data.shift.shiftDetail.map((item, index) => {
                      const startTime = moment(
                        item.start_time,
                        variables.DATE_FORMAT.TIME_FULL,
                      ).format(variables.DATE_FORMAT.HOUR);
                      const endTime = moment(item.end_time, variables.DATE_FORMAT.TIME_FULL).format(
                        variables.DATE_FORMAT.HOUR,
                      );
                      return (
                        <div key={index}>
                          <span>
                            {startTime}-{endTime}
                          </span>
                          <br />
                        </div>
                      );
                    })}
                </div>
              }
              color="#00B24D"
            >
              <div
                className={classnames(
                  stylesChildren['cell-content'],
                  stylesChildren['cell-content-code'],
                  {
                    [stylesChildren[`cell-heading-weekend`]]: moment(dayOfWeek).isoWeekday() >= 6,
                  },
                )}
              >
                {get(data, 'shift.shift_code')}
                <div className={stylesChildren['fade-cell']}>
                  <button
                    type="button"
                    className={stylesChildren['fade-cell-item']}
                    onClick={() => {
                      this.onRemove(data, user);
                    }}
                  >
                    <CloseOutlined />
                  </button>
                </div>
              </div>
            </Tooltip>
          );
        }
      }
    }
    return (
      <div
        className={classnames(stylesChildren['cell-content'], {
          [stylesChildren[`cell-heading-weekend`]]: moment(dayOfWeek).isoWeekday() >= 6,
        })}
      >
        <Button
          color="primary"
          icon="plusMain"
          type="dashed"
          onClick={() => this.onShowModal(dayOfWeek, record, user)}
        ></Button>
      </div>
    );
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
        className: 'min-width-120',
        fixed: 'left',
        render: (record) => <Text size="normal">{record.full_name}</Text>,
      },
      {
        title: 'Hình ảnh',
        key: 'name',
        className: 'min-width-70',
        width: 70,
        align: 'center',
        fixed: 'left',
        render: (record) => <Avatar size={40} shape="square" icon={<UserOutlined />} />,
      },
    ];
    const arrayHeaderDate = Helper.convertArrayDays(search.start_date, search.end_date).map(
      (item, index) => ({
        title: this.renderTitleHeader(index, item),
        key: Helper.convertArrayDays(search.start_date, search.end_date)[index],
        className: classnames('min-width-100', 'max-width-100'),
        width: 100,
        align: 'center',
        render: (record) =>
          this.renderWorkShift(
            record.schedules,
            Helper.convertArrayDays(search.start_date, search.end_date)[index],
            record,
          ),
      }),
    );
    return arrayHeader.concat(arrayHeaderDate);
  };

  renderTitleModal = () => {
    const { user, dayOfWeek } = this.state;
    if (!isEmpty(user)) {
      return `${user.full_name} - ${Helper.getDate(dayOfWeek, variables.DATE_FORMAT.DATE_SLASH)}`;
    }
    return '';
  };

  onChoose = () => {
    const { dispatch, pagination } = this.props;
    const { user, dayOfWeek, search } = this.state;
    if (this.formRefShift) {
      this.formRefShift.current.validateFields().then((values) => {
        dispatch({
          type: 'schedulesChildren/ADD',
          payload: {
            ...search,
            limit: 10,
            repeat_by: values.repeat_by,
            user_id: user.id,
            page: pagination.current_page,
            shift_id: values.shift_id,
            start_date_add: moment(dayOfWeek),
            by_week_day:
              repeat_by === variables.DATE_FORMAT.WEEKLY
                ? moment(dayOfWeek)
                    .format(variables.DATE_FORMAT.DAY_NAME)
                    .substr(0, 2)
                    .toLocaleLowerCase()
                : null,
          },
          callback: () => {
            this.onReset();
          },
        });
      });
    }
  };

  handleRemoveAll = () => {
    const { dispatch, pagination } = this.props;
    const { schedule, user, search } = this.state;
    dispatch({
      type: 'schedulesChildren/REMOVE',
      payload: {
        ...search,
        limit: 10,
        id: schedule.id,
        user_id: user.id,
        page: pagination.current_page,
        start_date_remove: schedule.start_date,
      },
    }).then(() => {
      this.cancelSchedule();
    });
  };

  handleRemoveOnly = () => {
    const { dispatch, pagination } = this.props;
    const { schedule, user, search } = this.state;
    dispatch({
      type: 'schedulesChildren/REMOVE_ONLY',
      payload: {
        ...search,
        limit: 10,
        isRepeat: true,
        id: schedule.id,
        user_id: user.id,
        date: schedule.start_date,
        page: pagination.current_page,
      },
    }).then(() => {
      this.cancelSchedule();
    });
  };

  convertTreeSelect = (items = [], keyValue = 'id', keyLabel = 'name') => {
    return items.map((item) => {
      let details = [];
      if (!isEmpty(item.shiftDetail)) {
        details = item.shiftDetail.map((item, index) => {
          const startTime = moment(item.start_time, variables.DATE_FORMAT.TIME_FULL).format(
            variables.DATE_FORMAT.HOUR,
          );
          const endTime = moment(item.end_time, variables.DATE_FORMAT.TIME_FULL).format(
            variables.DATE_FORMAT.HOUR,
          );
          return `${startTime} - ${endTime}`;
        });
      }
      return {
        [`${keyValue}`]: item.id,
        [`${keyLabel}`]: `${item.shift_code} (${details.join(', ')})`,
      };
    });
  };

  render() {
    const {
      data,
      pagination,
      category,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search, visible, visibleSchedule } = this.state;
    const loading = effects['schedulesChildren/GET_DATA'];
    const loadingSubmit = effects['schedulesChildren/ADD'];
    const loadingRemoveAll = effects['schedulesChildren/REMOVE'];
    const loadingRemoveOnly = effects['schedulesChildren/REMOVE_ONLY'];
    return (
      <>
        <Modal
          title="XÁC NHẬN"
          visible={visibleSchedule}
          className={stylesChildren['modal-confirm']}
          onCancel={this.cancelSchedule}
          centered
          width={400}
          footer={[
            <Button
              key="ONLY"
              color="primary"
              icon="cancel"
              loading={loadingRemoveOnly}
              onClick={this.handleRemoveOnly}
            >
              Xóa một ca
            </Button>,
            <Button
              key="ALL"
              color="success"
              icon="remove"
              loading={loadingRemoveAll}
              onClick={this.handleRemoveAll}
            >
              Xóa tất cả
            </Button>,
          ]}
        >
          <Text color="dark" size="large">
            Bạn có muốn xóa ca này hoặc xóa tất cả ca này trong tương lai?
          </Text>
        </Modal>
        <Modal
          visible={visible}
          title={this.renderTitleModal()}
          onOk={this.handleOk}
          centered
          className={stylesChildren.modal}
          onCancel={this.cancelModal}
          footer={[
            <Button key="cancel" color="white" onClick={this.cancelModal}>
              Hủy
            </Button>,
            <Button key="choose" color="success" onClick={this.onChoose} loading={loadingSubmit}>
              Lưu
            </Button>,
          ]}
        >
          <Form layout="vertical" ref={this.formRefShift} initialValues={{ repeat_by: null }}>
            <FormItem
              data={this.convertTreeSelect(category.shifts)}
              label="Thời gian"
              name="shift_id"
              type={variables.SELECT}
              rules={[variables.RULES.EMPTY]}
            />
            <FormItem
              data={REPEAT}
              label="Lựa chọn lặp lại"
              name="repeat_by"
              placeholder="Nhập từ khóa"
              type={variables.SELECT}
              allowClear={false}
            />
          </Form>
        </Modal>
        <Helmet title="Danh sách học sinh" />
        <div
          className={classnames(styles['content-form'], styles['content-form-schedulesChildren'])}
        >
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Điểm danh học sinh</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                productType: search.productType || null,
                start_date: search.start_date && moment(search.start_date),
                end_date: search.end_date && moment(search.end_date),
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="full_name"
                    onChange={(event) => this.onChange(event, 'full_name')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="start_date"
                    onChange={(event) => this.onChangeDate(event, 'start_date')}
                    type={variables.DATE_PICKER}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="end_date"
                    onChange={(event) => this.onChangeDate(event, 'end_date')}
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
              className={stylesChildren.table}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              bordered
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
