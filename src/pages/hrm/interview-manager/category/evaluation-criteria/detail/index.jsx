import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';
import { variables } from '@/utils';
import Button from '@/components/CommonComponent/Button';
import FormDetail from '@/components/CommonComponent/FormDetail';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    menuLeftHRM,
    error,
    details,
  } = useSelector(({ menu, loading, hrmInterviewManagerCategoryEvaluationCriteriaAdd }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    details: hrmInterviewManagerCategoryEvaluationCriteriaAdd.details,
    error: hrmInterviewManagerCategoryEvaluationCriteriaAdd.error,
  }));

  const loadingSubmit =
    effects[`hrmInterviewManagerCategoryEvaluationCriteriaAdd/UPDATE`] ||
    effects[`hrmInterviewManagerCategoryEvaluationCriteriaAdd/ADD`];

  const onFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id
          ? 'hrmInterviewManagerCategoryEvaluationCriteriaAdd/UPDATE'
          : 'hrmInterviewManagerCategoryEvaluationCriteriaAdd/ADD',
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
        type: 'hrmInterviewManagerCategoryEvaluationCriteriaAdd/GET_DATA',
        payload: params,
        callback: () => {},
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <>
      <Breadcrumbs last="Chi tiết" menu={menuLeftHRM} />
      <div className="col-lg-6 offset-lg-3">
        <Helmet title="Tiêu chí đánh giá" />
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                isError={error.isError}
                params={{ type: 'container' }}
                loading={effects['hrmInterviewManagerCategoryEvaluationCriteriaAdd/GET_DATA']}
              >
                <Pane className="card p20">
                  <Heading type="form-title" className="mb15">
                    Thông tin chung
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <FormDetail name={details?.code} label="ID" type={variables.TYPE.TEXT} />
                    </Pane>
                    <Pane className="col-lg-6">
                      <FormDetail
                        name={details?.name}
                        label="Tên tiêu chí"
                        type={variables.TYPE.TEXT}
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormDetail
                        name={details?.note}
                        label="Ghi chú"
                        type={variables.TYPE.TEXTAREA}
                      />
                    </Pane>
                  </Pane>
                  <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                    <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                      Đóng
                    </p>
                    <Button
                      className="ml-auto px25"
                      color="success"
                      size="large"
                      loading={loadingSubmit}
                      onClick={() => history.push(`chinh-sua`)}
                      permission={`${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHMUC_TIEUCHIDANHGIA}${ACTION.EDIT}`}
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
