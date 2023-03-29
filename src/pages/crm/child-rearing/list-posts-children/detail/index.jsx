import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Button from '@/components/CommonComponent/Button';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const [detail, setDetail] = useState({});


  const {
    loading: { effects },
    menuLeftCRM,
  } = useSelector(({ menu, loading, crmListPostsChildrenAdd }) => ({
    loading,
    menuLeftCRM: menu.menuLeftCRM,
    error: crmListPostsChildrenAdd.error,
  }));

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'crmListPostsChildrenAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            setDetail(response);
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
      <Breadcrumbs last='Chi tiết' menu={menuLeftCRM} />
      <div className="col-lg-6 offset-lg-3">
        <Helmet title="Danh mục" />
        <Pane className="pl20 pr20 pb20">
          <Pane >
            <Form layout="vertical" form={form} initialValues={{}}>
              <Loading
                loading={effects['crmListPostsChildrenAdd/GET_DATA']}
              >
                <Pane className="card p20">
                  <Heading type="form-title" className="mb15">
                    Thông tin danh mục
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-12">
                      <FormDetail name={detail?.name} label="Tên danh mục" type="text" />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormDetail name={detail?.description} label="Mô tả" type="TextArea" />
                    </Pane>
                  </Pane>
                  <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                    <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                      Đóng
                    </p>
                    <Button
                      className="ml-auto px25"
                      color="success"
                      htmlType="submit"
                      size="large"
                      permission="WEB_KIENTHUCNUOIDAYTRE_DANHMUC_EDIT"
                      onClick={() => history.push(`/crm/kien-thuc-nuoi-day-tre/danh-muc/${params.id}/chinh-sua`)}
                    >
                      Sửa
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