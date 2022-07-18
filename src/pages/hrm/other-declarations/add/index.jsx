import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, InputNumber, Tabs } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get, isEmpty, last, omit, differenceWith, size, head } from 'lodash';
import moment from 'moment';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import PropTypes from 'prop-types';
import Table from '@/components/CommonComponent/Table';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

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
    this.state = {
      detail: [],
      paramaterValues: [],
      detailContract: [],
      paramaterValuesContract: [],
      isContactSocialInsurance: false,
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
    if (details !== prevProps.details && !isEmpty(details) && params?.id) {
      const paramaterValues = !isEmpty(head(details.otherDeclarationDetail)?.detail)
        ? [
          ...new Map(
            head(details.otherDeclarationDetail)
              ?.detail?.map((item) => item.id)
              .map((item) => [item, item]),
          ).values(),
        ]
        : [];
      const paramaterValuesContract = !isEmpty(head(details.changeContractParameter)?.detail)
        ? [
          ...new Map(
            head(details.changeContractParameter)
              ?.detail?.map((item) => item.id)
              .map((item) => [item, item]),
          ).values(),
        ]
        : [];
      this.formRef.current.setFieldsValue({
        ...details,
        time: details.time && moment(details.time),
        employeeId: details.otherDeclarationDetail.map((item) => item.employeeId),
        paramaterValues,
        changeContract: {
          paramaterValues: paramaterValuesContract,
          employeeId: details.changeContractParameter.map((item) => item.employeeId),
        },
      });
      this.onSetDetail(details.otherDeclarationDetail);
      this.onSetDetailContract(details.changeContractParameter);
      this.onSetParamaterValues(head(details.otherDeclarationDetail));
      if (head(details.changeContractParameter)) {
        this.onSetParamaterValuesContract(head(details.changeContractParameter));
      }
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

  onSetParamaterValues = (item) => {
    this.setStateData({
      paramaterValues: item.detail,
    });
  };

  onSetParamaterValuesContract = (item) => {
    this.setStateData({
      paramaterValuesContract: item.detail || [],
    });
  };

  onSetDetailContract = (detailContract) => {
    this.setStateData({
      detailContract,
    });
  };

  onSetDetail = (detail) => {
    this.setStateData({
      detail,
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { detail, detailContract } = this.state;
    dispatch({
      type: params.id ? 'otherDeclarationsAdd/UPDATE' : 'otherDeclarationsAdd/ADD',
      payload: {
        id: params.id,
        ...values,
        time: moment(values.time).startOf('months'),
        detail: detail.map((item) => ({
          ...omit(item, 'employee'),
          employeeId: item?.employee?.id,
        })),
        changeContract: detailContract.map((item) => ({
          ...omit(item, 'employee'),
          isSocialInsurance: true,
          employeeId: item?.employee?.id,
        })),
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.data?.errors && !isEmpty(error?.data?.errors)) {
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

  onChangeEmployee = (value) => {
    const { detail, paramaterValues } = this.state;
    const { categories } = this.props;
    if (size(value) < size(detail)) {
      const diffirence = differenceWith(
        detail.map((item) => item?.employee?.id),
        value,
      );
      this.setStateData((prevState) => ({
        detail: prevState.detail.filter((item) => item?.employee?.id !== last(diffirence)),
      }));
    } else {
      const employee = categories.users.find((item) => item.id === last(value));
      this.setStateData((prevState) => ({
        detail: [
          ...prevState.detail,
          {
            employee,
            detail: paramaterValues.map((i) => ({ ...i, value: i?.valueDefault })),
          },
        ],
      }));
    }
  };

  onChangeEmployeeContract = (value) => {
    const { detailContract, paramaterValuesContract } = this.state;
    const { categories } = this.props;
    if (size(value) < size(detailContract)) {
      const diffirence = differenceWith(
        detailContract.map((item) => item?.employee?.id),
        value,
      );
      this.setStateData((prevState) => ({
        detailContract: prevState.detailContract.filter(
          (item) => item?.employee?.id !== last(diffirence),
        ),
      }));
    } else {
      const employee = categories.users.find((item) => item.id === last(value));
      this.setStateData((prevState) => ({
        detailContract: [
          ...prevState.detailContract,
          {
            employee,
            detail: paramaterValuesContract.map((i) => ({ ...i, value: i?.valueDefault })),
          },
        ],
      }));
    }
  };

  onChangeParamater = (value) => {
    const { categories } = this.props;
    this.setStateData((prevState) => ({
      paramaterValues: [
        ...(value
          ? value.map((item) => {
            const itemParamaterValues = categories.paramaterValues.find(({ id }) => id === item);
            const currentParamaterValues = prevState.paramaterValues.find(
              (item) => item.id === itemParamaterValues.id,
            );

            if (currentParamaterValues) {
              return currentParamaterValues;
            }
            console.log("itemParamaterValues", itemParamaterValues);
            console.log("currentParamaterValues", currentParamaterValues);
            return { ...itemParamaterValues, value: itemParamaterValues?.valueDefault };
          })
          : []),
      ],
      detail: prevState.detail.map((item) => ({
        ...item,
        detail: value
          ? [
            ...value.map((itemValue) => {
              const itemParamaterValues = categories.paramaterValues.find(
                ({ id }) => id === itemValue,
              );
              const currentParamaterValues = item.detail.find(
                (item) => item.id === itemParamaterValues.id,
              );

              if (currentParamaterValues) {
                return currentParamaterValues;
              }

              return { ...itemParamaterValues, value: itemParamaterValues?.valueDefault };
            }),
          ]
          : [],
      })),
    }));
  };

  onChangeParamaterContract = (value) => {
    const { categories } = this.props;
    this.setStateData((prevState) => ({
      paramaterValuesContract: [
        ...(value
          ? value.map((item) => {
            const itemParamaterContract = categories.paramaterContract.find(
              ({ id }) => id === item,
            );
            const currentParamaterContract = prevState.paramaterValuesContract.find(
              (item) => item.id === itemParamaterContract.id,
            );

            if (currentParamaterContract) {
              return currentParamaterContract;
            }

            return { ...itemParamaterContract, value: itemParamaterContract?.valueDefault };
          })
          : []),
      ],
      detailContract: prevState.detailContract.map((item) => ({
        ...item,
        detail: value
          ? [
            ...value.map((itemValue) => {
              const itemParamaterContract = categories.paramaterContract.find(
                ({ id }) => id === itemValue,
              );
              const currentParamaterContract = item.detail.find(
                (item) => item.id === itemParamaterContract.id,
              );

              if (currentParamaterContract) {
                return currentParamaterContract;
              }

              return { ...itemParamaterContract, value: itemParamaterContract?.valueDefault };
            }),
          ]
          : [],
      })),
    }));
  };

  onChangeNumber = (value, record, paramaterValue) => {
    this.setStateData((prevState) => ({
      detail: prevState.detail.map((item) => {
        if (item?.employee?.id === record?.employee?.id) {
          return {
            ...item,
            detail: item.detail.map((itemDetail) => {
              if (itemDetail.id === paramaterValue.id) {
                return {
                  ...itemDetail,
                  value,
                };
              }
              return itemDetail;
            }),
          };
        }
        return item;
      }),
    }));
  };

  onChangeNumberContract = (value, record, paramaterValue) => {
    this.setStateData((prevState) => ({
      detailContract: prevState.detailContract.map((item) => {
        if (item?.employee?.id === record?.employee?.id) {
          return {
            ...item,
            detail: item.detail.map((itemDetail) => {
              if (itemDetail.id === paramaterValue.id) {
                return {
                  ...itemDetail,
                  value,
                };
              }
              return itemDetail;
            }),
          };
        }
        return item;
      }),
    }));
  };

  onRemove = (record) => {
    const data = this.formRef.current.getFieldsValue();
    this.setStateData((prevState) => ({
      detail: prevState.detail.filter((item) => item?.employee?.id !== record?.employee?.id),
    }));
    this.formRef.current.setFieldsValue({
      ...data,
      employeeId: data.employeeId.filter((item) => item !== record?.employee?.id),
    });
  };

  onRemoveContract = (record) => {
    const data = this.formRef.current.getFieldsValue();
    this.setStateData((prevState) => ({
      detailContract: prevState.detailContract.filter(
        (item) => item?.employee?.id !== record?.employee?.id,
      ),
    }));
    this.formRef.current.setFieldsValue({
      ...data,
      changeContract: {
        employeeId: data?.changeContract?.employeeId?.filter(
          (item) => item !== record?.employee?.id,
        ),
      },
    });
  };

  onChangeCheckbox = (value) => {
    this.setStateData(() => ({
      isContactSocialInsurance: value.target.checked,
    }));
  };

  /**
   * Function header table
   */
  header = () => {
    const { paramaterValues } = this.state;
    const columns = [
      {
        title: 'Nhân viên',
        key: 'user',
        className: 'min-width-200',
        width: 200,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(get(record, 'employee.fileImage'))}
            fullName={get(record, 'employee.fullName')}
          />
        ),
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button color="danger" icon="remove" onClick={() => this.onRemove(record)} />
          </div>
        ),
      },
    ];
    const columnsMerge = paramaterValues.map((item) => ({
      title: item.name,
      key: item.code,
      className: 'min-width-200',
      width: 200,
      render: (record) => {
        const itemParamater = record?.detail?.find((itemDetail) => itemDetail.id === item.id);
        return (
          <InputNumber
            className={classnames('input-number', styles['input-number-container'])}
            formatter={(value) => value.replace(variables.REGEX_NUMBER, ',')}
            placeholder="Nhập"
            value={itemParamater?.value || 0}
            onChange={(value) => this.onChangeNumber(value, record, item)}
          />
        );
      },
    }));
    return [...columns.slice(0, 1), ...columnsMerge, ...columns.slice(1)];
  };

  headerContact = () => {
    const { paramaterValuesContract, isContactSocialInsurance } = this.state;
    const columns = [
      {
        title: 'Nhân viên',
        key: 'user',
        className: 'min-width-200',
        width: 200,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(get(record, 'employee.fileImage'))}
            fullName={get(record, 'employee.fullName')}
          />
        ),
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button color="danger" icon="remove" onClick={() => this.onRemoveContract(record)} />
          </div>
        ),
      },
    ];

    const columnsMerge = paramaterValuesContract?.map((item) => ({
      title: item.name,
      key: item.code,
      className:
        item.code === 'T_BHXH' ? 'min-width-80 d-flex justify-content-center' : 'min-width-200',
      width: item.code === 'T_BHXH' ? 80 : 200,
      render: (record) => {
        const itemParamater = record?.detail?.find(({ id }) => id === item.id);
        console.log("itemParamater", itemParamater);
        if (itemParamater?.code === 'T_BHXH') {
          return (
            <FormItem
              type={variables.CHECKBOX_FORM}
              onChange={(value) => this.onChangeCheckbox(value, record, item)}
              valuePropName="checked"
              checked={isContactSocialInsurance}
            />
          );
        }
        return (
          <InputNumber
            className={classnames('input-number', styles['input-number-container'])}
            formatter={(value) => value.replace(variables.REGEX_NUMBER, ',')}
            placeholder="Nhập"
            value={itemParamater?.value || 0}
            onChange={(value) => this.onChangeNumberContract(value, record, item)}
          />
        );
      },
    }));

    return [...columns.slice(0, 1), ...columnsMerge, ...columns.slice(1)];
  };

  render() {
    const {
      menuData,
      categories,
      loading: { effects },
      match: { params },
    } = this.props;
    const { detail, detailContract } = this.state;
    console.log("detail", detail);
    const loadingSubmit =
      effects['otherDeclarationsAdd/ADD'] || effects['otherDeclarationsAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs
          last={params.id ? 'Chỉnh sửa Khai báo các khoản khác' : 'Tạo Khai báo các khoản khác'}
          menu={menuData}
        />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          ref={this.formRef}
          initialValues={{}}
          onFinish={this.onFinish}
        >
          <div className={styles['content-form']}>
            <div className={classnames(styles['content-children'], 'mt10')}>
              <Text color="dark" size="large-medium">
                THÔNG TIN CHUNG
              </Text>

              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    label="Thời gian"
                    name="time"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.RANGE_PICKER}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    label="Số công"
                    name="numberOfWorkdays"
                    rules={[variables.RULES.EMPTY, variables.RULES.NUMBER]}
                    type={variables.INPUT_COUNT}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    label="Tính lương mùa dịch"
                    name="isDiseaseSalary"
                    type={variables.CHECKBOX_FORM}
                    valuePropName="checked"
                  />
                </div>
              </div>
            </div>
            <div className={classnames(styles['content-children'], 'mt20')}>
              <Tabs defaultActiveKey="MONTH">
                <TabPane tab="Tăng giảm theo tháng" key="MONTH">
                  <div className="row">
                    <div className="col-lg-12">
                      <FormItem
                        data={Helper.convertSelectUsers(categories?.users)}
                        label="Nhân viên"
                        name="employeeId"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT_MUTILPLE}
                        onChange={this.onChangeEmployee}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <FormItem
                        data={categories?.paramaterValues}
                        label="Khai báo"
                        name="paramaterValues"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT_MUTILPLE}
                        onChange={this.onChangeParamater}
                      />
                    </div>
                  </div>
                  <hr />
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
                    rowKey={(record) => record?.employee?.id || record.id}
                    scroll={{ x: '100%' }}
                  />
                </TabPane>
                <TabPane tab="Tăng giảm theo hợp đồng" key="CONTRACT">
                  <div className="row">
                    <div className="col-lg-12">
                      <FormItem
                        data={Helper.convertSelectUsers(categories?.users)}
                        label="Nhân viên"
                        name={['changeContract', 'employeeId']}
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT_MUTILPLE}
                        onChange={this.onChangeEmployeeContract}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <FormItem
                        data={categories?.paramaterContract}
                        label="Khai báo"
                        name={['changeContract', 'paramaterValues']}
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT_MUTILPLE}
                        onChange={this.onChangeParamaterContract}
                      />
                    </div>
                  </div>
                  <hr />
                  <Table
                    bordered
                    columns={this.headerContact()}
                    dataSource={detailContract}
                    isEmpty
                    className="table-edit"
                    pagination={false}
                    params={{
                      header: this.headerContact(),
                      type: 'table',
                    }}
                    rowKey={(record) => record?.employee?.id || record.id}
                    scroll={{ x: '100%' }}
                  />
                </TabPane>
              </Tabs>
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

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  categories: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  menuData: PropTypes.arrayOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  categories: {},
  menuData: [],
  loading: {},
};

export default Index;
