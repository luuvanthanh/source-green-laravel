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
const mapStateToProps = ({ workDeclarationsAdd, loading, menu }) => ({
  dataStores: workDeclarationsAdd.dataStores,
  loading: loading,
  error: workDeclarationsAdd.error,
  details: workDeclarationsAdd.details,
  categories: workDeclarationsAdd.categories,
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
        type: 'workDeclarationsAdd/GET_DETAILS',
        payload: get(params, 'id'),
      });
    }
    this.loadCategories();
  }

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workDeclarationsAdd/GET_CATEGORIES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: params.id ? 'workDeclarationsAdd/UPDATE' : 'workDeclarationsAdd/ADD',
      payload: {
        employeeId: values.employeeId,
        data: [
          {
            type: 'default',
            reason: values.reason,
            shiftId: values.shiftId,
            date: Helper.getDateTime({
              value: Helper.setDate({
                ...variables.setDateData,
                originValue: values.date,
                targetValue: '23:59:59',
              }),
              isUTC: false,
            }),
            time: values.time.map((item) => ({
              in: moment(item.in).format(variables.DATE_FORMAT.HOUR),
              out: moment(item.out).format(variables.DATE_FORMAT.HOUR),
            })),
          },
        ],
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
  };

  convertSelectShift = (items) => {
    if (!isEmpty(items)) {
      return items.map((item) => ({
        id: item.id,
        name: `${item.shiftCode} (${item.shiftDetail
          .map((itemShift) => `${itemShift.startTime} - ${itemShift.endTime}`)
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
      const { time } = this.formRef.current.getFieldsValue();
      this.formRef.current.setFieldsValue({
        time: time.map((item, indexTime) => {
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
    const loading = effects['workDeclarationsAdd/GET_DETAILS'];
    const loadingSubmit =
      effects['workDeclarationsAdd/ADD'] || effects['workDeclarationsAdd/UPDATE'];
    return (
      <>
        <Helmet title="Tạo mới khai báo công" />
        <Breadcrumbs last="Tạo mới khai báo công" menu={menuData} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          initialValues={{}}
          colon={false}
          onFinish={this.onFinish}
          ref={this.formRef}
        >
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <div className={styles['content-form']}>
              <div className="d-flex justify-content-between">
                <Text color="dark">TẠO MỚI KHAI BÁO CÔNG</Text>
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
                      name="employeeId"
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
                <div className="row">
                  <div className="col-lg-12">
                    <FormItem
                      data={this.convertSelectShift(categories.shifts)}
                      label="CA LÀM VIỆC"
                      name="shiftId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                      onChange={this.onChange}
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
