import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import stylesModule from '@/assets/styles/Modules/Schedules/styles.module.scss';
import { DeleteOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { get, isEmpty } from 'lodash';
import Text from '@/components/CommonComponent/Text';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

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
const mapStateToProps = ({ workHoursAdd, loading, menu }) => ({
  dataStores: workHoursAdd.dataStores,
  loading: loading,
  error: workHoursAdd.error,
  details: workHoursAdd.details,
  categories: workHoursAdd.categories,
  menuData: menu.menuLeftSchedules,
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
        type: 'workHoursAdd/GET_DETAILS',
        payload: get(params, 'id'),
      });
    }
    this.loadCategories();
  }

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workHoursAdd/GET_CATEGORIES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (get(params, 'id')) {
      dispatch({
        type: 'workHoursAdd/UPDATE',
        payload: {
          user_id: values.user_id,
          user_create: values.user_id,
          date: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: values.date,
              targetValue: '23:59:59',
            }),
            isUTC: false,
          }),
          hours: values.hours.map((item) => ({
            in: moment(item.in).format(variables.DATE_FORMAT.HOUR),
            out: moment(item.out).format(variables.DATE_FORMAT.HOUR),
          })),
          id: get(params, 'id'),
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
    } else {
      dispatch({
        type: 'workHoursAdd/ADD',
        payload: {
          user_id: values.user_id,
          user_create: values.user_id,
          date: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: values.date,
              targetValue: '23:59:59',
            }),
            isUTC: false,
          }),
          hours: values.hours.map((item) => ({
            in: moment(item.in).format(variables.DATE_FORMAT.HOUR),
            out: moment(item.out).format(variables.DATE_FORMAT.HOUR),
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
    }
  };

  convertSelectShift = (items) => {
    if (!isEmpty(items)) {
      return items.map((item) => ({
        id: item.id,
        name: `${item.shift_code} (${item.shiftDetail
          .map((itemShift) => `${itemShift.start_time} - ${itemShift.end_time}`)
          .join(', ')})`,
      }));
    }
    return [];
  };

  convertSelectUsers = (items) => {
    if (!isEmpty(items)) {
      return items.map((item) => ({
        id: item.id,
        name: item.full_name,
      }));
    }
    return [];
  };

  onChange = (value) => {
    const { categories } = this.props;
    const shift = categories.shifts.find((item) => item.id === value);
    if (shift) {
      this.formRef.current.setFieldsValue({
        time: shift.shiftDetail,
      });
    }
  };

  onChangeTimePicker = (timeChoose, index, type = 'in') => {
    if (this.formRef.current) {
      const { hours } = this.formRef.current.getFieldsValue();
      this.formRef.current.setFieldsValue({
        hours: hours.map((item, indexTime) => {
          if (indexTime === index && type === 'in') {
            return {
              ...item,
              in: timeChoose,
            };
          }
          if (indexTime === index && type === 'out') {
            return {
              ...item,
              out: timeChoose,
            };
          }
          return item;
        }),
      });
    }
  };

  render() {
    const {
      error,
      menuData,
      categories,
      loading: { effects },
    } = this.props;
    const loading = effects['workHoursAdd/GET_DETAILS'];
    const loadingSubmit = effects['workHoursAdd/ADD'] || effects['workHoursAdd/UPDATE'];
    return (
      <>
        <Helmet title="Tạo mới công giờ hỗ trợ" />
        <Breadcrumbs last="Tạo mới công giờ hỗ trợ" menu={menuData} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          initialValues={{
            hours: [{}],
          }}
          colon={false}
          onFinish={this.onFinish}
          ref={this.formRef}
        >
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <div className={styles['content-form']}>
              <div className="d-flex justify-content-between">
                <Text color="dark">TẠO MỚI CÔNG GIỜ HỖ TRỢ</Text>
              </div>
              <div className={styles['content-children']}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-12">
                    <FormItem
                      data={this.convertSelectUsers(categories.users)}
                      label="NHÂN VIÊN"
                      name="user_id"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <FormItem
                      label="THỜI GIAN"
                      name="date"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.DATE_PICKER}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <FormItem
                      label="LÝ DO"
                      name="reason"
                      rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                      type={variables.TEXTAREA}
                    />
                  </div>
                </div>
                <Form.List name="hours">
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
                          <div className="col-lg-6">
                            <FormItem
                              onSelect={(value) => this.onChangeTimePicker(value, index, 'in')}
                              label="VÀO"
                              name={[field.name, 'in']}
                              fieldKey={[field.fieldKey, 'in']}
                              rules={[variables.RULES.EMPTY]}
                              type={variables.TIME_PICKER}
                            />
                          </div>
                          <div className="col-lg-6">
                            <FormItem
                              onSelect={(value) => this.onChangeTimePicker(value, index, 'out')}
                              label="RA"
                              name={[field.name, 'out']}
                              fieldKey={[field.fieldKey, 'out']}
                              rules={[variables.RULES.EMPTY]}
                              type={variables.TIME_PICKER}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Form.List>
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
