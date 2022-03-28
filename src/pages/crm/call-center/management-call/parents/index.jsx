import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import { Helper, variables } from '@/utils';
import { Form } from 'antd';
import { useDispatch, useSelector } from 'dva';
import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'umi';

const Index = memo(() => {
  const [
    { data, pagination },
    { effects },
  ] = useSelector(({ crmManagementCallParents, loading }) => [crmManagementCallParents, loading]);
  const dispatch = useDispatch();
  const { pathname, query } = useLocation();
  const history = useHistory();
  const [formRef] = Form.useForm();

  const [search, setSearch] = useState({
    keyWord: query?.keyWord,
    typeId: query?.typeId,
    statusId: query?.statusId,
    potentialId: query?.potentialId,
  });

  const onLoad = () => {
    dispatch({
      type: 'crmManagementCallParents/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({ ...search }),
    });
  };

  useEffect(() => {
    onLoad();
  }, [search]);

  const onChangeExpected = (event, type) => {
    switch (type) {
      case 'keyWord':
        setSearch((prevState) => ({
          ...prevState,
          [type]: event.target.value,
        }));
        break;
      case 'timetableSettingId':
        setSearch((prevState) => ({
          ...prevState,
          [type]: event,
        }));
        break;
      case 'classId':
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
      key: 'phone',
      width: 150,
      className: 'min-width-150',
      render: (record) => record?.phone,
    },
    {
      title: 'SĐT 2',
      key: 'class',
      width: 150,
      dataIndex: 'class',
      className: 'min-width-150',
      render: (value) => value?.name,
    },
    {
      title: 'Nội dung gọi',
      key: 'age',
      dataIndex: 'age',
      className: 'min-width-150',
      render: (value) => value?.name,
    },
    {
      title: 'Nội dung gọi',
      key: 'date',
      className: 'min-width-150',
      render: (value) => Helper.getDate(value?.registerDate, variables.DATE_FORMAT.DATE_VI),
    },
    {
      title: 'Phân loại PH',
      key: 'branch',
      width: 150,
      className: 'min-width-150',
      render: (value) => value?.class?.branch?.name,
    },
    {
      title: 'Tình trạng lead',
      key: 'branch',
      width: 150,
      className: 'min-width-150',
      render: (value) => value?.class?.branch?.name,
    },
    {
      title: 'Tình trạng tiềm năng',
      key: 'branch',
      width: 150,
      className: 'min-width-150',
      render: (value) => value?.class?.branch?.name,
    },
    {
      title: 'Người gọi',
      key: 'branch',
      width: 150,
      className: 'min-width-150',
      render: (value) => value?.class?.branch?.name,
    },
    {
      title: 'Lần gọi',
      key: 'branch',
      width: 150,
      className: 'min-width-150',
      render: (value) => value?.class?.branch?.name,
    },
  ];

  const changePagination = ({ page, limit }) => {
    setSearch(
      (prev) => ({
        ...prev,
        page,
        limit,
      }),
      () => {
        onLoad();
      },
    );
  };

  const paginationFunction = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        changePagination(response);
      },
    });

  return (
    <>
      <Helmet title="Thống kê tiệm cận" />
      <Form
        initialValues={{
          ...search,
          typeId: query?.typeId || null,
          statusId: query?.statusId || null,
          potentialId: query?.potentialId || null,
        }}
        layout="vertical"
        form={formRef}
      >
        <div className="row">
          <div className="col-lg-3">
            <FormItem
              className="ant-form-item-row"
              name="keyWord"
              type={variables.INPUT_SEARCH}
              placeholder="Từ khóa tìm kiếm"
              onChange={(event) => onChangeExpected(event, 'keyWord')}
            />
          </div>
          <div className="col-lg-3">
            <FormItem
              className="ant-form-item-row"
              data={[{ id: null, name: 'Tất cả phân loại PH' }]}
              name="typeId"
              onChange={(event) => onChangeExpected(event, 'typeId')}
              type={variables.SELECT}
              allowClear={false}
            />
          </div>
          <div className="col-lg-3">
            <FormItem
              className="ant-form-item-row"
              data={[{ id: null, name: 'Tất cả tình trạng Lead' }]}
              name="statusId"
              onChange={(event) => onChangeExpected(event, 'statusId')}
              type={variables.SELECT}
              allowClear={false}
            />
          </div>
          <div className="col-lg-3">
            <FormItem
              className="ant-form-item-row"
              data={[{ id: null, name: 'Tất cả tình trạng tiềm năng' }]}
              name="potentialId"
              onChange={(event) => onChangeExpected(event, 'potentialId')}
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
        pagination={paginationFunction(pagination)}
        rowSelection={{
          getCheckboxProps: (record) => ({ name: record.name }),
        }}
        params={{
          header: header(),
          type: 'table',
        }}
        rowKey={(record) => record.id}
        scroll={{ x: '100%' }}
      />
    </>
  );
});

export default Index;
