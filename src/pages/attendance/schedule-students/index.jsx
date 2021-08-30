import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Modal, Form, Tooltip, Input } from 'antd';
import classnames from 'classnames';
import { isEmpty, debounce, get } from 'lodash';
import { Helmet } from 'react-helmet';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import { RRule, RRuleSet } from 'rrule';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import variablesModules from '../utils/variables';
import HelperModules from '../utils/Helper';
import stylesChildren from './styles.modules.scss';
import { REPEAT, CHOOSE } from './data.json';

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
const mapStateToProps = ({ scheduleStudents, loading }) => ({
  data: scheduleStudents.data,
  category: scheduleStudents.category,
  pagination: scheduleStudents.pagination,
  branches: scheduleStudents.branches,
  classes: scheduleStudents.classes,
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
        branchId: query?.branchId,
        classId: query?.classId,
        type: query?.type || 'DATE',
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        startDate: HelperModules.getDateSearch(query?.startDate),
        endDate: HelperModules.getDateSearch(query?.endDate, 'endDate'),
      },
      user: {},
      dayOfWeek: moment(),
      visible: false,
      showConfirm: false,
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
    const { search } = this.state;
    const { dispatch } = this.props;
    if (search.branchId) {
      dispatch({
        type: 'scheduleStudents/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    dispatch({
      type: 'scheduleStudents/GET_BRANCHES',
      payload: {},
    });
    dispatch({
      type: 'scheduleStudents/GET_CATEGORY',
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
      type: 'scheduleStudents/GET_DATA',
      payload: {
        ...search,
        status,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
        endDate: Helper.getDate(search.endDate, variables.DATE_FORMAT.DATE_AFTER),
        startDate: Helper.getDate(search.startDate, variables.DATE_FORMAT.DATE_AFTER),
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
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
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
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
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
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
          },
        }),
        () => this.onLoad(),
      );
    }
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
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */

  onChangeSelectBranch = debounce((e, type) => {
    this.formRef?.current?.setFieldsValue({ classId: null });
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          [`${type}`]: e,
          classId: '',
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
        },
      }),
      () => this.onLoad(),
    );
    this.props.dispatch({
      type: 'scheduleStudents/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
  }, 300);

  /**
   * Function change type
   * @param {object} e value of select
   */
  onChangeType = (type) => {
    const startDate = moment.utc().local().startOf('month');
    const endDate = moment.utc().local().endOf('month');
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          type,
          startDate,
          endDate,
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
        },
      }),
      () => {
        if (type === 'MONTH') {
          this.formRef?.current?.setFieldsValue({ month: moment(startDate) });
        } else {
          this.formRef.current.setFieldsValue({
            rageDate: [moment(startDate), moment(endDate)],
          });
        }

        this.debouncedLoadData();
      },
    );
  };

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDate = (e, type) => {
    let startDate = '';
    let endDate = '';
    if (type === 'month' && e) {
      startDate = moment.utc(e).local().startOf('month');
      endDate = moment.utc(e).local().endOf('month');
    }
    if (type === 'rangeDate' && e) {
      startDate = moment.utc(e[0]).local().startOf('day');
      endDate = moment.utc(e[1]).local().endOf('day');
    }
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          startDate,
          endDate,
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
        },
      }),
      () => {
        this.debouncedLoadData();
      },
    );
  };

  debouncedLoadData = debounce(() => {
    this.onLoad();
  }, 300);

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
   * Function reset form
   */
  onReset = () => {
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
   * Function show modal
   * @param {date} dayOfWeek date show modal
   * @param {object} record item of table
   * @param {object} user info user
   */
  onShowModal = (dayOfWeek, record, user) => {
    this.setStateData({
      user,
      dayOfWeek,
      visible: true,
    });
  };

  /**
   * Function show modal remove
   * @param {object} record item of table
   * @param {object} user info user
   */
  onRemove = (record, user) => {
    this.setState({
      user,
      schedule: record,
      showConfirm: true,
    });
  };

  /**
   * Function cancel modal schedules
   */
  cancelSchedule = () => {
    this.setState({
      user: {},
      schedule: {},
      showConfirm: false,
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
          {HelperModules.getDayOfWeek(moment(item).format('d'))} {moment(item).format('DD-MM')}
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
          freq: RRule[item.scheduleRepeat.repeatBy?.toUpperCase()],
          interval: item.scheduleRepeat.interval || 1,
          byweekday: item.byWeekDay ? RRule[item.scheduleRepeat.byWeekDay[0]?.toUpperCase()] : null,
          dtstart: new Date(Helper.getDate(item.startDate, variables.DATE_FORMAT.DATE_AFTER)),
          until:
            moment(item.endDate).diff(moment(search.endDate), 'days', true) > 0
              ? new Date(Helper.getDate(search.endDate, variables.DATE_FORMAT.DATE_AFTER))
              : new Date(Helper.getDate(item.endDate, variables.DATE_FORMAT.DATE_AFTER)),
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
    if (moment(dayOfWeek).isoWeekday() >= 6) {
      return (
        <div
          className={classnames(stylesChildren['cell-content'], {
            [stylesChildren[`cell-heading-weekend`]]: moment(dayOfWeek).isoWeekday() >= 6,
          })}
         />
      );
    }

    const absent = user?.absent?.find(
      (item) =>
        Helper.getDate(item.date, variables.DATE_FORMAT.DATE_AFTER) ===
        Helper.getDate(dayOfWeek, variables.DATE_FORMAT.DATE_AFTER),
    );
    if (absent) {
      return (
        <div
          className={classnames(
            stylesChildren['cell-content'],
            stylesChildren['cell-content'],
            stylesChildren['cell-content-code'],
            stylesChildren['cell-content-absent'],
            {
              [stylesChildren[`cell-heading-weekend`]]: moment(dayOfWeek).isoWeekday() >= 6,
            },
          )}
        >
          P
        </div>
      );
    }
    if (!isEmpty(record)) {
      let dataRRule = [];
      record.forEach((item) => {
        if (!item.scheduleRepeat) {
          dataRRule = [...dataRRule, item];
        } else {
          const itemRRulle = this.onConvertItemRRule(item);
          dataRRule = dataRRule.concat(
            itemRRulle.map((itemRRule) => ({ ...item, startDate: itemRRule })),
          );
        }
      });
      if (!isEmpty(dataRRule)) {
        const data = dataRRule.find(
          (item) =>
            moment(get(item, 'startDate')).format(variables.DATE_FORMAT.DATE_AFTER) ===
            moment(dayOfWeek).format(variables.DATE_FORMAT.DATE_AFTER),
        );
        if (!isEmpty(data)) {
          return (
            <Tooltip
              title={
                <div className={stylesChildren['tooltip-container']}>
                  <strong>Ca {get(data, 'shift.shiftCode')}:</strong>
                  <br />
                  {!isEmpty(get(data, 'shift.shiftDetail')) &&
                    data.shift.shiftDetail.map((item, index) => {
                      const startTime = moment(
                        item.startTime,
                        variables.DATE_FORMAT.TIME_FULL,
                      ).format(variables.DATE_FORMAT.HOUR);
                      const endTime = moment(item.endTime, variables.DATE_FORMAT.TIME_FULL).format(
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
                {get(data, 'shift.shiftCode')}
                {moment(dayOfWeek).diff(moment(), 'days', true) >= 0 && (
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
                )}
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
        {moment(dayOfWeek).diff(moment(), 'days', true) >= 0 &&
          moment(dayOfWeek).isoWeekday() < 6 && (
            <Button
              color="primary"
              icon="plusMain"
              type="dashed"
              onClick={() => this.onShowModal(dayOfWeek, record, user)}
            />
          )}
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
        title: (
          <Input
            value={search.fullName}
            onChange={(event) => this.onChange(event, 'fullName')}
            placeholder="Từ khóa"
          />
        ),
        key: 'fullName',
        className: 'pl10 pr10 min-width-200',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.fileImage)}
            fullName={record.fullName}
            description={`${record?.classStudent?.class?.name} - ${record?.classStudent?.class?.branch?.name}`}
          />
        ),
      },
    ];
    const arrayHeaderDate = Helper.convertArrayDays(search.startDate, search.endDate).map(
      (item, index) => ({
        title: this.renderTitleHeader(index, item),
        key: Helper.convertArrayDays(search.startDate, search.endDate)[index],
        className: classnames('min-width-100', 'max-width-100'),
        width: 100,
        align: 'center',
        render: (record) =>
          this.renderWorkShift(
            record.schedules,
            Helper.convertArrayDays(search.startDate, search.endDate)[index],
            record,
          ),
      }),
    );
    return arrayHeader.concat(arrayHeaderDate);
  };

  renderTitleModal = () => {
    const { user, dayOfWeek } = this.state;
    if (!isEmpty(user)) {
      return `${user.fullName} - ${Helper.getDate(dayOfWeek, variables.DATE_FORMAT.DATE_SLASH)}`;
    }
    return '';
  };

  onChoose = () => {
    const { dispatch } = this.props;
    const { user, dayOfWeek, search } = this.state;
    if (this.formRefShift) {
      this.formRefShift.current.validateFields().then((values) => {
        dispatch({
          type: 'scheduleStudents/ADD',
          payload: {
            ...search,
            limit: search.limit,
            repeatBy: values.repeatBy,
            studentId: user.id,
            page: search.page,
            shiftId: values.shiftId,
            startDateAdd: moment(dayOfWeek),
            byWeekDay:
              values.repeatBy === variables.DATE_FORMAT.WEEKLY
                ? variablesModules.DATE_OF_WEEK[moment().format('d')]
                : null,
          },
          callback: () => {
            this.onReset();
          },
        });
      });
    }
  };

  removeAll = () => {
    const { dispatch } = this.props;
    const { schedule, user, search } = this.state;
    dispatch({
      type: 'scheduleStudents/REMOVE',
      payload: {
        ...search,
        limit: search.limit,
        id: schedule.id,
        studentId: user.id,
        page: search.page,
        startDateRemove: schedule.startDate,
      },
    }).then(() => {
      this.cancelSchedule();
    });
  };

  removeOnly = () => {
    const { dispatch } = this.props;
    const { schedule, user, search } = this.state;
    dispatch({
      type: 'scheduleStudents/REMOVE_ONLY',
      payload: {
        ...search,
        limit: search.limit,
        isRepeat: true,
        id: schedule.id,
        studentId: user.id,
        date: schedule.startDate,
        page: search.page,
      },
    }).then(() => {
      this.cancelSchedule();
    });
  };

  convertTreeSelect = (items = [], branchId, keyValue = 'id', keyLabel = 'name') =>
    items
      ?.filter((obj) => (branchId ? obj.branchId === branchId : true))
      ?.map((item) => {
        let details = [];
        if (!isEmpty(item.shiftDetail)) {
          details = item.shiftDetail.map((item) => {
            const startTime = moment(item.startTime, variables.DATE_FORMAT.TIME_FULL).format(
              variables.DATE_FORMAT.HOUR,
            );
            const endTime = moment(item.endTime, variables.DATE_FORMAT.TIME_FULL).format(
              variables.DATE_FORMAT.HOUR,
            );
            return `${startTime} - ${endTime}`;
          });
        }
        return {
          [`${keyValue}`]: item.id,
          [`${keyLabel}`]: `${item.shiftCode} (${details.join(', ')})`,
        };
      });

  render() {
    const {
      classes,
      branches,
      data,
      category,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search, visible, showConfirm, user } = this.state;
    const loading = effects['scheduleStudents/GET_DATA'];
    const loadingSubmit = effects['scheduleStudents/ADD'];
    const loadingRemoveAll = effects['scheduleStudents/REMOVE'];
    const loadingRemoveOnly = effects['scheduleStudents/REMOVE_ONLY'];
    return (
      <>
        <Helmet title="Lịch học trẻ" />
        {/* MODAL CONFIRM */}
        <Modal
          visible={showConfirm}
          className={stylesChildren['modal-confirm']}
          onCancel={this.cancelSchedule}
          centered
          width={350}
          footer={[
            <Button
              key="ONLY"
              color="white"
              icon="cancel"
              loading={loadingRemoveOnly}
              onClick={this.removeOnly}
            >
              Xóa một ca
            </Button>,
            <Button
              key="ALL"
              color="danger"
              icon="remove"
              loading={loadingRemoveAll}
              onClick={this.removeAll}
            >
              Xóa tất cả
            </Button>,
          ]}
        >
          <Text color="dark" size="large">
            Bạn có muốn xóa ca này hoặc xóa tất cả ca này trong tương lai?
          </Text>
        </Modal>
        {/* MODAL CONFIRM */}
        {/* MODAL CHOOSE SHIFT */}
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
          <Form layout="vertical" ref={this.formRefShift} initialValues={{ repeatBy: null }}>
            <FormItem
              data={this.convertTreeSelect(
                category.shifts,
                user?.classStudent?.class?.branchId || search?.branchId,
              )}
              label="Thời gian"
              name="shiftId"
              type={variables.SELECT}
              rules={[variables.RULES.EMPTY]}
            />
            <FormItem
              data={REPEAT}
              label="Lựa chọn lặp lại"
              name="repeatBy"
              placeholder="Nhập từ khóa"
              type={variables.SELECT}
              allowClear={false}
            />
          </Form>
        </Modal>
        {/* MODAL CHOOSE SHIFT */}
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Lịch học trẻ</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                productType: search.productType || null,
                type: search.type || 'DATE',
                branchId: search.branchId || null,
                classId: search.classId || null,
                rageDate:
                  search?.type === 'DATE'
                    ? [moment(search.startDate), moment(search.endDate)]
                    : null,
                month: search?.type === 'MONTH' ? moment(search.startDate) : null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                    name="branchId"
                    onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Chọn tất cả lớp' }, ...classes]}
                    name="classId"
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
                    allowClear={false}
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
                {search?.type === 'DATE' ? (
                  <div className="col-lg-3">
                    <FormItem
                      name="rageDate"
                      onChange={(event) => this.onChangeDate(event, 'rangeDate')}
                      type={variables.RANGE_PICKER}
                      allowClear={false}
                    />
                  </div>
                ) : (
                  <div className="col-lg-3">
                    <FormItem
                      name="month"
                      onChange={(event) => this.onChangeDate(event, 'month')}
                      type={variables.MONTH_PICKER}
                      allowClear={false}
                    />
                  </div>
                )}
              </div>
            </Form>
            <Table
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              className={classnames(stylesChildren.table, 'table-edit')}
              isEmpty
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
  category: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  category: {},
  classes: [],
  branches: [],
};

export default Index;
