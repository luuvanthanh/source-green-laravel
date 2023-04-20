import { memo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
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
    menuApplicableConfiguration.dataMaterials,
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
          setDetail(response);
          form.setFieldsValue({
            config_food_in_kitchen: response?.find((i) => i?.key === 'config_food_in_kitchen')
              ?.value,
            material_group: response?.find((i) => i?.key === 'material_group')?.value,
          });
        }
      },
    });
  };

  const onFinish = (values) => {
    dispatch({
      type: 'menuApplicableConfiguration/ADD',
      payload: [
        { key: 'config_food_in_kitchen', value: values?.config_food_in_kitchen },
        { key: 'material_group', value: values?.material_group },
      ],
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
            <Loading
              loading={
                effects['menuApplicableConfiguration/GET_DETAILS'] ||
                effects['menuApplicableConfiguration/GET_FOOD_GROUP']
              }
            >
              <div className="card p20">
                <Heading type="form-title" className="pb20">
                  Cấu hình áp dụng
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-12">
                    {checkEdit ? (
                      <FormItem
                        label="Nhóm hàng áp dụng"
                        name="config_food_in_kitchen"
                        data={dataFoodGroup}
                        type={variables.TYPE.SELECT}
                      />
                    ) : (
                      <FormDetail
                        name={detail?.find((i) => i?.key === 'config_food_in_kitchen')?.value}
                        data={dataFoodGroup}
                        label="Nhóm hàng áp dụng"
                        type={variables.TYPE.SELECT}
                      />
                    )}
                  </Pane>
                </Pane>
              </div>
              <div className="card p20">
                <Heading type="form-title" className="pb20">
                  Nguyên vật liệu áp dụng
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-12">
                    {checkEdit ? (
                      <FormItem
                        label="Nhóm hàng áp dụng"
                        name="material_group"
                        data={dataFoodGroup}
                        type={variables.TYPE.SELECT}
                      />
                    ) : (
                      <FormDetail
                        name={detail?.find((i) => i?.key === 'material_group')?.value}
                        label="Nhóm hàng áp dụng"
                        data={dataFoodGroup}
                        type={variables.TYPE.SELECT}
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
