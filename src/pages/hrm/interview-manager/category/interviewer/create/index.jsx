import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { size, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

import { variables } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    menuLeftHRM,
    divisions,
    employees,
    error,
  } = useSelector(({ menu, loading, hrmInterviewManagerCategoryInterviewAdd, categories }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    employees: categories.employees,
    divisions: categories.divisions,
    error: hrmInterviewManagerCategoryInterviewAdd.error,
  }));

  const loadingSubmit =
    effects[`hrmInterviewManagerCategoryInterviewAdd/UPDATE`] ||
    effects[`hrmInterviewManagerCategoryInterviewAdd/ADD`];

  const onFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id
          ? 'hrmInterviewManagerCategoryInterviewAdd/UPDATE'
          : 'hrmInterviewManagerCategoryInterviewAdd/ADD',
        payload: {
          id: params.id,
          divisionId: values?.divisionId,
          employeeId: values?.employeeId,
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
    });
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'hrmInterviewManagerCategoryInterviewAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              ...response,
              employeeId: response?.interviewerEmployee?.map((item) => item?.id),
            });
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    dispatch({
      type: 'categories/GET_DIVISIONS',
      payload: {},
    });
    dispatch({
      type: 'categories/GET_EMPLOYEES',
      payload: {},
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <>
      <Helmet title="Người phỏng vấn" />
      <Breadcrumbs last={params.id ? 'Chỉnh sửa' : 'Tạo mới'} menu={menuLeftHRM} />
      <div className="col-lg-6 offset-lg-3">
        <Helmet title="Người phỏng vấn" />
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                isError={error.isError}
                params={{ type: 'container' }}
                loading={
                  effects['hrmInterviewManagerCategoryInterviewAdd/GET_DATA'] ||
                  (params?.id && effects['categories/GET_EMPLOYEES'])
                }
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
                    <Pane className="col-lg-6">
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
                        name="employeeId"
                        options={['id', 'fullName']}
                        placeholder="Chọn người phụ trách"
                        type={variables.SELECT_MUTILPLE}
                        data={employees}
                        rules={[variables.RULES.EMPTY]}
                        loading={effects['categories/GET_EMPLOYEES']}
                        label="Người phụ trách phỏng vấn"
                      />
                    </Pane>
                  </Pane>
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
                    loading={loadingSubmit}
                    permission={
                      params?.id
                        ? `${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHMUC_NGUOIPHONGVAN}${ACTION.EDIT}`
                        : `${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHMUC_NGUOIPHONGVAN}${ACTION.CREATE}`
                    }
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
