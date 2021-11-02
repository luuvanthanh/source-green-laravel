import { memo, useRef, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { isEmpty, get } from 'lodash';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from '../../styles.module.scss';

const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
  loading,
  details: crmSaleAdmissionAdd.details,
  error: crmSaleAdmissionAdd.error,
  branches: crmSaleAdmissionAdd.branches,
  classes: crmSaleAdmissionAdd.classes,
  city: crmSaleAdmissionAdd.city,
  district: crmSaleAdmissionAdd.district,
});
const General = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const mounted = useRef(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const loadingSubmit =
    effects[`crmSaleAdmissionAdd/ADD`] ||
    effects[`crmSaleAdmissionAdd/UPDATE`] ||
    effects[`crmSaleAdmissionAdd/UPDATE_STATUS`];
  const loading = effects[`crmSaleAdmissionAdd/GET_DETAILS`];

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'crmSaleAdmissionAdd/UPDATE' : 'crmSaleAdmissionAdd/ADD',
      payload: params.id
        ? { ...details, ...values, id: params.id }
        : { ...values, status: 'WORKING' },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <Pane className="card">
            <Pane className="border-bottom">
              <Pane className="p20">
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  Thông tin test đầu vào
                </Heading>
                <p className={stylesModule['title-Information']}>Chưa có thông tin đăng ký test đầu vào</p>
                <div>
                  <Button color="success" className="mt10 mb50 " onClick={() => showModal()}>
                    Đăng ký test đầu vào
                  </Button>
                  <Modal
                    title="Thông tin đăng ký test đầu vào"
                    centered
                    visible={isModalVisible}
                    onOk={() => handleOk()}
                    className={stylesModule['wrapper-modal']}
                    onCancel={() => handleCancel()}
                    footer={[
                      <p
                        key="back"
                        role="presentation"
                        onClick={() => handleCancel()}
                        className={stylesModule['button-cancel']}
                      >
                        Hủy
                      </p>,
                      <Button
                        key="submit"
                        color="success"
                        type="primary"
                        onClick={() => handleOk()}
                      >
                        Đăng ký
                      </Button>,
                    ]}
                  >
                    <div>
                      <Pane className="row">
                        <Pane className="col-lg-6">
                          <FormItem
                            label="Giáo viên phỏng vấn trẻ"
                            name="select"
                            placeholder="Chọn"
                            type={variables.SELECT}
                            rules={[variables.RULES.EMPTY_INPUT]}
                          />
                        </Pane>
                      </Pane>
                      <Pane className="row">
                        <Pane className="col-lg-6">
                          <FormItem
                            name="birth_date"
                            label="Ngày phỏng vấn"
                            type={variables.DATE_PICKER}
                            rules={[variables.RULES.EMPTY]}
                          />
                        </Pane>
                        <Pane className="col-lg-6">
                          <FormItem
                            label="Giờ phỏng vấn"
                            name="time"
                            rules={[variables.RULES.EMPTY]}
                            type={variables.TIME_PICKER}
                          />
                        </Pane>
                      </Pane>
                    </div>
                  </Modal>
                </div>
              </Pane>
            </Pane>
          </Pane>
        </Loading>
      </Form>
      {/*  */}
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <Pane className="card">
            <Pane className="border-bottom">
              <Pane className="p20">
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  Thông tin test đầu vào
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-4">
                    <FormItem
                      label="Giáo viên phỏng vấn trẻ"
                      name="select"
                      placeholder="Chọn"
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY_INPUT]}
                    />
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormItem
                      name="birth_date"
                      label="Ngày phỏng vấn"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormItem
                      label="Giờ phỏng vấn"
                      name="time"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.TIME_PICKER}
                    />
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
            <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
              <Button color="primary" icon="export" className="ml-2">
                Xuất form phỏng vấn
              </Button>
              <Button color="success" htmlType="submit" loading={loadingSubmit} className="ml-2">
                Lưu
              </Button>
            </Pane>
          </Pane>

          <Pane className="card">
            <Pane className="p20">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Kết quả test đầu vào
              </Heading>
              <Pane className="row">
                <Pane className="col-lg-12">
                  <FormItem
                    name=""
                    placeholder="Nhập"
                    label="Nhận xét và kết luận của giáo viên"
                    type={variables.TEXTAREA}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    name="birth_date"
                    label="Ý kiến của hiệu trưởng cơ sở"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </Pane>
              </Pane>
            </Pane>
          </Pane>
        </Loading>
      </Form>
    </>
  );
});

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
};

export default withRouter(connect(mapStateToProps)(General));
