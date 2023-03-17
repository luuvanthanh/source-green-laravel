import { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import stylesModule from './styles.module.scss';


const Index = memo(() => {
  const [form] = Form.useForm();
  const [
    effects
  ] = useSelector(({ sensitivePeriodConfiguration, loading, user, menu }) => [
    sensitivePeriodConfiguration,
    loading,
    user,
    menu,
  ]);
  const dispatch = useDispatch();

  const onFinish = (value) => {
    dispatch({
      type: 'sensitivePeriodConfiguration/ADD',
      payload: {
        dateConfig:
        {
          dateTotal: value?.dateTotal,
          name: value?.name,
        }
      },
      callback: (response, error) => {
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
      type: 'sensitivePeriodConfiguration/GET_DETAILS',
      payload: {},
      callback: (response) => {
        if (response) {
          form.setFieldsValue({
            name: response?.dateConfig?.name,
            dateTotal: response?.dateConfig?.dateTotal,
          });
        }
      },
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Helmet title="Cấu hình TKNC" />
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <Heading type="form-title" className="pb20">
              Cấu hình TKNC
            </Heading>
            <Loading loading={effects['sensitivePeriodConfiguration/GET_DETAILS']} >
              <div className="card p20">
                <Pane className="row">
                  <Pane className="col-lg-12">
                    <Heading type="form-title" className="mb20">
                      Ngày
                    </Heading>
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Số ngày liên tục"
                      name="dateTotal"
                      type={variables.NUMBER_INPUT}
                      rules={[variables.RULES.EMPTY, variables.RULES.NUMBER_INTEGER]}
                    />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Gọi tên"
                      name="name"
                      type={variables.INPUT}
                    />
                  </Pane>
                </Pane>
              </div>
            </Loading>
            <Pane className={stylesModule['wrapper-btn']} >
              <Button color="success" size="large" htmlType="submit" loading={effects['sensitivePeriodConfiguration/ADD']}>
                Lưu
              </Button>
            </Pane>
          </div>
        </div>
      </Form>
    </div>
  );
});

Index.propTypes = {
};

Index.defaultProps = {
};

export default Index;
