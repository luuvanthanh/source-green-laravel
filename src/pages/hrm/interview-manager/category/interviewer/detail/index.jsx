import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
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
    details,
  } = useSelector(({ menu, loading, hrmInterviewManagerCategoryInterviewAdd }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    details: hrmInterviewManagerCategoryInterviewAdd.details,
  }));

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'hrmInterviewManagerCategoryInterviewAdd/GET_DATA',
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
        <Helmet title="Người phỏng vấn" />
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form layout="vertical" form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={effects['hrmInterviewManagerCategoryInterviewAdd/GET_DATA']}
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
                        name={details?.division?.name}
                        label="Bộ phận"
                        type={variables.TYPE.TEXT}
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormDetail
                        name={details?.interviewerEmployee}
                        label="Người phụ trách phỏng vấn"
                        type={variables.TYPE.SELECT_TAGS}
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
                      onClick={() => history.push(`chinh-sua`)}
                      permission={`${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHMUC_NGUOIPHONGVAN}${ACTION.EDIT}`}
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
