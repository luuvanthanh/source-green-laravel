import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';
import Loading from '@/components/CommonComponent/Loading';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';

const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
  loading,
  details: crmSaleAdmissionAdd.details,
  error: crmSaleAdmissionAdd.error,

  customerLead: crmSaleAdmissionAdd.customerLead,
});
const General = memo(
  ({ dispatch, match: { params }, loading: { effects }, error, customerLead }) => {
    const formRef = useRef();
    const mounted = useRef(false);
    const loadingSubmit = effects[`crmSaleAdmissionAdd/ADD`];
    const loading =
      effects[`crmSaleAdmissionAdd/GET_DETAILS`] ||
      effects[`crmSaleAdmissionAdd/GET_STUDENTS_LEAD`];
    const [studentsLead, setStudentsLead] = useState();
    useEffect(() => {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_CUSTOMER_LEAD',
        payload: {},
      });
    }, [params.id]);

    const onChangeStudents = (customer_lead_id) => {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_STUDENTS_LEAD',
        payload: {
          customer_lead_id,
        },
        callback: (response) => {
          if (response) {
            setStudentsLead(response?.parsePayload);
          }
        },
      });
    };

    const selectPosition = (student_info_id) => {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_STUDENTS_LEAD',
        payload: {
          student_info_id,
        },
        callback: (response) => {
          if (response) {
            formRef.current.setFieldsValue({
              data: response.parsePayload.map((item) => ({
                ...item,
                birth_date: moment(item.birth_date),
              })),
            });
          }
        },
      });
    };

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = (values) => {
      dispatch({
        type: 'crmSaleAdmissionAdd/ADD',
        payload: { ...values },
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

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    return (
      <Form
        layout="vertical"
        ref={formRef}
        onFinish={onFinish}
        initialValues={{
          data: [{}],
        }}
      >
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <Pane className="card p20">
            <Pane>
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Phụ huynh Lead
              </Heading>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <FormItem
                    options={['id', 'full_name']}
                    name="customer_lead_id"
                    data={customerLead}
                    placeholder="Chọn phụ huynh"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY_INPUT]}
                    onChange={onChangeStudents}
                  />
                </Pane>
              </Pane>
            </Pane>
          </Pane>

          <Pane className="card p20">
            <Pane className="border-bottom">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Thông tin đăng ký
              </Heading>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <FormItem
                    label="Họ và tên học sinh"
                    options={['id', 'full_name']}
                    name="student_info_id"
                    data={studentsLead}
                    placeholder="Chọn học sinh"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY_INPUT]}
                    onChange={selectPosition}
                  />
                </Pane>
                <Pane className="col-lg-8">
                  <Form.List name="data">
                    {(fields) => (
                      <>
                        {fields.map((field) => (
                          <Pane key={field.key}>
                            <Pane className="row">
                              <Pane className="col-lg-6">
                                <FormItem
                                  name={[field.name, 'birth_date']}
                                  label="Ngày sinh"
                                  fieldKey={[field.fieldKey, 'birth_date']}
                                  type={variables.DATE_PICKER}
                                  disabled
                                />
                              </Pane>
                              <Pane className="col-lg-6">
                                <FormItem
                                  name={[field.name, 'age_month']}
                                  label="Tuổi hiện tại (tháng)"
                                  placeholder="Tháng"
                                  fieldKey={[field.fieldKey, 'age_month']}
                                  type={variables.INPUT}
                                  disabled
                                />
                              </Pane>
                            </Pane>
                          </Pane>
                        ))}
                      </>
                    )}
                  </Form.List>
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    name="date_register"
                    label="Thời gian đăng ký nhập học"
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                  />
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    name="parent_wish"
                    placeholder="Nhập"
                    label="Mong muốn của phụ huynh"
                    type={variables.TEXTAREA}
                  />
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    name="children_note"
                    placeholder="Nhập"
                    label="Lưu ý trẻ"
                    type={variables.TEXTAREA}
                  />
                </Pane>
              </Pane>
            </Pane>
            <Pane className="pt20 d-flex justify-content-between align-items-center ">
            <p className="btn-delete" role="presentation" onClick={() => history.push('/crm/sale/dang-ky-nhap-hoc')}>
                Hủy
              </p>
              <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
                Lưu
              </Button>
            </Pane>
          </Pane>
        </Loading>
      </Form>
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  customerLead: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  dispatch: () => { },
  loading: {},
  error: {},
  customerLead: [],
};

export default withRouter(connect(mapStateToProps)(General));