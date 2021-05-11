import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { DeleteOutlined } from '@ant-design/icons';
import Text from '@/components/CommonComponent/Text';
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
const mapStateToProps = ({ menu, businessCardsAdd, loading }) => ({
  loading,
  categories: businessCardsAdd.categories,
  details: businessCardsAdd.details,
  menuData: menu.menuLeftHRM,
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

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'businessCardsAdd/GET_DETAILS',
        payload: {
          id: params.id,
        },
      });
    }
    this.loadCategories();
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && get(params, 'id')) {
      this.formRef.current.setFieldsValue({
        ...details,
        startDate: details.startDate && moment(details.startDate),
        endDate: details.endDate && moment(details.endDate),
        detail: details.businessCardDetail.map((item) => ({
          ...item,
          date: item.date && moment(details.date),
          startTime: item.startTime && moment(`${moment(details.date).format(variables.DATE_FORMAT.DATE_AFTER)} ${item.startTime}`),
          endTime: item.endTime && moment(`${moment(details.date).format(variables.DATE_FORMAT.DATE_AFTER)} ${item.endTime}`),
        })),
      });
    }
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
      type: 'businessCardsAdd/GET_CATEGORIES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: params.id ? 'businessCardsAdd/UPDATE' : 'businessCardsAdd/ADD',
      payload: {
        id: params.id,
        ...values,
        detail: values.detail.map((item) => ({
          ...item,
          date: moment(item.date).format(variables.DATE_FORMAT.DATE_AFTER),
          endTime: moment(item.endTime).format(variables.DATE_FORMAT.TIME_FULL),
          startTime: moment(item.startTime).format(variables.DATE_FORMAT.TIME_FULL),
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
      const { detail } = this.formRef.current.getFieldsValue();
      this.formRef.current.setFieldsValue({
        detail: detail.map((item, indexTime) => {
          if (indexTime === index) {
            return {
              ...item,
              startTime: type === 'startTime' ? timeChoose : item.startTime,
              endTime: type === 'endTime' ? timeChoose : item.endTime,
            };
          }
          return item;
        }),
      });
    }
  };

  render() {
    const {
      categories,
      menuData,
      loading: { effects },
      match: { params },
    } = this.props;
    const loadingSubmit = effects['businessCardsAdd/ADD'] || effects['businessCardsAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs
          last={params.id ? 'Chỉnh sửa đơn đi công tác' : 'Tạo mới đi công tác'}
          menu={menuData}
        />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          ref={this.formRef}
          initialValues={{
            detail: [{}],
          }}
          onFinish={this.onFinish}
        >
          <div className={styles['content-form']}>
            <div className={classnames(styles['content-children'], 'mt10')}>
              <Text color="dark" size="large-medium">
                THÔNG TIN CHUNG
              </Text>
              <div className="row mt-3">
                <div className="col-lg-6">
                  <FormItem
                    data={Helper.convertSelectUsers(categories?.users)}
                    label="NHÂN VIÊN"
                    name="employeeId"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-6">
                  <FormItem
                    data={categories?.absentTypes}
                    label="LOẠI CÔNG TÁC"
                    name="absentTypeId"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.SELECT}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <FormItem
                    label="NGÀY BẮT ĐẦU"
                    name="startDate"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.DATE_PICKER}
                  />
                </div>
                <div className="col-lg-6">
                  <FormItem
                    label="NGÀY KẾT THÚC"
                    name="endDate"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.DATE_PICKER}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <FormItem
                    label="Lý do"
                    name="reason"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <Form.List name="detail">
                    {(fields, { add, remove }) => (
                      <div>
                        {fields.map((field, index) => (
                          <div
                            className={classnames(
                              'row',
                              styles['form-item'],
                              styles['form-item-advance'],
                            )}
                            key={field.key}
                          >
                            <div className="col-lg-4">
                              <FormItem
                                label="NGÀY"
                                name={[field.name, 'date']}
                                fieldKey={[field.fieldKey, 'date']}
                                rules={[variables.RULES.EMPTY]}
                                type={variables.DATE_PICKER}
                              />
                            </div>
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
                                onSelect={(value) =>
                                  this.onChangeTimePicker(value, index, 'endTime')
                                }
                                label="ĐẾN"
                                name={[field.name, 'endTime']}
                                fieldKey={[field.fieldKey, 'endTime']}
                                rules={[variables.RULES.EMPTY]}
                                type={variables.TIME_PICKER}
                              />
                            </div>

                            <div className="col-lg-4">
                              <FormItem
                                label="GIỜ"
                                name={[field.name, 'number']}
                                fieldKey={[field.fieldKey, 'number']}
                                rules={[variables.RULES.EMPTY]}
                                type={variables.INPUT_COUNT}
                              />
                            </div>
                            <div className="col-lg-4">
                              <FormItem
                                label="GIỮA GIỜ"
                                name={[field.name, 'isHalfTime']}
                                fieldKey={[field.fieldKey, 'isHalfTime']}
                                rules={[variables.RULES.EMPTY]}
                                valuePropName="checked"
                                type={variables.SWITCH}
                              />
                            </div>
                            <>
                              {fields?.length > 1 ? (
                                <DeleteOutlined
                                  className={classnames(styles['icon-delete'], 'ml-1')}
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
              >
                LƯU
              </Button>
            </div>
          </div>
        </Form>
      </>
    );
  }
}

Index.propTypes = {};

export default Index;
