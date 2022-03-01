import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { useParams, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { isEmpty, get } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
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
    effects['currencyPaymentPlanAdd/ADD'] || effects['currencyPaymentPlanAdd/UPDATE'] || effects['currencyPaymentPlanAdd/GET_PAYMENT'] ;

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
                fullName: item?.chargeOldStudent?.student?.fullName,
                totalMoney: parseInt(item?.chargeOldStudent?.totalMoney, 10),
                studentId: item?.chargeOldStudent?.id,
                note: item?.note,
                tuition: item?.chargeOldStudent?.tuition?.map((i) => ({
                  fee: i?.fee?.name,
                  money: parseInt(i?.money, 10),
                })),
              })),
            });
          }
        },
      });
    }
    dispatch({
      type: 'currencyPaymentPlanAdd/GET_CLASSES',
      payload : {},
    });
  }, [params.id]);

  const onFinish = (values) => {
    dispatch({
      type: 'currencyPaymentPlanAdd/GET_PAYMENT',
      payload: values,
      callback: (response, error) => {
        if (response) {
          setDataSelect(values);
          setDataPayment(response);
          form.setFieldsValue({
            data: response.map((item) => ({
              fullName: item?.student?.fullName,
              totalMoney: parseInt(item?.totalMoney, 10),
              studentId: item?.id,
              tuition: item?.tuition?.map((i) => ({
                fee: i?.fee?.name,
                money: parseInt(i?.money, 10),
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
        ? { id: params.id, ...values, ...details, classTypeId: dataType[0]?.classType?.id }
        : { ...values, ...dataSelect, classTypeId: dataType[0]?.classType?.id },
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
    payload: {branch : e},
  });
};

  return (
    <>
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
                    {
                      details?.startDate  ?
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
                              moment(details?.endDate, variables.DATE_FORMAT.DATE_VI).endOf('day'))
                        }
                      />
                    </Pane>
                    : 
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
                            moment(details?.endDate, variables.DATE_FORMAT.DATE_VI).endOf('day'))
                      }
                      disabled
                    />
                  </Pane>
                    }
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
                      {
                        params?.id ? 
                      <Button className="ml-auto px25" color="success" htmlType="submit"  loading={loadingSubmit}  disabled>
                        Tính phí
                      </Button>
                        : 
                        <Button className="ml-auto px25" color="success" htmlType="submit"  loading={loadingSubmit}>
                        Tính phí
                      </Button>
                      }
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
                                                      />
                                                    </div>
                                                    <div className={classnames(stylesModule.col)}>
                                                      <FormItem
                                                        className={stylesModule.item}
                                                        fieldKey={[fieldItemD.fieldKey, 'money']}
                                                        name={[fieldItemD.name, 'money']}
                                                        type={variables.INPUT_NUMBER}
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
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        className={classnames(stylesModule.cols)}
                                        style={{ width: '25%'}}
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
    </>
  );
});

export default General;
