import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'umi';
import { Form, Tabs, InputNumber } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get, isEmpty, last, head, omit } from 'lodash';
import moment from 'moment';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Loading from '@/components/CommonComponent/Loading';
import Table from '@/components/CommonComponent/Table';
import Select from '@/components/CommonComponent/Select';
import { useDispatch, useSelector } from 'dva';

const { TabPane } = Tabs;

function Index() {
  const [formRef] = Form.useForm();
  const dispatch = useDispatch();
  const { params } = useRouteMatch();
  const history = useHistory();

  const [
    { error, contractTypes, details, categories, Staff },
    loading,
    { menuLeftHRM },
  ] = useSelector(({ loading: { effects }, seasonalContractsAdd, menu }) => [
    seasonalContractsAdd,
    effects,
    menu,
  ]);

  const [parameterValues, setParameterValues] = useState([]);
  const [show, setShow] = useState(false);
  const [dataFormContarct, setDataFormContarct] = useState([]);
  const [numberMonth, setNumberMonth] = useState(0);

  const loadCategories = () => {
    dispatch({
      type: 'seasonalContractsAdd/GET_CATEGORIES',
      payload: {},
    });
    dispatch({
      type: 'seasonalContractsAdd/GET_TYPE_CONTRACTS',
      payload: {
        type: 'THOI_VU',
      },
    });
    dispatch({
      type: 'seasonalContractsAdd/GET_STAFF',
      payload: {},
    });
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'seasonalContractsAdd/GET_DETAILS',
        payload: {
          id: params.id,
        },
      });
    }
    loadCategories();
  }, []);

  const setparameterValues = (parameterValues) => {
    setParameterValues(parameterValues.map((item, index) => ({ ...item, index })));
  };

  useEffect(() => {
    if (!!details && !isEmpty(details) && get(params, 'id')) {
      if (details?.project) {
        setShow(true);
      }
      setNumberMonth(details?.month);
      formRef.setFieldsValue({
        ...details,
        contractDate: details.contractDate && moment(details.contractDate),
        contractFrom: details.contractFrom && moment(details.contractFrom),
        contractTo: details.contractTo && moment(details.contractTo),
      });

      setparameterValues(
        details.parameterValues.map((item) => ({
          ...item,
          valueDefault: item.pivot.value,
          id: item.pivot.parameterValueId,
        })),
      );
      setDataFormContarct([details]);
    }
  }, [details]);

  const formUpdate = (value, values) => {
    const { month, date, contractFrom } = values;
    if (moment.isMoment(contractFrom)) {
      formRef?.setFieldsValue({
        contractTo: moment(contractFrom)
          .add(month || 0, 'months')
          .add(date || 0, 'day'),
      });
      // const yearPoint = moment(contractFrom).add(12, 'months');
      // const timeContract = moment(contractFrom)
      //   .add(month || 0, 'months')
      //   .add(date || 0, 'days');
      formRef.setFields([
        {
          name: 'month',
          errors: '',
        },
        {
          name: 'date',
          errors: '',
        },
      ]);
    }
  };

  const changeContract = (value) => {
    const itemContract = contractTypes.find((item) => item.id === value);
    if (itemContract) {
      setParameterValues(
        itemContract.parameterValues.map((item, index) => ({
          index,
          ...item,
        })),
      );
      formRef.setFieldsValue({
        month: itemContract.month,
        date: itemContract.month ? 30 * itemContract.month + 5 : 0,
      });
    }
  };

  const changeValueSelect = (record) => (event) => {
    const itemValue = categories.paramaterValues.find((item) => item.id === event);
    if (itemValue) {
      setParameterValues((prev) =>
        prev.map((item) => (item.index === record.index ? { ...item, ...itemValue } : item)),
      );
    }
  };

  const changeValue = (record) => (event) => {
    setParameterValues((prev) =>
      prev.map((item) => (item.index === record.index ? { ...item, valueDefault: event } : item)),
    );
  };

  const onAddValues = () => {
    setParameterValues((prev) => [...prev, { index: last(prev)?.index + 1, valueDefault: 0 }]);
  };

  const onChangeEmployee = (value) => {
    dispatch({
      type: 'seasonalContractsAdd/GET_CONTRACTS',
      payload: {
        employeeId: value,
      },
      callback: (response) => {
        if (response?.length > 0) {
          const details = head(response);
          formRef.setFieldsValue({
            ...omit(details, 'typeOfContractId'),
            contractDate: null,
            ordinalNumber: null,
            contractFrom: details.contractFrom && moment(details.contractFrom),
            contractTo: details.contractTo && moment(details.contractTo),
          });
        } else {
          formRef.setFieldsValue({
            contractDate: null,
            contractNumber: null,
            ordinalNumber: null,
            typeOfContractId: null,
            month: null,
            date: null,
            divisionId: null,
            positionId: null,
            branchId: null,
            contractFrom: null,
            contractTo: null,
            workDetail: null,
            workTime: null,
            joinSocialInsurance: false,
            isAuthority: true,
            project: false,
            nameProject: null,
            representId: null,
          });
        }
      },
    });
  };

  const handleCheckbox = () => {
    setShow(!show);
    if (!show) {
      formRef.setFieldsValue({
        nameProject: null,
      });
    }
  };

  const onFinish = (values) => {
    const payload = {
      ...values,
      id: params.id,
      ordinalNumber: values?.ordinalNumber,
      numberForm: head(dataFormContarct)?.numberForm,
      numberFormContractId: head(dataFormContarct)?.id,
      type: 'SEASONAL',
      contractDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: values.contractDate,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      contractFrom: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: values.contractFrom,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      contractTo: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: values.contractTo,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      detail: (parameterValues || []).map(({ id, valueDefault }) => ({
        parameterValueId: id,
        value: valueDefault,
      })),
      nameProject: values.project ? values.nameProject : null,
    };

    dispatch({
      type: params.id ? 'seasonalContractsAdd/UPDATE' : 'seasonalContractsAdd/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              formRef.setFields([
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

  const onRemove = (record) => {
    setParameterValues((prev) => prev.filter((item) => item.index !== record.index));
  };

  const headerValuesColumns = () => {
    const columns = [
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
            onChange={changeValueSelect(record)}
            style={{ width: '100%' }}
          />
        ),
      },
      {
        title: 'Giá trị (đ)',
        key: 'values',
        dataIndex: 'valueDefault',
        className: 'min-width-120',
        render: (value, record) => (
          <InputNumber
            value={value}
            className={classnames('input-number')}
            formatter={(value) => `${value}`.replace(variables.REGEX_NUMBER, ',')}
            onChange={changeValue(record)}
            placeholder="Nhập"
          />
        ),
      },
      // {
      //   title: 'Ngày hiệu lực',
      //   key: 'application_date',
      //   dataIndex: 'applyDate',
      //   className: 'min-width-120',
      //   render: (value) => Helper.getDate(moment(value)),
      // },
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
                onClick={() => onRemove(record)}
              />
            </li>
          </ul>
        ),
      },
    ];

    return columns;
  };

  const converNumber = (input) => {
    const pad = input;
    if ((Number(input) + 1)?.toString().length < pad?.length) {
      return pad?.substring(0, pad?.length - (Number(input) + 1).toString()?.length) + (Number(input) + 1);
    }
    return input ? `${Number(input) + 1}` : "";
  };

  const changeFormContarct = (value) => {
    dispatch({
      type: 'probationaryContractsAdd/GET_FORM_CONTRACTS',
      payload: {
        type: 'SEASONAL',
        contractDate: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: value,
          }),
          format: variables.DATE_FORMAT.DATE_AFTER,
          isUTC: false,
        }),
      },
      callback: (response) => {
        setDataFormContarct(response?.parsePayload);
        formRef.setFieldsValue({
          ordinalNumber: converNumber(head(response?.parsePayload)?.ordinalNumber),
        });
      }
    });
  };

  const onChangeMonth = (e) => {
    setNumberMonth(e);
  };

  return (
    <>
      <Breadcrumbs
        last={params.id ? 'Chỉnh sửa hợp đồng thời vụ' : 'Thêm mới hợp đồng thời vụ'}
        menu={menuLeftHRM}
      />
      <Form
        className={styles['layout-form']}
        layout="vertical"
        form={formRef}
        onFinish={onFinish}
        onValuesChange={formUpdate}
        initialValues={{
          isAuthority: true,
        }}
      >
        <div className={styles['content-form']}>
          <Loading
            loading={
              loading['seasonalContractsAdd/GET_CATEGORIES'] ||
              loading['seasonalContractsAdd/GET_DETAILS'] ||
              loading['seasonalContractsAdd/GET_TYPE_CONTRACTS']
            }
            isError={error.isError}
            params={{ error, type: 'container', goBack: '/quan-ly-nhan-su/hop-dong-thoi-vu' }}
          >
            <div className={classnames(styles['content-children'], 'mt0')}>
              <Text color="dark" size="large-medium">
                THÔNG TIN CHUNG
              </Text>
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    data={Helper.convertSelectUsers(categories?.users)}
                    label="NHÂN VIÊN"
                    name="employeeId"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.SELECT}
                    onChange={onChangeEmployee}
                  />
                </div>
              </div>

              <div className="row">
                {
                  details?.contractNumber && params?.id ?
                    <>
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
                          label="Số hợp đồng"
                          name="contractNumber"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                    </>
                    :
                    <>
                      <div className="col-lg-4">
                        <FormItem
                          label="Ngày hợp đồng"
                          name="contractDate"
                          type={variables.DATE_PICKER}
                          rules={[variables.RULES.EMPTY]}
                          onChange={changeFormContarct}
                        />
                      </div>
                      <div className="col-lg-2">
                        <FormItem
                          label="Số hợp đồng"
                          name="ordinalNumber"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY]}
                          disabled={isEmpty(dataFormContarct)}
                        />
                      </div>
                      <div className="col-lg-2">
                        <p className="mb0 font-size-13 mt35 font-weight-bold">
                          {!isEmpty(dataFormContarct) ? `/${head(dataFormContarct)?.numberForm}` : ''}
                        </p>
                      </div>
                    </>
                }
                <div className="col-lg-4">
                  <FormItem
                    data={contractTypes}
                    label="Loại hợp đồng"
                    name="typeOfContractId"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY]}
                    onChange={changeContract}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    label="Số tháng hợp đồng"
                    name="month"
                    type={variables.INPUT_COUNT}
                    rules={[variables.RULES.EMPTY]}
                    onChange={onChangeMonth}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    label="Số ngày hợp đồng"
                    name="date"
                    type={variables.INPUT_COUNT}
                    rules={numberMonth > 0 ? [] : [variables.RULES.EMPTY, variables.RULES.MIN_LENGTH_INPUT]}
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
                    data={categories.positions}
                    label="Chức vụ"
                    name="positionId"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
                <div className="col-lg-8">
                  <FormItem
                    data={categories.branches}
                    label="Nơi làm việc"
                    name="branchId"
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
                    label="Công việc cụ thể"
                    name="workDetail"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    label="Thời gian làm việc"
                    name="workTime"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
                <div className="col-lg-8">
                  <FormItem
                    data={Staff}
                    options={['id', 'fullName']}
                    label="Đại diện ký hợp đồng bên Clover"
                    name="representId"
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    label="Không tham gia BHXH"
                    name="joinSocialInsurance"
                    type={variables.CHECKBOX_FORM}
                    valuePropName="checked"
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    label="Hợp đồng ủy quyền"
                    name="isAuthority"
                    type={variables.CHECKBOX_FORM}
                    valuePropName="checked"
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    label="Có dự án"
                    name="project"
                    type={variables.CHECKBOX_FORM}
                    valuePropName="checked"
                    onChange={handleCheckbox}
                  />
                </div>
                {show && (
                  <div className="col-lg-12">
                    <FormItem
                      label="Tên dự án"
                      name="nameProject"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                )}
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
                        columns={headerValuesColumns()}
                        dataSource={parameterValues}
                        pagination={false}
                        params={{
                          header: headerValuesColumns(),
                          type: 'table',
                        }}
                        className="table-edit"
                        isEmpty
                        rowKey="index"
                        scroll={{ x: '100%' }}
                        footer={() => (
                          <div className='d-flex justify-content-between'>
                            <Button color="success" ghost icon="plus" onClick={onAddValues}>
                              Thêm dòng
                            </Button>
                            <div className={styles['text-sum']}>
                              <p className={styles.title}>Tổng cộng: </p>
                              <h3 className={styles.number}>{Helper.getPrice(parameterValues?.reduce((total, item) => total + JSON.parse(item?.valueDefault), 0))}</h3>
                            </div>
                          </div>
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
                loading={
                  loading['seasonalContractsAdd/ADD'] || loading['seasonalContractsAdd/UPDATE']
                }
              >
                HỦY
              </Button>
              <Button
                color="green"
                icon="save"
                htmlType="submit"
                size="large"
                loading={
                  loading['seasonalContractsAdd/ADD'] || loading['seasonalContractsAdd/UPDATE']
                }
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

export default Index;
