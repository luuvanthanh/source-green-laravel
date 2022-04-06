import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import { variables } from '@/utils';
import { Form } from 'antd';
import { useDispatch, useSelector } from 'dva';
import React, { memo, useEffect, useState } from 'react';
import { useLocation } from 'umi';
import PropTypes from 'prop-types';

const leadStatus = [
  { id: 'LEAD_NEW', name: 'Lead mới' },
  { id: 'POTENTIAL', name: 'Có tiềm năng' },
  { id: 'NOT_POTENTIAL', name: 'Không tiềm năng' },
];

const Index = memo(({ callTimes, crmIdUser, handleOnClick }) => {
  const [
    { data, lead },
    { effects },
    { user },
  ] = useSelector(({ crmManagementCallParents, loading, user }) => [
    crmManagementCallParents,
    loading,
    user,
  ]);
  const dispatch = useDispatch();
  const { query } = useLocation();
  const [formRef] = Form.useForm();

  const [search, setSearch] = useState({
    key: query?.key,
    status_lead: query?.status_lead,
    status_type_lead: query?.status_type_lead,
    status_parent_potential_id: query?.status_parent_potential_id,
  });

  const [parentRecord, setParentRecord] = useState([]);

  useEffect(() => {
    dispatch({
      type: 'crmManagementCallParents/GET_STATUS_LEAD',
      payload: {},
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'crmManagementCallParents/GET_DATA',
      payload: {
        ...search,
        call_times: callTimes,
        employee_id: crmIdUser,
      },
    });
  }, [search, callTimes]);

  const onChangeExpected = (event, type) => {
    switch (type) {
      case 'key':
        setSearch((prevState) => ({
          ...prevState,
          [type]: event.target.record,
        }));
        break;
      case 'status_lead':
        setSearch((prevState) => ({
          ...prevState,
          [type]: event,
        }));
        break;
      case 'status_type_lead':
        setSearch((prevState) => ({
          ...prevState,
          [type]: event,
        }));
        break;
      case 'status_parent_potential_id':
        setSearch((prevState) => ({
          ...prevState,
          [type]: event,
        }));
        break;

      default:
        break;
    }
  };

  const header = () => [
    {
      title: 'STT',
      width: 50,
      align: 'center',
      className: 'min-width-50',
      render: (value, record, index) => index + 1,
    },
    {
      title: 'Họ tên',
      key: 'full_name',
      width: 200,
      className: 'min-width-200',
      render: (record) => record?.full_name,
    },
    {
      title: 'SĐT 1',
      key: 'customerLead.phone',
      width: 150,
      className: 'min-width-150',
      render: (record) => record?.phone,
    },
    {
      title: 'SĐT 2',
      key: 'other_phone',
      width: 150,
      className: 'min-width-150',
      render: (record) => record?.other_phone,
    },
    {
      title: 'Nội dung gọi',
      key: 'content',
      className: 'min-width-150',
      render: (record) => record?.content,
    },
    {
      title: 'Phân loại PH',
      key: 'statusLeadLatest',
      width: 150,
      className: 'min-width-150',
      render: (record) => variables.LEAD_STATUS[record?.statusLeadLatest[0]?.status],
    },
    {
      title: 'Tình trạng lead',
      key: 'leadStatus',
      width: 150,
      render: (record) => record?.statusCareLatest[0]?.statusParentLead?.name,
    },
    {
      title: 'Tình trạng tiềm năng',
      key: 'potentialStatus',
      width: 150,
      render: (record) => record?.customerPotential[0],
    },
    {
      title: 'Người gọi',
      key: 'saler',
      width: 150,
      render: () => user?.objectInfo?.fullName,
    },
    {
      title: 'Lần gọi',
      key: 'call_times',
      width: 150,
      render: () => variables.CALL_TIMES[callTimes],
    },
  ];

  const handleOk = () => {
    if (handleOnClick) {
      handleOnClick(parentRecord);
    }
  };

  return (
    <>
      <Form
        initialValues={{
          ...search,
          status_lead: query?.status_lead || null,
          status_type_lead: query?.status_type_lead || null,
          status_parent_potential_id: query?.status_parent_potential_id || null,
        }}
        layout="vertical"
        form={formRef}
      >
        <div className="row">
          <div className="col-lg-3">
            <FormItem
              className="ant-form-item-row"
              name="key"
              type={variables.INPUT_SEARCH}
              placeholder="Từ khóa tìm kiếm"
              onChange={(event) => onChangeExpected(event, 'key')}
            />
          </div>
          <div className="col-lg-3">
            <FormItem
              className="ant-form-item-row"
              data={[{ id: null, name: 'Tất cả phân loại PH' }, ...leadStatus]}
              name="status_lead"
              onChange={(event) => onChangeExpected(event, 'status_lead')}
              type={variables.SELECT}
              allowClear={false}
            />
          </div>
          <div className="col-lg-3">
            <FormItem
              className="ant-form-item-row"
              data={[{ id: null, name: 'Tất cả tình trạng Lead' }, ...lead]}
              name="status_type_lead"
              onChange={(event) => onChangeExpected(event, 'status_type_lead')}
              type={variables.SELECT}
              allowClear={false}
            />
          </div>
          <div className="col-lg-3">
            <FormItem
              className="ant-form-item-row"
              data={[{ id: null, name: 'Tất cả tình trạng tiềm năng' }]}
              name="status_parent_potential_id"
              onChange={(event) => onChangeExpected(event, 'status_parent_potential_id')}
              type={variables.SELECT}
              allowClear={false}
            />
          </div>
        </div>
      </Form>
      <Table
        bordered
        columns={header()}
        isEmpty
        dataSource={data}
        loading={effects['crmManagementCallParents/GET_DATA']}
        pagination={false}
        rowSelection={{
          onChange: (id, record) => {
            setParentRecord(record);
          },
          getCheckboxProps: (record) => ({
            full_name: record.full_name,
          }),
        }}
        params={{
          header: header(),
          type: 'table',
        }}
        rowKey={(record) => record.id}
        scroll={{ x: '100%' }}
      />
      <div className="d-flex justify-content-end mt20">
        <Button htmlType="submit" color="success" type="primary" onClick={handleOk}>
          Áp dụng
        </Button>
      </div>
    </>
  );
});

Index.propTypes = {
  callTimes: PropTypes.string,
  crmIdUser: PropTypes.string,
  handleOnClick: PropTypes.func,
};

Index.defaultProps = {
  callTimes: '',
  crmIdUser: '',
  handleOnClick: () => {},
};

export default Index;
