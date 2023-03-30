import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import ImageUpload from '@/components/CommonComponent/ImageUpload';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Quill from '@/components/CommonComponent/Quill';
import Pane from '@/components/CommonComponent/Pane';
import EditorToolbar, { modules, formats } from '@/components/CommonComponent/EditorToolbarNoUploadVideo';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import ValidateModules from '../../utils/variables';


const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const [content, setContent] = useState('');
  const [detail, setDetail] = useState({});
  const [fileImage, setFileImage] = useState(null);


  const {
    loading: { effects },
    menuLeftCRM,
    data,
    user
  } = useSelector(({ menu, loading, crmCategoryChildrennAdd, crmListPostsChildren, user }) => ({
    loading,
    menuLeftCRM: menu.menuLeftCRM,
    data: crmListPostsChildren.data,
    error: crmCategoryChildrennAdd.error,
    user: user.user
  }));

  const loadingSubmit = effects[`crmCategoryChildrennAdd/UPDATE`] || effects[`crmCategoryChildrennAdd/ADD`];

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'crmCategoryChildrennAdd/UPDATE' : 'crmCategoryChildrennAdd/ADD',
      payload: {
        id: params.id,
        name: values?.name,
        category_knowledge_to_teach_children_id: values?.category_knowledge_to_teach_children_id,
        status: ValidateModules.STATUS.POSTED,
        employee_id: user?.objectInfo?.id,
        content,
        image: fileImage || "",
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
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'crmCategoryChildrennAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              name: response?.name,
              category_knowledge_to_teach_children_id: response?.category_knowledge_to_teach_children_id,
            });
            setContent(response?.content);
            if (!isEmpty(response?.image)) {
              setFileImage(response.image);
            }
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

  const onChangeEditor = (e) => {
    setContent(e);
  };

  const onSetImage = (file) => {
    setFileImage(file);
  };

  const saveDraft = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id ? 'crmCategoryChildrennAdd/UPDATE' : 'crmCategoryChildrennAdd/ADD',
        payload: {
          id: params.id,
          name: values?.name,
          category_knowledge_to_teach_children_id: values?.category_knowledge_to_teach_children_id,
          status: detail?.status === ValidateModules.STATUS.POSTED ? ValidateModules.STATUS.POSTED : ValidateModules.STATUS.DRAFT,
          employee_id: user?.objectInfo?.id,
          content,
          image: fileImage || "",
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

  const formBtnSave = () => (
    <>
      <Button
        className="ml-auto px25 mr5"
        color="primary"
        size="large"
        loading={loadingSubmit}
        onClick={() => saveDraft()}
      // permission={!params?.id ? "WEB_KIENTHUCNUOIDAYTRE_DANHSACHBAIVIET_CREATE" : "WEB_KIENTHUCNUOIDAYTRE_DANHSACHBAIVIET_EDIT"}
      >
        {params?.id ? "Lưu cập nhập" : "Lưu nháp"}
      </Button>
    </>
  );

  const formBtnSend = () => {
    if (detail?.status !== ValidateModules.STATUS.POSTED) {
      return (
        <Button
          className="ml-auto px25"
          color="success"
          htmlType="submit"
          size="large"
          // permission="WEB_KIENTHUCNUOIDAYTRE_DANHSACHBAIVIET_SEND"
          loading={loadingSubmit}
        >
          Đăng bài viết
        </Button>
      );
    }
    return "";
  };

  return (
    <>
      <Breadcrumbs last={params.id ? 'Sửa' : 'Thêm mới'} menu={menuLeftCRM} />
      <div className="col-lg-8 offset-lg-2">
        <Helmet title="Danh sách bài viết" />
        <Pane className="pl20 pr20 pb20">
          <Pane >
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                loading={effects['crmCategoryChildrennAdd/GET_DATA']}
              >
                <Pane className="card p20">
                  <Heading type="form-title" className="mb15">
                    Thông tin bài viết
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-12">
                      <FormItem
                        name="name"
                        placeholder="Nhập"
                        type={variables.INPUT}
                        label="Tên bài viết"
                        rules={[variables.RULES.EMPTY_INPUT]}
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormItem
                        name="category_knowledge_to_teach_children_id"
                        placeholder="Chọn"
                        data={data}
                        type={variables.SELECT}
                        label="Danh mục"
                        rules={[variables.RULES.EMPTY_INPUT]}
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <div className="ant-col ant-form-item-label">
                        <label>
                          <span>Nội dung</span>
                        </label>
                      </div>
                      <EditorToolbar />
                      <Quill
                        onChange={onChangeEditor}
                        value={content}
                        theme="snow"
                        modules={modules}
                        formats={formats}
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <Form.Item label="Ảnh đại diện">
                        <ImageUpload
                          callback={(res) => {
                            onSetImage(res?.fileInfo?.url);
                          }}
                          fileImage={fileImage}
                        />
                      </Form.Item>
                    </Pane>
                  </Pane>
                  <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                    <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                      Hủy
                    </p>
                    <Pane className="d-flex" style={{ marginLeft: 'auto' }}>
                      {formBtnSave()}
                      {formBtnSend()}
                    </Pane>
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