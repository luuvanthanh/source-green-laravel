import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, history, withRouter } from 'umi';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import ImageUpload from '@/components/CommonComponent/ImageUpload';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import variablesModules from '../../../utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];

const marginProps = { style: { marginBottom: 12 } };
const mapStateToProps = ({ loading, HRMusersAdd }) => ({
  loading,
  details: HRMusersAdd.details,
  error: HRMusersAdd.error,
});
const General = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const [fileImage, setFileImage] = useState(null);
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);
  const loadingSubmit =
    effects[`HRMusersAdd/ADD`] ||
    effects[`HRMusersAdd/UPDATE`] ||
    effects[`HRMusersAdd/UPDATE_STATUS`];
  const loading = effects[`HRMusersAdd/GET_DETAILS`];

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'HRMusersAdd/UPDATE' : 'HRMusersAdd/ADD',
      payload: params.id
        ? { ...details, ...values, id: params.id, fileImage }
        : { ...values, fileImage },
      callback: (response, error) => {
        if (response) {
          history.goBack();
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

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        ...details,
        DateOfBirth: details.DateOfBirth && moment(details.DateOfBirth),
        DateOfIssueIdCard: details.DateOfIssueIdCard && moment(details.DateOfIssueIdCard),
        DateOff: details.DateOff && moment(details.DateOff),
      });
      mountedSet(setFileImage, details.fileImage);
    }
  }, [details]);

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  return (
    <Form layout="vertical" ref={formRef} initialValues={{}} onFinish={onFinish}>
      <Loading loading={loading} isError={error.isError} params={{ error }}>
        <Pane className="card">
          <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Thông tin cơ bản
            </Heading>
            <Pane className="row">
              <Pane className="col">
                <Form.Item name="avatar" label="Hình ảnh nhân viên">
                  <ImageUpload
                    callback={(res) => {
                      mountedSet(setFileImage, res.fileInfo.url);
                    }}
                    fileImage={fileImage}
                  />
                </Form.Item>
              </Pane>
            </Pane>
            <Pane className="row" {...marginProps}>
              <Pane className="col-lg-4">
                <FormItem
                  name="FullName"
                  label="Tên nhân viên"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="Code"
                  label="Mã nhân viên"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="DateOfBirth"
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
                  name="PhoneNumber"
                  label="Số điện thoại"
                  type={variables.INPUT}
                  rules={[variables.RULES.PHONE]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="Email"
                  label="Email"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMAIL]}
                />
              </Pane>
            </Pane>
            <Pane className="row" {...marginProps}>
              <Pane className="col-lg-4">
                <FormItem
                  data={genders}
                  name="Gender"
                  label="Giới tính"
                  type={variables.SELECT}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="IdCard"
                  label="Số CMND"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="DateOfIssueIdCard"
                  label="Ngày cấp"
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
            </Pane>

            <Pane className="row" {...marginProps}>
              <Pane className="col-lg-4">
                <FormItem
                  name="PlaceOfIssueIdCard"
                  label="Nơi cấp"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="Nation" label="Dân tộc" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="Religion" label="Tôn giáo" type={variables.INPUT} />
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
                <FormItem name="TaxCode" label="Mã số thuế" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem data={[]} name="DegreeId" label="Bằng cấp" type={variables.SELECT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  data={[]}
                  name="TrainingMajorId"
                  label="Chuyên ngành đào tạo"
                  type={variables.SELECT}
                />
              </Pane>
            </Pane>
            <Pane className="row" {...marginProps}>
              <Pane className="col-lg-4">
                <FormItem
                  data={[]}
                  name="TrainingSchoolId"
                  label="Trường đào tạo"
                  type={variables.SELECT}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="DateOff" label="Ngày nghỉ việc" type={variables.DATE_PICKER} />
              </Pane>
            </Pane>
          </Pane>

          <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
            <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
              Lưu
            </Button>
          </Pane>
        </Pane>
      </Loading>
    </Form>
  );
});

export default withRouter(connect(mapStateToProps)(General));
