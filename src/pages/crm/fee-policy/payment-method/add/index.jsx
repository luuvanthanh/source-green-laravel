import { memo, useRef, useEffect, useState } from 'react';
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
  const [isSemester, setIsSemester] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'CRMpaymentMethodAdd/GET_DETAILS',
        payload: {
          ...params
        },
        callback: (res) => {
          if (res) {
            formRef.current.setFieldsValue({
              ...res,
            });
            setIsSemester(res?.isSemester || false);
          }
        },
      });
    }
  }, []);

  const onFinish = (values) => {
    dispatch({
      type: params?.id ? 'CRMpaymentMethodAdd/UPDATE' : 'CRMpaymentMethodAdd/ADD',
      payload: {
        ...values,
        isSemester,
        id: params?.id || undefined
      },
      callback: (res) => {
        if (res) {
          history.goBack();
        }
      },
    });
  };

  const onChange = (e) => {
    const { checked } = e.target;
    setIsSemester(checked);
  };

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title={params?.id ? 'Chi tiết hình thức đóng phí' : 'Thêm hình thức đóng phí'} />
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
                  {params?.id ? 'Chi tiết hình thức đóng phí' : 'Thêm hình thức đóng phí'}
                </Heading>

                <Pane className={csx('row')}>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Hình thức"
                      name="code"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-6">
                    <FormItem
                      label="Tên"
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

                  <Pane className="col-lg-6">
                    <FormItem
                      className="checkbox-row no-label"
                      label="Học kỳ"
                      onChange={onChange}
                      type={variables.CHECKBOX_SINGLE}
                      checked={isSemester}
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
