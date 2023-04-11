import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import DetailInfo from '../component/detail-info';
import ResultOfEvaluation from '../component/result-of-evaluation';

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
  } = useSelector(({ menu, loading, hrmProbationManagerBrowseProbationaryPersonnel }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    error: hrmProbationManagerBrowseProbationaryPersonnel.error,
  }));

  const onFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id ? 'hrmProbationManagerBrowseProbationaryPersonnel/UPDATE' : 'hrmProbationManagerBrowseProbationaryPersonnel/ADD',
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
        type: 'hrmProbationManagerBrowseProbationaryPersonnel/GET_DATA',
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
      <Breadcrumbs last={params.id ? 'Sửa' : 'Thêm mới'} menu={menuLeftHRM} />
      <div >
        <Helmet title="Duyệt nhân sự thử việc" />
        <ModalDoNotBrowse checkModal={checkModal} setCheckModal={setCheckModal} />
        <Pane className="pl20 pr20 pb20">
          <Pane >
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={effects['hrmProbationManagerBrowseProbationaryPersonnel/GET_DATA']}
              >
                <DetailInfo />
                <ResultOfEvaluation />
                <SalaryProposalDetail />
                <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                  <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                    Hủy
                  </p>
                  <div className='d-flex'>
                    <Button
                      className="ml-auto px25"
                      color="success"
                      htmlType="submit"
                      size="large"
                      onClick={() => setCheckModal(true)}
                    >
                      Không duyệt
                    </Button>
                    <Button
                      className="ml-auto px25 ml10"
                      color="success"
                      htmlType="submit"
                      size="large"
                    >
                      Duyệt
                    </Button>
                  </div>
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