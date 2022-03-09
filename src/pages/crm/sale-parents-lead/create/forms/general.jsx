import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';

import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';
import { Helper, variables } from '@/utils';
import Text from '@/components/CommonComponent/Text';
import { useDispatch } from 'dva';

import FormItem from '@/components/CommonComponent/FormItem';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import stylesModule from '../../styles.module.scss';

const marginProps = { style: { marginBottom: 12 } };
const mapStateToProps = ({ loading, crmSaleLeadAdd }) => ({
  loading,
  details: crmSaleLeadAdd.details,
  error: crmSaleLeadAdd.error,
  branches: crmSaleLeadAdd.branches,
  classes: crmSaleLeadAdd.classes,
});
const General = memo(({ loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const mounted = useRef(false);
  const [dataUser, setDataUser] = useState([]);
  const loading = effects[`crmSaleLeadAdd/GET_DETAILS`];
  const dispatch = useDispatch();
  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const loadingSubmit =
    effects[`crmSaleAssignment/ASSIGNMENT`];

  /**
      * Function submit form modal
      * @param {object} values values of form
      */
  const onFinish = (values) => {
    dispatch({
      type: 'crmSaleAssignment/ASSIGNMENT',
      payload: [{ employee_id: values.employee_id, customer_lead_id: params.id, employee_info: dataUser.find((item) => item.id === values.employee_id) }],
      callback: (response, error) => {
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
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        ...details,
        ...head(details.searchSource),
        search_source: head(details.searchSource)?.name,
        created_at: details.created_at && moment(details.created_at),
        updated_at: details.updated_at && moment(details.updated_at),
      });
    }
  }, [details]);
  useEffect(() => {
    dispatch({
      type: 'crmSaleAssignment/GET_EMPLOYEES',
      callback: (response) => {
        if (response) {
          setDataUser(response?.parsePayload);
        }
      },
    });
    if (params.id) {
      dispatch({
        type: 'crmSaleLeadAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);
  return (
    <Form layout="vertical" ref={formRef} onFinish={onFinish}>
      <Pane className="card">
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Thông tin chung
            </Heading>

            <div className="row" {...marginProps}>
              <div className="col-lg-4">
                <div className="ant-col ant-form-item-label">
                  <label className="ant-form-item-required">Người tạo</label>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="ant-col ant-form-item-label">
                  <label className="ant-form-item-required">Ngày khởi tạo</label>
                </div>
                <Text size="normal" className={stylesModule['general-detail']}>
                  {Helper.getDate(details.created_at, variables.DATE_FORMAT.DATE)}
                </Text>
              </div>
              <div className="col-lg-4">
                <div className="ant-col ant-form-item-label">
                  <label className="ant-form-item-required">Ngày cập nhật</label>
                </div>
                <Text size="normal" className={stylesModule['general-detail']}>
                  {Helper.getDate(details.updated_at, variables.DATE_FORMAT.DATE)}
                </Text>
              </div>

              <div className="col-lg-4">
                <div className="ant-col ant-form-item-label">
                  <label className="ant-form-item-required">Nhân viên chăm sóc</label>
                </div>
                <FormItem
                  options={['id', 'full_name']}
                  data={dataUser}
                  name="employee_id"
                  placeholder="Chọn"
                  type={variables.SELECT}
                />
              </div>
              <div className="col-lg-4">
                <div className="ant-col ant-form-item-label">
                  <label className="ant-form-item-required">Tình trạng chăm sóc lead</label>
                </div>
                <div size="normal" className={stylesModule['general-detail']}>
                  {details?.statusCare
                    ?.map((item, index) => (
                      <Text size="normal" key={index} className={stylesModule['general-detail']}>
                        {get(item, 'statusParentLead.name')}
                      </Text>
                    ))
                    .pop()}
                </div>
              </div>
            </div>
          </Pane>
          <Pane className="p20 d-flex flex-row-reverse ">
            <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
              Lưu
            </Button>
          </Pane>
        </Loading>
      </Pane>
    </Form>
  );
});

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
  branches: [],
  classes: [],
};

export default withRouter(connect(mapStateToProps)(General));
