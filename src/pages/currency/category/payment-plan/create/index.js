import { memo, useRef, useEffect } from 'react';
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
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [
    { menuLeftCurrency },
    { details },
    effects,
  ] = useSelector(({ menu, currencyPaymentPlanAdd, loading: { effects } }) => [
    menu,
    currencyPaymentPlanAdd,
    effects,
  ]);
  const mounted = useRef(false);
  const loadingSubmit =
    effects['currencyPaymentPlanAdd/ADD'] || effects['currencyPaymentPlanAdd/UPDATE'];

  const params = useParams();

  const history = useHistory();

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      data: [''],
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
    const items = values.data.map((item) => ({
      ...item,
    }));
    dispatch({
      type: params.id ? 'currencyPaymentPlanAdd/UPDATE' : 'currencyPaymentPlanAdd/ADD',
      payload: {
        ...details,
        ...params,
        name: values?.name,
        symptoms: items,
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

  return (
    <>
      <Breadcrumbs last={params.id ? 'Chỉnh sửa ' : 'Tạo mới'} menu={menuLeftCurrency} />
      <Pane className="p20">
        <Form layout="vertical" form={form} initialValues={{}} onFinish={onFinish}>
          <Pane>
          <Pane className="card">
              <Pane >
                <Pane className="card p20">
                  <Heading type="form-title" className="mb10">
                    Thông tin chung
                  </Heading>

                  <Pane className="row">
                    <div className="col-lg-3">
                      <FormItem
                        className="mb-2"
                        label="Năm học"
                        name="currencyOldStudentAddId"
                        type={variables.SELECT}
                        placeholder="Chọn năm"
                        allowClear={false}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormItem
                        className="mb-2"
                        label="Thời gian hiệu lực"
                        name="currencyOldStudentAddId"
                        type={variables.SELEINPUTCT}
                        allowClear={false}
                      />
                    </div>
                  </Pane>
                  <Pane className="row">
                    <div className="col-lg-3">
                      <FormItem
                        className="mb-0"
                        label="Tên học sinh"
                        name="currencyOldStudentAddId"
                        type={variables.SELECT}
                        placeholder="Chọn năm"
                        allowClear={false}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormItem
                        className="mb0"
                        label="Mã học sinh"
                        name="decisionDate"
                        type={variables.INPUT}
                      />
                    </div>
                    <div className="col-lg-2">
                      <FormItem
                        className="mb0"
                        label="Cơ sở"
                        name="decisionDate"
                        type={variables.INPUT}
                      />
                    </div>{' '}
                    <div className="col-lg-2">
                      <FormItem
                        className="mb0"
                        label="Khối lớp"
                        name="decisionDate"
                        type={variables.INPUT}
                      />
                    </div>{' '}
                    <div className="col-lg-2">
                      <FormItem
                        className="mb0"
                        label="Lớp"
                        name="decisionDate"
                        type={variables.INPUT}
                      />
                    </div>
                  </Pane>
                </Pane>
              </Pane>

            </Pane>
            <Pane className="card">
              <Pane className="p20">
                <Heading type="form-title" className="mb20">
                  Thông tin thêm mới
                </Heading>
                <Pane className="row mt20">
                  <Pane className="col-lg-12">
                    <Heading type="form-title" className="mb20">
                      Triệu chứng
                    </Heading>

                    <Pane>
                      <div className={stylesModule['wrapper-table']}>
                        <div className={stylesModule['card-heading']}>
                          <div className={stylesModule.col}>
                            <p className={stylesModule.norm}>Tên học sinh</p>
                          </div>
                          <div className={stylesModule.col}>
                            <p className={stylesModule.norm}>Khoản phí</p>
                          </div>
                          <div className={stylesModule.cols}>
                            <p className={stylesModule.norm} />
                          </div>
                        </div>
                        <Form.List name="data">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map((fieldItem, index) => (
                                <Pane key={index} className="d-flex">
                                  <div className={stylesModule['card-item']}>
                                    <div className={classnames(stylesModule.col)}>
                                      <FormItem
                                        className={stylesModule.item}
                                        fieldKey={[fieldItem.fieldKey, 'position']}
                                        name={[fieldItem.name, 'position']}
                                        type={variables.INPUT}
                                        rules={[variables.RULES.EMPTY_INPUT]}
                                      />
                                    </div>
                                    <div className={classnames(stylesModule.col)}>
                                      <Form.List name="datas">
                                        {(fields, { add, remove }) => (
                                          <>
                                            {fields.map((fieldItem, index) => (
                                              <Pane key={index} className="d-flex">
                                                <div className={stylesModule['card-item']}>
                                                  <div className={classnames(stylesModule.col)}>
                                                    <FormItem
                                                      className={stylesModule.item}
                                                      fieldKey={[fieldItem.fieldKey, 'position']}
                                                      name={[fieldItem.name, 'position']}
                                                      type={variables.INPUT}
                                                      rules={[variables.RULES.EMPTY_INPUT]}
                                                    />
                                                  </div>
                                                  <div className={classnames(stylesModule.col)}>
                                                    <FormItem
                                                      className={stylesModule.item}
                                                      fieldKey={[fieldItem.fieldKey, 'symptomName']}
                                                      name={[fieldItem.name, 'symptomName']}
                                                      type={variables.INPUT}
                                                      rules={[variables.RULES.EMPTY_INPUT]}
                                                    />
                                                  </div>
                                                </div>
                                              </Pane>
                                            ))}
                                            <Pane className="mt10 ml10 mb10 d-flex align-items-center color-success pointer ">
                                              <span
                                                onClick={() => add()}
                                                role="presentation"
                                                className={stylesModule.add}
                                              >
                                                <span className="icon-plus-circle mr5" />
                                                Thêm
                                              </span>
                                            </Pane>
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
                                        rules={[variables.RULES.EMPTY_INPUT]}
                                      />
                                    </div>
                                  </div>
                                </Pane>
                              ))}
                              <Pane className="mt10 ml10 mb10 d-flex align-items-center color-success pointer ">
                                <span
                                  onClick={() => add()}
                                  role="presentation"
                                  className={stylesModule.add}
                                >
                                  <span className="icon-plus-circle mr5" />
                                  Thêm
                                </span>
                              </Pane>
                            </>
                          )}
                        </Form.List>
                      </div>
                    </Pane>
                  </Pane>
                </Pane>
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

General.propTypes = {};

General.defaultProps = {};

export default General;
