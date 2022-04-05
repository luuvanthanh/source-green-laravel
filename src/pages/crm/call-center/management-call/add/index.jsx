import React, { memo, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'umi';
import { Form, Modal } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get, head, isEmpty } from 'lodash';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Loading from '@/components/CommonComponent/Loading';
import Table from '@/components/CommonComponent/Table';
import { useDispatch, useSelector } from 'dva';
import Heading from '@/components/CommonComponent/Heading';
import Parents from '../parents';
import moment from 'moment';

const dataHour = (n) => {
  const allHour = [];
  for (let i = 1; i < n + 1; i += 1) {
    allHour.push({ id: i, name: `${i} giờ` });
  }
  return allHour.map((i, id) => ({ id, ...i }));
};

const Index = memo(() => {
  const [formRef] = Form.useForm();
  const dispatch = useDispatch();
  const { params } = useRouteMatch();
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [crmIdUser, setCrmIdUser] = useState('');
  const [parentLead, setParentLead] = useState([]);

  const [
    { error },
    loading,
    { menuLeftCRM },
    { user },
  ] = useSelector(({ loading: { effects }, seasonalContractsAdd, menu, user }) => [
    seasonalContractsAdd,
    effects,
    menu,
    user,
  ]);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'seasonalContractsAdd/GET_DETAILS',
        payload: {
          id: params.id,
        },
        callback: () => {},
      });
    } else {
      dispatch({
        type: 'crmCallCenter/GET_CRM_ID',
        payload: {
          employee_id_hrm: user.objectInfo?.id,
        },
        callback: (response) => {
          if (response) {
            setCrmIdUser(head(response.parsePayload).id);
            formRef.setFieldsValue({
              employee_id: head(response.parsePayload).full_name,
            });
          }
        },
      });
    }
  }, []);

  const onRemove = (id) => {
    setParentLead((prev) => prev.filter((item) => item.id !== id));
  };

  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'code',
        align: 'center',
        className: 'min-width-80',
        width: 80,
        render: (value, record, index) => index + 1,
      },
      {
        title: 'Họ và tên',
        key: 'name',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'full_name'),
      },
      {
        title: 'SĐT 1',
        key: 'phone',
        width: 100,
        className: 'min-width-100',
        render: (record) => get(record, 'phone'),
      },
      {
        title: 'SĐT 2',
        key: 'phone_company',
        width: 100,
        className: 'min-width-100',
        render: (record) => get(record, 'phone_company'),
      },
      {
        title: 'Phân loại PH',
        key: 'statusLeadLatest',
        width: 100,
        className: 'min-width-100',
        render: (record) => variables.LEAD_STATUS[record?.statusLeadLatest[0]?.status],
      },
      {
        title: 'Tình trạng PH Lead',
        key: 'leadStatus',
        width: 150,
        className: 'min-width-150',
        render: (record) => record?.statusCareLatest[0]?.statusParentLead?.name,
      },
      {
        title: 'Tình trạng TN',
        key: 'potentialStatus',
        width: 100,
        className: 'min-width-100',
        render: (record) => record?.customerPotential[0],
      },
      {
        title: 'Lần đã gọi',
        key: 'call_times',
        width: 100,
        className: 'min-width-100',
        render: () => variables.CALL_TIMES[formRef.getFieldValue().call_times],
      },
      {
        key: 'actions',
        width: 50,
        className: 'min-width-50',
        align: 'center',
        render: (record) => (
          <ul className="list-unstyled list-inline">
            <li className="list-inline-item">
              <Button
                color="danger"
                icon="remove"
                className="ml-2"
                onClick={() => onRemove(record.id)}
              />
            </li>
          </ul>
        ),
      },
    ];
    return columns;
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddParent = (record) => {
    setParentLead(record);
    setIsModalVisible(false);
  };

  const onFinish = () => {
    formRef.validateFields().then((values) => {
      const payload = {
        ...values,
        expected_date: moment(values.expected_date).format(variables.DATE_FORMAT.DATE_AFTER),
        received_data: moment().format(variables.DATE_FORMAT.DATE_AFTER),
        employee_id: crmIdUser,
        list_customer_lead: parentLead.map((item) => ({ customer_lead_id: item.id })),
      };

      dispatch({
        type: 'crmManagementCallAdd/ADD',
        payload,
        callback: (response, error) => {
          if (response) {
            history.goBack();
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
    <>
      <Breadcrumbs last="Tạo mới" menu={menuLeftCRM} />
      <Form className={styles['layout-form']} layout="vertical" form={formRef} onFinish={onFinish}>
        <div className={styles['content-form']}>
          <Loading
            isError={error.isError}
            params={{ error, type: 'container', goBack: '/quan-ly-nhan-su/hop-dong-thoi-vu' }}
          >
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className={classnames(styles['content-children'], 'mt0')}>
                  <Heading type="form-title" className="mb15">
                    Thông tin chung
                  </Heading>
                  <div className="row">
                    <div className="col-lg-4">
                      <FormItem
                        label="Ngày dự kiến gọi"
                        name="expected_date"
                        type={variables.DATE_PICKER}
                      />
                    </div>
                    <div className="col-lg-4">
                      <FormItem
                        label="Người gọi"
                        name="employee_id"
                        type={variables.INPUT}
                        disabled
                      />
                    </div>
                    <div className="col-lg-4">
                      <FormItem
                        label="Lần gọi"
                        name="call_times"
                        type={variables.SELECT}
                        data={variables.CALL_TIME}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                      <FormItem label="Nội dung cuộc gọi" name="content" type={variables.INPUT} />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-4">
                      <FormItem
                        label="Nhắc trước"
                        name="before_time"
                        type={variables.SELECT}
                        data={dataHour(24)}
                      />
                    </div>
                  </div>
                </div>

                <div className={classnames(styles['content-children'], 'mt15')}>
                  <div className="d-flex justify-content-between align-items-center mb15">
                    <Heading type="form-title">Phụ huynh</Heading>
                    <Button color="success" icon="plus" className="ml-2" onClick={showModal}>
                      Thêm phụ huynh
                    </Button>
                    <Modal
                      title="Chọn phụ huynh"
                      className={styles['wrapper-modal-management-call']}
                      centered
                      visible={isModalVisible}
                      onCancel={handleCancel}
                      width={1300}
                      footer={null}
                    >
                      <Parents
                        handleOnClick={handleAddParent}
                        callTimes={formRef.getFieldValue().call_times}
                        crmIdUser={crmIdUser}
                        parentLead={parentLead}
                      />
                    </Modal>
                  </div>
                  <Table
                    columns={header()}
                    dataSource={parentLead}
                    pagination={false}
                    className={classnames('mb15', styles['statistical-table'])}
                    isEmpty
                    params={{
                      header: header(),
                      type: 'table',
                    }}
                    bordered
                    rowKey={(record) => record.id}
                    scroll={{ x: '100%' }}
                  />
                </div>

                <div className={classnames('d-flex', 'justify-content-between', 'mt-4')}>
                  <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                    Hủy
                  </p>
                  <Button
                    color="success"
                    htmlType="submit"
                    loading={
                      loading['seasonalContractsAdd/ADD'] || loading['seasonalContractsAdd/UPDATE']
                    }
                  >
                    Lưu
                  </Button>
                </div>
              </div>
            </div>
          </Loading>
        </div>
      </Form>
    </>
  );
});

export default Index;
