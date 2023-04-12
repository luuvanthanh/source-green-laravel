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
  } = useSelector(({ menu, loading, hrmProbationManagerCategoryEvaluationCriteriaAdd }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    error: hrmProbationManagerCategoryEvaluationCriteriaAdd.error,
  }));

  const loadingSubmit = effects[`hrmProbationManagerCategoryEvaluationCriteriaAdd/UPDATE`] || effects[`hrmProbationManagerCategoryEvaluationCriteriaAdd/ADD`];

  const onFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id ? 'hrmProbationManagerCategoryEvaluationCriteriaAdd/UPDATE' : 'hrmProbationManagerCategoryEvaluationCriteriaAdd/ADD',
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
        type: 'hrmProbationManagerCategoryEvaluationCriteriaAdd/GET_DATA',
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
      <Helmet title="Tiêu chí đánh giá" />
      <Breadcrumbs last={params.id ? 'Sửa' : 'Tạo mới'} menu={menuLeftHRM} />
      <div className="col-lg-6 offset-lg-3">
        <Helmet title="Tiêu chí đánh giá" />
        <Pane className="pl20 pr20 pb20">
          <Pane >
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={effects['hrmProbationManagerCategoryEvaluationCriteriaAdd/GET_DATA']}
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
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Tên tiêu chí"
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormItem
                        name="note"
                        placeholder="Nhập"
                        type={variables.INPUT}
                        label="Ghi chú"
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