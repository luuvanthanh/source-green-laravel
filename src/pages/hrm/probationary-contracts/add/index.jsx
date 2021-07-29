import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Tabs, InputNumber } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get, isEmpty, toString, last } from 'lodash';
import moment from 'moment';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Loading from '@/components/CommonComponent/Loading';
import Table from '@/components/CommonComponent/Table';
import Select from '@/components/CommonComponent/Select';
import PropTypes from 'prop-types';

const { TabPane } = Tabs;
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
const mapStateToProps = ({ menu, probationaryContractsAdd, loading }) => ({
  loading,
  categories: probationaryContractsAdd.categories,
  contractTypes: probationaryContractsAdd.contractTypes,
  details: probationaryContractsAdd.details,
  error: probationaryContractsAdd.error,
  menuData: menu.menuLeftHRM,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      parameterValues: [],
    };
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
        type: 'probationaryContractsAdd/GET_DETAILS',
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
        contractDate: details.contractDate && moment(details.contractDate),
        contractFrom: details.contractFrom && moment(details.contractFrom),
        contractTo: details.contractTo && moment(details.contractTo),
      });
      this.setparameterValues(
        details.parameterValues.map((item) => ({
          ...item,
          valueDefault: item.pivot.value,
          id: item.pivot.parameterValueId,
        })),
      );
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

  setparameterValues = (parameterValues) => {
    this.setStateData({
      parameterValues: parameterValues.map((item, index) => ({ ...item, index })),
    });
  };

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'probationaryContractsAdd/GET_CATEGORIES',
      payload: {

      },
    });
    dispatch({
      type: 'probationaryContractsAdd/GET_TYPE_CONTRACTS',
      payload: {
        type: 'THU_VIEC',
      },
    });
  };

  changeContract = (value) => {
    const { contractTypes } = this.props;
    const itemContract = contractTypes.find((item) => item.id === value);
    if (itemContract) {
      this.setStateData({
        parameterValues: itemContract.parameterValues.map((item, index) => ({
          index,
          ...item,
        })),
      });
      this.formRef.current.setFieldsValue({
        month: toString(itemContract.month),
      });
    }
  };

  formUpdate = (value, values) => {
    const { month, year, contractFrom } = values;

    if (moment.isMoment(contractFrom)) {
      this.formRef?.current?.setFieldsValue({
        contractTo: moment(contractFrom)
          .add(month || 0, 'months')
          .add(year || 0, 'years'),
      });
    }
  };

  changeValueSelect = (record) => (event) => {
    const { categories } = this.props;
    const itemValue = categories.paramaterValues.find((item) => item.id === event);
    if (itemValue) {
      this.setStateData((prevState) => ({
        parameterValues: prevState.parameterValues.map((item) =>
          item.index === record.index ? { ...item, ...itemValue } : item,
        ),
      }));
    }
  };

  changeValue = (record) => (event) => {
    this.setStateData((prevState) => ({
      parameterValues: prevState.parameterValues.map((item) =>
        item.index === record.index ? { ...item, valueDefault: event } : item,
      ),
    }));
  };

  onAddValues = () => {
    this.setStateData((prevState) => ({
      parameterValues: [
        ...prevState.parameterValues,
        { index: last(prevState?.parameterValues)?.index + 1 },
      ],
    }));
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { parameterValues } = this.state;
    const payload = {
      ...values,
      id: params.id,
      contractDate: moment(values.contractDate),
      contractFrom: values.contractFrom && moment(values.contractFrom),
      contractTo: values.contractTo && moment(values.contractTo),
      detail: (parameterValues || []).map(({ id, valueDefault }) => ({
        parameterValueId: id,
        value: valueDefault,
      })),
    };
    dispatch({
      type: params.id ? 'probationaryContractsAdd/UPDATE' : 'probationaryContractsAdd/ADD',
      payload,
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

  onRemove = (record) => {
    this.setStateData((prevState) => ({
      parameterValues: prevState.parameterValues.filter((item) => item.index !== record.index),
    }));
  };

  headerValuesColumns = () => {
    const { categories } = this.props;
    return [
      {
        title: 'STT',
        key: 'index',
        width: 60,
        className: 'min-width-60',
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Loại tham số',
        key: 'name',
        className: 'min-width-120',
        render: (record) => (
          <Select
            value={record.id}
            dataSet={categories.paramaterValues}
            onChange={this.changeValueSelect(record)}
            style={{ width: '100%' }}
          />
        ),
      },
      {
        title: 'Giá trị',
        key: 'values',
        dataIndex: 'valueDefault',
        className: 'min-width-120',
        render: (value, record) => (
          <InputNumber
            value={value}
            className={classnames('input-number')}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={this.changeValue(record)}
            placeholder="Nhập"
          />
        ),
      },
      {
        title: 'Ngày hiệu lực',
        key: 'application_date',
        dataIndex: 'applyDate',
        className: 'min-width-120',
        render: (value) => Helper.getDate(moment(value)),
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 100,
        className: 'min-width-100',
        fixed: 'right',
        align: 'center',
        render: (record) => (
          <ul className="list-unstyled list-inline">
            <li className="list-inline-item">
              <Button
                color="danger"
                icon="remove"
                className="ml-2"
                onClick={() => this.onRemove(record)}
              />
            </li>
          </ul>
        ),
      },
    ];
  };

  headerFormulasColumns = () => [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      className: 'min-width-60',
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Loại tham số',
      key: 'name',
      dataIndex: 'name',
      className: 'min-width-120',
    },
    {
      title: 'Công thức',
      key: 'recipe',
      dataIndex: 'recipe',
      className: 'min-width-120',
    },
  ];

  render() {
    const {
      error,
      menuData,
      categories,
      contractTypes,
      loading: { effects },
      match: { params },
    } = this.props;
    const { parameterValues } = this.state;
    const loading =
      effects['probationaryContractsAdd/GET_CATEGORIES'] ||
      effects['probationaryContractsAdd/GET_DETAILS'] ||
      effects['probationaryContractsAdd/GET_TYPE_CONTRACTS'];
    const loadingSubmit =
      effects['probationaryContractsAdd/ADD'] || effects['probationaryContractsAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs
          last={params.id ? 'Chỉnh sửa hợp đồng thử việc' : 'Tạo hợp đồng thử việc'}
          menu={menuData}
        />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          ref={this.formRef}
          onFinish={this.onFinish}
          onValuesChange={this.formUpdate}
        >
          <div className={styles['content-form']}>
            <Loading
              loading={loading}
              isError={error.isError}
              params={{ error, type: 'container', goBack: '/quan-ly-nhan-su/hop-dong-thu-viec' }}
            >
              <div className={classnames(styles['content-children'], 'mt0')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row">
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
                <div className="row">
                  <div className="col-lg-4">
                    <FormItem
                      label="Số hợp đồng"
                      name="contractNumber"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormItem
                      label="Ngày hợp đồng"
                      name="contractDate"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormItem
                      data={contractTypes}
                      label="Loại hợp đồng"
                      name="typeOfContractId"
                      type={variables.SELECT}
                      onChange={this.changeContract}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-4">
                    <FormItem
                      label="Số tháng thử việc"
                      name="month"
                      type={variables.INPUT_COUNT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormItem
                      label="Tỷ lệ lương thử việc"
                      name="salaryRatio"
                      type={variables.INPUT_COUNT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormItem
                      data={categories.divisions}
                      label="Bộ phận"
                      name="divisionId"
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-4">
                    <FormItem
                      label="Thời hạn HĐ từ"
                      name="contractFrom"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormItem
                      label="Thời hạn HĐ đến"
                      name="contractTo"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                      disabled
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormItem
                      data={categories.positions}
                      label="Chức vụ"
                      name="positionId"
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <FormItem
                      label="Công việc cụ thể"
                      name="work"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      label="Thời gian làm việc"
                      name="workTime"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      data={categories.branches}
                      label="Nơi làm việc"
                      name="branchId"
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                </div>
                {!isEmpty(parameterValues) && (
                  <>
                    <Text color="dark" size="large-medium">
                      Chi tiết hợp đồng
                    </Text>
                    <Tabs defaultActiveKey="paramaterValues">
                      <TabPane tab="Tham số giá trị" key="paramaterValues">
                        <Table
                          bordered
                          columns={this.headerValuesColumns()}
                          dataSource={parameterValues}
                          pagination={false}
                          params={{
                            header: this.headerValuesColumns(),
                            type: 'table',
                          }}
                          className="table-edit"
                          isEmpty
                          rowKey="index"
                          scroll={{ x: '100%' }}
                          footer={() => (
                            <Button color="success" ghost icon="plus" onClick={this.onAddValues}>
                              Thêm dòng
                            </Button>
                          )}
                        />
                      </TabPane>
                    </Tabs>
                  </>
                )}
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
  menuData: PropTypes.arrayOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  categories: PropTypes.objectOf(PropTypes.any),
  contractTypes: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  menuData: [],
  loading: {},
  dispatch: {},
  error: {},
  details: {},
  categories: {},
  contractTypes: []
};

export default Index;
