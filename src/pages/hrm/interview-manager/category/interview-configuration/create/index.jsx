import { memo, useEffect, useRef, useState } from 'react';
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
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

import UsageCriteria from '../component/usage-criteria';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    menuLeftHRM,
    divisions,
    details,
  } = useSelector(({ menu, loading, hrmInterviewManagerCategoryInterviewConfigurationAdd }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    divisions: hrmInterviewManagerCategoryInterviewConfigurationAdd?.divisions,
    details: hrmInterviewManagerCategoryInterviewConfigurationAdd.details,
    error: hrmInterviewManagerCategoryInterviewConfigurationAdd.error,
  }));

  const loadingSubmit =
    effects[`hrmInterviewManagerCategoryInterviewConfigurationAdd/UPDATE`] ||
    effects[`hrmInterviewManagerCategoryInterviewConfigurationAdd/ADD`];

  const [dataEvaluation, setDataEvaluation] = useState([]);

  const onFinish = (values) => {
    dispatch({
      type: params.id
        ? 'hrmInterviewManagerCategoryInterviewConfigurationAdd/UPDATE'
        : 'hrmInterviewManagerCategoryInterviewConfigurationAdd/ADD',
      payload: {
        id: params.id,
        name: values?.name,
        divisionId: values?.divisionId,
        note: values?.note,
        evaluationCriteriaId: dataEvaluation?.filter((i) => i?.checkbox)?.map((k) => k?.id),
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
  };

  useEffect(() => {
    dispatch({
      type: 'hrmInterviewManagerCategoryInterviewConfigurationAdd/GET_DIVISIONS',
      payload: {
        limit: variables.PAGINATION.SIZEMAX,
        page: variables.PAGINATION.PAGE,
      },
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'hrmInterviewManagerCategoryInterviewConfigurationAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              ...response,
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

  useEffect(() => {
    if (details?.id && params?.id) {
      dispatch({
        type: 'hrmInterviewManagerCategoryEvaluationCriteria/GET_DATA',
        payload: {},
        callback: (response) => {
          if (response) {
            setDataEvaluation(
              response?.map((i) => ({
                ...i,
                checkBox: !!details?.interviewConfigurationEvaluationCriteria?.find(
                  (k) => i?.id === k?.id,
                ),
              })),
            );
          }
        },
      });
    }
  }, [details?.id]);

  useEffect(() => {
    if (!params?.id) {
      dispatch({
        type: 'hrmInterviewManagerCategoryEvaluationCriteria/GET_DATA',
        payload: {},
        callback: (response) => {
          if (response) {
            setDataEvaluation(response);
          }
        },
      });
    }
  }, []);

  return (
    <>
      <Helmet title="Cấu hình phỏng vấn" />
      <Breadcrumbs last={params.id ? 'Sửa' : 'Tạo mới'} menu={menuLeftHRM} />
      <div className="col-lg-6 offset-lg-3">
        <Helmet title="Cấu hình phỏng vấn" />
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={effects['hrmInterviewManagerCategoryInterviewConfigurationAdd/GET_DATA']}
              >
                <Pane className="card p20">
                  <Heading type="form-title" className="mb15">
                    Thông tin chung
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <FormItem
                        name="code"
                        placeholder=" "
                        type={variables.INPUT}
                        label="ID"
                        disabled
                      />
                    </Pane>
                  </Pane>
                  <Pane className="row">
                    <Pane className="col-lg-12">
                      <FormItem
                        name="divisionId"
                        placeholder="Chọn bộ phận"
                        type={variables.SELECT}
                        data={divisions}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Bộ phận"
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormItem
                        name="name"
                        placeholder="Nhập"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Tên cấu hình"
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormItem
                        name="note"
                        placeholder="Nhập"
                        type={variables.TEXTAREA}
                        rules={[variables.RULES.MAX_LENGTH_INPUT, variables.RULES.EMPTY_INPUT]}
                        label="Ghi chú"
                      />
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="card p20">
                  <Heading type="form-title" className="mb15">
                    Thông tin tiêu chí sử dụng
                  </Heading>
                  <UsageCriteria
                    setDataEvaluation={setDataEvaluation}
                    dataEvaluation={dataEvaluation}
                    details={details}
                  />
                </Pane>
                <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                  <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                    Hủy
                  </p>
                  <Button
                    className="ml-auto px25"
                    color="success"
                    htmlType="submit"
                    size="large"
                    permission={
                      params?.id
                        ? `${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHMUC_CAUHINHPHONGVAN}${ACTION.EDIT}`
                        : `${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHMUC_CAUHINHPHONGVAN}${ACTION.CREATE}`
                    }
                    loading={loadingSubmit}
                  >
                    Lưu
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
