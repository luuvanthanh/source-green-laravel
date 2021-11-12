import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, InputNumber } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
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
import PropTypes from 'prop-types';
import Heading from '@/components/CommonComponent/Heading';
import Table from '@/components/CommonComponent/Table';

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
  loading,
  error: busRegistrationsAdd.error,
  details: busRegistrationsAdd.details,
  categories: busRegistrationsAdd.categories,
  menuData: menu.menuLeftHRM,
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
    if (params.id) {
      dispatch({
        type: 'busRegistrationsAdd/GET_DETAILS',
        payload: params.id,
      });
    }
    this.loadCategories();
  }

  componentDidUpdate(prevProps) {
    const { details } = this.props;
    if (details !== prevProps.details && !isEmpty(details)) {
      this.formRef.current.setFieldsValue({
        ...details,
        startDate: details.startDate && moment(details.startDate),
        endDate: details.endDate && moment(details.endDate),
      });
      this.onSetDetail(details.busRegistrationDetail || []);
    }
  }

  onSetDetail = (detail) => {
    this.setStateData({
      detail,
    });
  };

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
    const { detail } = this.state;
    dispatch({
      type: params.id ? 'busRegistrationsAdd/UPDATE' : 'busRegistrationsAdd/ADD',
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

  formUpdate = (value, values) => {
    if (values.endDate && values.startDate && values.hourNumber) {
      const dates = Helper.convertArrayDaysNotWeekends(values.startDate, values.endDate);
      this.setStateData({
        detail: dates.map((item, index) => ({ date: item, index, hours: values.hourNumber })),
      });
    }
  };

  onChangeHours = (hours, record) => {
    this.setStateData((prevState) => ({
      detail: prevState.detail.map((item) => {
        if (item.index === record.index) {
          return {
            ...item,
            hours,
          };
        }
        return item;
      }),
    }));
  };

  /**
   * Function header table
   */
  header = () => [
    {
      title: 'Thời gian',
      key: 'date',
      className: 'min-width-200',
      width: 200,
      render: (record) => Helper.getDate(record.date, variables.DATE_FORMAT.DATE),
    },
    {
      title: 'Số giờ',
      key: 'hours',
      className: 'min-width-150',
      render: (record) => (
        <InputNumber
          value={record.hours}
          placeholder="Nhập"
          style={{ width: '100%' }}
          onChange={(event) => this.onChangeHours(event, record)}
        />
      ),
    },
  ];

  render() {
    const {
      error,
      menuData,
      categories,
      loading: { effects },
    } = this.props;
    const { detail } = this.state;
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
          onValuesChange={this.formUpdate}
        >
          <Loading
            loading={loading}
            isError={error.isError}
            params={{ error, goBack: '/quan-ly-nhan-su/phieu-dang-ky-di-xe-bus' }}
          >
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
                  <div className="col-lg-4">
                    <FormItem
                      label="Ngày đăng ký từ"
                      name="startDate"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.DATE_PICKER}
                      disabledDate={(current) =>
                        Helper.disabledDateFrom(current, this.formRef) ||
                        Helper.disabledDateWeekeend(current)
                      }
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormItem
                      label="Đến ngày"
                      name="endDate"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.DATE_PICKER}
                      disabledDate={(current) =>
                        Helper.disabledDateTo(current, this.formRef) ||
                        Helper.disabledDateWeekeend(current)
                      }
                    />
                  </div>
                  <div className="col-lg-4">
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
                <hr />
                <Heading type="form-block-title" className="mb10">
                  Chi tiết
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

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  menuData: PropTypes.arrayOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  categories: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  menuData: [],
  loading: {},
  dispatch: {},
  error: {},
  details: {},
  categories: {},
};

export default Index;
