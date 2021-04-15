import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { head, isEmpty } from 'lodash';
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
const mapStateToProps = ({ loading, OPParentsAdd }) => ({
  loading,
  details: OPParentsAdd.details,
  error: OPParentsAdd.error,
});
const General = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const [fileImage, setFileImage] = useState(null);
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);
  const loadingSubmit =
    effects[`OPParentsAdd/ADD`] ||
    effects[`OPParentsAdd/UPDATE`] ||
    effects[`OPParentsAdd/UPDATE_STATUS`];
  const loading = effects[`OPParentsAdd/GET_DETAILS`];

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'OPParentsAdd/UPDATE' : 'OPParentsAdd/ADD',
      payload: params.id
        ? { ...details, ...values, id: params.id, fileImage }
        : { ...values, fileImage },
      callback: (response, error) => {
        if (response) {
          history.push(`/ho-so-doi-tuong/phu-huynh/${response?.id}/chi-tiet?type=general`);
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
      type: 'OPParentsAdd/UPDATE_STATUS',
      payload: { status: variablesModules.STATUS.STORE, id: params.id },
      callback: (response, error) => {
        if (response) {
          history.push(`/ho-so-doi-tuong/phu-huynh`);
        }
      },
    });
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'OPParentsAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        ...details,
        boD: moment(details.boD),
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
                <Form.Item name="avatar" label="Hình ảnh phụ huynh">
                  <ImageUpload
                    callback={(res) => {
                      mountedSet(setFileImage, res.fileInfo.url);
                    }}
                    fileImage={fileImage}
                  />
                </Form.Item>
              </Pane>
            </Pane>
            <Pane className="row border-bottom" {...marginProps}>
              <Pane className="col-lg-4">
                <FormItem
                  name="fullName"
                  label="Tên khách hàng"
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
              <Pane className="col-lg-4">
                <FormItem
                  name="email"
                  label="Email"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY, variables.RULES.EMAIL]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="phone"
                  label="Số điện thoại"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="anotherPhone"
                  label="Số điện thoại khác"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
            </Pane>

            <Heading type="form-block-title" {...marginProps}>
              Địa chỉ
            </Heading>

            <Pane className="row border-bottom" {...marginProps}>
              <Pane className="col-lg-4">
                <FormItem name="address" label="Địa chỉ" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-8">
                <FormItem data={[]} name="cityId" label="Thành phố" type={variables.CASCADER} />
              </Pane>
            </Pane>

            <Pane className="row">
              <Pane className="col-lg-4">
                <FormItem name="jobTile" label="Nghề nghiệp" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="faceBook" label="Địa chỉ facebook" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="zalo" label="Địa chỉ zalo" type={variables.INPUT} />
              </Pane>

              <Pane className="col-lg-4">
                <FormItem name="instagram" label="Địa chỉ Instagram" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="referent" label="Khách hàng liên quan" type={variables.INPUT} />
              </Pane>

              <Pane className="col-lg-12">
                <FormItem name="remark" label="Ghi chú" type={variables.INPUT} />
              </Pane>

              <Pane className="col-lg-12">
                <FormItem name="hobby" label="Tính cách, sở thích" type={variables.INPUT} />
              </Pane>
            </Pane>
          </Pane>

          <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
            {params.id && (
              <Button
                color="success"
                size="large"
                htmlType="button"
                className="mr-3"
                onClick={updateStatus}
                loading={loadingSubmit}
              >
                Lưu trữ hồ sơ
              </Button>
            )}
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
