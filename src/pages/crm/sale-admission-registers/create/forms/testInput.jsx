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
  ({ dispatch, loading: { effects }, match: { params }, employees, branches, details }) => {
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
      if (details?.id) {
        formSubmit?.current?.setFieldsValue({
          branch_id: details?.branch_id,
        });
      }
    }, [details]);

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

    const formCriteria = (item) => {
      const a = _.groupBy(item?.testInputDetailChildren, 'childEvaluateDetail.id');
      const entries = Object.entries(a);
      return (
        <>
          {
            entries?.map(i =>
              <>
                <Pane className="col-lg-12 pt20 pb20">
                  <h3 className={stylesModule['container-title-criteria']}>
                    Tiêu chí : {i?.[1]?.[0]?.childEvaluateDetail?.name_criteria}
                  </h3>
                  <h3 className={stylesModule['container-title']}>Hình thức tiếp cận</h3>
                </Pane>
                {
                  i?.[1]?.map(k =>
                    <Pane className="col-lg-12">
                      <Pane className={stylesModule['wrapper-title']}>
                        <div className={stylesModule.icon} />
                        <h3 className={stylesModule.title}>{k?.childEvaluateDetailChildren?.content}</h3>
                      </Pane>
                    </Pane>
                  )
                }
              </>
            )
          }
        </>
      );
    };

    const formLevel = (item) => {
      if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '0') {
        return (
          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#D0E6FF' }}>
            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
            <h3 className={stylesModule.tilteLogo}>Cấp độ 0-6 Tháng</h3>
          </Pane>
        );
      }
      if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '1') {
        return (
          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#D1D0FF' }}>
            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
            <h3 className={stylesModule.tilteLogo}>Cấp độ 6-9 Tháng</h3>
          </Pane>
        );
      }
      if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '2') {
        return (
          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#FFD6B9' }}>
            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
            <h3 className={stylesModule.tilteLogo}>Cấp độ 9-12 Tháng</h3>
          </Pane>
        );
      }
      if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '3') {
        return (
          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#E2FFD0' }}>
            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
            <h3 className={stylesModule.tilteLogo}>Cấp độ 12-18 Tháng</h3>
          </Pane>
        );
      }
      if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '4') {
        return (
          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#D0FCFF' }}>
            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
            <h3 className={stylesModule.tilteLogo}>Cấp độ 18-24 Tháng</h3>
          </Pane>
        );
      }
      if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '5') {
        return (
          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#F0D0FF' }}>
            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
            <h3 className={stylesModule.tilteLogo}>Cấp độ 24-30 Tháng</h3>
          </Pane>
        );
      }
      if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '6') {
        return (
          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#FFE5B7' }}>
            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
            <h3 className={stylesModule.tilteLogo}>Cấp độ 30-36 Tháng</h3>
          </Pane>
        );
      }
      if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '7') {
        return (
          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#C3FFD8' }}>
            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
            <h3 className={stylesModule.tilteLogo}>Cấp độ 36-50 Tháng</h3>
          </Pane>
        );
      }
      if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '8') {
        return (
          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#FFC4C4' }}>
            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
            <h3 className={stylesModule.tilteLogo}>Cấp độ 50-60 Tháng</h3>
          </Pane>
        );
      }
      return "";
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
                                  label="Giáo viên phỏng vấn trẻ"
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
                {
                  details?.register_status === "CANCEL_REGISTER" ? "" :
                    <Button color="success" htmlType="submit" loading={loadingSubmit} className="ml-2">
                      Lưu
                    </Button>
                }

              </Pane>
            </Pane>

            <Pane className="card">
              {
                students[0]?.testInputDetail.length > 0 ?
                  <Pane className={stylesModule['wrapper-testInput']}>
                    <Pane className={stylesModule['wrapper-card-main']}>
                      <Pane className="d-flex justify-content-between pb15">
                        <Heading type="form-sub-title">
                          Thông tin test đầu vào
                        </Heading>
                        <div className={stylesModule.contentDay}>Thời gian đánh giá:
                          <h3 className={stylesModule.time}>  {Helper.getDate(
                            students[0]?.testInputDetail[0]?.updated_at,
                            variables.DATE_FORMAT.DATE_TIME,
                          )}</h3>
                        </div>
                      </Pane>
                      {
                        students[0]?.testInputDetail?.map(item =>
                          <Pane className="row border-top">
                            <Pane className={stylesModule['wrapper-container']}>
                              <Pane className="col-lg-12" >
                                <Pane className={stylesModule['wrapper-contentTop']}>
                                  <img src="/images/mh.svg" alt="group" className={stylesModule.img} />
                                  <Pane className="pl15">
                                    <h3 className={stylesModule.title}>
                                      {item?.categorySkill?.name}
                                    </h3>
                                  </Pane>
                                  {formLevel(item)}
                                </Pane>
                              </Pane>
                              {formCriteria(item)}

                            </Pane>
                          </Pane>
                        )
                      }

                    </Pane>
                  </Pane>
                  :
                  <p className={stylesModule['wrapper-none']}>
                    Chưa có thông tin test đầu vào
                  </p>
              }
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

                        details?.register_status === "CANCEL_REGISTER" ?
                          <Button
                            htmlType="submit"
                            color="success"
                            type="primary"
                            onClick={() => onFinish()}
                            loading={loadingSubmit}
                            disabled
                          >
                            Lưu
                          </Button>
                          :
                          <Button
                            htmlType="submit"
                            color="success"
                            type="primary"
                            onClick={() => onFinish()}
                            loading={loadingSubmit}
                          >
                            Lưu
                          </Button>
                        ,
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
          </Pane >
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
  branches: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  // error: {},
  employees: [],
  // testInputs: [],
  branches: [],
};

export default withRouter(connect(mapStateToProps)(General));
