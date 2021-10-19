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
  const { data } = useSelector(({ loading, crmMarketingManageAdd }) => ({
    loading,
    details: crmMarketingManageAdd.details,
    data: crmMarketingManageAdd.data,
    error: crmMarketingManageAdd.error,
  }));
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);

  useEffect(() => {
    dispatch({
      type: 'crmMarketingManageAdd/GET_DATA',
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
            Thông tin phụ huynh
          </Heading>
          <div className="row" {...marginProps}>
            {params.id ? (
              <div className="col-lg-3">
                <FormItem name="day" label="Ngày gọi" type={variables.INPUT} />
              </div>
            ) : (
              ''
            )}
            <div className="col-lg-3">
              <FormItem
                name="day"
                label="Ngày gọi"
                type={variables.DATE_PICKER}
                disabledDate={(current) => current > moment()}
              />
            </div>
            <div className="col-lg-3">
              <FormItem
                name="day"
                label="Ngày gọi"
                type={variables.DATE_PICKER}
                disabledDate={(current) => current > moment()}
              />
            </div>
            <div className="col-lg-3">
              <FormItem data={data} name="gender" label="Giới tính" type={variables.SELECT} />
            </div>
          </div>
          <div className="row" {...marginProps}>
            <div className="col-lg-12">
              <FormItem name="email" label="Email" type={variables.INPUT} />
            </div>
            <div className="col-lg-12">
              <FormItem name="phoneNumber" label="Số điện thoại" type={variables.TEXTAREA} />
            </div>
            <div className="col-lg-12">
              <FormItem name="phoneNumber" label="Số điện thoại Khác" type={variables.TEXTAREA} />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center" style={{ padding: 20 }}>
          <p className="btn-delete" role="presentation">
            Hủy
          </p>
          <Button color="success" size="large" htmlType="submit">
            Lưu
          </Button>
        </div>
      </div>
    </Form>
  );
});

export default General;
