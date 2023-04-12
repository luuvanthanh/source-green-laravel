import { memo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { isEmpty, get, head } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import FormDetail from '@/components/CommonComponent/FormDetail';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';

const Index = memo(() => {
  const [form] = Form.useForm();
  const [
    { dataFoodGroup },
    effects,
  ] = useSelector(({ menuApplicableConfiguration, loading, user, menu }) => [
    menuApplicableConfiguration,
    loading,
    user,
    menuApplicableConfiguration.dataFoodGroup,
    menu,
  ]);
  const dispatch = useDispatch();
  const [checkEdit, setCheckEdit] = useState(false);
  const [detail, setDetail] = useState(undefined);

  const onLoad = () => {
    dispatch({
      type: 'menuApplicableConfiguration/GET_DETAILS',
      payload: {},
      callback: (response) => {
        if (response) {
          setDetail(head(response?.parsePayload));
          form.setFieldsValue({
            content: head(response?.parsePayload)?.content,
          });
        }
      },
    });
  };

  const onFinish = (value) => {
    setDetail({});
    dispatch({
      type: 'menuApplicableConfiguration/ADD',
      payload: {
        value: value?.value,
      },
      callback: (response, error) => {
        if (response) {
          setCheckEdit(false);
          onLoad();
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
    onLoad();
    dispatch({
      type: 'menuApplicableConfiguration/GET_FOOD_GROUP',
      payload: {},
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Helmet title="Cấu hình áp dụng" />
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <Heading type="form-title" className="pb20">
              Cấu hình áp dụng
            </Heading>
            <Loading loading={effects['menuApplicableConfiguration/GET_DETAILS']}>
              <div className="card p20">
                <Pane className="row">
                  <Pane className="col-lg-12">
                    {checkEdit ? (
                      <FormItem
                        label="Nhóm hàng áp dụng"
                        name="value"
                        data={dataFoodGroup}
                        type={variables.TYPE.SELECT}
                      />
                    ) : (
                      <FormDetail
                        name={detail?.value}
                        label="Nhóm hàng áp dụng"
                        type={variables.TYPE.TEXT}
                      />
                    )}
                  </Pane>
                </Pane>
              </div>
            </Loading>
            {checkEdit ? (
              <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                <>
                  <p className="btn-delete" role="presentation" onClick={() => setCheckEdit(false)}>
                    Hủy
                  </p>
                  <Button
                    color="success"
                    size="large"
                    htmlType="submit"
                    loading={effects['menuApplicableConfiguration/ADD']}
                    permission={`${FLATFORM.WEB}${permissions.BEP_CAUHINHAPDUNG}${ACTION.EDIT}`}
                  >
                    Lưu
                  </Button>
                </>
              </Pane>
            ) : (
              <Pane className="pt20 pb20 d-flex justify-content-end align-items-center border-top">
                <Button
                  permission={`${FLATFORM.WEB}${permissions.BEP_CAUHINHAPDUNG}${ACTION.EDIT}`}
                  color="success"
                  onClick={() => setCheckEdit(true)}
                >
                  Sửa
                </Button>
              </Pane>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
});

export default Index;
