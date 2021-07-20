import { memo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import csx from 'classnames';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

import { variables } from '@/utils';

import variablesModules from '../variables';

const Index = memo(() => {
  const params = useParams();
  const { loading } = useSelector(({ loading }) => ({ loading }));
  const [{ menuLeftFeePolicy }] = useSelector(({ menu }) => [menu]);
  const dispatch = useDispatch();

  const history = useHistory();
  const formRef = useRef();

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'feesAdd/GET_DETAILS',
        payload: {
          ...params
        },
        callback: (res) => {
          if (res) {
            formRef.current.setFieldsValue({
              ...res,
            });
          }
        },
      });
    }
  }, []);

  const onFinish = (values) => {
    dispatch({
      type: params?.id ? 'feesAdd/UPDATE' : 'feesAdd/ADD',
      payload: {
        ...values,
        id: params?.id || undefined
      },
      callback: (res) => {
        if (res) {
          history.goBack();
        }
      },
    });
  };

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title={params?.id ? 'Chi tiết phí' : 'Thêm mới phí'} />
      <Breadcrumbs className="pb30 pt0" last={`${params?.id ? 'Chi tiết' : 'Thêm mới'}`} menu={menuLeftFeePolicy} />
      <Pane className="row justify-content-center">
        <Pane className="col-lg-6">
          <Pane className="card">
            <Form
              layout="vertical"
              ref={formRef}
              onFinish={onFinish}
              initialValues={{}}
            >
              <Pane className="px20 pt20">
                <Heading type="form-title" className="mb20">
                  {params?.id ? 'Chi tiết phí' : 'Thêm mới phí'}
                </Heading>

                <Pane className={csx('row')}>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Mã phí"
                      name="code"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-6">
                    <FormItem
                      label="Tên phí"
                      name="name"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-6">
                    <FormItem
                      label="Kiểu (Type)"
                      name="type"
                      type={variables.SELECT}
                      data={variablesModules.TYPE}
                      rules={[variables.RULES.EMPTY]}
                      allowClear={false}
                    />
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="p20 d-flex justify-content-between align-items-center border-top">
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={loading['classTypeAdd/ADD'] || loading['classTypeAdd/UPDATE']}
                >
                  Lưu
                </Button>
              </Pane>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
