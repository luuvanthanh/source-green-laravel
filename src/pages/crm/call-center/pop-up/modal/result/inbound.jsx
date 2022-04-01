import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import { Form } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { head, isEmpty } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../style.module.scss';

const leadStatus = [
  { id: 'LEAD_NEW', name: 'Lead mới' },
  { id: 'POTENTIAL', name: 'Có tiềm năng' },
  { id: 'NOT_POTENTIAL', name: 'Không tiềm năng' },
];

const InboundResult = memo(({ handleOnClick, inboundHistory, infoFromInbound, contentInbound }) => {
  const [user] = useSelector(({ user }) => [user]);

  const [formRef] = Form.useForm();
  const dispatch = useDispatch();
  const [parentLeadStatus, setParentLeadStatus] = useState([]);
  const [parentPotentialsStatus, setParentPotentialsStatus] = useState([]);
  const [crmIdUser, setCrmIdUser] = useState('');
  const [checkStatusLead, setCheckStatusLead] = useState(
    head(infoFromInbound?.statusLeadLatest)?.status,
  );

  const handleInboundResult = () => {
    if (handleOnClick) {
      handleOnClick();
    }
  };

  const onLoad = () => {
    dispatch({
      type: 'crmCallCenter/PARENT_LEAD_STATUS',
      callback: (response) => {
        if (response) {
          setParentLeadStatus(response.parsePayload);
        }
      },
    });
    dispatch({
      type: 'crmCallCenter/PARENT_POTENTIALS_STATUS',
      callback: (response) => {
        if (response) {
          setParentPotentialsStatus(response.parsePayload);
        }
      },
    });
    dispatch({
      type: 'crmCallCenter/GET_CRM_ID',
      payload: {
        employee_id_hrm: user.objectInfo?.id,
      },
      callback: (response) => {
        if (response) {
          setCrmIdUser(head(response.parsePayload).id);
        }
      },
    });
  };

  useEffect(() => {
    onLoad();
    if (infoFromInbound.id) {
      formRef.setFieldsValue({
        status_parent_lead_id: head(infoFromInbound?.statusCareLatest)?.statusParentLead.id,
        status_lead: head(infoFromInbound?.statusLeadLatest)?.status,
        status_parent_potential_id: head(infoFromInbound?.customerPotential)?.id,
      });
    }
  }, [infoFromInbound]);

  const changeStatusLead = (e) => {
    setCheckStatusLead(e);
  };

  const onFinish = () => {
    formRef.validateFields().then((values) => {
      const payload = {
        result: values.result && values.result,
        content: contentInbound && contentInbound,
        status_lead: values.status_lead && values.status_lead,
        status_parent_lead_id: values.status_parent_lead_id && values.status_parent_lead_id,
        customer_lead_id: infoFromInbound.customer_lead_id && infoFromInbound.customer_lead_id,
        status_parent_potential_id:
          values.status_parent_potential_id && values.status_parent_potential_id,
        history_call_id: inboundHistory.id && inboundHistory.id,
        call_type: inboundHistory.direction && inboundHistory.direction,
        call_id_sub: inboundHistory.call_id_sub && inboundHistory.call_id_sub,
        employee_id: crmIdUser,
      };
      dispatch({
        type: 'crmCallCenter/ADD',
        payload,
        callback: (response, error) => {
          if (response) {
            formRef.resetFields();
          }
          if (error) {
            if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
              error?.validationErrors.forEach((item) => {
                formRef.setFields([
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
    });
  };

  return (
    <Form className="row" form={formRef} onFinish={onFinish}>
      <div className="col-lg-12 mb20 p0">
        {infoFromInbound?.full_name ? (
          <p className={styles['call-result-info']}>
            {infoFromInbound.full_name} - {infoFromInbound.phone}
          </p>
        ) : (
          <p className={styles['call-result-info']}>Không xác định - {infoFromInbound.number}</p>
        )}
      </div>
      <div className="col-lg-12 p0">
        <FormItem
          data={[...parentLeadStatus]}
          label="Phân loại phụ huynh"
          name="status_parent_lead_id"
          type={variables.SELECT}
          allowClear={false}
          disabled={infoFromInbound.number}
        />
      </div>
      <div className="col-lg-12 p0 mt10">
        <FormItem
          data={[...leadStatus]}
          label="Tình trạng Lead"
          name="status_lead"
          type={variables.SELECT}
          allowClear={false}
          disabled={infoFromInbound.number}
          onChange={(e) => changeStatusLead(e)}
        />
      </div>
      <div className="col-lg-12 p0 mt10">
        <FormItem
          data={[...parentPotentialsStatus]}
          label="Tình trạng Tiềm năng (Chặng sale)"
          name="status_parent_potential_id"
          type={variables.SELECT}
          allowClear={false}
          disabled={checkStatusLead !== 'POTENTIAL'}
        />
      </div>
      <div className="col-lg-12 p0 mt10">
        <FormItem
          label="Kết quả cuộc gọi"
          placeholder="Kết quả cuộc gọi"
          name="result"
          type={variables.TEXTAREA}
          rules={[variables.RULES.MAX_LENGTH_INPUT]}
          showCount={false}
        />
      </div>
      <div className="col-lg-12 p0 mt30 d-flex justify-content-end">
        <Button htmlType="submit" color="success" type="primary" onClick={handleInboundResult}>
          Lưu
        </Button>
      </div>
    </Form>
  );
});

InboundResult.propTypes = {
  handleOnClick: PropTypes.func,
  inboundHistory: PropTypes.object,
  infoFromInbound: PropTypes.any,
  contentInbound: PropTypes.any,
};

InboundResult.defaultProps = {
  handleOnClick: () => {},
  inboundHistory: {},
  infoFromInbound: null,
  contentInbound: null,
};

export default InboundResult;
