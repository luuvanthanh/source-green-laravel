import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import ImgDetail from '@/components/CommonComponent/imageDetail';

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
    data,
  } = useSelector(({ menu, loading, crmCategoryChildrennAdd, crmListPostsChildren }) => ({
    loading,
    menuLeftCRM: menu.menuLeftCRM,
    data: crmListPostsChildren.data,
    error: crmCategoryChildrennAdd.error,
  }));

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'crmCategoryChildrennAdd/GET_DATA',
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
    dispatch({
      type: 'crmListPostsChildren/GET_DATA',
      payload: {},
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <>
      <Breadcrumbs last='Chi tiết' menu={menuLeftCRM} />
      <div className="col-lg-8 offset-lg-2">
        <Helmet title="Danh sách bài viết" />
        <Pane className="pl20 pr20 pb20">
          <Pane >
            <Form layout="vertical" form={form} initialValues={{}}>
              <Loading
                loading={effects['crmCategoryChildrennAdd/GET_DATA']}
              >
                <Pane className="card p20">
                  <Heading type="form-title" className="mb15">
                    Thông tin bài viết
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-12">
                      <FormDetail name={detail?.name} label="Tên bài viết" type="text" />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormDetail name={detail?.category_knowledge_to_teach_children_id} label="Danh mục" data={data} type="select" />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormDetail label="Nội dung" name={detail?.content} type="HTML" />
                    </Pane>
                    <Pane className="col-lg-12 mb10">
                      <FormDetail label="Ảnh đại diện" type="img" />
                      <ImgDetail
                        fileImage={detail?.image}
                        type='object'
                      />
                    </Pane>
                  </Pane>
                  <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                    <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                      Đóng
                    </p>
                    <Button
                      color="success"
                      size="large"
                      style={{ marginLeft: 'auto' }}
                      // permission="WEB_KIENTHUCNUOIDAYTRE_DANHSACHBAIVIET_EDIT"
                      onClick={() => history.push(`/crm/kien-thuc-nuoi-day-tre/danh-sach-bai-viet/${params.id}/chinh-sua`)}
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