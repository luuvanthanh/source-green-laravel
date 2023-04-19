import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { size, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

import DetailInfo from '../component/detail-info';

import InterviewResult from '../component/interview-result';
import VariablesModules from '../../utils/variables';
import SalaryProposalDetail from '../component/salary-proposal-detail';
import ModalDoNotBrowse from '../component/modal-do-not-browse';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();

  const mounted = useRef(false);

  const [checkModal, setCheckModal] = useState(false);
  const {
    loading: { effects },
    menuLeftHRM,
    details,
  } = useSelector(({ menu, loading, hrmRecruitmentBrowseCandidates }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    details: hrmRecruitmentBrowseCandidates.details,
    error: hrmRecruitmentBrowseCandidates.error,
  }));

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'hrmRecruitmentBrowseCandidates/GET_DATA_DETAILS',
        payload: params,
        callback: () => {},
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onBrowsingCandidate = () => {
    dispatch({
      type: 'hrmRecruitmentBrowseCandidates/BROWSING_CANDIDATE',
      payload: {
        id: params?.id,
        status: VariablesModules.STATUS.PENDING,
        flag: VariablesModules.STATUS_APPROVED.APPROVED,
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

  return (
    <>
      <Breadcrumbs last={params.id ? 'Sửa' : 'Thêm mới'} menu={menuLeftHRM} />
      <div>
        <Helmet title="Duyệt ứng viên" />
        <ModalDoNotBrowse checkModal={checkModal} setCheckModal={setCheckModal} />
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form layout="vertical" form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={effects['hrmRecruitmentBrowseCandidates/GET_DATA_DETAILS']}
              >
                <DetailInfo details={details} />
                <InterviewResult details={details} />
                <SalaryProposalDetail details={details} />
                <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                  {details?.status === VariablesModules.STATUS.PENDING ? (
                    <>
                      <p
                        className="btn-delete"
                        role="presentation"
                        onClick={() => history.goBack()}
                      >
                        Hủy
                      </p>
                      <div className="d-flex">
                        <Button
                          className="ml-auto px25"
                          color="success"
                          htmlType="submit"
                          size="large"
                          onClick={() => setCheckModal(true)}
                          permission={`${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DUYETUNGVIEN}${ACTION.CREATE}`}
                        >
                          Không duyệt
                        </Button>
                        <Button
                          className="ml-auto px25 ml10"
                          color="success"
                          htmlType="submit"
                          size="large"
                          onClick={() => onBrowsingCandidate()}
                          permission={`${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DUYETUNGVIEN}${ACTION.CREATE}`}
                        >
                          Duyệt
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                      Đóng
                    </p>
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
