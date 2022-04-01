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

const OutboundResult = memo(
  ({ handleOnClick, outboundHistory, infoFromOutbound, contentOutbound }) => {
    const [user] = useSelector(({ user }) => [user]);

    const [formRef] = Form.useForm();
    const dispatch = useDispatch();
    const [parentLeadStatus, setParentLeadStatus] = useState([]);
    const [parentPotentialsStatus, setParentPotentialsStatus] = useState([]);
    const [crmIdUser, setCrmIdUser] = useState('');
    const [checkStatusLead, setCheckStatusLead] = useState(
      head(infoFromOutbound?.statusLeadLatest)?.status,
    );

    const handleOutboundResult = () => {
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
      if (infoFromOutbound.id) {
        formRef.setFieldsValue({
          status_parent_lead_id: head(infoFromOutbound?.statusCareLatest)?.statusParentLead.id,
          status_lead: head(infoFromOutbound?.statusLeadLatest)?.status,
          status_parent_potential_id: head(infoFromOutbound?.customerPotential)?.id,
        });
      }
    }, [infoFromOutbound]);

    const changeStatusLead = (e) => {
      setCheckStatusLead(e);
    };

    const onFinish = () => {
      formRef.validateFields().then((values) => {
        const payload = {
          result: values.result && values.result,
          content: contentOutbound && contentOutbound,
          status_lead: values.status_lead && values.status_lead,
          status_parent_lead_id: values.status_parent_lead_id && values.status_parent_lead_id,
          status_parent_potential_id:
            values.status_parent_potential_id && values.status_parent_potential_id,
          call_type: 'OUTBOUND',
          call_id_sub: outboundHistory.callId && outboundHistory.callId,
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
          {infoFromOutbound?.full_name ? (
            <p className={styles['call-result-info']}>
              {infoFromOutbound.full_name} - {infoFromOutbound.phone}
            </p>
          ) : (
            <p className={styles['call-result-info']}>Không xác định - {infoFromOutbound.number}</p>
          )}
        </div>
        <div className="col-lg-12 p0">
          <FormItem
            data={[...parentLeadStatus]}
            label="Phân loại phụ huynh"
            name="status_parent_lead_id"
            type={variables.SELECT}
            allowClear={false}
            disabled={infoFromOutbound.number}
          />
        </div>
        <div className="col-lg-12 p0 mt10">
          <FormItem
            data={[...leadStatus]}
            label="Tình trạng Lead"
            name="status_lead"
            type={variables.SELECT}
            allowClear={false}
            disabled={infoFromOutbound.number}
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
            name="content"
            type={variables.TEXTAREA}
            rules={[variables.RULES.MAX_LENGTH_INPUT]}
            showCount={false}
          />
        </div>
        <div className="col-lg-12 p0 mt30 d-flex justify-content-end">
          <Button htmlType="submit" color="success" type="primary" onClick={handleOutboundResult}>
            Lưu
          </Button>
        </div>
      </Form>
    );
  },
);

OutboundResult.propTypes = {
  handleOnClick: PropTypes.func,
  outboundHistory: PropTypes.object,
  infoFromOutbound: PropTypes.any,
  contentOutbound: PropTypes.any,
};

OutboundResult.defaultProps = {
  handleOnClick: () => {},
  outboundHistory: {},
  infoFromOutbound: null,
  contentOutbound: null,
};

export default OutboundResult;
