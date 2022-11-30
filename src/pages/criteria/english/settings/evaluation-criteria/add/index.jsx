import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { head } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
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
    menuLeftCriteria,
  } = useSelector(({ menu, loading, englishSettingevaluationCriteriaAdd }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    details: englishSettingevaluationCriteriaAdd.details,
    skill: englishSettingevaluationCriteriaAdd.skill,
    error: englishSettingevaluationCriteriaAdd.error,
  }));


  const loadingSubmit = effects[`englishSettingevaluationCriteriaAdd/UPDATE`] || effects[`englishSettingevaluationCriteriaAdd/ADD`];

  const onFinish = () => {

  };

  useEffect(() => {
    dispatch({
      type: 'englishSettingevaluationCriteriaAdd/GET_SKILL',
      payload: {},
    });
  }, []);

  // useEffect(() => {
  //   if (params.id) {
  //     dispatch({
  //       type: 'englishSettingevaluationCriteriaAdd/GET_DATA',
  //       payload: params,
  //       callback: (response) => {
  //         if (response) {
  //           form.setFieldsValue({
  //             data: response.parsePayload.childEvaluateDetail,
  //           });
  //         }
  //       },
  //     });
  //   }
  // }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue({
        ...details,
        ...head(details.positionLevel),
      });
    }
  }, [details]);

  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={params.id ? 'Edit' : 'Create new'} menu={menuLeftCriteria} />
      <Helmet title="Subject" />
      <Pane className="pl20 pr20">
        <Pane className="col-lg-6 offset-lg-3">
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            {/* <Loading
              loading={loading}
              isError={error.isError}
              params={{ error, goBack: '/su-phat-trien-cua-tre/cau-hinh-kich-ban-danh-gia' }}
            > */}
            <Pane className="card p20">
              <Heading type="form-title" className="mb15">
                General info
              </Heading>
              <Pane className="row">
                <Pane className="col-lg-12">
                  <FormItem
                    name="id"
                    placeholder="Chọn"
                    type={variables.INPUT}
                    label="ID"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    name="age"
                    placeholder="Chọn"
                    type={variables.INPUT}
                    label="Subject name"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    name="Explain"
                    placeholder="Chọn"
                    type={variables.TEXTAREA}
                    label="Explain"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
              </Pane>
            </Pane>
            <Pane className="d-flex justify-content-between align-items-center mb20">
              <p
                className="btn-delete"
                role="presentation"

                onClick={() => history.goBack()}
              >
                Cancel
              </p>
              <Button
                className="ml-auto px25"
                color="success"
                htmlType="submit"
                size="large"
                loading={loadingSubmit}
              >
                Save
              </Button>
            </Pane>
          </Form>
        </Pane>
      </Pane>
    </div>
  );
});

export default Index;