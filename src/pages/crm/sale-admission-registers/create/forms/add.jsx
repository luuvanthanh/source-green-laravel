import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';
import { useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from '../../styles.module.scss';

const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
  loading,
  error: crmSaleAdmissionAdd.error,
  studentsLead: crmSaleAdmissionAdd.studentsLead,
  customerLead: crmSaleAdmissionAdd.customerLead,
});
const General = memo(
  ({ loading: { effects }, customerLead, studentsLead }) => {
    const formRef = useRef();
    const mounted = useRef(false);
    const loadingSubmit = effects[`crmSaleAdmissionAdd/ADD`];
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_CUSTOMER_LEAD',
        payload: {},
      });
    }, []);

    const onChangeStudents = (customer_lead_id) => {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_STUDENTS_LEAD',
        payload: {
          customer_lead_id,
        },
      });
      formRef.current.setFieldsValue({
        birth_date: undefined,
        age_month: undefined,
        student_info_id: undefined,
      });
    };

    const selectPosition = (student_info_id) => {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_STUDENTS_ID',
        payload: {
          student_info_id,
        },
        callback(response) {
          if (response) {
            formRef.current.setFieldsValue({
              age_month: response[0]?.age_month,
              birth_date: response[0]?.birth_date ? moment(response[0]?.birth_date) : "",
            });
          }
        }
      });
    };
    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = (values) => {
      dispatch({
        type: 'crmSaleAdmissionAdd/ADD',
        payload: { ...values, disable_status: true },
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
      <Pane className={stylesModule['disabled-container']}>
        <Form
          layout="vertical"
          ref={formRef}
          onFinish={onFinish}
          initialValues={{
            data: [{}],
          }}
        >
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
                    onChange={(event) => onChangeStudents(event, 'customer_lead_id')}
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
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY_INPUT]}
                    onChange={selectPosition}
                  />
                </Pane>
                <Pane className="col-lg-8">
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <FormItem
                        name='birth_date'
                        label="Ngày sinh"
                        type={variables.DATE_PICKER}
                        disabled
                      />
                    </Pane>
                    <Pane className="col-lg-6">
                      <FormItem
                        name='age_month'
                        label="Tuổi hiện tại (tháng)"
                        placeholder="Tháng"
                        type={variables.INPUT}
                        disabled
                      />
                    </Pane>
                  </Pane>
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
        </Form>
      </Pane>
    );
  },
);

General.propTypes = {
  loading: PropTypes.objectOf(PropTypes.any),
  customerLead: PropTypes.arrayOf(PropTypes.any),
  studentsLead: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  loading: {},
  customerLead: [],
  studentsLead: [],
};

export default withRouter(connect(mapStateToProps)(General));