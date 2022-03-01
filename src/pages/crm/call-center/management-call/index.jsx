import styles from '@/assets/styles/Common/common.scss';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import { Helper, variables } from '@/utils';
import { Form } from 'antd';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'dva';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation, useRouteMatch } from 'umi';

const checkboxArr = [
  { id: 1, name: 'Tất cả' },
  { id: 2, name: 'Chưa có lịch gọi' },
  { id: 3, name: 'Gọi lần 1' },
  { id: 4, name: 'Gọi lần 2' },
  { id: 5, name: 'Gọi lần 3' },
  { id: 6, name: 'Gọi lần 4' },
  { id: 7, name: 'Gọi lần 5' },
  { id: 8, name: 'Overtime' },
  { id: 9, name: 'Chưa gọi' },
  { id: 10, name: 'Đã gọi' },
];

const Index = () => {
  const [
    { data, pagination },
    loading,
  ] = useSelector(({ loading: { effects }, crmHistoryCall }) => [crmHistoryCall, effects]);
  const { query, pathname } = useLocation();
  const { params } = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const [formRef] = Form.useForm();
  const [search, setSearch] = useState({
    key: query?.key,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  });

  const onLoad = () => {
    dispatch({
      type: 'crmHistoryCall/GET_DATASOURCE',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  };

  const loadCategories = () => {
    dispatch({
      type: 'crmHistoryCall/GET_EMPLOYEES',
      payload: {},
    });
  };

  useEffect(() => {
    onLoad();
    loadCategories();
  }, []);

  const debouncedSearch = debounce((value, type) => {
    setSearch(
      (prev) => ({
        ...prev,
        [`${type}`]: value,
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
      }),
      () => onLoad(),
    );
  }, 300);

  const onChange = (e, type) => {
    debouncedSearch(e.target.value, type);
  };

  const onChangeSelect = (e, type) => {
    debouncedSearch(e, type);
  };

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
    Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        changePagination(response);
      },
    });

  const header = () => {
    const columns = [
      {
        title: 'STT ',
        key: 'index',
        width: 80,
        render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
      },
      {
        title: 'Ngày nhận data',
        key: 'received_date',
        width: 150,
        render: (record) => record?.received_date,
      },
      {
        title: 'Ngày dự kiến gọi',
        key: 'estimated_date',
        width: 150,
        render: (record) => record?.estimated_date,
      },
      {
        title: 'Ngày gọi',
        key: 'calling_date',
        width: 150,
        render: (record) => record?.calling_date,
      },
      {
        title: 'Họ tên',
        key: 'name',
        width: 150,
        render: (record) => record?.name,
      },
      {
        title: 'SĐT 1',
        key: 'phone_number_1',
        width: 150,
        render: (record) => record?.phone_number_1,
      },
      {
        title: 'SĐT 2',
        key: 'phone_number_2',
        width: 150,
        render: (record) => record?.phone_number_2,
      },
      {
        title: 'Nội dung gọi ',
        key: 'content',
        width: 150,
        render: (record) => record?.content,
      },
      {
        title: 'Phân loại PH',
        key: 'parents',
        width: 150,
        render: (record) => record?.parents,
      },
      {
        title: 'Tình trạng lead',
        key: 'leadStatus',
        width: 150,
        render: (record) => record?.leadStatus,
      },
      {
        title: 'Tình trạng tiềm năng',
        key: 'potentialStatus',
        width: 150,
        render: (record) => record?.potentialStatus,
      },
      {
        title: 'Người gọi',
        key: 'saler',
        width: 150,
        render: (record) => record?.saler,
      },
      {
        title: 'Lần gọi',
        key: 'number_calls',
        width: 150,
        render: (record) => record?.number_calls,
      },
      {
        title: 'Trạng thái',
        key: 'status',
        width: 150,
        render: (record) => record?.status,
      },
      {
        title: 'Ghi âm',
        key: 'record',
        width: 150,
        render: (record) => record?.record,
      },
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Quản lý lịch gọi" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark">Quản lý lịch gọi</Text>
          <Button
            color="success"
            icon="plus"
            onClick={() => history.push(`${pathname}/tao-moi`)}
            className="ml-2"
          >
            Tạo mới
          </Button>
        </div>
        <div className={styles['block-table']}>
          <Form
            initialValues={{
              ...search,
              parents: query?.parents || null,
              leadStatus: query?.leadStatus || null,
              potentialStatus: query?.potentialStatus || null,
              employee: query?.employee || null,
            }}
            layout="vertical"
            form={formRef}
          >
            <div className="row">
              <div className="col-lg-3">
                <FormItem
                  name="key"
                  onChange={(e) => onChange(e, 'key')}
                  placeholder="Số điện thoại"
                  type={variables.INPUT_SEARCH}
                />
              </div>
              <div className="col-lg-6">
                <FormItem
                  name="date"
                  onChange={(e) => onChangeSelect(e, 'date')}
                  placeholder="Nhập từ khóa"
                  type={variables.RANGE_DATETIME_PICKER}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Phân loại PH' }]}
                  name="parents"
                  onChange={(e) => onChangeSelect(e, 'parents_id')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tình trạng lead' }]}
                  name="leadStatus"
                  onChange={(e) => onChangeSelect(e, 'leadStatus_id')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tình trạng tiềm năng' }]}
                  name="potentialStatus"
                  onChange={(e) => onChangeSelect(e, 'potentialStatus_id')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả nhân viên' }]}
                  name="employee"
                  onChange={(e) => onChangeSelect(e, 'employee_id')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 d-flex">
                {checkboxArr.map((item) => (
                  <FormItem
                    key={item.id}
                    name={item.id}
                    className={classnames('checkbox-small', styles['list-checkbox-form'])}
                    label={item.name}
                    type={variables.CHECKBOX_FORM}
                    valuePropName="checked"
                  />
                ))}
              </div>
            </div>
          </Form>
          <Table
            bordered={false}
            columns={header(params)}
            dataSource={data}
            loading={loading['crmSaleParentsLead/GET_DATA']}
            disabled
            pagination={paginationFunction(pagination)}
            params={{
              header: header(),
              type: 'table',
            }}
            rowKey={(record) => record.id}
            scroll={{ x: '100%', y: 'calc(100vh - 150px)' }}
          />
        </div>
      </div>
    </>
  );
};

export default Index;
