import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { get, size } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    menuLeftHRM,
  } = useSelector(({ menu, loading, hrmRecruitmentLevelConfigurationAdd }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    error: hrmRecruitmentLevelConfigurationAdd.error,
  }));

  const loadingSubmit =
    effects[`hrmRecruitmentLevelConfigurationAdd/UPDATE`] ||
    effects[`hrmRecruitmentLevelConfigurationAdd/ADD`];

  const onFinish = (values) => {
    dispatch({
      type: params.id
        ? 'hrmRecruitmentLevelConfigurationAdd/UPDATE'
        : 'hrmRecruitmentLevelConfigurationAdd/ADD',
      payload: {
        id: params.id,
        ...values,
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
        type: 'hrmRecruitmentLevelConfigurationAdd/GET_DATA',
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

  return (
    <>
      <Helmet title={params.id ? 'Sửa cấu hình level' : 'Tạo mới cấu hình level'} />
      <Breadcrumbs last={params.id ? 'Sửa' : 'Tạo mới'} menu={menuLeftHRM} />
      <div className="col-lg-6 offset-lg-3">
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={effects['hrmRecruitmentLevelConfigurationAdd/GET_DATA']}
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
                        name="name"
                        placeholder="Nhập"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Tên level"
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormItem
                        name="decription"
                        placeholder="Nhập"
                        type={variables.TEXTAREA}
                        rules={[variables.RULES.MAX_LENGTH_INPUT]}
                        label="Mô tả"
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormItem
                        name="note"
                        placeholder="Nhập"
                        type={variables.TEXTAREA}
                        rules={[variables.RULES.MAX_LENGTH_INPUT]}
                        label="Ghi chú"
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
                        ? `${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_CAUHINHLEVEL}${ACTION.EDIT}`
                        : `${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_CAUHINHLEVEL}${ACTION.CREATE}`
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
