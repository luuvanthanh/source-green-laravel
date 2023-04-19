import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';
import Button from '@/components/CommonComponent/Button';
import Pane from '@/components/CommonComponent/Pane';
import DetailInfo from '../component/detail-info';
import VariablesModules from '../../utils/variables';
import InterviewResult from '../component/interview-result';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    menuLeftHRM,
    details,
  } = useSelector(({ menu, loading, hrmRecruitmentDoInterviewAdd }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    details: hrmRecruitmentDoInterviewAdd.details,
    error: hrmRecruitmentDoInterviewAdd.error,
  }));

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'hrmRecruitmentDoInterviewAdd/GET_DATA',
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
      <Breadcrumbs last={params.id ? 'Sửa' : 'Thêm mới'} menu={menuLeftHRM} />
      <div>
        <Helmet title="Phỏng vấn" />
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form layout="vertical" form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={effects['hrmRecruitmentDoInterviewAdd/GET_DATA']}
              >
                <DetailInfo details={details} />
                {details?.status !== VariablesModules.STATUS.NOT_INTERVIEWED_YET && (
                  <InterviewResult details={details} />
                )}
                <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                  <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                    Đóng
                  </p>
                  {details?.status === VariablesModules.STATUS.NOT_INTERVIEWED_YET && (
                    <Button
                      className="ml-auto px25"
                      color="success"
                      size="large"
                      onClick={() => history.push(`phong-van`)}
                      permission={`${FLATFORM.WEB}${permissions.HRM_PHONGVAN_LAMPHONGVAN}${ACTION.CREATE}`}
                    >
                      Làm phỏng vấn
                    </Button>
                  )}
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
