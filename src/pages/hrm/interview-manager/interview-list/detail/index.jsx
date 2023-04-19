import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { get, size } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';
import Button from '@/components/CommonComponent/Button';
import DetailInfo from '../component/detail-info';

import InterviewResult from '../component/interview-result-detail';
import SalaryProposalDetail from '../component/salary-proposal-detail';
import VariablesModules from '../../utils/variables';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    menuLeftHRM,
    details,
  } = useSelector(({ menu, loading, hrmRecruitmentInterviewListAdd }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    details: hrmRecruitmentInterviewListAdd.details,
    error: hrmRecruitmentInterviewListAdd.error,
  }));

  const loadingSubmit = effects[`hrmRecruitmentInterviewListAdd/ADD`];

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'hrmRecruitmentInterviewListAdd/GET_DATA',
        payload: params,
        callback: () => {},
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onFinish = (values) => {
    if (details?.status === VariablesModules.STATUS.INTERVIEWED) {
      return dispatch({
        type: 'hrmRecruitmentInterviewListAdd/ADD_SEND_SUGGESTIONS',
        payload: {
          status: VariablesModules.STATUS.INTERVIEWED,
          suggestedSalary: values?.suggestedSalary,
          pointEvaluationId: details?.pointEvaluationId,
          id: params?.id,
          mediumScore: details?.mediumScore,
        },
        callback: (response, error) => {
          if (response) {
            history.goBack();
          }
          if (error) {
            const { data } = error;
            if (data?.status === 400 && !!size(data?.errors)) {
              data?.errors.forEach((item) => {
                form?.setFields([
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
    }
    return '';
  };

  const formBtn = () => {
    if (details?.status === VariablesModules.STATUS.NOT_INTERVIEWED_YET) {
      return (
        <Button
          className="ml-auto px25"
          color="success"
          size="large"
          loading={loadingSubmit}
          onClick={() => history.push(`chinh-sua`)}
          permission={`${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_CAUHINHLEVEL}${ACTION.EDIT}`}
        >
          Sửa
        </Button>
      );
    }
    if (
      details?.status === VariablesModules.STATUS.INTERVIEWED ||
      details?.status === VariablesModules.STATUS.NO_SALARY_APPROVAL
    ) {
      return (
        <Button
          className="ml-auto px25"
          color="success"
          htmlType="submit"
          size="large"
          loading={loadingSubmit}
          permission={`${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_CAUHINHLEVEL}${ACTION.EDIT}`}
        >
          Gửi đề xuất
        </Button>
      );
    }
    if (details?.status === VariablesModules.STATUS.APPROVED) {
      return (
        <Button
          className="ml-auto px25"
          color="success"
          size="large"
          loading={loadingSubmit}
          permission={`${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_CAUHINHLEVEL}${ACTION.EDIT}`}
          onClick={() => history.push(`/quan-ly-nhan-su/hop-dong-thu-viec/tao-moi`)}
        >
          Tạo hợp đồng thử việc
        </Button>
      );
    }
    return '';
  };

  return (
    <>
      <Breadcrumbs last="Chi tiết" menu={menuLeftHRM} />
      <Helmet title="Chi tiết phỏng vấn" />
      <Pane className="pl20 pr20 pb20">
        <Pane>
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
            <Loading
              params={{ type: 'container' }}
              loading={effects['hrmRecruitmentInterviewListAdd/GET_DATA']}
            >
              <DetailInfo details={details} />
              {details?.status !== VariablesModules.STATUS.NOT_INTERVIEWED_YET && (
                <>
                  <InterviewResult details={details} />
                  <SalaryProposalDetail details={details} />
                </>
              )}
              <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                  Đóng
                </p>
                {formBtn()}
              </Pane>
            </Loading>
          </Form>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
