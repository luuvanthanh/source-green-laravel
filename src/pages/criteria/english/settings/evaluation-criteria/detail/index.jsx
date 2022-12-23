import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import FormDetail from '@/components/CommonComponent/FormDetail';

import Button from '@/components/CommonComponent/Button';
import stylesModule from '../styles.module.scss';


const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    details,
    menuLeftCriteria,
  } = useSelector(({ menu, loading, englishSettingevaluationCriteriaAdd }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    details: englishSettingevaluationCriteriaAdd.details,
    skill: englishSettingevaluationCriteriaAdd.skill,
    error: englishSettingevaluationCriteriaAdd.error,
  }));

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'englishSettingevaluationCriteriaAdd/GET_DATA',
        payload: params,
        callback: () => { },
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue({
        ...details,
      });
    }
  }, [details]);

  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={details?.name} menu={menuLeftCriteria} />
      <Helmet title="Evaluation criteria" />
      <Pane className="pl20 pr20">
        <Pane className="col-lg-6 offset-lg-3">
          <Form layout="vertical" form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            <Loading
              loading={effects['englishSettingevaluationCriteriaAdd/GET_DATA']}
            >
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  General info
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-12">
                    <FormDetail name={details?.code} label="ID" />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormDetail name={details?.name} label="Subject name" />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormDetail name={details?.content} label="Explain" />
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="d-flex justify-content-between align-items-center mb20">
                <p
                  className="btn-delete"
                  role="presentation"

                  onClick={() => history.goBack()}
                >
                  Close
                </p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  size="large"
                  onClick={() => {
                    history.push(`/chuong-trinh-hoc/settings/evaluationCriteria/${details?.id}/edit`);
                  }}
                >
                  Edit
                </Button>
              </Pane>
            </Loading>
          </Form>
        </Pane>
      </Pane>
    </div>
  );
});

export default Index;