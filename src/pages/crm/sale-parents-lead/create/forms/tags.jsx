import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import Heading from '@/components/CommonComponent/Heading';
import { variables } from '@/utils';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

const General = memo(() => {
  const dispatch = useDispatch();
  const params = useParams();

  const mounted = useRef(false);
  const { data } = useSelector(({ loading, crmSaleLeadAdd }) => ({
    loading,
    details: crmSaleLeadAdd.details,
    data: crmSaleLeadAdd.data,
    error: crmSaleLeadAdd.error,
  }));

  useEffect(() => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_DATA',
      payload: params,
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <Form layout="vertical">
      <div className="card">
        <div style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>
            Tags
          </Heading>
          <div className="row">
            <div className="col-lg-12">
              <FormItem
                data={data}
                mode="tags"
                name="phoneNumberCompany"
                type={variables.SELECT_TAGS}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-row-reverse">
      <Button color="success" icon="plus" >
        Lưu
      </Button>
      </div>
    </Form>
  );
});

export default General;
