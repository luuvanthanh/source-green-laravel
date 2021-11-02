import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';

const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
  loading,
  details: crmSaleAdmissionAdd.details,
  error: crmSaleAdmissionAdd.error,
  branches: crmSaleAdmissionAdd.branches,
  classes: crmSaleAdmissionAdd.classes,
  city: crmSaleAdmissionAdd.city,
  district: crmSaleAdmissionAdd.district,
});
const General = memo(({ dispatch, match: { params }, details }) => {
  const formRef = useRef();
  const mounted = useRef(false);
  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'crmSaleAdmissionAdd/UPDATE' : 'crmSaleAdmissionAdd/ADD',
      payload: params.id
        ? { ...details, ...values, id: params.id }
        : { ...values, status: 'WORKING' },
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
    <Form layout="vertical" ref={formRef} onFinish={onFinish}>
      <Pane className="card p20">
        <Pane>
          <Heading type="form-title" style={{ marginBottom: 20 }}>
            Phụ huynh Lead
          </Heading>
          <Pane className="row">
            <Pane className="col-lg-4">
              <FormItem
                name="select"
                placeholder="Chọn"
                type={variables.SELECT}
                rules={[variables.RULES.EMPTY_INPUT]}
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
                name="select"
                placeholder="Chọn"
                type={variables.SELECT}
                rules={[variables.RULES.EMPTY_INPUT]}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                name="birth_date"
                label="Ngày sinh"
                type={variables.DATE_PICKER}
                rules={[variables.RULES.EMPTY]}
                disabledDate={(current) => current > moment()}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="age" label="Tuổi hiện tại (tháng)" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                name="time"
                label="Thời gian đăng ký nhập học"
                type={variables.DATE_PICKER}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-12">
              <FormItem
                name=""
                placeholder="Nhập"
                label="Mong muốn của phụ huynh"
                type={variables.TEXTAREA}
              />
            </Pane>
            <Pane className="col-lg-12">
              <FormItem name="" placeholder="Nhập" label="Lưu ý trẻ" type={variables.TEXTAREA} />
            </Pane>
          </Pane>
        </Pane>
        <Pane className="d-flex pr-0" style={{ marginLeft: 'auto', padding: 20 }}>
          <Button color="success" size="large" htmlType="submit">
            Lưu
          </Button>
        </Pane>
      </Pane>
    </Form>
  );
});

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
};

export default withRouter(connect(mapStateToProps)(General));
