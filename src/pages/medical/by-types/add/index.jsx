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
import { variables } from '@/utils';

const Index = memo(() => {
  const [menuData, loading] = useSelector(({ menu: { menuLeftMedical }, loading: { effects } }) => [
    menuLeftMedical,
    effects,
  ]);
  const dispatch = useDispatch();
  const params = useParams();

  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'medicalByTypesAdd/UPDATE' : 'medicalByTypesAdd/ADD',
      payload: {
        ...values,
        ...params,
        type: 'MEDICAL',
        isParent: 'false',
        orderNo: 0,
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

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'medicalByTypesAdd/GET_DATA',
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
      <Helmet title={params.id ? 'Chỉnh sửa' : 'Tạo mới'} />
      <Breadcrumbs
        className="pb30 pt0"
        last={params.id ? 'Chỉnh sửa' : 'Tạo mới'}
        menu={menuData}
      />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Pane className="row justify-content-center">
          <Pane className="col-lg-6">
            <Form layout="vertical" ref={formRef} onFinish={onFinish} initialValues={{}}>
              <Pane className="p20 pt20 card">
                <Heading type="form-title" className="mb20">
                  Thông tin chung
                </Heading>
                <FormItem
                  className="mb0"
                  label="Tên buổi"
                  name="description"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>

              <Pane className="d-flex justify-content-between align-items-center">
                <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                  Hủy
                </p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={
                    loading['medicalByTypesAdd/ADD'] ||
                    loading['medicalByTypesAdd/UPDATE'] ||
                    loading['medicalByTypesAdd/GET_DATA']
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
