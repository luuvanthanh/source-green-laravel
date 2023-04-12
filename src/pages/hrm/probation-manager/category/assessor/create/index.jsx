import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    menuLeftHRM,
  } = useSelector(({ menu, loading, hrmProbationManagerCategoryAssessorAdd }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    error: hrmProbationManagerCategoryAssessorAdd.error,
  }));

  const loadingSubmit = effects[`hrmProbationManagerCategoryAssessorAdd/UPDATE`] || effects[`hrmProbationManagerCategoryAssessorAdd/ADD`];

  const onFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id ? 'hrmProbationManagerCategoryAssessorAdd/UPDATE' : 'hrmProbationManagerCategoryAssessorAdd/ADD',
        payload: {
          id: params.id,
          name: values?.name,
          description: values?.description,
        },
        callback: (response, error) => {
          if (response) {
            history.goBack();
          }
          if (error) {
            if (!isEmpty(error?.validationErrors)) {
              error?.validationErrors.forEach((item) => {
                form.setFields([
                  {
                    name: get(item, 'member').toLowerCase(),
                    errors: [get(item, 'message')],
                  },
                ]);
              });
            }
          }
        },
      });
    });
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'hrmProbationManagerCategoryAssessorAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              name: response?.name,
              description: response?.description,
            });
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <>
      <Helmet title="Người phỏng vấn" />
      <Breadcrumbs last={params.id ? 'Sửa' : 'Tạo mới'} menu={menuLeftHRM} />
      <div className="col-lg-6 offset-lg-3">
        <Helmet title="Người phỏng vấn" />
        <Pane className="pl20 pr20 pb20">
          <Pane >
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={effects['hrmProbationManagerCategoryAssessorAdd/GET_DATA']}
              >
                <Pane className="card p20">
                  <Heading type="form-title" className="mb15">
                    Thông tin chung
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <FormItem
                        name="code"
                        placeholder=" "
                        type={variables.INPUT}
                        label="ID"
                        disabled
                      />
                    </Pane>
                    <Pane className="col-lg-6">
                      <FormItem
                        name="name"
                        placeholder="Nhập"
                        type={variables.SELECT}
                        data={[]}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Bộ phận"
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormItem
                        name="note"
                        placeholder="Nhập"
                        type={variables.SELECT_MUTILPLE}
                        data={[]}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Người phụ trách phỏng vấn"
                      />
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                  <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
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
              </Loading>
            </Form>
          </Pane>
        </Pane>
      </div>
    </>
  );
});

export default Index;