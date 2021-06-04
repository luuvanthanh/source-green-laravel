import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, InputNumber, TimePicker } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get, isEmpty, last, head } from 'lodash';
import PropTypes from 'prop-types';

import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Loading from '@/components/CommonComponent/Loading';
import Heading from '@/components/CommonComponent/Heading';
import Table from '@/components/CommonComponent/Table';
import Select from '@/components/CommonComponent/Select';
import moment from 'moment';
import variablesModules from '../../../utils/variables';

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
const mapStateToProps = ({ menu, absentsAdd, loading }) => ({
  loading,
  error: absentsAdd.error,
  categories: absentsAdd.categories,
  shiftUsers: absentsAdd.shiftUsers,
  menuLeftSchedules: menu.menuLeftHRM,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      detail: [],
    };
    setIsMounted(true);
  }

  componentWillUnmount() {
    setIsMounted(false);
  }

  componentDidMount() {
    this.loadDetails();
    this.loadCategories();
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

  loadDetails = () => {
    const {
      match: { params },
      dispatch,
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'absentsAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            this.formRef.current.setFieldsValue({
              ...response,
              startDate: response.startDate && moment(response.startDate),
              endDate: response.endDate && moment(response.endDate),
              type: response?.absentType?.type,
            });
            this.setStateData({
              detail: response.absentDetail.map((item, index) => ({
                ...item,
                index,
                isFullDate: item.isFullDate ? 1 : 0.5,
              })),
            });
          }
        },
      });
    }
  };

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'absentsAdd/GET_CATEGORIES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { detail } = this.state;
    dispatch({
      type: params.id ? 'absentsAdd/UPDATE' : 'absentsAdd/ADD',
      payload: {
        ...values,
        detail: detail.map((item) => ({
          ...item,
          date: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: item.date,
            }),
            format: variables.DATE_FORMAT.DATE_AFTER,
            isUTC: false,
          }),
          isFullDate: item.isFullDate === 1,
        })),
        id: params.id,
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              this.formRef.current.setFields([
                {
                  name: get(item, 'source.pointer'),
                  errors: [get(item, 'detail')],
                },
              ]);
            });
          }
        }
      },
    });
  };

  onChangeFullDate = (value, record) => {
    const { shiftUsers } = this.props;
    let itemShift = {};
    if (shiftUsers[Helper.getDate(record.date, variables.DATE_FORMAT.DATE_AFTER)]) {
      itemShift = shiftUsers[Helper.getDate(record.date, variables.DATE_FORMAT.DATE_AFTER)];
    }
    this.setStateData((prevState) => ({
      detail: prevState.detail.map((item) => {
        if (item.index === record.index) {
          return {
            ...item,
            isFullDate: value,
            shiftId: value === 1 ? null : item.shiftId,
            shiftCode: value === 1 ? null : item.shiftCode,
            startTime: value === 1 ? head(itemShift)?.startTime : item.startTime,
            endTime: value === 1 ? last(itemShift)?.endTime : item.endTime,
          };
        }
        return item;
      }),
    }));
  };

  onChangeShiftCode = (shiftId, record) => {
    const { shiftUsers } = this.props;
    const shifts = shiftUsers[Helper.getDate(record.date, variables.DATE_FORMAT.DATE_AFTER)];
    if (shifts) {
      const itemShift = shifts.find((item) => item.id === shiftId);
      this.setStateData((prevState) => ({
        detail: prevState.detail.map((item) => {
          if (item.index === record.index) {
            return {
              ...item,
              shiftId,
              shiftCode: itemShift.name || itemShift.shiftCode,
              startTime: itemShift?.startTime,
              endTime: itemShift?.endTime,
            };
          }
          return item;
        }),
      }));
    } else {
      this.setStateData((prevState) => ({
        detail: prevState.detail.map((item) => {
          if (item.index === record.index) {
            return {
              ...item,
              shiftId,
              startTime: null,
              endTime: null,
            };
          }
          return item;
        }),
      }));
    }
  };

  onChangeTimeStart = (event, record) => {
    this.setStateData((prevState) => ({
      detail: prevState.detail.map((item) => {
        if (item.index === record.index) {
          return {
            ...item,
            startTime: moment(event).format(variables.DATE_FORMAT.TIME_FULL),
          };
        }
        return item;
      }),
    }));
  };

  onChangeTimeEnd = (event, record) => {
    this.setStateData((prevState) => ({
      detail: prevState.detail.map((item) => {
        if (item.index === record.index) {
          return {
            ...item,
            endTime: moment(event).format(variables.DATE_FORMAT.TIME_FULL),
          };
        }
        return item;
      }),
    }));
  };

  /**
   * Function header table
   */
  header = () => {
    const { shiftUsers } = this.props;
    return [
      {
        title: 'Thời gian',
        key: 'date',
        className: 'min-width-200',
        width: 200,
        render: (record) => Helper.getDate(record.date, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Số ngày',
        key: 'isFullDate',
        className: 'min-width-150',
        width: 150,
        render: (record) => (
          <InputNumber
            value={record.isFullDate}
            min="0.5"
            max="1"
            step="0.5"
            placeholder="Nhập"
            style={{ width: '100%' }}
            onChange={(event) => this.onChangeFullDate(event, record)}
          />
        ),
      },
      {
        title: 'Loại ca',
        key: 'shiftCode',
        className: 'min-width-200',
        render: (record) => (
          <Select
            dataSet={
              shiftUsers[Helper.getDate(record.date, variables.DATE_FORMAT.DATE_AFTER)]?.map(
                (item) => ({
                  id: item.id,
                  name: item.name,
                }),
              ) || []
            }
            disabled={record.isFullDate === 1}
            value={record?.shiftId}
            style={{ width: '100%' }}
            placeholder="Chọn"
            onChange={(event) => this.onChangeShiftCode(event, record)}
          />
        ),
      },
      {
        title: 'Thời gian bắt đầu',
        key: 'startTime',
        className: 'min-width-200',
        render: (record) => (
          <TimePicker
            format={variables.DATE_FORMAT.HOUR}
            placeholder="Chọn"
            disabled
            value={record.startTime && moment(record.startTime, variables.DATE_FORMAT.TIME_FULL)}
            onSelect={(value) => this.onChangeTimeStart(value, record)}
          />
        ),
      },
      {
        title: 'Thời gian kết thúc',
        key: 'endTime',
        className: 'min-width-200',
        render: (record) => (
          <TimePicker
            format={variables.DATE_FORMAT.HOUR}
            placeholder="Chọn"
            disabled
            value={record.endTime && moment(record.endTime, variables.DATE_FORMAT.TIME_FULL)}
            onSelect={(value) => this.onChangeTimeEnd(value, record)}
          />
        ),
      },
    ];
  };

  formUpdate = (value, values) => {
    const { dispatch } = this.props;
    if (
      values.employeeId &&
      values.endDate &&
      values.startDate &&
      values.absentTypeId &&
      values.type
    ) {
      const dates = Helper.convertArrayDaysNotWeekends(values.startDate, values.endDate);
      this.setStateData({
        detail: dates.map((item, index) => ({ date: item, index })),
      });
      dispatch({
        type: 'absentsAdd/GET_SHIFT_USERS',
        payload: { ...values },
      });
    }
  };

  enableButton = (items) => {
    const enable = items.find((item) => !item.startTime || !item.endTime || !item.isFullDate);
    return !!enable;
  };

  render() {
    const {
      error,
      categories,
      match: { params },
      menuLeftSchedules,
      loading: { effects },
    } = this.props;
    const { detail } = this.state;
    const loading = effects['absentsAdd/GET_DETAILS'] || effects['absentsAdd/GET_CATEGORIES'];
    const loadingSubmit = effects['absentsAdd/ADD'] || effects['absentsAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs
          last={params.id ? 'Chỉnh sửa nghỉ phép' : 'Tạo nghỉ phép'}
          menu={menuLeftSchedules}
        />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          ref={this.formRef}
          onFinish={this.onFinish}
          onValuesChange={this.formUpdate}
        >
          <div className={styles['content-form']}>
            <Loading loading={loading} isError={error.isError} params={{ error }}>
              <div className={classnames(styles['content-children'], 'mt10')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row  mt-3">
                  <div className="col-lg-6">
                    <FormItem
                      label="Ngày bắt đầu"
                      name="startDate"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                      disabledDate={(current) =>
                        Helper.disabledDateFrom(current, this.formRef) ||
                        Helper.disabledDateWeekeend(current)
                      }
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      label="Ngày kết thúc"
                      name="endDate"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                      disabledDate={(current) =>
                        Helper.disabledDateTo(current, this.formRef) ||
                        Helper.disabledDateWeekeend(current)
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <FormItem
                      data={Helper.convertSelectUsers(categories.users)}
                      label="Nhân viên"
                      name="employeeId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <FormItem
                      data={variablesModules.TYPES_ABSENTS || []}
                      label="Hình thức chấm công"
                      name="type"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      data={categories?.absentTypes || []}
                      label="Loại công"
                      name="absentTypeId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <FormItem label="Lý do" name="reason" rules={[]} type={variables.INPUT} />
                  </div>
                </div>
                <hr />
                <Heading type="form-block-title" className="mb10">
                  Chi tiết nghỉ phép
                </Heading>
                <Table
                  bordered
                  columns={this.header()}
                  dataSource={detail}
                  isEmpty
                  className="table-edit"
                  pagination={false}
                  params={{
                    header: this.header(),
                    type: 'table',
                  }}
                  rowKey={(record) => record.id || record.index}
                  scroll={{ x: '100%' }}
                />
              </div>
              <div className={classnames('d-flex', 'justify-content-center', 'mt-4')}>
                <Button
                  color="gray"
                  icon="prev"
                  onClick={() => history.goBack()}
                  size="large"
                  className="mr-3"
                  loading={loadingSubmit}
                >
                  HỦY
                </Button>
                <Button
                  color="green"
                  icon="save"
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit}
                  disabled={this.enableButton(detail)}
                >
                  LƯU
                </Button>
              </div>
            </Loading>
          </div>
        </Form>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  shiftUsers: PropTypes.arrayOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  menuLeftSchedules: PropTypes.arrayOf(PropTypes.any),
  categories: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  shiftUsers: [],
  error: {},
  menuLeftSchedules: [],
  categories: {},
};

export default Index;
