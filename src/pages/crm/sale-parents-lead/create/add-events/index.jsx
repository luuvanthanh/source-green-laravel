import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { useParams } from 'umi';
import { useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { variables } from '@/utils';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

const General = memo(() => {
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);

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
    <>
      <Helmet title="Thêm cuộc gọi" />
      <Pane className="col-lg-6 offset-lg-3">
        <Form layout="vertical p20">
          <div className="card">
            <div style={{ padding: 20 }} className="pb-0 border-bottom">
              <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                <Heading type="form-title">Thông tin thêm mới</Heading>
                <Button color="success" icon="plus">
                  Thêm mới
                </Button>
              </div>
              <div className="row">
                <Pane className="col-lg-6">
                  <FormItem
                    name="day"
                    label="Ngày diễn ra"
                    type={variables.DATE_PICKER}
                    disabledDate={(current) => current > moment()}
                  />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem name="nameEvents" label="Tên sự  kiện" type={variables.INPUT} />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem name="location" label="Địa điêm diễn ra" type={variables.INPUT} />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem name="status" label="Trạng thái" type={variables.INPUT} />
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    name="result"
                    label="Kết quả sự kiện"
                    rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                    type={variables.TEXTAREA}
                  />
                </Pane>
              </div>
            </div>
            <Pane className="p20 d-flex justify-content-between align-items-center ">
              <p className="btn-delete" role="presentation">
                Hủy
              </p>
              <Button className="ml-auto px25" color="success" htmlType="submit" size="large">
                Lưu
              </Button>
            </Pane>
          </div>
        </Form>
      </Pane>
    </>
  );
});

export default General;
