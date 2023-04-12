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
import { variables } from '@/utils';
import Button from '@/components/CommonComponent/Button';
import FormDetail from '@/components/CommonComponent/FormDetail';
import InterviewResult from '../component/interview-result-detail';
import SalaryProposalDetail from '../component/salary-proposal-detail';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    menuLeftHRM,
  } = useSelector(({ menu, loading, hrmRecruitmentInterviewListAdd }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    error: hrmRecruitmentInterviewListAdd.error,
  }));

  const loadingSubmit = effects[`hrmRecruitmentInterviewListAdd/UPDATE`] || effects[`hrmRecruitmentInterviewListAdd/ADD`];

  const onFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id ? 'hrmRecruitmentInterviewListAdd/UPDATE' : 'hrmRecruitmentInterviewListAdd/ADD',
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
        type: 'hrmRecruitmentInterviewListAdd/GET_DATA',
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
      <Breadcrumbs last="Chi tiết" menu={menuLeftHRM} />
      <div>
        <Helmet title="Chi tiết phỏng vấn" />
        <Pane className="pl20 pr20 pb20">
          <Pane >
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={effects['hrmRecruitmentInterviewListAdd/GET_DATA']}
              >
                <Pane className="card p20"  >
                  <Heading type="form-title" className="mb15">
                    Thông tin chung
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-3">
                      <FormDetail name="LV0001" label="ID" type={variables.TYPE.TEXT} />
                    </Pane>
                    <Pane className="col-lg-9">
                      <FormDetail name="Phỏng vấn kinh doanh" label="Phỏng vấn" type={variables.TYPE.TEXT} />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormDetail name="Nguyễn Thị Linh" label="Tên ứng viên" type={variables.TYPE.TEXT} />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormDetail name="Kinh doanh" label="Vị trí ứng tuyển" type={variables.TYPE.TEXT} />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormDetail name="Kinh doanh" label="Bộ phận" type={variables.TYPE.TEXT} />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormDetail name=" " label="CV ứng viên" type={variables.TYPE.TEXT} />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormDetail name="Cấu hình kinh doanh" label="Cấu hình áp dụng" type={variables.TYPE.TEXT} />
                    </Pane>
                    <Pane className="col-lg-9">
                      <FormDetail name=" " label="Người phụ trách" type={variables.TYPE.TEXT} />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormDetail name=" " label="Thời gian" type={variables.TYPE.TEXT} />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormDetail name="Trụ sở Clover" label="Địa điểm" type={variables.TYPE.TEXT} />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormDetail name="" label="Trạng thái" type={variables.TYPE.TEXT} />
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="card p20"  >
                  <Heading type="form-title" className="mb15">
                    Kết quả phỏng vấn
                  </Heading>
                  <InterviewResult />
                </Pane>
                <Pane className="card p20"  >
                  <Heading type="form-title" className="mb15">
                    Đề xuất mức lương
                  </Heading>
                  <SalaryProposalDetail />
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
                  >
                    Sửa
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