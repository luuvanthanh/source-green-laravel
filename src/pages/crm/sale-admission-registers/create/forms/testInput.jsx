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
  branches: crmSaleAdmissionAdd.branches,
});

const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, employees, branches }) => {
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
          payload: { ...values, admission_register_id: params.id },
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
          employee_id: item?.employee_id,
          time_interview: item?.time_interview,
          branch_id: item?.branch_id,
          date_interview: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: item.date_interview,

            }),
            format: variables.DATE_FORMAT.DATE_AFTER,
            isUTC: false,
          }),
          customer_lead_id: params.id,
          admission_register_id: item?.admission_register_id,
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
        type: 'crmSaleAdmissionAdd/GET_BRANCHES',
        payload: {},
      });
    }, []);

    useEffect(() => {
      if (params.id) {
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
    }, [params.id]);

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
        {students.length > 0 ? (
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
                                  options={['id', 'name']}
                                  name={[field.name, 'branch_id']}
                                  data={branches}
                                  placeholder="Chọn"
                                  type={variables.SELECT}
                                  label="Cơ sở phỏng vấn trẻ"
                                />
                              </Pane>
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
              <Pane className={stylesModule['wrapper-testInput']}>
                {/* <Heading type="form-title" style={{ marginBottom: 20 }}>
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
                </Pane> */}
                <Pane className={stylesModule['wrapper-card-main']}>
                  <Pane className="d-flex justify-content-between pb15">
                    <Heading type="form-sub-title">
                      Thông tin test đầu vào
                    </Heading>
                    <div className={stylesModule.contentDay}>Thời gian đánh giá:
                      <h3 className={stylesModule.time}> 10/11/2021, 10:15 </h3>
                    </div>
                  </Pane>
                  <Pane className="row border-top">
                    <Pane className={stylesModule['wrapper-container']}>
                      <Pane className="col-lg-12" >
                        <Pane className={stylesModule['wrapper-contentTop']}>
                          <img src="/images/mh.svg" alt="group" className={stylesModule.img} />
                          <Pane className="pl15">
                            <h3 className={stylesModule.title}>
                              Tương tác xã hội
                            </h3>
                            <h3 className={stylesModule.description}>Nhận biết được việc làm đúng hoặc sai và có ý kiến cá nhân.</h3>
                          </Pane>
                          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#FFE5B7' }}>
                            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                            <h3 className={stylesModule.tilteLogo}>Cấp độ 30 – 36 tháng</h3>
                          </Pane>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12 pt20 pb20">
                        <h3 className={stylesModule['container-title']}>Hình thức tiếp cận</h3>
                      </Pane>

                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Khi bé có phản ứng mạnh về điều gì đó ba mẹ thường làm gì? Hãy chia sẻ cách ba mẹ đã tương tác với con khi con bộc lộ cảm xúc mạnh.</h3>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Khi bé có phản ứng mạnh về điều gì đó ba mẹ thường làm gì? Hãy chia sẻ cách ba mẹ đã tương tác với con khi con bộc lộ cảm xúc mạnh.</h3>
                        </Pane>
                      </Pane>

                    </Pane>
                  </Pane>

                  <Pane className="row border-top">
                    <Pane className={stylesModule['wrapper-container']}>
                      <Pane className="col-lg-12" >
                        <Pane className={stylesModule['wrapper-contentTop']}>
                          <img src="/images/mh.svg" alt="group" className={stylesModule.img} />
                          <Pane className="pl15">
                            <h3 className={stylesModule.title}>
                              Tự lập - tự phục vụ
                            </h3>
                            <h3 className={stylesModule.description}>Biết việc đánh răng - rửa mặt hàng ngày.</h3>
                          </Pane>
                          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#F0D0FF' }}>
                            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                            <h3 className={stylesModule.tilteLogo}>Cấp độ 24 - 30 tháng</h3>
                          </Pane>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12 pt20 pb20">
                        <h3 className={stylesModule['container-title']}>Hình thức tiếp cận</h3>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Cho tương tác với bô giáo cụ đánh răng, quan sát quy trình em bé tự làm..</h3>
                        </Pane>
                      </Pane>
                    </Pane>
                  </Pane>

                  <Pane className="row border-top">
                    <Pane className={stylesModule['wrapper-container']}>
                      <Pane className="col-lg-12" >
                        <Pane className={stylesModule['wrapper-contentTop']}>
                          <img src="/images/mh.svg" alt="group" className={stylesModule.img} />
                          <Pane className="pl15">
                            <h3 className={stylesModule.title}>
                              Vận động thô
                            </h3>
                            <h3 className={stylesModule.description}>Đi hoặc chạy liên tục khoảng 10m theo hướng thẳng</h3>
                          </Pane>
                          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#C4FFD8' }}>
                            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                            <h3 className={stylesModule.tilteLogo}>Cấp độ 36 - 50 tháng</h3>
                          </Pane>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12 pt20 pb20">
                        <h3 className={stylesModule['container-title']}>Hình thức tiếp cận</h3>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Chơi cùng con:
                            Cô có một chiếc túi ( bên trong có chai , trong chai có nhiều đồ vật bất ngờ).
                            Yêu cầu bé: con hãy cho tay vào và lấy 1 vật và khám phá nhé
                            . Bên trong chai có một hạt đậu, bom bom, khối hình học
                          </h3>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Chơi cùng con:
                            Con hãy giúp cô mở nắp chai để xem bên trong có gì?
                            Từ trò chơi này sẽ đưa ra đánh giá về kĩ năng vận động tinh của bé.
                          </h3>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Thông qua giáo cụ: đóng mở nắp chai hướng bé để đánh giá vận động tinh.
                          </h3>
                        </Pane>
                      </Pane>
                    </Pane>
                  </Pane>

                  <Pane className="row border-top">
                    <Pane className={stylesModule['wrapper-container']}>
                      <Pane className="col-lg-12" >
                        <Pane className={stylesModule['wrapper-contentTop']}>
                          <img src="/images/mh.svg" alt="group" className={stylesModule.img} />
                          <Pane className="pl15">
                            <h3 className={stylesModule.title}>
                              Ngôn ngữ
                            </h3>
                            <h3 className={stylesModule.description}>Nhận diện các kí hiệu, biểu tượng như nhà vệ sinh nam, nữ, cấm lửa, không vứt rác, không hút thuốc, tín hiệu nguy hiểm, tín hiệu giao thông</h3>
                          </Pane>
                          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#C4FFD8' }}>
                            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                            <h3 className={stylesModule.tilteLogo}>Cấp độ 36 - 50 tháng</h3>
                          </Pane>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12 pt20 pb20">
                        <h3 className={stylesModule['container-title']}>Hình thức tiếp cận</h3>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Dùng photocard các kí hiệu, biểu tượng và hỏi bé về các hình ảnh đó.
                          </h3>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Đặt câu hỏi:
                            Cô chỉ vào photocard và hỏi, con có biết đây là hình gì không?
                            Nếu bé không trả lời được thì khơi gợi để bé trả lời.
                            Hỏi 1 số hình ảnh và đưa ra đánh giá về ngôn ngữ của bé

                          </h3>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Thông qua giáo cụ: đóng mở nắp chai hướng bé để đánh giá vận động tinh.
                          </h3>
                        </Pane>
                      </Pane>
                    </Pane>
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
                      width={['auto']}
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
                          <Pane className="col-lg-6">
                            <FormItem
                              options={['id', 'name']}
                              name="branch_id"
                              data={branches}
                              style={{ width: '100%', display: 'block' }}
                              placeholder="Chọn"
                              type={variables.SELECT}
                              label="Cơ sở phỏng vấn trẻ"
                            />
                          </Pane>
                          <Pane className="col-lg-6">
                            <FormItem
                              options={['id', 'full_name']}
                              name="employee_id"
                              style={{ width: '100%', display: 'block' }}
                              data={employees}
                              placeholder="Chọn"
                              type={variables.SELECT}
                              label="Giáo viên phỏng vấn trẻ"
                            />
                          </Pane>

                          <Pane className="col-lg-6">
                            <FormItem
                              name="date_interview"
                              label="Ngày phỏng vấn"
                              style={{ width: '100%', display: 'block' }}
                              type={variables.DATE_PICKER}
                            />
                          </Pane>

                          <Pane className="col-lg-6">
                            <FormItem
                              label="Giờ phỏng vấn"
                              style={{ width: '100%', display: 'block' }}
                              name="time_interview"
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
  // details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  // error: PropTypes.objectOf(PropTypes.any),
  employees: PropTypes.arrayOf(PropTypes.any),
  // testInputs: PropTypes.arrayOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  // details: {},
  dispatch: () => { },
  loading: {},
  // error: {},
  employees: [],
  // testInputs: [],
  branches: [],
};

export default withRouter(connect(mapStateToProps)(General));
