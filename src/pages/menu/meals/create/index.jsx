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
import { variables, Helper } from '@/utils';

const Index = memo(() => {
  const [
    menuData,
    loading,
  ] = useSelector(({ menu: { menuLeftCriteria }, loading: { effects } }) => [
    menuLeftCriteria,
    effects,
  ]);
  const dispatch = useDispatch();
  const params = useParams();

  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'mealsCreate/UPDATE' : 'mealsCreate/ADD',
      payload: {
        ...values,
        ...params,
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
          type: 'mealsCreate/REMOVE',
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
        type: 'mealsCreate/GET_DATA',
        payload: {
          ...params,
        },
        callback: (response) => {
          if (response) {
            formRef.current.setFieldsValue({
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
    <Pane style={{ paddingTop: 20 }}>
      <Helmet title="Tạo bữa ăn" />
      <Breadcrumbs className="pb30 pt0" last="Tạo bữa ăn" menu={menuData} />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Pane className="row justify-content-center">
          <Pane className="col-lg-6">
            <Form layout="vertical" ref={formRef} onFinish={onFinish} initialValues={{}}>
              <Pane className="p20 pt20 card">
                <Heading type="form-title" className="mb20">
                  Thông tin chung
                </Heading>
                <Pane className="row">
                  <Pane className="col-6">
                    <FormItem
                      label="Mã bữa ăn"
                      name="code"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                  <Pane className="col-6">
                    <FormItem
                      label="Tên bữa ăn"
                      name="name"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                </Pane>
                <Pane className="row">
                  <Pane className="col-6">
                    <FormItem
                      label="Sử dụng"
                      name="isUsed"
                      type={variables.SWITCH}
                      valuePropName="checked"
                    />
                  </Pane>
                </Pane>
              </Pane>

              <Pane className="py20 d-flex justify-content-between align-items-center">
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
                    loading['mealsCreate/ADD'] ||
                    loading['mealsCreate/UPDATE'] ||
                    loading['mealsCreate/GET_DATA']
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
