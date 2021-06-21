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

const Index = memo(() => {
  const params = useParams();
  const { loading } = useSelector(({ loading }) => ({ loading }));
  const [{ menuConfiguration }] = useSelector(({ menu }) => [menu]);
  const dispatch = useDispatch();

  const history = useHistory();
  const formRef = useRef();

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'classTypeAdd/GET_DETAILS',
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
      type: 'classTypeAdd/ADD',
      payload: {
        ...values,
      },
      callback: (res) => {
        if (res) {
          history.goBack();
        }
      },
    });
  };

  const remove = () => {
    formRef.current.resetFields();
  };

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title={params?.id ? 'Chi tiết loại lớp' : 'Thêm mới loại lớp'} />
      <Breadcrumbs className="pb30 pt0" last={`${params?.id ? 'Chi tiết' : 'Thêm mới'}`} menu={menuConfiguration} />
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
                  {params?.id ? 'Chi tiết loại lớp' : 'Thêm mới loại lớp'}
                </Heading>

                <Pane className={csx('row')}>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Mã loại lớp"
                      name="code"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                    />
                  </Pane>

                  <Pane className="col-lg-6">
                    <FormItem
                      label="Tên loại lớp"
                      name="name"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                    />
                  </Pane>

                  <Pane className="col-lg-6">
                    <FormItem
                      label="Từ tháng tuổi"
                      name="from"
                      type={variables.INPUT_COUNT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-6">
                    <FormItem
                      label="Đến tháng tuổi"
                      name="to"
                      type={variables.INPUT_COUNT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-12">
                    <FormItem
                      label="Mô tả"
                      name="description"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_TEXTAREA]}
                    />
                  </Pane>

                </Pane>
              </Pane>
              {
                !params?.id && (
                  <Pane className="p20 d-flex justify-content-between align-items-center border-top">
                    <p className="btn-delete" role="presentation" onClick={remove}>
                      Hủy
                    </p>
                    <Button
                      className="ml-auto px25"
                      color="success"
                      htmlType="submit"
                      size="large"
                      loading={loading['classTypeAdd/GET_DETAILS']}
                    >
                      Lưu
                    </Button>
                  </Pane>
                )
              }
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
