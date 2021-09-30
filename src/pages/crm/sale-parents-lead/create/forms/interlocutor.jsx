import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import moment from 'moment';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';

const marginProps = { style: { marginBottom: 12 } };
const General = memo(() => {
  const { data } = useSelector(({ loading, crmSaleLeadAdd }) => ({
    loading,
    details: crmSaleLeadAdd.details,
    data: crmSaleLeadAdd.data,
    error: crmSaleLeadAdd.error,
  }));
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);

  /**
   * Load Items Degres
   */
  useEffect(() => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_DEGREES',
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
            Người giới thiệu
          </Heading>
          <div className="row" {...marginProps}>
            <div className="col-lg-4">
              <FormItem
                name="fullName"
                label="Họ và tên"
                type={variables.INPUT}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="dateOfBirth"
                label="Ngày sinh"
                type={variables.DATE_PICKER}
                disabledDate={(current) => current > moment()}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="address"
                label="Địa chỉ"
                type={variables.INPUT}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="phoneNumber"
                label="Số điện thoại"
                type={variables.INPUT}
              />
            </div>
            <div className="col-lg-4">
              <FormItem data={data} name="status" label="Tình trạng" type={variables.SELECT} />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end" style={{ padding: 20 }}>
          <Button color="success" size="large" htmlType="submit">
            Lưu
          </Button>
        </div>
      </div>
    </Form>
  );
});

export default General;
