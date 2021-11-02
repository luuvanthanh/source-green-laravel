import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
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
const General = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const mounted = useRef(false);
  const loadingSubmit =
    effects[`crmSaleAdmissionAdd/ADD`] ||
    effects[`crmSaleAdmissionAdd/UPDATE`] ||
    effects[`crmSaleAdmissionAdd/UPDATE_STATUS`];
  const loading = effects[`crmSaleAdmissionAdd/GET_DETAILS`];
 
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
      {/* <Pane className="card"> */}
      <Loading loading={loading} isError={error.isError} params={{ error }}>
        <Pane className="card">
          <Pane className="border-bottom">
            <Pane className="p20">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Thông tin đăng ký
            </Heading>
            <Pane className="row">
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
                  // rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                />
              </Pane>
              <Pane className="col-lg-12">
                <FormItem
                  name=""
                  placeholder="Nhập"
                  label="Lưu ý trẻ"
                  type={variables.TEXTAREA}
                  // rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                />
              </Pane>
            </Pane>
            </Pane>
          </Pane>
          <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
            <Button color="primary" icon="export" className="ml-2">
              Xuất đơn đăng ký
            </Button>
            <Button color="success" htmlType="submit" loading={loadingSubmit} className="ml-2">
              Lưu
            </Button>
          </Pane>
        </Pane>
      </Loading>
    </Form>
  );
});

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
};

export default withRouter(connect(mapStateToProps)(General));
