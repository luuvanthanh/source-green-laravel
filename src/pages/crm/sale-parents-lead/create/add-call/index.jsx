import { memo, useRef, useEffect } from 'react';
import { Form, Upload } from 'antd';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { variables } from '@/utils';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

import stylesModule from '../../styles.module.scss';

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
                    label="Ngày gọi"
                    type={variables.DATE_PICKER}
                    disabledDate={(current) => current > moment()}
                  />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem
                    name="time"
                    label="Giờ gọi"
                    type={variables.TIME_PICKER}
                    disabledDate={(current) => current > moment()}
                  />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem name="phone" label="Số gọi" type={variables.INPUT} />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem name="phone" label="Số nhận" type={variables.INPUT} />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem name="name" data={data} label="Người gọi" type={variables.SELECT} />
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    name="contents"
                    label="Nội dung cuộc gọi"
                    rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                    type={variables.TEXTAREA}
                  />
                </Pane>
                <Pane className="col-lg-12 pb20">
                  <Pane className="row ">
                    <Pane className="col-lg-12">
                      <div className="ant-col ant-form-item-label">
                        <label>
                          <span>Nội dung</span>
                        </label>
                      </div>
                    </Pane>
                    <Pane className="col-lg-12 d-flex">
                      <Upload>
                        <Button
                          color="white"
                          icon="upload1"
                          className={stylesModule['wrapper-btn-add']}
                        >
                          Tải lên
                        </Button>
                      </Upload>
                      <span className={stylesModule['wrapper-title-add']}>
                        Hỗ trợ định dạng: .doc, .pdf, .xls
                      </span>
                    </Pane>
                  </Pane>
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
