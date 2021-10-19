import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import Heading from '@/components/CommonComponent/Heading';
import { variables } from '@/utils';
import { isEmpty, get } from 'lodash';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

const General = memo(() => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const params = useParams();

  const mounted = useRef(false);
  const {
    detailsTags,
    loading: { effects },
    tags,
    error,
  } = useSelector(({ loading, crmSaleLeadAdd }) => ({
    loading,
    tags: crmSaleLeadAdd.tags,
    error: crmSaleLeadAdd.error,
    detailsTags: crmSaleLeadAdd.detailsTags,
    data: crmSaleLeadAdd.data,
  }));

  const loading = effects[`crmSaleLeadAdd/GET_CUSTOMER_TAGS`] || effects[`crmSaleLeadAdd/GET_TAGS`];
  const loadingSubmit = effects[`crmSaleLeadAdd/ADD_TAGS`];
  useEffect(() => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_CUSTOMER_TAGS',
      payload: {
        customer_lead_id: params.id,
      },
      callback: (response) => {
        if (response) {
          formRef.current.setFieldsValue({
            data: response.parsePayload.map((item) => ({
              ...item,
            })),
          });
        }
      },
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      formRef.current.setFieldsValue({
        tag_id: detailsTags?.map((item) => item.tag_id),
      });
    }
  }, [detailsTags]);

  useEffect(() => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_TAGS',
      payload: {},
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onFinish = (values) => {
    dispatch({
      type: 'crmSaleLeadAdd/ADD_TAGS',
      payload: {
        customer_lead_id: params.id,
        customer_tag: values.tag_id.map((item) => ({ tag_id: item })),
      },
      callback: (response, error) => {
        // if (response) {
        //   history.goBack();
        // }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              formRef.current.setFields([
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
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <Form
      layout="vertical"
      ref={formRef}
      onFinish={onFinish}
      initialValues={{
        data: [{}],
      }}
    >
      <Loading loading={loading} isError={error.isError} params={{ error }}>
        <div className="card">
          <div style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Tags
            </Heading>
            <div className="row">
              <div className="col-lg-12">
                <FormItem
                  data={tags}
                  options={['id', 'name']}
                  name="tag_id"
                  placeholder="Chọn"
                  type={variables.SELECT_MUTILPLE}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-row-reverse">
          <Button color="success" htmlType="submit" loading={loadingSubmit || loading}>
            Lưu
          </Button>
        </div>
      </Loading>
    </Form>
  );
});

export default General;
