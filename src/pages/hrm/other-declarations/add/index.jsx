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
const mapStateToProps = ({ menu, otherDeclarationsAdd, loading }) => ({
  loading,
  categories: otherDeclarationsAdd.categories,
  details: otherDeclarationsAdd.details,
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
        type: 'otherDeclarationsAdd/GET_DETAILS',
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
          startTime:
            item.startTime &&
            moment(
              `${moment(details.date).format(variables.DATE_FORMAT.DATE_AFTER)} ${item.startTime}`,
            ),
          endTime:
            item.endTime &&
            moment(
              `${moment(details.date).format(variables.DATE_FORMAT.DATE_AFTER)} ${item.endTime}`,
            ),
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
      type: 'otherDeclarationsAdd/GET_CATEGORIES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: params.id ? 'otherDeclarationsAdd/UPDATE' : 'otherDeclarationsAdd/ADD',
      payload: {
        id: params.id,
        ...values,
        detail: values.detail.map((item) => ({
          ...item,
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
    const loadingSubmit =
      effects['otherDeclarationsAdd/ADD'] || effects['otherDeclarationsAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs
          last={
            params.id
              ? 'Chỉnh sửa khai báo ngày công chuẩn trong tháng'
              : 'Tạo khai báo ngày công chuẩn trong tháng'
          }
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

              <div className="row">
                <div className="col-lg-6">
                  <FormItem
                    label="THỜI GIAN"
                    name="time"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.DATE_PICKER}
                  />
                </div>
                <div className="col-lg-6">
                  <FormItem
                    label="SỐ CÔNG"
                    name="numberOfWorkdays"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.INPUT_COUNT}
                  />
                </div>
              </div>
              <hr />
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
                            <div className="col-lg-6">
                              <FormItem
                                data={Helper.convertSelectUsers(categories?.users)}
                                label="NHÂN VIÊN"
                                name={[field.name, 'employeeId']}
                                fieldKey={[field.fieldKey, 'employeeId']}
                                rules={[variables.RULES.EMPTY]}
                                type={variables.SELECT}
                              />
                            </div>
                            <div className="col-lg-6">
                              <FormItem
                                label="TRỢ CẤP"
                                name={[field.name, 'allowance']}
                                fieldKey={[field.fieldKey, 'allowance']}
                                rules={[variables.RULES.EMPTY]}
                                type={variables.INPUT_COUNT}
                              />
                            </div>
                            <div className="col-lg-6">
                              <FormItem
                                label="TIỀN THƯỞNG"
                                name={[field.name, 'bonus']}
                                fieldKey={[field.fieldKey, 'bonus']}
                                rules={[variables.RULES.EMPTY]}
                                type={variables.INPUT_NUMBER}
                              />
                            </div>
                            <div className="col-lg-6">
                              <FormItem
                                label="THU HỒI"
                                name={[field.name, 'retrieval']}
                                fieldKey={[field.fieldKey, 'retrieval']}
                                rules={[variables.RULES.EMPTY]}
                                type={variables.INPUT_NUMBER}
                              />
                            </div>
                            <div className="col-lg-6">
                              <FormItem
                                label="BHXH"
                                name={[field.name, 'paymentOfSocialInsurance']}
                                fieldKey={[field.fieldKey, 'paymentOfSocialInsurance']}
                                rules={[variables.RULES.EMPTY]}
                                type={variables.INPUT_NUMBER}
                              />
                            </div>
                            <div className="col-lg-6">
                              <FormItem
                                label="BHXH NV"
                                name={[field.name, 'employeeSocialInsurance']}
                                fieldKey={[field.fieldKey, 'employeeSocialInsurance']}
                                rules={[variables.RULES.EMPTY]}
                                type={variables.INPUT_NUMBER}
                              />
                            </div>
                            <div className="col-lg-6">
                              <FormItem
                                label="TỪ THIỆN"
                                name={[field.name, 'charity']}
                                fieldKey={[field.fieldKey, 'charity']}
                                rules={[variables.RULES.EMPTY]}
                                type={variables.INPUT_NUMBER}
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
