import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from '../styles.module.scss';


const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    details,
    menuLeftEnglish,
  } = useSelector(({ menu, loading, englishSettingevaluationCriteriaAdd }) => ({
    loading,
    menuLeftEnglish: menu.menuLeftEnglish,
    details: englishSettingevaluationCriteriaAdd.details,
    error: englishSettingevaluationCriteriaAdd.error,
  }));


  const loadingSubmit = effects[`englishSettingevaluationCriteriaAdd/UPDATE`] || effects[`englishSettingevaluationCriteriaAdd/ADD`];

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'englishSettingevaluationCriteriaAdd/UPDATE' : 'englishSettingevaluationCriteriaAdd/ADD',
      payload: { name: values?.name, content: values?.content, id: params.id },
      callback: (response, error) => {
        if (response) {
          if (response) {
            history.push(`/english/settings/evaluationCriteria`);
          }
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              form.current.setFields([
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
      <Breadcrumbs last={params.id ? 'Edit' : 'Create new'} menu={menuLeftEnglish} />
      <Helmet title="Evaluation criteria" />
      <Pane className="pl20 pr20">
        <Pane className="col-lg-6 offset-lg-3">
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
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
                    <FormItem
                      name="code"
                      placeholder=" "
                      type={variables.INPUT}
                      label="ID"
                      disabled
                    />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name="name"
                      placeholder="Input text"
                      type={variables.INPUT}
                      label="Subject name"
                      rules={[variables.RULES.EMPTY_INPUT_ENGLISH]}
                    />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name="content"
                      placeholder="Input text"
                      type={variables.TEXTAREA}
                      label="Explain"
                      rules={[variables.RULES.EMPTY_INPUT_ENGLISH]}
                    />
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="d-flex justify-content-between align-items-center mb20">
                <p
                  className="btn-delete"
                  role="presentation"

                  onClick={() => history.push(`/english/settings/evaluationCriteria`)}
                >
                  Cancel
                </p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit}
                // permission={"WEB_TIENGANH_QUANLYTIEUCHI_UPDATE" || "WEB_TIENGANH_QUANLYTIEUCHI_CREATE"}
                >
                  Save
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