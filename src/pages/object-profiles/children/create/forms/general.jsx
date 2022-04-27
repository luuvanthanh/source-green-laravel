import { memo, useRef, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { head, isEmpty } from 'lodash';
import moment from 'moment';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';
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
    branches,
    classes,
    defaultBranch,
    user,
  }) => {
    const formRef = useRef();
    const [modalForm] = Form.useForm();
    const [dayOfBirth, setDayOfBirth] = useState(null);
    const [files, setFiles] = useState([]);
    const mounted = useRef(false);
    const mountedSet = (setFunction, value) =>
      !!mounted?.current && setFunction && setFunction(value);

    const [visibleModal, setVisibleModal] = useState(false);
    const [modalType, setModalType] = useState('');

    const loadingSubmit =
      effects[`OPchildrenAdd/ADD`] ||
      effects[`OPchildrenAdd/UPDATE`] ||
      effects[`OPchildrenAdd/UPDATE_STATUS`];
    const loading = effects[`OPchildrenAdd/GET_DETAILS`];

    const onChaneDate = (e) => {
      mountedSet(setDayOfBirth, e);
    };

    const onChangeBranch = (e) => {
      dispatch({
        type: 'OPchildrenAdd/GET_CLASSES',
        payload: {
          branch: e,
        },
      });
    };

    const onFinish = (values) => {
      const age = moment().diff(moment(values.dayOfBirth), 'month');
      dispatch({
        type: params.id ? 'OPchildrenAdd/UPDATE' : 'OPchildrenAdd/ADD',
        payload: params.id
          ? {
            ...details,
            id: params.id,
            student: {
              ...details.student,
              ...values,
              branchId: details?.student?.branchId || details?.student?.class?.branchId,
              id: params.id,
              fileImage: JSON.stringify(files),
              age,
            },
            branchId: details?.student?.class?.branchId,
          }
          : {
            student: {
              ...values,
              fileImage: JSON.stringify(files),
              age,
              branchId: user?.branchs?.length > 0 ? user?.branchs[0]?.id : "",
              registerDate: moment(),
            },
          },
        callback: (response, error) => {
          if (response) {
            history.push(
              `/ho-so-doi-tuong/hoc-sinh/${response?.student?.id}/chi-tiet?type=general`,
            );
          }
          if (error) {
            if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
              error?.validationErrors.forEach((item) => {
                formRef.current.setFields([
                  {
                    name: head(item.members),
                    errors: [item.message],
                  },
                ]);
              });
            }
          }
        },
      });
    };

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
          callback: () => { },
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
          registerDate: moment(),
        });
      }
    }, [user?.id]);

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    useEffect(() => {
      if (!isEmpty(details) && params.id) {
        formRef.current.setFieldsValue({
          ...details.student,
          dayOfBirth: details?.student?.dayOfBirth && moment(details?.student?.dayOfBirth),
          registerDate: details?.student?.registerDate && moment(details?.student?.registerDate),
          branchId: details?.student?.branch?.name,
          status: details?.student?.status,
        });
        mountedSet(setDayOfBirth(moment(details?.student?.dayOfBirth)));
        if (details?.student?.class?.branchId) {
          dispatch({
            type: 'OPchildrenAdd/GET_CLASSES',
            payload: {
              branch: details?.student?.class?.branchId,
            },
          });
        }
        if (Helper.isJSON(details?.student?.fileImage)) {
          mountedSet(setFiles, JSON.parse(details?.student?.fileImage));
        }
      }
    }, [details]);

    const uploadFiles = (file) => {
      mountedSet(setFiles, (prev) => [...prev, file]);
    };

    const disabledDate = (current) =>
      current && current > moment().endOf('day').subtract(1, 'days');

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
        <Form layout="vertical" ref={formRef} onFinish={onFinish}>
          <Pane className="card">
            <Loading loading={loading} isError={error.isError} params={{ error }}>
              <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  Thông tin cơ bản
                </Heading>
                <Pane className="row">
                  <Pane className="col">
                    <Form.Item name="avatar" label="Hình ảnh học sinh">
                      <MultipleImageUpload
                        files={files}
                        callback={(files) => uploadFiles(files)}
                        removeFiles={(files) => mountedSet(setFiles, files)}
                      />
                    </Form.Item>
                  </Pane>
                </Pane>

                <Pane className="row">
                  <Pane className="col-lg-4">
                    <FormItem name="code" label="Mã học sinh" type={variables.INPUT} disabled />
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormItem
                      name="status"
                      label="Trạng thái"
                      type={variables.SELECT}
                      data={Helper.objectToArray(variablesModules.STATUS_OBJECT_PROFILE_LABEL)}
                      disabled
                    />
                  </Pane>
                </Pane>

                <Pane className="row">
                  <Pane className="col-lg-4">
                    <FormItem
                      name="fullName"
                      label="Họ và tên"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                    />
                  </Pane>
                  <Pane className="col-lg-2">
                    <FormItem
                      name="dayOfBirth"
                      label="Ngày sinh"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                      disabledDate={disabledDate}
                      onChange={onChaneDate}
                    />
                  </Pane>
                  <Pane className="col-lg-2">
                    <Form.Item label="Tuổi(tháng)">
                      {dayOfBirth && moment().diff(moment(dayOfBirth), 'month')}
                    </Form.Item>
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormItem
                      data={genders}
                      name="sex"
                      label="Giới tính"
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                  <Pane className="col-lg-4">
                    {defaultBranch?.id ? (
                      <FormItem
                        data={[defaultBranch]}
                        name="branchId"
                        label="Mã cơ sở"
                        type={variables.SELECT}
                        onChange={onChangeBranch}
                        disabled
                      />
                    ) : (
                      <FormItem
                        data={branches}
                        name="branchId"
                        label="Mã cơ sở"
                        type={variables.SELECT}
                        onChange={onChangeBranch}
                        disabled
                      />
                    )}
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormItem
                      data={classes}
                      name="classId"
                      label="Mã lớp"
                      type={variables.SELECT}
                      disabled
                    />
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormItem
                      name="registerDate"
                      label="Ngày vào lớp"
                      type={variables.DATE_PICKER}
                      disabled
                    />
                  </Pane>
                </Pane>

                <Pane className="row">
                  <Pane className="col-lg-12">
                    <FormItem name="address" label="Địa chỉ" type={variables.INPUT} />
                  </Pane>
                </Pane>
              </Pane>

              <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
                {params.id && (
                  <>
                    {details?.student?.status !== variablesModules.STATUS.REGISTED && (
                      <>
                        <Button
                          color="primary"
                          size="large"
                          htmlType="button"
                          className="mr-3"
                          onClick={() => handleModalForm(type.WITHDRAW_APPLICATION)}
                        >
                          Rút hồ sơ
                        </Button>
                        <Button
                          color="primary"
                          size="large"
                          htmlType="button"
                          className="mr-3"
                          onClick={() => handleModalForm(type.STOP_STUDYING)}
                        >
                          Bảo lưu
                        </Button>
                        {details?.student?.status !== variablesModules.STATUS.OFFICAL && (
                          <Button
                            color="primary"
                            size="large"
                            htmlType="button"
                            className="mr-3"
                            onClick={() => handleModalForm(type.STOP_DISTRIBUTED)}
                          >
                            Kết thúc nhập môn
                          </Button>
                        )}
                      </>
                    )}
                    {details?.student?.status === variablesModules.STATUS.REGISTED && (
                      <Button
                        color="success"
                        size="large"
                        htmlType="button"
                        className="mr-3"
                        onClick={updateStatus}
                        loading={loadingSubmit}
                      >
                        {details?.student?.status === variablesModules.STATUS.STORE
                          ? 'Khôi phục'
                          : 'Lưu trữ hồ sơ'}
                      </Button>
                    )}
                  </>
                )}
                {
                  user?.roleCode === "admin" && !params?.id ? " " :
                    <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
                      Lưu
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
  branches: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  defaultBranch: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
  branches: [],
  classes: [],
  defaultBranch: {},
  user: {},
};

export default withRouter(connect(mapStateToProps)(General));
