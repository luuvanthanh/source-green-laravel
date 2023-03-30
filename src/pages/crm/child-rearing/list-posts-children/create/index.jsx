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
    menuLeftCRM,
  } = useSelector(({ menu, loading, crmListPostsChildrenAdd }) => ({
    loading,
    menuLeftCRM: menu.menuLeftCRM,
    error: crmListPostsChildrenAdd.error,
  }));

  const loadingSubmit = effects[`crmListPostsChildrenAdd/UPDATE`] || effects[`crmListPostsChildrenAdd/ADD`];

  const onFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id ? 'crmListPostsChildrenAdd/UPDATE' : 'crmListPostsChildrenAdd/ADD',
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
    });
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'crmListPostsChildrenAdd/GET_DATA',
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
      <Breadcrumbs last={params.id ? 'Sửa' : 'Thêm mới'} menu={menuLeftCRM} />
      <div className="col-lg-6 offset-lg-3">
        <Helmet title="Danh mục" />
        <Pane className="pl20 pr20 pb20">
          <Pane >
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                loading={effects['crmListPostsChildrenAdd/GET_DATA']}
              >
                <Pane className="card p20">
                  <Heading type="form-title" className="mb15">
                    Thông tin danh mục
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-12">
                      <FormItem
                        name="name"
                        placeholder="Nhập"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY]}
                        label="Tên danh mục"
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormItem
                        name="description"
                        placeholder="Nhập"
                        type={variables.TEXTAREA}
                        label="Mô tả"
                        rules={[variables.RULES.EMPTY]}
                      />
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
                      permission={!params?.id ? "WEB_KIENTHUCNUOIDAYTRE_DANHMUC_CREATE" : "WEB_KIENTHUCNUOIDAYTRE_DANHMUC_EDIT"}
                    >
                      Lưu
                    </Button>
                  </Pane>
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