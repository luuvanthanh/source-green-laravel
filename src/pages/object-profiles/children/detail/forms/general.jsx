import { memo, useRef, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import moment from 'moment';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import { isEmpty } from 'lodash';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import ImgDetail from '@/components/CommonComponent/imageDetail';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import FormDetail from '@/components/CommonComponent/FormDetail';
import { Helper } from '@/utils';
import variablesModules from '../../../utils/variables';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];

const type = {
  WITHDRAW_APPLICATION: 'IsWithdrawApplication',
  STOP_STUDYING: 'IsStopStudying',
  STOP_DISTRIBUTED: 'IsStopDistributed',
};

const mapStateToProps = ({ loading, OPchildrenAdd, user }) => ({
  loading,
  details: OPchildrenAdd.details,
  error: OPchildrenAdd.error,
  branches: OPchildrenAdd.branches,
  classes: OPchildrenAdd.classes,
  defaultBranch: user.defaultBranch,
  user: user.user,
});
const General = memo(
  ({
    dispatch,
    loading: { effects },
    match: { params },
    details,
    error,
    user,
  }) => {
    const formRef = useRef();
    const [modalForm] = Form.useForm();
    const [dayOfBirth, setDayOfBirth] = useState(null);
    const mounted = useRef(false);

    const [visibleModal, setVisibleModal] = useState(false);
    const [modalType, setModalType] = useState('');

    const loadingSubmit =
      effects[`OPchildrenAdd/ADD`] ||
      effects[`OPchildrenAdd/UPDATE`];
    const loading = effects[`OPchildrenAdd/GET_DETAILS`];

    useEffect(() => {
      if (!isEmpty(details) && params.id) {
        setDayOfBirth(details?.student?.age);
      }
    }, [details]);

    const updateStatus = () => {
      dispatch({
        type: 'OPchildrenAdd/UPDATE_STATUS',
        payload: {
          status:
            details?.student?.status === variablesModules.STATUS.STORE
              ? variablesModules.STATUS.REGIST
              : variablesModules.STATUS.STORE,
          id: params.id,
        },
        callback: (response) => {
          if (response) {
            history.push(
              `/ho-so-doi-tuong/hoc-sinh`,
            );
            dispatch({
              type: 'OPchildrenAdd/GET_DETAILS',
              payload: params,
            });
          }
        },
      });
    };

    const handleModalForm = (val) => {
      modalForm.resetFields();
      setVisibleModal(true);
      setModalType(val);
    };

    const cancelModalForm = () => {
      setVisibleModal(false);
    };

    const save = () => {
      modalForm.validateFields().then((values) => {
        const payload = {
          ...values,
          id: params.id,
          date: moment(values.date).toISOString(),
          IsWithdrawApplication: modalType === type.WITHDRAW_APPLICATION,
          IsStopStudying: modalType === type.STOP_STUDYING,
          IsStopDistributed: modalType === type.STOP_DISTRIBUTED,
        };
        dispatch({
          type: 'OPchildrenAdd/STORE_STUDENT',
          payload,
          callback: (res) => {
            if (res) {
              history.push(
                `/ho-so-doi-tuong/hoc-sinh`,
              );
            }
          },
        });
      });
      setVisibleModal(false);
    };

    useEffect(() => {
      if (user?.branchs?.length > 0) {
        dispatch({
          type: 'OPchildrenAdd/GET_BRANCHES',
          payload: params,
        });
        formRef.current.setFieldsValue({
          branchId: user?.branchs[0]?.id,
        });
      }
    }, [user?.id]);

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    const updateStatusRestore = () => {
      formRef.current.validateFields().then((values) => {
        dispatch({
          type: 'OPchildrenAdd/UPDATE_STATUS_RESTORE',
          payload: {
            id: params.id,
            restoredDate: Helper.getDateTime({
              value: Helper.setDate({
                ...variables.setDateData,
                originValue: values?.restoredDate,
              }),
              format: variables.DATE_FORMAT.DATE_AFTER,
              isUTC: false,
            }),
          },
          callback: (response) => {
            if (response) {
              history.push(
                `/ho-so-doi-tuong/hoc-sinh`,
              );
              dispatch({
                type: 'OPchildrenAdd/GET_DETAILS',
                payload: params,
              });
            }
          },
        });
      });
    };

    return (
      <>
        <Modal
          visible={visibleModal}
          title={
            (modalType === type.WITHDRAW_APPLICATION && 'Thông tin rút hồ sơ') ||
            (modalType === type.STOP_STUDYING && 'Thông tin bảo lưu') ||
            (modalType === type.STOP_DISTRIBUTED && 'Thông tin kết thúc nhập môn')
          }
          onOk={save}
          centered
          width={700}
          onCancel={cancelModalForm}
          footer={
            <Pane className="d-flex justify-content-end align-items-center">
              <Button
                key="cancel"
                color="white"
                icon="fe-x"
                onClick={cancelModalForm}
                loading={loadingSubmit}
              >
                Hủy
              </Button>
              <Button
                key="choose"
                color="success"
                icon="fe-save"
                onClick={save}
                loading={loadingSubmit}
              >
                Lưu
              </Button>
            </Pane>
          }
        >
          <Form layout="vertical" form={modalForm}>
            <Pane className="row">
              {modalType !== type.STOP_DISTRIBUTED && (
                <Pane className="col-lg-6">
                  <FormItem
                    label={
                      (modalType === type.WITHDRAW_APPLICATION && 'Lý do rút hồ sơ') ||
                      (modalType === type.STOP_STUDYING && 'Lý do bảo lưu')
                    }
                    name="reason"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                  />
                </Pane>
              )}
              <Pane className="col-lg-6">
                <FormItem
                  label={
                    (modalType === type.WITHDRAW_APPLICATION && 'Ngày rút hồ sơ') ||
                    (modalType === type.STOP_STUDYING && 'Ngày bảo lưu') ||
                    (modalType === type.STOP_DISTRIBUTED && 'Ngày kết thúc nhập môn')
                  }
                  name="date"
                  disabledDate={Helper.disabledDate}
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
            </Pane>
            <Pane className="row">
              <Pane className="col-lg-12">
                <FormItem
                  label="Ghi chú"
                  name="note"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                />
              </Pane>
            </Pane>
          </Form>
        </Modal>
        <Form layout="vertical" ref={formRef} >
          <Pane className="card">
            <Loading loading={loading} isError={error.isError} params={{ error }}>
              <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  Thông tin cơ bản
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-12 mb20">
                    <FormDetail label="Hình ảnh" type="img" />
                    <ImgDetail
                      fileImage={details?.student?.fileImage}
                    />
                  </Pane>
                </Pane>

                <Pane className="row">
                  <Pane className="col-lg-4">
                    <FormDetail name={details?.student?.code} label="Mã học sinh" type="text" />
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormDetail
                      name={details?.student?.status}
                      data={Helper.objectToArray(variablesModules.STATUS_OBJECT_PROFILE_LABEL)}
                      label="Trạng thái"
                      type="select" />
                  </Pane>
                </Pane>

                <Pane className="row">
                  <Pane className="col-lg-4">
                    <FormDetail name={details?.student?.fullName} label="Họ và tên" type="text" />
                  </Pane>
                  <Pane className="col-lg-2">
                    <FormDetail name={details?.student?.dayOfBirth} label="Ngày sinh" type="day" />
                  </Pane>
                  <Pane className="col-lg-2">
                    <FormDetail name={dayOfBirth} label="Tuổi (tháng)" />
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormDetail name={details?.student?.sex} label="Giới tính" data={genders} type="select" />
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormDetail name={details?.student?.branch?.name} label="Cơ sở" />
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormDetail name={details?.student?.class?.name} label="Lớp" />
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormDetail name={details?.student?.startDate} label="Ngày nhập học" type="day" />
                  </Pane>
                </Pane>

                <Pane className="row">
                  <Pane className="col-lg-12">
                    <FormDetail name={details?.student?.address} label="Địa chỉ" />
                  </Pane>
                </Pane>
                {
                  params?.id && (details?.student?.status === variablesModules.STATUS.STOP_STUDYING ||
                    details?.student?.status === variablesModules.STATUS.WITHDRAW_APPLICATION) && (
                    <Pane className="row">
                      <Pane className="col-lg-4">
                        <FormDetail name={details?.student?.stopStudyingDate} label="Ngày bắt đầu thôi học" type="day" />
                      </Pane>
                      <Pane className="col-lg-4">
                        <FormDetail name={details?.student?.restoredDate} label="Ngày kết thúc thôi học" type="day" />
                      </Pane>
                    </Pane>
                  )
                }
              </Pane>

              <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
                {params.id && (details?.student?.status === variablesModules.STATUS.STORE ||
                  details?.student?.status === variablesModules.STATUS.STOP_STUDYING ||
                  details?.student?.status === variablesModules.STATUS.WITHDRAW_APPLICATION) ?
                  <Button
                    color="success"
                    size="large"
                    htmlType="button"
                    className="mr-3"
                    onClick={updateStatusRestore}
                    loading={effects[`OPchildrenAdd/UPDATE_STATUS_RESTORE`]}
                    permission="WEB_HSDT_HOSODALUUTRU_HOCSINH_EDIT"
                  >
                    Khôi phục
                  </Button>
                  :
                  <>
                    {details?.student?.status !== variablesModules.STATUS.REGISTED && params?.id && (
                      <>
                        <Button
                          color="primary"
                          size="large"
                          htmlType="button"
                          className="mr-3"
                          onClick={() => handleModalForm(type.WITHDRAW_APPLICATION)}
                          permission="WEB_HSDT_HOCSINH_EDIT"
                        >
                          Rút hồ sơ
                        </Button>
                        <Button
                          color="primary"
                          size="large"
                          htmlType="button"
                          className="mr-3"
                          onClick={() => handleModalForm(type.STOP_STUDYING)}
                          permission="WEB_HSDT_HOCSINH_EDIT"
                        >
                          Bảo lưu
                        </Button>
                      </>
                    )}
                    {details?.student?.status === variablesModules.STATUS.REGISTED && params?.id && (
                      <Button
                        color="success"
                        size="large"
                        htmlType="button"
                        className="mr-3"
                        permission="WEB_HSDT_HOCSINH_EDIT"
                        onClick={updateStatus}
                        loading={effects[`OPchildrenAdd/UPDATE_STATUS`]}
                      >
                        Lưu trữ hồ sơ
                      </Button>
                    )}
                  </>
                }
                {
                  user?.roleCode === "admin" && !params?.id ? " " :
                    <Button
                      permission="WEB_HSDT_HOCSINH_EDIT"
                      color="success" size="large" loading={loadingSubmit} onClick={() => {
                        history.push(`/ho-so-doi-tuong/hoc-sinh/${details?.student?.id}/chinh-sua`);
                      }}>
                      Chỉnh sửa
                    </Button>
                }
              </Pane>
            </Loading>
          </Pane>
        </Form>
      </>
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
  user: {},
};

export default withRouter(connect(mapStateToProps)(General));
