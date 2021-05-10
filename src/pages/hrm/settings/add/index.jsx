import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import stylesModule from '@/assets/styles/Modules/Schedules/styles.module.scss';
import { DeleteOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import moment from 'moment';
import { get, isEmpty } from 'lodash';
import Text from '@/components/CommonComponent/Text';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

const getTotalTime = (start, end) => {
  if (!start || !end) return null;
  return moment
    .utc(
      moment
        .duration(moment(end).startOf('second').diff(moment(start).startOf('second')))
        .asMilliseconds(),
    )
    .format(variables.DATE_FORMAT.HOUR);
};
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
const mapStateToProps = ({ schedulesSettingAdd, loading, menu }) => ({
  loading: loading,
  menuData: menu.menuLeftHRM,
  error: schedulesSettingAdd.error,
  details: schedulesSettingAdd.details,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {};
    setIsMounted(true);
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

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (get(params, 'id')) {
      dispatch({
        type: 'schedulesSettingAdd/GET_DETAILS',
        payload: get(params, 'id'),
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && get(params, 'id')) {
      this.formRef.current.setFieldsValue({
        shiftCode: get(details, 'shiftCode'),
        name: get(details, 'name'),
        time: get(details, 'shiftDetail').map((item) => {
          const startTime = moment(item.startTime, variables.DATE_FORMAT.TIME_FULL);
          const endTime = moment(item.endTime, variables.DATE_FORMAT.TIME_FULL);
          return {
            endTime,
            startTime,
            totalTime: getTotalTime(startTime, endTime),
          };
        }),
        description: get(details, 'description'),
      });
    }
  }

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: get(params, 'id') ? 'schedulesSettingAdd/UPDATE' : 'schedulesSettingAdd/ADD',
      payload: {
        ...values,
        id: get(params, 'id'),
        shiftId: get(params, 'id'),
        time: values.time.map((item) => ({
          endTime: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: item.endTime,
            }),
            format: variables.DATE_FORMAT.TIME_FULL,
            isUTC: false,
          }),
          startTime: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: item.startTime,
            }),
            format: variables.DATE_FORMAT.TIME_FULL,
            isUTC: false,
          }),
        })),
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

  onChangeTimePicker = (timeChoose, index, type = 'startTime') => {
    if (this.formRef.current) {
      const { time } = this.formRef.current.getFieldsValue();
      this.formRef.current.setFieldsValue({
        time: time.map((item, indexTime) => {
          if (indexTime === index) {
            let totalTime = null;
            if (type === 'startTime' && item.endTime) {
              totalTime = getTotalTime(timeChoose, item.endTime);
            }
            if (type === 'endTime' && item.startTime) {
              totalTime = getTotalTime(item.startTime, timeChoose);
            }
            return {
              ...item,
              startTime: type === 'startTime' ? timeChoose : item.startTime,
              endTime: type === 'endTime' ? timeChoose : item.endTime,
              totalTime,
            };
          }
          return item;
        }),
      });
    }
  };

  disabledHours = (index) => {
    const { getFieldsValue } = this.formRef.current;
    const { time } = getFieldsValue();
    const itemLast = time.find((item, indexTime) => indexTime === index - 1);
    if (get(itemLast, 'startTime') && get(itemLast, 'endTime')) {
      const arrayHours = [];
      const startTime = parseInt(moment(itemLast.startTime).format('H'), 10);
      const endTime = parseInt(moment(itemLast.endTime).format('H'), 10);
      const endTimeMinutes = parseInt(moment(itemLast.endTime).format('m'), 10);
      if (startTime === endTime) {
        if (endTimeMinutes === 59) {
          for (let i = startTime; i <= endTime; i += 1) {
            arrayHours.push(i);
          }
          return arrayHours;
        }
        return [];
      }
      if (startTime < endTime) {
        for (let i = startTime; i < endTime; i += 1) {
          arrayHours.push(i);
        }
      } else {
        for (let i = 0; i < endTime; i += 1) {
          arrayHours.push(i);
        }
        for (let i = startTime; i <= 23; i += 1) {
          arrayHours.push(i);
        }
      }
      return uniqBy(arrayHours);
    }
    return [];
  };

  disabledMinutes = (selectedHour, index, type = 'startTime') => {
    const { getFieldsValue } = this.formRef.current;
    const { time } = getFieldsValue();
    const itemLast = time.find((item, indexTime) => indexTime === index - 1);
    const itemCurrent = time.find((item, indexTime) => indexTime === index);
    const startTimeMinutesCurrent = parseInt(moment(itemCurrent.startTime).format('m'), 10);
    if (get(itemLast, 'startTime') && get(itemLast, 'endTime')) {
      const arrayHours = [];
      const endTime = parseInt(moment(itemLast.endTime).format('H'), 10);
      const startTimeMinutes = parseInt(moment(itemLast.startTime).format('m'), 10);
      const endTimeMinutes = parseInt(moment(itemLast.endTime).format('m'), 10);
      if (selectedHour !== endTime) {
        return [];
      }
      if (type === 'endTime') {
        if (startTimeMinutes < endTimeMinutes) {
          for (let i = startTimeMinutes; i < endTimeMinutes; i += 1) {
            arrayHours.push(i);
          }
          for (let i = endTimeMinutes; i < startTimeMinutesCurrent; i += 1) {
            arrayHours.push(i);
          }
        }
      } else if (startTimeMinutes < endTimeMinutes) {
        for (let i = startTimeMinutes; i < endTimeMinutes; i += 1) {
          arrayHours.push(i);
        }
      }
      return uniqBy(arrayHours);
    }
    return [];
  };

  renderTimeHelper = (index) => {
    if (!this.formRef.current) return <></>;
    const { getFieldsValue } = this.formRef.current;
    const { startTime, endTime } = get(getFieldsValue(), `time.${index}`, {});
    if (!startTime || !endTime) return <></>;
    const range = moment.utc(endTime.diff(startTime)).format('HH:mm');
    return <span>{range}</span>;
  };

  render() {
    const {
      error,
      menuData,
      loading: { effects },
    } = this.props;
    const loading = effects['schedulesSettingAdd/GET_DETAILS'];
    const loadingSubmit =
      effects['schedulesSettingAdd/ADD'] || effects['schedulesSettingAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs last="Tạo mới ca" menu={menuData} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          initialValues={{
            time: [{}],
          }}
          colon={false}
          onFinish={this.onFinish}
          ref={this.formRef}
        >
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <div className={styles['content-form']}>
              <div className={classnames(styles['content-children'], 'mt10')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-6">
                    <FormItem
                      label="MÃ CA"
                      name="shiftCode"
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      label="TÊN CA"
                      name="name"
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                </div>
                <Form.List name="time">
                  {(fields, { add, remove }) => (
                    <div>
                      {fields.map((field, index) => (
                        <div
                          className={classnames(
                            'row',
                            stylesModule['form-item'],
                            stylesModule['form-item-advance'],
                          )}
                          key={field.key}
                        >
                          <div className="col-lg-4">
                            <FormItem
                              onSelect={(value) =>
                                this.onChangeTimePicker(value, index, 'startTime')
                              }
                              label="THỜI GIAN TỪ"
                              name={[field.name, 'startTime']}
                              fieldKey={[field.fieldKey, 'startTime']}
                              rules={[variables.RULES.EMPTY]}
                              type={variables.TIME_PICKER}
                            />
                          </div>
                          <div className="col-lg-4">
                            <FormItem
                              onSelect={(value) => this.onChangeTimePicker(value, index, 'endTime')}
                              label="ĐẾN"
                              name={[field.name, 'endTime']}
                              fieldKey={[field.fieldKey, 'endTime']}
                              rules={[variables.RULES.EMPTY]}
                              type={variables.TIME_PICKER}
                            />
                          </div>
                          <div className="col-lg-4">
                            <Form.Item label={<span>Tổng thời gian</span>} shouldUpdate>
                              {({ getFieldValue }) => {
                                const totalTime = get(getFieldValue('time'), `${index}.totalTime`);
                                return totalTime;
                              }}
                            </Form.Item>
                          </div>
                          <>
                            {fields?.length > 1 ? (
                              <DeleteOutlined
                                className={classnames(stylesModule['icon-delete'], 'ml-1')}
                                onClick={() => {
                                  remove(field.name);
                                }}
                              />
                            ) : null}
                          </>
                        </div>
                      ))}
                      <div className="row mb-3">
                        <div className="col-lg-3">
                          <Button
                            color="success"
                            icon="plusMain"
                            onClick={() => {
                              add();
                            }}
                          >
                            Thêm dòng
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Form.List>
                <div className="row mt-3">
                  <div className="col-lg-12">
                    <FormItem
                      label="MÔ TẢ"
                      name="description"
                      rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                      type={variables.TEXTAREA}
                    />
                  </div>
                </div>
              </div>
              <div className={classnames('d-flex', 'justify-content-center', 'mt-4')}>
                <Button
                  color="gray"
                  icon="prev"
                  onClick={() => history.goBack()}
                  size="large"
                  className="mr-3"
                  loading={loadingSubmit || loading}
                >
                  HỦY
                </Button>
                <Button
                  color="green"
                  icon="save"
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit || loading}
                >
                  LƯU
                </Button>
              </div>
            </div>
          </Loading>
        </Form>
      </>
    );
  }
}

Index.propTypes = {};

export default Index;
