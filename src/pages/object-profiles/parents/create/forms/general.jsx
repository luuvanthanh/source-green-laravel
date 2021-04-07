import { memo, useRef, useEffect } from 'react';
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
const mapStateToProps = ({ loading, OPParentsAdd }) => ({
  loading,
  details: OPParentsAdd.details,
  error: OPParentsAdd.error,
});
const General = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const loadingSubmit = effects[`OPParentsAdd/ADD`] || effects[`OPParentsAdd/UPDATE`];
  const loading = effects[`OPParentsAdd/GET_DETAILS`];

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'OPParentsAdd/UPDATE' : 'OPParentsAdd/ADD',
      payload: params.id ? { ...details, ...values, id: params.id } : values,
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
    }
  }, [details]);

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
                  <ImageUpload />
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
                <FormItem data={[]} name="city" label="Thành phố" type={variables.CASCADER} />
              </Pane>
            </Pane>

            <Pane className="row">
              <Pane className="col-lg-4">
                <FormItem name="jobTile" label="Nghề nghiệp" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="facebook" label="Địa chỉ facebook" type={variables.INPUT} />
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
                <FormItem name="hobby" label="Sở thích" type={variables.INPUT} />
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
