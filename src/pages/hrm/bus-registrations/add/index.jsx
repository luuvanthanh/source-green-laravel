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
const mapStateToProps = ({ busRegistrationsAdd, loading, menu }) => ({
  dataStores: busRegistrationsAdd.dataStores,
  loading: loading,
  error: busRegistrationsAdd.error,
  details: busRegistrationsAdd.details,
  categories: busRegistrationsAdd.categories,
  absentTypes: busRegistrationsAdd.absentTypes,
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
        type: 'busRegistrationsAdd/GET_DETAILS',
        payload: get(params, 'id'),
      });
    }
    this.loadCategories();
  }

  componentDidUpdate(prevProps) {
    const { details } = this.props;
    if (details !== prevProps.details && !isEmpty(details)) {
      this.formRef.current.setFieldsValue({
        ...details,
        date: details.date && moment(details.date),
      });
    }
  }

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'busRegistrationsAdd/GET_CATEGORIES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: params.id ? 'busRegistrationsAdd/UPDATE' : 'busRegistrationsAdd/ADD',
      payload: {
        ...values,
        date: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.date,
            targetValue: '23:59:59',
          }),
          isUTC: false,
        }),
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
      absentTypes,
      loading: { effects },
    } = this.props;
    const loading = effects['busRegistrationsAdd/GET_DETAILS'];
    const loadingSubmit =
      effects['busRegistrationsAdd/ADD'] || effects['busRegistrationsAdd/UPDATE'];
    return (
      <>
        <Helmet title="Tạo mới phiếu ĐK đi xe bus" />
        <Breadcrumbs last="Tạo mới phiếu ĐK đi xe bus" menu={menuData} />
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
              <div className={classnames(styles['content-children'], 'mt10')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-12">
                    <FormItem
                      data={Helper.convertSelectUsers(categories.users)}
                      label="NHÂN VIÊN"
                      name="employeeId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <FormItem
                      label="Ngày đăng ký"
                      name="date"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.DATE_PICKER}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      label="Số giờ"
                      name="hourNumber"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.INPUT_COUNT}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <FormItem
                      label="Ghi chú"
                      name="note"
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
