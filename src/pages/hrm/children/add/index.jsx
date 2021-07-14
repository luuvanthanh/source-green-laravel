import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Loading from '@/components/CommonComponent/Loading';
import PropTypes from 'prop-types';

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
const mapStateToProps = ({ menu, childrenHRMAdd, loading }) => ({
  loading,
  categories: childrenHRMAdd.categories,
  details: childrenHRMAdd.details,
  error: childrenHRMAdd.error,
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
        type: 'childrenHRMAdd/GET_DETAILS',
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
        data: [
          {
            birthday: details.birthday && moment(details.birthday),
            fullName: details.fullName,
            gender: details.gender,
          },
        ],
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
      type: 'childrenHRMAdd/GET_CATEGORIES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: params.id ? 'childrenHRMAdd/UPDATE' : 'childrenHRMAdd/ADD',
      payload: {
        id: params.id,
        ...values,
        data: values.data.map((item) => ({
          ...item,
          birthday: moment(item.birthday).format(variables.DATE_FORMAT.DATE_AFTER),
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

  render() {
    const {
      error,
      categories,
      menuData,
      loading: { effects },
      match: { params },
    } = this.props;
    const loading =
      effects['childrenHRMAdd/GET_CATEGORIES'] || effects['childrenHRMAdd/GET_DETAILS'];
    const loadingSubmit = effects['childrenHRMAdd/ADD'] || effects['childrenHRMAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs
          last={
            params.id ? 'Chỉnh sửa thông tin con của nhân viên' : 'Tạo thông tin con của nhân viên'
          }
          menu={menuData}
        />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          ref={this.formRef}
          initialValues={{
            data: [{}],
          }}
          onFinish={this.onFinish}
        >
          <div className={styles['content-form']}>
            <Loading loading={loading} isError={error.isError} params={{ error, goBack: '/quan-ly-nhan-su/thong-ke-con-cua-nhan-vien' }}>
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
                </div>
                <hr />
                <div className="row">
                  <div className="col-lg-12">
                    <Form.List name="data">
                      {(fields, { _ }) => (
                        <div>
                          {fields.map((field, _index) => (
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
                                  label="HỌ VÀ TÊN"
                                  name={[field.name, 'fullName']}
                                  fieldKey={[field.fieldKey, 'fullName']}
                                  rules={[variables.RULES.EMPTY]}
                                  type={variables.INPUT}
                                />
                              </div>
                              <div className="col-lg-6">
                                <FormItem
                                  label="NGÀY SINH"
                                  name={[field.name, 'birthday']}
                                  fieldKey={[field.fieldKey, 'birthday']}
                                  rules={[variables.RULES.EMPTY]}
                                  type={variables.DATE_PICKER}
                                  disabledDate={Helper.disabledDateFuture}
                                />
                              </div>
                              <div className="col-lg-6">
                                <FormItem
                                  label="GIỚI TÍNH"
                                  name={[field.name, 'gender']}
                                  fieldKey={[field.fieldKey, 'gender']}
                                  rules={[variables.RULES.EMPTY]}
                                  type={variables.INPUT}
                                />
                              </div>
                            </div>
                          ))}
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
            </Loading>
          </div>
        </Form>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  categories: PropTypes.objectOf(PropTypes.any),
  menuData: PropTypes.arrayOf(PropTypes.any),
  error: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  details: {},
  loading: {},
  dispatch: {},
  categories: {},
  menuData: [],
  error: {},
};

export default Index;
