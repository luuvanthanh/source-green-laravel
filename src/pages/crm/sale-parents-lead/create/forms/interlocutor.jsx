import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import moment from 'moment';
import { useParams } from 'umi';
import { head, isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';

const General = memo(() => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const {
    loading: { effects },
    detailsReferences,
    // parentLead,
  } = useSelector(({ loading, crmSaleLeadAdd }) => ({
    loading,
    detailsReferences: crmSaleLeadAdd.detailsReferences,
    data: crmSaleLeadAdd.data,
    error: crmSaleLeadAdd.error,
    parentLead: crmSaleLeadAdd.parentLead,
  }));
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);

  const loadingSubmit = effects[`crmSaleLeadAdd/ADD_REFERENCES`];
  const loading =
    effects[`crmSaleLeadAdd/GET_REFERENCES`] || effects[`crmSaleLeadAdd/GET_PARENT_LEAD`];

  const onFinish = (values) => {
    dispatch({
      type: 'crmSaleLeadAdd/ADD_REFERENCES',
      payload: { ...detailsReferences, ...values, customer_lead_id: params.id, id: params.id },
      callback: (response, error) => {
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              formRef.current.setFields([
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

  useEffect(() => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_PARENT_LEAD',
      payload: {},
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_REFERENCES',
      payload: { customer_lead_id: params.id },
      callback: (response) => {
        if (response) {
          if (params.id) {
            form.setFieldsValue({
              ...head(
                response.parsePayload.map((item) => ({
                  ...item,
                  birth_date: moment(item.birth_date),
                })),
              ),
            });
          }
        }
      },
    });
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <>
      <Pane>
        <Pane>
          <Form
            layout="vertical"
            initialValues={{
              data: [{}],
            }}
            name="control-ref"
            form={form}
            onFinish={onFinish}
          >
            <Pane>
              <Pane>
                <Pane className="card">
                  <div className="row">
                    <div className="col-lg-12">
                      <Pane style={{ padding: 20 }}>
                        <Heading type="form-title" style={{ marginBottom: 20 }}>
                          Người giới thiệu
                        </Heading>

                        <Pane className="row">
                          <Pane className="col-lg-4">
                            <FormItem
                              label="Họ và tên"
                              name="full_name"
                              type={variables.INPUT}
                              rules={[
                                variables.RULES.EMPTY_INPUT,
                                variables.RULES.MAX_LENGTH_INPUT,
                              ]}
                            />
                          </Pane>
                          <Pane className="col-lg-4">
                            <FormItem
                              name="birth_date"
                              label="Ngày sinh"
                              type={variables.DATE_PICKER}
                            />
                          </Pane>
                          <Pane className="col-lg-4">
                            <FormItem
                              label="Địa chỉ"
                              name="address"
                              type={variables.INPUT}
                              rules={[ variables.RULES.MAX_LENGTH_INPUT]}
                            />
                          </Pane>
                          <Pane className="col-lg-4">
                            <FormItem
                              label="Số điện thoại"
                              name="phone"
                              type={variables.INPUT}
                              rules={[variables.RULES.EMPTY_INPUT]}
                            />
                          </Pane>
                          {/* <Pane className="col-lg-4">
                            <FormItem
                              label="Tình trạng"
                              data={parentLead}
                              options={['id', 'name']}
                              name="status_parent_lead_id"
                              type={variables.SELECT}
                            />
                          </Pane> */}
                        </Pane>
                      </Pane>
                    </div>
                  </div>
                </Pane>
                <Pane className="d-flex justify-content-between align-items-center mb20">
                  <Button
                    className="ml-auto px25"
                    color="success"
                    htmlType="submit"
                    size="large"
                    loading={loadingSubmit || loading}
                  >
                    Lưu
                  </Button>
                </Pane>
              </Pane>
            </Pane>
          </Form>
        </Pane>
      </Pane>
    </>
  );
});

export default General;
