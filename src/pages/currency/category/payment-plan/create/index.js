import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { useParams, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { head, isEmpty, get } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import styles from '@/assets/styles/Common/common.scss';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import stylesModule from '../styles.module.scss';

const General = memo(() => {
  const {
    loading: { effects },
    yearsSchool,
    branches,
    classes,
    details,
  } = useSelector(({ loading, currencyPaymentPlanAdd }) => ({
    loading,
    details: currencyPaymentPlanAdd.details,
    yearsSchool: currencyPaymentPlanAdd.yearsSchool,
    classes: currencyPaymentPlanAdd.classes,
    data: currencyPaymentPlanAdd.data,
    branches: currencyPaymentPlanAdd.branches,
  }));
  const [{ menuLeftCurrency }] = useSelector(({ menu }) => [menu]);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const mounted = useRef(false);
  const loadingSubmit =
    effects['currencyPaymentPlanAdd/ADD'] || effects['currencyPaymentPlanAdd/UPDATE'];

  const params = useParams();
  const [dataPayment, setDataPayment] = useState([]);

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
    dispatch({
      type: 'currencyPaymentPlanAdd/GET_CLASSES',
      payload: {},
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'currencyPaymentPlanAdd/GET_DETAILS',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              data: response.symptoms.map((item) => ({
                ...item,
              })),
            });
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue({
        ...details,
        ...(head(details.positionLevel) || {}),
      });
    }
  }, [details]);

  const onFinish = (values) => {
    dispatch({
      type: 'currencyPaymentPlanAdd/GET_PAYMENT',
      payload: values,
      callback: (response, error) => {
        if (response) {
          console.log('ress', response);
          setDataPayment(response);
          form.setFieldsValue({
            data: response.map((item) => ({
              fullName: item?.student?.fullName,
              totalMoney: item?.totalMoney,
              tuition: item?.tuition?.map((i) => ({
                fee: i?.fee?.name,
                money: i?.money,
              })),
            })),
          });
          console.log('F', form);
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

  return (
    <>
      <Breadcrumbs last={params.id ? 'Chỉnh sửa ' : 'Tạo mới'} menu={menuLeftCurrency} />
      <Pane className="p20">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Pane>
            <Pane className="card">
              <Pane>
                <Pane className="card p20">
                  <Heading type="form-title" className="mb10">
                    Thông tin chung
                  </Heading>

                  <Pane className="row">
                    <Pane className="col-lg-3">
                      <FormItem
                        className="mb-3"
                        label="Ngày kế hoạch"
                        name="datePlan"
                        type={variables.DATE_PICKER}
                        // rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>
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
                        // onChange={(e) => loadTableFees(e, 'schoolYearId')}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        className="mb-3"
                        label="Tháng tính phí"
                        name="chargeMonth"
                        type={variables.MONTH_PICKER}
                        placeholder="Chọn tháng"
                        allowClear={false}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        className="mb-3"
                        label="Cơ sở"
                        data={branches}
                        name="branchId"
                        type={variables.SELECT}
                        placeholder="Chọn cơ sở"
                        rules={[variables.RULES.EMPTY]}
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
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        className="mb-0"
                        label="Loại lớp"
                        name="currencyOldStudentAddId"
                        type={variables.INPUT}
                        placeholder=" "
                        allowClear={false}
                        disabled
                      />
                    </Pane>
                    <Pane className="pt30 pl15">
                      <Button className="ml-auto px25" color="success" htmlType="submit">
                        Tính phí
                      </Button>
                    </Pane>
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
            <Pane className="card">
              <Pane className="p20">
                <Heading type="form-title" className="mb20">
                  Thông tin tính phí
                </Heading>
                {dataPayment.length > 0 ? (
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
                            {/* <div className={stylesModule.cols}>
                     <p className={stylesModule.norm} />
                   </div> */}
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
                                                        type={variables.INPUT}
                                                      />
                                                    </div>
                                                  </div>
                                                </Pane>
                                              ))}
                                              <div className={stylesModule['card-child']}>
                                                <div className={classnames(stylesModule.col)}>
                                                  <div className={stylesModule.item}>Tổng cộng</div>
                                                </div>
                                                <div className={classnames(stylesModule.col)}>
                                                  <FormItem
                                                    className={stylesModule.item}
                                                    fieldKey={[fieldItem.fieldKey, 'totalMoney']}
                                                    name={[fieldItem.name, 'totalMoney']}
                                                    type={variables.INPUT}
                                                  />
                                                </div>
                                              </div>
                                            </>
                                          )}
                                        </Form.List>
                                      </div>
                                      <div className={classnames(stylesModule.cols)}>
                                        <FormItem
                                          className={stylesModule.item}
                                          fieldKey={[fieldItem.fieldKey, 'symptomName']}
                                          name={[fieldItem.name, 'symptomName']}
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
                ) : (
                  <div className={stylesModule['wrapper-table-none']}>Chưa có dữ liệu</div>
                )}
                <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
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
              </Pane>
            </Pane>
          </Pane>
        </Form>
      </Pane>
    </>
  );
});

export default General;
