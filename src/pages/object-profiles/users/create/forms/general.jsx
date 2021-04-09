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
import FormItem from '@/components/CommonComponent/FormItem';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];

const marginProps = { style: { marginBottom: 12 } };
const mapStateToProps = ({ loading, OPusersAdd }) => ({
  loading,
  details: OPusersAdd.details,
  error: OPusersAdd.error,
});
const General = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const [fileImage, setFileImage] = useState(null);
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) => !!mounted?.current && (setFunction && setFunction(value));
  const loadingSubmit = effects[`OPusersAdd/ADD`] || effects[`OPusersAdd/UPDATE`];
  const loading = effects[`OPusersAdd/GET_DETAILS`];

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'OPusersAdd/UPDATE' : 'OPusersAdd/ADD',
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

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'OPusersAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        ...details,
        boD: moment(details.boD),
        identifyDate: moment(details.boD),
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
                  name="fullName"
                  label="Tên nhân viên"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="boD"
                  label="Ngày sinh"
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                  disabledDate={(current) => current > moment()}
                />
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
            </Pane>
            <Pane className="row" {...marginProps}>
              <Pane className="col-lg-4">
                <FormItem
                  name="identifyNumber"
                  label="Số CMND"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="identifyDate"
                  label="Ngày cấp"
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="identifyLocation"
                  label="Nơi cấp"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
            </Pane>

            <Pane className="row" {...marginProps}>
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

          <Pane style={{ padding: 20 }}>
            <Button
              color="success"
              size="large"
              htmlType="submit"
              style={{ marginLeft: 'auto' }}
              loading={loadingSubmit}
            >
              Lưu
            </Button>
          </Pane>
        </Pane>
      </Loading>
    </Form>
  );
});

export default withRouter(connect(mapStateToProps)(General));
