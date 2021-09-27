import { memo, useRef, useEffect } from 'react';
import { Form, Upload } from 'antd';
import { Helmet } from 'react-helmet';
import { useParams } from 'umi';
import { useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import styles from '@/assets/styles/Common/common.scss';
import { variables } from '@/utils';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Quill from '@/components/CommonComponent/Quill';

const General = memo(() => {
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);

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
      <Helmet title="Thông tin email" />
      <Pane className="col-lg-6 offset-lg-3">
        <Form layout="vertical p20">
          <div className="card">
            <div style={{ padding: 20 }} className="pb-0 border-bottom">
              <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                <Heading type="form-title">Thông tin email</Heading>
              </div>
              <div className="row">
                <Pane className="col-lg-6">
                  <FormItem name="email" label="Email gửi" type={variables.INPUT} />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem name="email" label="Email nhận" type={variables.INPUT} />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem name="contents" label="Chủ đề" type={variables.INPUT} />
                </Pane>
                <Pane className="col-lg-12">
                  <div className="ant-col ant-form-item-label">
                    <label>
                      <span>Nội dung</span>
                    </label>
                  </div>
                  <Quill />
                </Pane>
                <Pane className="col-lg-12 pt20  pb20">
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
                        <Button color="white" icon="upload1" className={styles['wrapper-btn-add']}>
                          Tải lên
                        </Button>
                      </Upload>
                      <span className={styles['wrapper-title-add']}>
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
