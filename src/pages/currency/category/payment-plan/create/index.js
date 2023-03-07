import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { useParams, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { isEmpty, get, head } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
import { Helmet } from 'react-helmet';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
import { Helper } from '@/utils';
import moment from 'moment';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import stylesModule from '../styles.module.scss';

const General = memo(() => {
  const {
    loading: { effects },
    yearsSchool,
    branches,
    classes,
  } = useSelector(({ loading, currencyPaymentPlanAdd }) => ({
    loading,

    payment: currencyPaymentPlanAdd.payment,
    yearsSchool: currencyPaymentPlanAdd.yearsSchool,
    classes: currencyPaymentPlanAdd.classes,
    data: currencyPaymentPlanAdd.data,
    branches: currencyPaymentPlanAdd.branches,
  }));
  const [{ menuLeftCurrency }] = useSelector(({ menu }) => [menu]);

  const [form] = Form.useForm();
  const [formData] = Form.useForm();
  const dispatch = useDispatch();

  const mounted = useRef(false);
  const loadingSubmit =
    effects['currencyPaymentPlanAdd/ADD'] ||
    effects['currencyPaymentPlanAdd/UPDATE'] ||
    effects['currencyPaymentPlanAdd/GET_PAYMENT'];

  const params = useParams();
  const [dataPayment, setDataPayment] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [dataSelect, setDataSelect] = useState([]);

  const [details, setDetails] = useState({
    datePlan: '',
    startDate: '',
    endDate: '',
    chargeMonth: '',
  });

  const history = useHistory();

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      data: [''],
    });
    dispatch({
      type: 'currencyPaymentPlanAdd/GET_YEARS',
      payload: params,
    });
    dispatch({
      type: 'currencyPaymentPlanAdd/GET_BRANCHES',
      payload: {},
    });
    formData.setFieldsValue({
      datePlan: moment(),
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'currencyPaymentPlanAdd/GET_DETAILS',
        payload: params,
        callback: (response) => {
          if (response) {
            setDetails((prev) => ({
              ...prev,
              ...response,
              startDate: response?.schoolYear?.startDate
                ? Helper.getDate(response?.schoolYear?.startDate, variables.DATE_FORMAT.DATE_VI)
                : '',
              endDate: response?.schoolYear?.endDate
                ? Helper.getDate(response?.schoolYear?.endDate, variables.DATE_FORMAT.DATE_VI)
                : '',
            }));
            formData.setFieldsValue({
              datePlan: response?.datePlan && moment(response?.datePlan),
              chargeMonth: response?.chargeMonth && moment(response?.chargeMonth),
              schoolYearId: response?.schoolYearId,
              branchId: response?.branchId,
              classId: response?.classId,
              classTypeId: response?.classType?.name,
            });
            form.setFieldsValue({
              data: response?.paymentPlanDetail?.map((item) => ({
                fullName: item?.student?.fullName,
                totalMoney: parseInt(item?.totalMoneyMonth, 10),
                chargeOldStudentId: item?.id,
                studentId: item?.student?.id,
                note: item?.note,
                tuition: item?.feeInfo?.map((i) => ({
                  fee: i?.feeName,
                  money: parseInt(i?.money, 10),
                  fee_id: i?.feeId,
                })),
              })),
            });
          }
        },
      });
    }
    dispatch({
      type: 'currencyPaymentPlanAdd/GET_CLASSES',
      payload: {},
    });
  }, [params.id]);

  const onFinish = (values) => {
    dispatch({
      type: 'currencyPaymentPlanAdd/GET_PAYMENT',
      payload: {
        ...values,
        month_payment_plan: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values?.chargeMonth,
          }),
          format: variables.DATE_FORMAT.YEAR_MONTH,
          isUTC: false,
        }),
      },
      callback: (response, error) => {
        if (response) {
          setDataSelect(values);
          setDataPayment(response);
          form.setFieldsValue({
            data: response.map((item) => ({
              fullName: item?.student?.fullName,
              totalMoney: parseInt(head(item?.feeInfo)?.total_money_month, 10),
              chargeOldStudentId: item?.id,
              studentId: item?.student?.id,
              tuition: head(item?.feeInfo)?.fee?.map((i) => ({
                fee: i?.fee_name,
                money: parseInt(i?.money, 10),
                fee_id: i?.fee_id,
              })),
            })),
          });
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              form.setFields([
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

  const onSubmit = (values) => {
    dispatch({
      type: params?.id ? 'currencyPaymentPlanAdd/UPDATE' : 'currencyPaymentPlanAdd/ADD',
      payload: params?.id
        ? {
            id: params.id,
            detail: values?.data?.map((i) => ({
              chargeOldStudentId: i?.chargeOldStudentId,
              studentId: i?.studentId,
              totalMoneyMonth: i?.totalMoney,
              note: i?.note,
              feeInfo: i?.tuition?.map((k) => ({
                money: k?.money,
                feeName: k?.fee,
                feeId: k?.fee_id,
              })),
            })),
            ...details,
            classTypeId: head(dataType)?.classType?.id,
          }
        : {
            ...dataSelect,
            classTypeId: head(dataType)?.classType?.id,
            detail: values?.data?.map((i) => ({
              chargeOldStudentId: i?.chargeOldStudentId,
              studentId: i?.studentId,
              totalMoneyMonth: i?.totalMoney,
              note: i?.note,
              feeInfo: i?.tuition?.map((k) => ({
                money: k?.money,
                feeName: k?.fee,
                feeId: k?.fee_id,
              })),
            })),
          },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              form.setFields([
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

  const onChangeClass = (e) => {
    setDataType(classes.filter((i) => i.id === e));
    form.setFieldsValue({
      data: undefined,
    });
  };

  useEffect(() => {
    if (dataType.length > 0) {
      formData.setFieldsValue({
        classTypeId: dataType[0]?.classType?.name,
      });
    }
  }, [dataType.length > 0]);

  const changeYear = (value) => {
    formData.setFieldsValue({
      chargeMonth: undefined,
    });
    if (!value) {
      setDetails((prev) => ({
        ...prev,
        startDate: '',
        endDate: '',
        schoolYearId: '',
        dayAdmission: '',
      }));
      return;
    }

    const response = yearsSchool.find((item) => item.id === value);
    if (response?.id) {
      const newDetails = {
        ...details,
        startDate: response.startDate
          ? Helper.getDate(response.startDate, variables.DATE_FORMAT.DATE_VI)
          : '',
        endDate: response.endDate
          ? Helper.getDate(response.endDate, variables.DATE_FORMAT.DATE_VI)
          : '',
        schoolYearId: value,
        dayAdmission: '',
      };
      setDetails(newDetails);
    }
  };

  const changeDate = (e) => {
    setDetails((prev) => ({
      ...prev,
      datePlan: e,
    }));
  };

  const changeMonth = (e) => {
    setDetails((prev) => ({
      ...prev,
      chargeMonth: e,
    }));
  };

  const onChangeBranch = (e) => {
    dispatch({
      type: 'currencyPaymentPlanAdd/GET_CLASSES',
      payload: { branch: e },
    });
    formData.setFieldsValue({
      classId: undefined,
      classTypeId: undefined,
    });
  };

  const onChangeTotal = () => {
    form.validateFields().then((values) => {
      form.setFieldsValue({
        data: values?.data?.map((item) => ({
          ...item,
          totalMoney: item?.tuition.reduce((accumulator, object) => accumulator + object.money, 0),
        })),
      });
    });
  };

  return (
    <Pane className={stylesModule['disabled-container']}>
      <Helmet title="Kế hoạch đóng phí" />
      <Breadcrumbs last={params.id ? 'Chỉnh sửa ' : 'Tạo mới'} menu={menuLeftCurrency} />
      <Pane className="p20">
        <Pane>
          <Pane className="card">
            <Pane>
              <Pane className="card p20">
                <Heading type="form-title" className="mb10">
                  Thông tin chung
                </Heading>
                <Form layout="vertical" form={formData} onFinish={onFinish}>
                  <Pane className="row">
                    <Pane className="col-lg-3">
                      <FormItem
                        className="mb-3"
                        label="Ngày kế hoạch"
                        name="datePlan"
                        type={variables.DATE_PICKER}
                        onChange={changeDate}
                        disabledDate={(current) => current <= moment() || params?.id}
                      />
                    </Pane>
                    {params?.id ? (
                      <Pane className="col-lg-3">
                        <FormItem
                          className="mb-0"
                          label="Năm học"
                          name="schoolYearId"
                          type={variables.SELECT}
                          placeholder="Chọn năm"
                          allowClear={false}
                          data={yearsSchool?.map((item) => ({
                            ...item,
                            name: `${item?.yearFrom} - ${item?.yearTo}`,
                          }))}
                          rules={[variables.RULES.EMPTY]}
                          disabled
                        />
                      </Pane>
                    ) : (
                      <Pane className="col-lg-3">
                        <FormItem
                          className="mb-0"
                          label="Năm học"
                          name="schoolYearId"
                          type={variables.SELECT}
                          placeholder="Chọn năm"
                          allowClear={false}
                          data={yearsSchool?.map((item) => ({
                            ...item,
                            name: `${item?.yearFrom} - ${item?.yearTo}`,
                          }))}
                          rules={[variables.RULES.EMPTY]}
                          onChange={changeYear}
                        />
                      </Pane>
                    )}
                    {details?.startDate ? (
                      <Pane className="col-lg-3">
                        <FormItem
                          className="mb-3"
                          label="Tháng tính phí"
                          name="chargeMonth"
                          type={variables.MONTH_PICKER}
                          placeholder="Chọn tháng"
                          allowClear={false}
                          rules={[variables.RULES.EMPTY]}
                          onChange={changeMonth}
                          disabledDate={(current) =>
                            (details?.startDate &&
                              current <
                                moment(details?.startDate, variables.DATE_FORMAT.DATE_VI).startOf(
                                  'day',
                                )) ||
                            (details?.endDate &&
                              current >=
                                moment(details?.endDate, variables.DATE_FORMAT.DATE_VI).endOf(
                                  'day',
                                )) ||
                            current <= moment()
                          }
                          disabled={params?.id}
                        />
                      </Pane>
                    ) : (
                      <Pane className="col-lg-3">
                        <FormItem
                          className="mb-3"
                          label="Tháng tính phí"
                          name="chargeMonth"
                          type={variables.MONTH_PICKER}
                          placeholder="Chọn tháng"
                          allowClear={false}
                          rules={[variables.RULES.EMPTY]}
                          onChange={changeMonth}
                          disabledDate={(current) =>
                            (details?.startDate &&
                              current <
                                moment(details?.startDate, variables.DATE_FORMAT.DATE_VI).startOf(
                                  'day',
                                )) ||
                            (details?.endDate &&
                              current >=
                                moment(details?.endDate, variables.DATE_FORMAT.DATE_VI).endOf(
                                  'day',
                                ))
                          }
                          disabled={params?.id}
                        />
                      </Pane>
                    )}
                    {params?.id ? (
                      <>
                        <Pane className="col-lg-3">
                          <FormItem
                            className="mb-3"
                            label="Cơ sở"
                            data={branches}
                            name="branchId"
                            type={variables.SELECT}
                            placeholder="Chọn cơ sở"
                            rules={[variables.RULES.EMPTY]}
                            disabled
                          />
                        </Pane>
                        <Pane className="col-lg-3">
                          <FormItem
                            className="mb-0"
                            label="Lớp học"
                            data={classes}
                            name="classId"
                            type={variables.SELECT}
                            placeholder="Chọn lớp học"
                            allowClear={false}
                            rules={[variables.RULES.EMPTY]}
                            onChange={(event) => onChangeClass(event, 'KeyWord')}
                            disabled
                          />
                        </Pane>
                      </>
                    ) : (
                      <>
                        <Pane className="col-lg-3">
                          <FormItem
                            className="mb-3"
                            label="Cơ sở"
                            data={branches}
                            name="branchId"
                            type={variables.SELECT}
                            placeholder="Chọn cơ sở"
                            rules={[variables.RULES.EMPTY]}
                            onChange={onChangeBranch}
                          />
                        </Pane>
                        <Pane className="col-lg-3">
                          <FormItem
                            className="mb-0"
                            label="Lớp học"
                            data={classes}
                            name="classId"
                            type={variables.SELECT}
                            placeholder="Chọn lớp học"
                            allowClear={false}
                            rules={[variables.RULES.EMPTY]}
                            onChange={(event) => onChangeClass(event, 'KeyWord')}
                          />
                        </Pane>
                      </>
                    )}
                    <Pane className="col-lg-3">
                      <FormItem
                        className="mb-0"
                        label="Loại lớp"
                        name="classTypeId"
                        type={variables.INPUT}
                        placeholder=" "
                        allowClear={false}
                        disabled
                      />
                    </Pane>
                    <Pane className="pt30 pl15">
                      {params?.id ? (
                        <Button
                          className="ml-auto px25"
                          color="success"
                          htmlType="submit"
                          loading={loadingSubmit}
                          disabled
                        >
                          Tính phí
                        </Button>
                      ) : (
                        <Button
                          className="ml-auto px25"
                          color="success"
                          htmlType="submit"
                          loading={loadingSubmit}
                        >
                          Tính phí
                        </Button>
                      )}
                    </Pane>
                  </Pane>
                </Form>
              </Pane>
            </Pane>
          </Pane>
          <Pane className="card">
            <Pane className="p20">
              <Heading type="form-title" className="mb20">
                Thông tin tính phí
              </Heading>
              {dataPayment.length > 0 || params?.id ? (
                <Form layout="vertical" form={form} onFinish={onSubmit}>
                  <Pane className="row mt20">
                    <Pane className="col-lg-12">
                      <Pane>
                        <div className={stylesModule['wrapper-table']}>
                          <div className={stylesModule['card-heading']}>
                            <div className={stylesModule.col}>
                              <p className={stylesModule.norm}>Tên học sinh</p>
                            </div>
                            <div className={stylesModule.col}>
                              <p className={stylesModule.norm}>Khoản phí</p>
                            </div>
                            <div className={stylesModule.col}>
                              <p className={stylesModule.norm}>Tiền (đ)</p>
                            </div>
                            <div className={stylesModule.col}>
                              <p className={stylesModule.norm}>Ghi chú</p>
                            </div>
                          </div>
                          <Form.List name="data">
                            {(fields) => (
                              <>
                                {fields.map((fieldItem, index) => (
                                  <Pane key={index} className="d-flex">
                                    <div className={stylesModule['card-item']}>
                                      <div className={classnames(stylesModule.col)}>
                                        <FormItem
                                          className={stylesModule.item}
                                          fieldKey={[fieldItem.fieldKey, 'fullName']}
                                          name={[fieldItem.name, 'fullName']}
                                          type={variables.INPUT}
                                          disabled
                                        />
                                      </div>
                                      <div className={classnames(stylesModule.nol)}>
                                        <Form.List name={[fieldItem.name, 'tuition']}>
                                          {(fields) => (
                                            <>
                                              {fields.map((fieldItemD, index) => (
                                                <Pane key={index} className="d-flex">
                                                  <div className={stylesModule['card-child']}>
                                                    <div className={classnames(stylesModule.col)}>
                                                      <FormItem
                                                        className={stylesModule.item}
                                                        fieldKey={[fieldItemD.fieldKey, 'fee']}
                                                        name={[fieldItemD.name, 'fee']}
                                                        type={variables.INPUT}
                                                        disabled
                                                      />
                                                    </div>
                                                    <div className={classnames(stylesModule.col)}>
                                                      <FormItem
                                                        className={stylesModule.item}
                                                        fieldKey={[fieldItemD.fieldKey, 'money']}
                                                        name={[fieldItemD.name, 'money']}
                                                        type={variables.INPUT_NUMBER}
                                                        onChange={() => onChangeTotal()}
                                                      />
                                                    </div>
                                                  </div>
                                                </Pane>
                                              ))}
                                            </>
                                          )}
                                        </Form.List>
                                        <div className={stylesModule['card-child']}>
                                          <div className={classnames(stylesModule.colPayment)}>
                                            <div
                                              className={stylesModule.item}
                                              style={{ color: 'black', fontWeight: '700' }}
                                            >
                                              Tổng cộng
                                            </div>
                                          </div>
                                          <div className={classnames(stylesModule.colPayment)}>
                                            <FormItem
                                              name={[fieldItem.name, 'totalMoney']}
                                              type={variables.INPUT_NUMBER}
                                              disabled
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        className={classnames(stylesModule.cols)}
                                        style={{ width: '25%' }}
                                      >
                                        <FormItem
                                          className={stylesModule.item}
                                          fieldKey={[fieldItem.fieldKey, 'note']}
                                          name={[fieldItem.name, 'note']}
                                          type={variables.INPUT}
                                        />
                                      </div>
                                    </div>
                                  </Pane>
                                ))}
                              </>
                            )}
                          </Form.List>
                        </div>
                      </Pane>
                    </Pane>
                  </Pane>
                  <Pane className=" pb20 d-flex justify-content-between align-items-center ">
                    <p
                      className="btn-delete"
                      role="presentation"
                      loading={loadingSubmit}
                      onClick={() => history.goBack()}
                    >
                      Hủy
                    </p>
                    <Button
                      className="ml-auto px25"
                      color="success"
                      htmlType="submit"
                      size="large"
                      loading={loadingSubmit}
                    >
                      Lưu
                    </Button>
                  </Pane>
                </Form>
              ) : (
                <div className={stylesModule['wrapper-table-none']}>Chưa có dữ liệu</div>
              )}
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default General;
