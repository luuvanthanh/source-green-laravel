import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import moment from 'moment';
import { useParams } from 'umi';
import { useDispatch } from 'dva';
import Heading from '@/components/CommonComponent/Heading';
import { variables } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';

const marginProps = { style: { marginBottom: 12 } };
const General = memo(() => {
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);

  useEffect(() => {
    dispatch({
      type: 'crmMarketingDataAdd/GET_DATA',
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
            Thông tin chung
          </Heading>
          <div className="row" {...marginProps}>
            <div className="col-lg-4">
              <FormItem name="source" label="Nguồn" type={variables.INPUT} />
            </div>
            <div className="col-lg-4">
              <FormItem name="fullName" label="Người tạo" type={variables.INPUT} />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="innitiatedDate"
                label="Ngày khởi tạo"
                type={variables.DATE_PICKER}
                disabledDate={(current) => current > moment()}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="updateDay"
                label="Ngày cập nhật"
                type={variables.DATE_PICKER}
                disabledDate={(current) => current > moment()}
              />
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
});

export default General;
