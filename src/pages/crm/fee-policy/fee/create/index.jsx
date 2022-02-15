import { memo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import csx from 'classnames';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import FormItem from '@/components/CommonComponent/FormItem';

import { variables } from '@/utils';

import variablesModules from '../variables';

const Index = memo(() => {
  const params = useParams();
  const [{ menuLeftCRM }] = useSelector(({ menu }) => [menu]);
  const dispatch = useDispatch();

  const history = useHistory();
  const formRef = useRef();

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'CRMfeesAdd/GET_DETAILS',
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
      type: params?.id ? 'CRMfeesAdd/UPDATE' : 'CRMfeesAdd/ADD',
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
      <Breadcrumbs className="pb30 pt0" last={`${params?.id ? 'Chi tiết' : 'Thêm mới'}`} menu={menuLeftCRM} />
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
              <Pane className="p20 d-flex flex-row-reverse border-top">
                <p className="btn-delete" role="presentation" onClick={() => history.goBack()} >
                  Hủy
                </p>
              </Pane>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
