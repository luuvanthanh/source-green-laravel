import { memo,  useEffect } from 'react';
import { Form } from 'antd';
import { useParams } from 'umi';
import { useDispatch } from 'dva';
import Heading from '@/components/CommonComponent/Heading';
import { variables } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';

const marginProps = { style: { marginBottom: 12 } };
const General = memo(() => {
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_DATA',
      payload: params,
    });
  }, []);

  return (
    <Form layout="vertical">
      <div className="card">
        <div style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>
            Thông tin tài khoản
          </Heading>
          <div className="row" {...marginProps}>
            <div className="col-lg-4">
              <FormItem name="fullName" label="Tên tài khoản" type={variables.INPUT} />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="email"
                label="email"
                type={variables.EMAIL}
              />
            </div>
            <div className="col-lg-4">
              <FormItem name="role" label="Vai trò" type={variables.INPUT} />
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
});

export default General;
