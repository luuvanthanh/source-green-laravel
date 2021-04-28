import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
import { history, useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import variablesModules from '../../../utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];

const marginProps = { style: { marginBottom: 12 } };
const General = memo(({}) => {
  const formRef = useRef();
  const [fileImage, setFileImage] = useState(null);
  const {
    error,
    degrees,
    details,
    loading: { effects },
    trainningMajors,
    trainningSchool,
    branches,
    divisions,
    positions,
  } = useSelector(({ loading, HRMusersAdd }) => ({
    loading,
    details: HRMusersAdd.details,
    degrees: HRMusersAdd.degrees,
    trainningMajors: HRMusersAdd.trainningMajors,
    trainningSchool: HRMusersAdd.trainningSchool,
    branches: HRMusersAdd.branches,
    divisions: HRMusersAdd.divisions,
    positions: HRMusersAdd.positions,
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
    effects[`HRMusersAdd/UPDATE`] ||
    effects[`HRMusersAdd/UPDATE_STATUS`];
  const loading =
    effects[`HRMusersAdd/GET_BRANCHES`] ||
    effects[`HRMusersAdd/GET_DIVISIONS`] ||
    effects[`HRMusersAdd/GET_POSITIONS`] ||
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
  const updateStatus = () => {
    dispatch({
      type: 'HRMusersAdd/UPDATE_STATUS',
      payload: {
        status:
          details?.status === variablesModules.STATUS.STORE
            ? variablesModules.STATUS.REGIST
            : variablesModules.STATUS.STORE,
        id: params.id,
      },
      callback: (response, error) => {
        if (response) {
          history.push(`/ho-so-doi-tuong/nhan-vien`);
        }
      },
    });
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'HRMusersAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

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

  /**
   * Load Items Branches
   */
  useEffect(() => {
    if (!params.id) {
      dispatch({
        type: 'HRMusersAdd/GET_BRANCHES',
        payload: params,
      });
    }
  }, []);

  /**
   * Load Items Divisions
   */
  useEffect(() => {
    if (!params.id) {
      dispatch({
        type: 'HRMusersAdd/GET_DIVISIONS',
        payload: params,
      });
    }
  }, []);

  /**
   * Load Items Positions
   */
  useEffect(() => {
    if (!params.id) {
      dispatch({
        type: 'HRMusersAdd/GET_POSITIONS',
        payload: params,
      });
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        ...details,
        dateOfBirth: details.dateOfBirth && moment(details.dateOfBirth),
        dateOfIssueIdCard: details.dateOfIssueIdCard && moment(details.dateOfIssueIdCard),
        dateOff: details.dateOff && moment(details.dateOff),
      });
      mountedSet(setFileImage, details.fileImage);
    }
  }, [details]);

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  const uploadFiles = (file) => {
    mountedSet(setFiles, (prev) => [...prev, file]);
  };

  return (
    <Form layout="vertical" ref={formRef} initialValues={{}} onFinish={onFinish}>
      <Pane className="card">
        <Loading loading={loading} isError={error.isError} params={{ error, type: 'container' }}>
          <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Thông tin cơ bản
            </Heading>
            <Pane className="row">
              <Pane className="col">
                <Form.Item name="avatar" label="Hình ảnh nhân viên">
                  <MultipleImageUpload
                    files={files}
                    callback={(files) => uploadFiles(files)}
                    removeFiles={(files) => mountedSet(setFiles, files)}
                  />
                </Form.Item>
              </Pane>
            </Pane>
            <Pane className="row" {...marginProps}>
              <Pane className="col-lg-4">
                <FormItem
                  name="fullName"
                  label="Tên nhân viên"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="code"
                  label="Mã nhân viên"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="dateOfBirth"
                  label="Ngày sinh"
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                  disabledDate={(current) => current > moment()}
                />
              </Pane>
            </Pane>
            <Pane className="row" {...marginProps}>
              <Pane className="col-lg-4">
                <FormItem
                  name="phoneNumber"
                  label="Số điện thoại"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="email"
                  label="Email"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY, variables.RULES.EMAIL]}
                />
              </Pane>
            </Pane>
            <Pane className="row" {...marginProps}>
              <Pane className="col-lg-4">
                <FormItem
                  data={genders}
                  name="gender"
                  label="Giới tính"
                  type={variables.SELECT}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="idCard"
                  label="Số CMND"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="dateOfIssueIdCard"
                  label="Ngày cấp"
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
            </Pane>

            <Pane className="row" {...marginProps}>
              <Pane className="col-lg-4">
                <FormItem
                  name="placeOfIssueIdCard"
                  label="Nơi cấp"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="nation" label="Dân tộc" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="religion" label="Tôn giáo" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  data={[
                    { value: false, label: 'Độc thân' },
                    { value: true, label: 'Đã kết hôn' },
                  ]}
                  name="married"
                  label="Tình trạng hôn nhân"
                  type={variables.RADIO}
                />
              </Pane>
            </Pane>
          </Pane>
          <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
            <Pane className="row" {...marginProps}>
              <Pane className="col-lg-4">
                <FormItem name="taxCode" label="Mã số thuế" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem data={degrees} name="degreeId" label="Bằng cấp" type={variables.SELECT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  data={trainningMajors}
                  name="trainingMajorId"
                  label="Ngành đào tạo"
                  type={variables.SELECT}
                />
              </Pane>
            </Pane>
            <Pane className="row" {...marginProps}>
              <Pane className="col-lg-4">
                <FormItem
                  data={trainningSchool}
                  name="trainingSchoolId"
                  label="Trường đào tạo"
                  type={variables.SELECT}
                />
              </Pane>
              {params.id && (
                <Pane className="col-lg-4">
                  <FormItem name="dateOff" label="Ngày nghỉ việc" type={variables.DATE_PICKER} />
                </Pane>
              )}
            </Pane>
          </Pane>
          {!params.id && (
            <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
              <Pane className="row">
                <Pane className="col-lg-6">
                  <FormItem
                    data={branches}
                    label="Cơ sở"
                    name="branchId"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem
                    data={divisions}
                    label="Bộ phận"
                    name="divisionId"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem
                    data={positions}
                    label="Chức vụ"
                    name="positionId"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem
                    label="Thời gian bắt đầu"
                    name="startDate"
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                    disabledDate={(current) => current < moment()}
                  />
                </Pane>
              </Pane>
            </Pane>
          )}

          <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
            <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
              Lưu
            </Button>
          </Pane>
        </Loading>
      </Pane>
    </Form>
  );
});

export default General;
