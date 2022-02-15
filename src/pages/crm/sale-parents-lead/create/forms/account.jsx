import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { isEmpty, get } from 'lodash';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';

const General = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [, { details }, effects] = useSelector(({ menu, crmSaleLeadAdd, loading: { effects } }) => [
    menu,
    crmSaleLeadAdd,
    effects,
  ]);
  const mounted = useRef(false);
  const loadingSubmit = effects['crmSaleLeadAdd/ADD'] || effects['crmSaleLeadAdd/UPDATE'];

  const params = useParams();

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (details) {
      form.setFieldsValue({
        user_name: details?.ssoAccount?.user_name,
        email: details?.ssoAccount?.email,
        password : details?.ssoAccount?.password,
      });
    }
  }, [details]);

  const onFinish = (values) => {
    dispatch({
      type: 'crmSaleLeadAdd/ADD_ACCOUNT',
      payload: { ...values, customer_lead_id: params.id },
      callback: (response, error) => {
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              form.setFieldsValue([
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
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <div className="card">
          <div style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Thông tin tài khoản
            </Heading>
            <div className="row">
              <div className="col-lg-4">
                <FormItem
                  name="user_name"
                  label="Tên tài khoản"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY_INPUT]}
                />
              </div>
              <div className="col-lg-4">
                <FormItem
                  name="password"
                  label="Mật khẩu"
                  type={variables.INPUT_PASSWORD}
                  rules={[variables.RULES.EMPTY_INPUT]}
                />
              </div>
              <div className="col-lg-4">
                <FormItem
                  name="email"
                  label="Email"
                  type={variables.EMAIL}
                  rules={[variables.RULES.EMPTY_INPUT]}
                />
              </div>
            </div>
          </div>
          <div className="p20 d-flex  flex-row-reverse">
            {details?.ssoAccount ? '' : (
              <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
                Lưu
              </Button>
            )}
          </div>
        </div>
      </Form>
    </>
  );
});

General.propTypes = {};

General.defaultProps = {};

export default General;
