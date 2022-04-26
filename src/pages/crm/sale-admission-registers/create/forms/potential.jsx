import { memo, useRef, useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, withRouter,history } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from '../../styles.module.scss';


const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
  loading,
  details: crmSaleAdmissionAdd.details,
  error: crmSaleAdmissionAdd.error,
  branches: crmSaleAdmissionAdd.branches,
  classes: crmSaleAdmissionAdd.classes,
  students: crmSaleAdmissionAdd.students,
});
const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, branches }) => {
    const formRef = useRef();
    const mounted = useRef(false);
    const [description, setDescription] = useState('');
    const [result, setResult] = useState('');

    // const [ramdom, setRamdom] = useState(0);
    const loadingSubmit =
      effects[`crmSaleAdmissionAdd/UPDATE_STUDENTS`];
    const loading = effects[`crmSaleAdmissionAdd/GET_DETAILS_ID`];
    useEffect(() => {
      if (params.id) {
        dispatch({
          type: 'crmSaleAdmissionAdd/GET_DETAILS_ID',
          payload: params,
          callback: (response) => {
            if (response) {
              setDescription(response?.parent_wish);
              setResult(response?.children_note);
            }
          },
        });
        dispatch({
          type: 'crmSaleAdmissionAdd/GET_BRANCHES',
          payload: {},
        });
      }
    }, [params.id]);

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = (values) => {
      dispatch({
        type: 'crmSaleAdmissionAdd/UPDATE_STUDENTS',
        payload: { ...details, ...values, id: params.id },
        callback: (response, error) => {
          // if (response) {
          //   setRamdom(Math.random());
          // }
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

    const onCancel = () => {
      dispatch({
        type: 'crmSaleAdmissionAdd/DELETE_REGISTERS',
        payload: { status: true, register_status: "CANCEL_REGISTER", id: params.id },
        callback: (response, error) => {
          if (response) {
            history.push('/crm/sale/dang-ky-nhap-hoc');
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

    useEffect(() => {
      if (!isEmpty(details) && params.id) {
        formRef.current.setFieldsValue({
          ...details,
          ...head(details.positionLevel),

          startDate:
            head(details.positionLevel)?.startDate &&
            moment(head(details.positionLevel)?.startDate),
          date_register: details.date_register && moment(details.date_register),
        });
      }
    }, [details]);

    return (
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Pane className="card">
          <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Thông tin đăng ký
            </Heading>
            {
              details?.disable_status ?
                <Pane className="row">
                  <Pane className="col-lg-4">
                    <FormItem
                      name="date_register"
                      label="Thời gian đăng ký nhập học"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormItem
                      name="branch_id"
                      label="Cơ sở"
                      data={branches}
                      type={variables.SELECT}
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
                </Pane> :
                <Pane className={stylesModule['disabled-container']}>
                  <Pane className="row">
                    <Pane className="col-lg-4">
                      <FormItem
                        name="date_register"
                        label="Thời gian đăng ký nhập học"
                        type={variables.DATE_PICKER}
                        rules={[variables.RULES.EMPTY]}
                        disabled
                      />
                    </Pane>
                    <Pane className="col-lg-4">
                      <FormItem
                        name="branch_id"
                        label="Cơ sở"
                        data={branches}
                        type={variables.SELECT}
                        disabled
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span>Mong muốn của phụ huynh</span>
                        </label>
                      </Pane>
                      <Input.TextArea
                        value={description}
                        placeholder=" "
                        className='mb15'
                        autoSize={{ minRows: 5, maxRows: 5 }}
                        rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                        type={variables.TEXTAREA}
                        disabled
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span>Lưu ý trẻ</span>
                        </label>
                      </Pane>
                      <Input.TextArea
                        value={result}
                        placeholder=" "
                        className='mb15'
                        autoSize={{ minRows: 5, maxRows: 5 }}
                        rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                        type={variables.TEXTAREA}
                        disabled
                      />
                    </Pane>
                  </Pane>
                </Pane>
            }
          </Pane>
          <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
            {
              details?.disable_status &&  details?.register_status !== "CANCEL_REGISTER" ?
                <>
                  <Button color="success" size="large" loading={effects['crmMarketingManageAdd/DELETE_REGISTERS']} className="mr10" onClick={onCancel}>
                    Huỷ đăng ký
                  </Button>
                  <Button color="success" size="large" htmlType="submit" loading={loadingSubmit || loading}>
                    Lưu
                  </Button>
                </> : ""
            }
          </Pane>
        </Pane>
      </Form>
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  branches: [],
};

export default withRouter(connect(mapStateToProps)(General));
