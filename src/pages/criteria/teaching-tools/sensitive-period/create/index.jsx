import { memo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import { head, isEmpty } from 'lodash';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import { variables, Helper } from '@/utils';

const Index = memo(() => {
  const [
    { menuLeftCriteria },
    loading,
    { error },
  ] = useSelector(({ menu, loading: { effects }, sensitivePeriodCreate }) => [
    menu,
    effects,
    sensitivePeriodCreate,
  ]);
  const dispatch = useDispatch();
  const params = useParams();

  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);
  // const mountedSet = (setFunction, value) =>
  //   !!mounted?.current && setFunction && setFunction(value);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'sensitivePeriodCreate/UPDATE' : 'sensitivePeriodCreate/ADD',
      payload: {
        ...values,
        ...params,
        // criterias: values.criterias.map((item) => item.name),
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

  const remove = () => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'sensitivePeriodCreate/REMOVE',
          payload: {
            ...params,
          },
          callback: (response) => {
            if (response) {
              history.goBack();
            }
          },
        });
      },
    });
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'sensitivePeriodCreate/GET_DATA',
        payload: {
          ...params,
        },
        callback: (response) => {
          if (response) {
            formRef.current.setFieldsValue({
              ...response,
              criterias: response.criterias.map((item) => ({
                name: item,
              })),
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
    <Pane style={{ paddingTop: 20 }}>
      <Helmet title={params.id ? 'Chỉnh sửa thời kỳ nhạy cảm' : 'Tạo thời kỳ nhạy cảm'} />
      <Breadcrumbs className="pb30 pt0" last={params.id ? 'Chỉnh sửa thời kỳ nhạy cảm' : 'Tạo thời kỳ nhạy cảm'} menu={menuLeftCriteria} />
      <Pane style={{ padding: 20, paddingBottom: 0, paddingTop: 0 }}>
        <Pane className="justify-content-center">
          <Pane className="col-lg-6 offset-lg-3">
            <Form
              layout="vertical"
              ref={formRef}
              onFinish={onFinish}
              initialValues={{
                criterias: [{}],
              }}
            >
              <Pane className="my20 mb0 card">
                <Loading
                  loading={loading['sensitivePeriodCreate/GET_DATA']}
                  isError={error.isError}
                  params={{
                    error,
                    type: 'container',
                    goBack: '/chuong-trinh-hoc/cau-hinh/thoi-ky-nhay-cam',
                  }}
                >
                  <Pane className="mt20">
                    <Pane className="p20 row ">
                      <Pane className="col-lg-12">
                        <Heading type="form-title" className="mb20">
                          Thông tin chung
                        </Heading>
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem label="Mã" name="code" disabled type={variables.INPUT} />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Tên thời kỳ nhạy cảm"
                          name="name"
                          rules={[variables.RULES.EMPTY]}
                          type={variables.INPUT}
                        />
                      </Pane>
                      <Pane className="col-lg-12">
                        <FormItem
                          label="Ghi chú"
                          name="note"
                          rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                          type={variables.TEXTAREA}
                        />
                      </Pane>
                    </Pane>
                  </Pane>
                </Loading>
              </Pane>
              <Pane className="d-flex justify-content-between align-items-center mb20">
                {params.id && (
                  <p className="btn-delete" role="presentation" onClick={remove}>
                    Xóa
                  </p>
                )}
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={
                    loading['sensitivePeriodCreate/ADD'] || loading['sensitivePeriodCreate/UPDATE']
                  }
                >
                  Lưu
                </Button>
              </Pane>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
