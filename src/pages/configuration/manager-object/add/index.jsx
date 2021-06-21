import { memo, useRef, useState, useEffect } from 'react';
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

const Index = memo(() => {
  const params = useParams();
  const {
    loading,
  } = useSelector(({ loading, managerObjectAdd }) => ({
    loading: loading.effects,
    details: managerObjectAdd.details,
  }));

  const [{ menuConfiguration }] = useSelector(({ menu }) => [menu]);
  const dispatch = useDispatch();

  const history = useHistory();
  const formRef = useRef();

  const [isGrateful, setisGrateful] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'managerObjectAdd/GET_DETAILS',
        payload: {
          ...params
        },
        callback: (res) => {
          if (res) {
            formRef.current.setFieldsValue({
              ...res,
            });
            setisGrateful(res?.isGrateful || false);
          }
        },
      });
    }
  }, []);

  const onFinish = (values) => {
    dispatch({
      type: 'managerObjectAdd/ADD',
      payload: {
        ...values,
        isGrateful
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
    setisGrateful(checked);
  };

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title={params?.id ? 'Chi tiết nhóm đối tượng' : 'Thêm mới nhóm đối tượng'} />
      <Breadcrumbs className="pb30 pt0" last={`${params?.id ? 'Chi tiết' : 'Thêm mới'}`} menu={menuConfiguration} />
      <Pane className="row justify-content-center">
        <Pane className="col-lg-6">
          <Pane className="card">
            <Form
              layout="vertical"
              ref={formRef}
              onFinish={onFinish}
            >
              <Pane className="px20 pt20">
                <Heading type="form-title" className="mb20">
                  {params?.id ? 'Chi tiết nhóm đối tượng' : 'Thêm mới nhóm đối tượng'}
                </Heading>

                <Pane className={csx('row')}>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Mã nhóm"
                      name="code"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-6">
                    <FormItem
                      label="Tên nhóm"
                      name="name"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-12">
                    <FormItem
                      label="Mô tả"
                      name="description"
                      type={variables.INPUT}
                    />
                  </Pane>

                  <Pane className="col-lg-12">
                    <FormItem
                      className="checkbox-row"
                      label="Tri ân"
                      onChange={onChange}
                      type={variables.CHECKBOX_SINGLE}
                      checked={isGrateful}
                    />
                  </Pane>
                </Pane>
              </Pane>
              {!params?.id && (
                <Pane className="p20 border-top">
                  <Button
                    className="ml-auto px25"
                    color="success"
                    htmlType="submit"
                    size="large"
                    loading={loading['managerObjectAdd/ADD']}
                  >
                    Lưu
                  </Button>
                </Pane>
              )}
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
