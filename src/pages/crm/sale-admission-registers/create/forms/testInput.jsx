import { memo, useRef, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { isEmpty, get } from 'lodash';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';
import moment from 'moment';
import { variables, Helper } from '@/utils';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from '../../styles.module.scss';

const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
  loading,
  details: crmSaleAdmissionAdd.details,
  error: crmSaleAdmissionAdd.error,
  employees: crmSaleAdmissionAdd.employees,
  testInputs: crmSaleAdmissionAdd.testInputs,
});

const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, employees }) => {
    const formRef = useRef();
    const formSubmit = useRef();

    const mounted = useRef(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [students, setStudents] = useState([]);
    const loadingSubmit = effects[`crmSaleAdmissionAdd/ADD_TEST_INPUT`];

    const onFinish = () => {
      formSubmit.current.validateFields().then((values) => {
        dispatch({
          type: 'crmSaleAdmissionAdd/ADD_TEST_INPUT',
          payload: { ...details, ...values, admission_register_id: params.id },
          callback: (response, error) => {
            if (response) {
              setIsModalVisible(false);
              dispatch({
                type: 'crmSaleAdmissionAdd/GET_TEST_INPUT',
                payload: { admission_register_id: params.id },
                callback: (response) => {
                  if (response) {
                    setStudents(response.parsePayload);
                    formRef.current.setFieldsValue({
                      data: response.parsePayload.map((item) => ({
                        ...item,
                        date_interview: moment(item.date_interview),
                        time_interview: moment(item.time_interview, variables.DATE_FORMAT.HOUR),
                      })),
                    });
                  }
                },
              });
            }
            if (error) {
              if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
                error.data.errors.forEach((item) => {
                  formSubmit.current.setFields([
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
      });
    };

    const onSubmit = () => {
      formRef.current.validateFields().then((values) => {
        const items = values.data.map((item) => ({
          ...item,
          birth_date: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: item.birth_date,
            }),
            format: variables.DATE_FORMAT.DATE_AFTER,
            isUTC: false,
          }),
          customer_lead_id: params.id,
        }));
        const payload = items[0];
        dispatch({
          type: 'crmSaleAdmissionAdd/ADD_TEST_INPUT',
          payload,
          callback: (response, error) => {
            if (response) {
              setIsModalVisible(false);
              dispatch({
                type: 'crmSaleAdmissionAdd/GET_TEST_INPUT',
                payload: { admission_register_id: params.id },
                callback: (response) => {
                  if (response) {
                    setStudents(response.parsePayload);
                    formRef.current.setFieldsValue({
                      data: response.parsePayload.map((item) => ({
                        ...item,
                        date_interview: moment(item.date_interview),
                        time_interview: moment(item.time_interview, variables.DATE_FORMAT.HOUR),
                      })),
                    });
                  }
                },
              });
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
      });
    };

    useEffect(() => {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_EMPLOYEES',
        payload: {},
      });
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_TEST_INPUT',
        payload: { admission_register_id: params.id },
        callback: (response) => {
          if (response) {
            setStudents(response.parsePayload);

            formRef.current.setFieldsValue({
              data: response.parsePayload.map((item) => ({
                ...item,
                date_interview: moment(item.date_interview),
                time_interview: moment(item.time_interview, variables.DATE_FORMAT.HOUR),
              })),
            });
          }
        },
      });
    }, []);

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
        {students.length > 10 ? (
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onSubmit}
            initialValues={{
              data: [
                {
                  ...params,
                  date_interview: params.date_interview && moment(params.date_interview),
                  time_interview: params.time_interview && moment(params.time_interview),
                },
              ],
            }}
          >
            <Pane className="card">
              <Pane className="border-bottom">
                <Pane className="p20">
                  <Heading type="form-title" style={{ marginBottom: 20 }}>
                    Thông tin test đầu vào
                  </Heading>
                  <Form.List name="data">
                    {(fields) => (
                      <>
                        {fields.map((field) => (
                          <Pane key={field.key}>
                            <Pane className="row">
                              <Pane className="col-lg-4">
                                <FormItem
                                  options={['id', 'full_name']}
                                  name={[field.name, 'employee_id']}
                                  data={employees}
                                  placeholder="Chọn"
                                  type={variables.SELECT}
                                  label="giáo viên phỏng vấn trẻ"
                                />
                              </Pane>

                              <Pane className="col-lg-4">
                                <FormItem
                                  name={[field.name, 'date_interview']}
                                  label="Ngày phỏng vấn"
                                  type={variables.DATE_PICKER}
                                />
                              </Pane>

                              <Pane className="col-lg-4">
                                <FormItem
                                  label="Giờ phỏng vấn"
                                  name={[field.name, 'time_interview']}
                                  type={variables.TIME_PICKER}
                                />
                              </Pane>
                            </Pane>
                          </Pane>
                        ))}
                      </>
                    )}
                  </Form.List>
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
                      name="teacher_comment"
                      placeholder="Nhập"
                      label="Nhận xét và kết luận của giáo viên"
                      type={variables.TEXTAREA}
                    />
                  </Pane>

                  <Pane className="col-lg-12">
                    <FormItem
                      name="headmaster_comment"
                      label="Ý kiến của hiệu trưởng cơ sở"
                      type={variables.INPUT}
                    />
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
          </Form>
        ) : (
          <Pane className="card">
            <Form
              layout="vertical"
              ref={formSubmit}
              onFinish={onFinish}
              initialValues={{
                data: [{}],
              }}
            >
              <Pane className="border-bottom">
                <Pane className="p20">
                  <Heading type="form-title" style={{ marginBottom: 20 }}>
                    Thông tin test đầu vào
                  </Heading>

                  <p className={stylesModule['title-Information']}>
                    Chưa có thông tin đăng ký test đầu vào
                  </p>

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
                          htmlType="submit"
                          color="success"
                          type="primary"
                          onClick={() => onFinish()}
                          loading={loadingSubmit}
                        >
                          Lưu
                        </Button>,
                      ]}
                    >
                      <div>
                        <Pane className="row">
                          <Pane className="col-lg-4">
                            <FormItem
                              options={['id', 'full_name']}
                              name="employee_id"
                              data={employees}
                              placeholder="Chọn"
                              type={variables.SELECT}
                              width={400}
                              label="giáo viên phỏng vấn trẻ"
                            />
                          </Pane>

                          <Pane className="col-lg-4">
                            <FormItem
                              name="date_interview"
                              label="Ngày phỏng vấn"
                              width="200"
                              type={variables.DATE_PICKER}
                            />
                          </Pane>

                          <Pane className="col-lg-4">
                            <FormItem
                              label="Giờ phỏng vấn"
                              name="time_interview"
                              width="200"
                              type={variables.TIME_PICKER}
                            />
                          </Pane>
                        </Pane>
                      </div>
                    </Modal>
                  </div>
                </Pane>
              </Pane>
            </Form>
          </Pane>
        )}
      </>
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  // error: PropTypes.objectOf(PropTypes.any),
  employees: PropTypes.arrayOf(PropTypes.any),
  // testInputs: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  // error: {},
  employees: [],
  // testInputs: [],
};

export default withRouter(connect(mapStateToProps)(General));
