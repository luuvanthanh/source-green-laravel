import { memo, useRef, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
import { history, useParams } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'dva';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { variables, Helper } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];
const { confirm } = Modal;

const marginProps = { style: { marginBottom: 12 } };
const General = memo(() => {
  const formRef = useRef();
  const {
    error,
    degrees,
    details,
    loading: { effects },
    trainningMajors,
    trainningSchool,
  } = useSelector(({ loading, HRMusersAdd }) => ({
    loading,
    details: HRMusersAdd.details,
    degrees: HRMusersAdd.degrees,
    trainningMajors: HRMusersAdd.trainningMajors,
    trainningSchool: HRMusersAdd.trainningSchool,
    error: HRMusersAdd.error,
  }));
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const [files, setFiles] = useState([]);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);
  const loadingSubmit =
    effects[`HRMusersAdd/ADD`] ||
    effects[`HRMusersAdd/STORAGE`] ||
    effects[`HRMusersAdd/UPDATE`] ||
    effects[`HRMusersAdd/UPDATE_STATUS`];
  const loading =
    effects[`HRMusersAdd/GET_DETAILS`] ||
    effects[`HRMusersAdd/GET_DEGREES`] ||
    effects[`HRMusersAdd/GET_TRAINNING_MAJORS`] ||
    effects[`HRMusersAdd/GET_TRAINNING_SCHOOLS`];

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'HRMusersAdd/UPDATE' : 'HRMusersAdd/ADD',
      payload: params.id
        ? { ...details, ...values, id: params.id, fileImage: JSON.stringify(files) }
        : { ...values, fileImage: JSON.stringify(files), status: 'WORKING' },
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

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const storage = () => {
    confirm({
      title: 'Thông báo',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content:
        details?.status === 'WORKING'
          ? 'Bạn có muốn lưu trữ nhân viên này. Nếu lưu trữ sẽ ảnh hưởng đến giữ liệu đang có. Bạn có chắc chắn?'
          : 'Bạn có muốn khôi phục nhân viên này. Nếu khôi phục sẽ ảnh hưởng đến giữ liệu đang có. Bạn có chắc chắn?',
      onOk() {
        dispatch({
          type: 'HRMusersAdd/STORAGE',
          payload: {
            id: params.id,
            status: details?.status === 'WORKING' ? 'STORE' : 'WORKING',
          },
          callback: (response, error) => {
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
      },
      onCancel() {},
    });
  };

  /**
   * Load Items Degres
   */
  useEffect(() => {
    dispatch({
      type: 'HRMusersAdd/GET_DEGREES',
      payload: params,
    });
  }, []);

  /**
   * Load Items Trainning Majors
   */
  useEffect(() => {
    dispatch({
      type: 'HRMusersAdd/GET_TRAINNING_MAJORS',
      payload: params,
    });
  }, []);

  /**
   * Load Items Trainning School
   */
  useEffect(() => {
    dispatch({
      type: 'HRMusersAdd/GET_TRAINNING_SCHOOLS',
      payload: params,
    });
  }, []);

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        ...details,
        ...head(details.positionLevel),
        startDate:
          head(details.positionLevel)?.startDate && moment(head(details.positionLevel)?.startDate),
        dateOfBirth: details.dateOfBirth && moment(details.dateOfBirth),
        dateOfIssueIdCard: details.dateOfIssueIdCard && moment(details.dateOfIssueIdCard),
        dateOff: details.dateOff && moment(details.dateOff),
      });
      if (Helper.isJSON(details?.fileImage)) {
        mountedSet(setFiles, JSON.parse(details?.fileImage));
      }
    }
  }, [details]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const uploadFiles = (file) => {
    mountedSet(setFiles, (prev) => [...prev, file]);
  };

  return (
    <Form layout="vertical" ref={formRef} initialValues={{}} onFinish={onFinish}>
      <div className="card">
        <Loading loading={loading} isError={error.isError} params={{ error, type: 'container' }}>
          <div style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Thông tin cơ bản
            </Heading>
            <div className="row">
              <div className="col">
                <div className="ant-col ant-form-item-label">
                  <label className="ant-form-item-required">
                    <span>Hình ảnh nhân viên</span>
                  </label>
                </div>
                <MultipleImageUpload
                  files={files}
                  callback={(files) => uploadFiles(files)}
                  removeFiles={(files) => mountedSet(setFiles, files)}
                />
              </div>
            </div>
            <div className="row" {...marginProps}>
              <div className="col-lg-4">
                <FormItem
                  name="fullName"
                  label="Tên nhân viên"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                />
              </div>
              <div className="col-lg-4">
                <FormItem
                  name="code"
                  label="Mã nhân viên"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                />
              </div>
              <div className="col-lg-4">
                <FormItem
                  name="dateOfBirth"
                  label="Ngày sinh"
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                  disabledDate={(current) => current > moment()}
                />
              </div>
            </div>
            <div className="row" {...marginProps}>
              <div className="col-lg-4">
                <FormItem
                  name="phoneNumber"
                  label="Số điện thoại"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
                />
              </div>
              <div className="col-lg-4">
                <FormItem
                  name="email"
                  label="Email"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY, variables.RULES.EMAIL]}
                />
              </div>
            </div>
            <div className="row" {...marginProps}>
              <div className="col-lg-4">
                <FormItem
                  data={genders}
                  name="gender"
                  label="Giới tính"
                  type={variables.SELECT}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-4">
                <FormItem
                  name="idCard"
                  label="Số CMND"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-4">
                <FormItem
                  name="dateOfIssueIdCard"
                  label="Ngày cấp"
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
            </div>

            <div className="row" {...marginProps}>
              <div className="col-lg-4">
                <FormItem
                  name="placeOfIssueIdCard"
                  label="Nơi cấp"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-4">
                <FormItem name="nation" label="Dân tộc" type={variables.INPUT} />
              </div>
              <div className="col-lg-4">
                <FormItem name="religion" label="Tôn giáo" type={variables.INPUT} />
              </div>
              <div className="col-lg-4">
                <FormItem
                  data={[
                    { value: false, label: 'Độc thân' },
                    { value: true, label: 'Đã kết hôn' },
                  ]}
                  name="married"
                  label="Tình trạng hôn nhân"
                  type={variables.RADIO}
                />
              </div>
            </div>
          </div>
          <div style={{ padding: 20 }} className="pb-0 border-bottom">
            <div className="row" {...marginProps}>
              <div className="col-lg-4">
                <FormItem name="placeOfBirth" label="Nơi sinh" type={variables.INPUT} />
              </div>
              <div className="col-lg-4">
                <FormItem name="nationality" label="Quốc tịch" type={variables.INPUT} />
              </div>
              <div className="col-lg-4">
                <FormItem
                  name="permanentAddress"
                  label="Hộ khẩu thường trú"
                  type={variables.INPUT}
                />
              </div>
              <div className="col-lg-4">
                <FormItem name="address" label="Chổ ở hiện tại" type={variables.INPUT} />
              </div>
            </div>
          </div>
          <div style={{ padding: 20 }} className="pb-0 border-bottom">
            <div className="row" {...marginProps}>
              <div className="col-lg-4">
                <FormItem name="taxCode" label="Mã số thuế" type={variables.INPUT} />
              </div>
              <div className="col-lg-4">
                <FormItem data={degrees} name="degreeId" label="Bằng cấp" type={variables.SELECT} />
              </div>
              <div className="col-lg-4">
                <FormItem
                  data={trainningMajors}
                  name="trainingMajorId"
                  label="Ngành đào tạo"
                  type={variables.SELECT}
                />
              </div>
              <div className="col-lg-4">
                <FormItem
                  data={trainningSchool}
                  name="trainingSchoolId"
                  label="Trường đào tạo"
                  type={variables.SELECT}
                />
              </div>
              {params.id && (
                <div className="col-lg-4">
                  <FormItem name="dateOff" label="Ngày nghỉ việc" type={variables.DATE_PICKER} />
                </div>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-between" style={{ padding: 20 }}>
            {params.id && (
              <Button color="primary" size="large" loading={loadingSubmit} onClick={storage}>
                {details?.status === 'WORKING' ? 'Lưu trữ' : 'Khôi phục'}
              </Button>
            )}

            <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
              Lưu
            </Button>
          </div>
        </Loading>
      </div>
    </Form>
  );
});

export default General;
