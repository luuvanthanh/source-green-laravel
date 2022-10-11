import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import csx from 'classnames';
import { useSelector, useDispatch } from 'dva';
import { useParams } from 'umi';
import { get, isEmpty, head } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils/variables';
import Loading from '@/components/CommonComponent/Loading';

const Index = memo(() => {
  const [form] = Form.useForm();
  const {
    loading: { effects },
  } = useSelector(({ loading, HRMusersAdd }) => ({
    loading,
    insurrances: HRMusersAdd.insurrances,
  }));
  const loadingSubmit = effects[`HRMusersAdd/ADD_HEALTH_INSURANCES`];
  const loading = effects[`HRMusersAdd/GET_HEALTH_INSURANCES`];
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const onFinish = (values) => {
    dispatch({
      type: 'HRMusersAdd/ADD_HEALTH_INSURANCES',
      payload: {
        employeeId: params.id,
        ...values,
      },
      callback: (response, error) => {
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

  /**
   * Load Items Apointes
   */
  useEffect(() => {
    dispatch({
      type: 'HRMusersAdd/GET_HEALTH_INSURANCES',
      payload: {
        employeeId: params.id,
      },
      callback: (response) => {
        if (response && !isEmpty(response.parsePayload)) {
          form.setFieldsValue({
            ...head(response.parsePayload),
          });
        }
      },
    });
  }, []);

  return (
    <Form layout="vertical" form={form} initialValues={{}} onFinish={onFinish}>
      <Pane className="card">
        <Loading loading={loading}>
          <Pane style={{ padding: 20 }} className="pb-0">
            <Heading type="form-title">Bảo hiểm y tế</Heading>
          </Pane>

          <Pane
            className={csx('pb-0', 'border-bottom', 'position-relative')}
            style={{ padding: 20 }}
          >
            <Pane className="row">
              <Pane className="col-lg-6">
                <FormItem name="insuranceNumber" label="Số thẻ BHYT" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-6">
                <FormItem
                  name="medicalTreatmentPlace"
                  label="Nơi khám chữa bệnh"
                  type={variables.INPUT}
                />
              </Pane>
              <Pane className="col-lg-6">
                <FormItem
                  name="hospitalCode"
                  label="Mã bệnh viện"
                  type={variables.INPUT}
                />
              </Pane>
            </Pane>
          </Pane>

          <Pane style={{ padding: 20 }}>
            <Button
              color="success"
              size="large"
              style={{ marginLeft: 'auto' }}
              htmlType="submit"
              loading={loadingSubmit}
            >
              Lưu
            </Button>
          </Pane>
        </Loading>
      </Pane>
    </Form>
  );
});

export default Index;
