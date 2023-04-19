import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { size, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import DetailInfo from '../component/detail-info';
import TableInput from '../component/table-edit';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    menuLeftHRM,
    details,
    user,
  } = useSelector(({ menu, loading, hrmRecruitmentDoInterviewAdd, user }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    details: hrmRecruitmentDoInterviewAdd.details,
    user: user?.user,
    error: hrmRecruitmentDoInterviewAdd.error,
  }));

  const [dataEvaluationCriteria, setDataEvaluationCriteria] = useState([]);
  const loadingSubmit =
    effects[`hrmRecruitmentDoInterviewAdd/UPDATE`] || effects[`hrmRecruitmentDoInterviewAdd/ADD`];

  const onFinish = () => {
    dispatch({
      type: 'hrmRecruitmentDoInterviewAdd/UPDATE',
      payload: {
        interviewListId: params?.id,
        employeeId: user?.objectInfo?.id,
        interviewDetails: dataEvaluationCriteria?.map((item) => ({
          evaluationCriteriaId: item?.id,
          pointEvaluation: item?.pointEvaluation,
          comment: item?.comment,
        })),
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
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'hrmRecruitmentDoInterviewAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            setDataEvaluationCriteria(
              response?.interviewConfiguration?.interviewConfigurationEvaluationCriteria,
            );
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
      <Helmet title="phỏng vấn" />
      <Breadcrumbs last="Phỏng vấn " menu={menuLeftHRM} />
      <div>
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={effects['hrmRecruitmentDoInterviewAdd/GET_DATA']}
              >
                <DetailInfo details={details} />
                <TableInput
                  setDataEvaluationCriteria={setDataEvaluationCriteria}
                  dataEvaluationCriteria={dataEvaluationCriteria}
                />
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
                    permission={`${FLATFORM.WEB}${permissions.HRM_PHONGVAN_LAMPHONGVAN}${ACTION.CREATE}`}
                  >
                    Hoàn thành phỏng vấn
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
