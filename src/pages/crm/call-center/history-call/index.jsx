import styles from '@/assets/styles/Common/common.scss';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Form } from 'antd';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'dva';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation, useRouteMatch } from 'umi';

const Index = () => {
  const [
    { data, pagination },
    loading,
  ] = useSelector(({ loading: { effects }, CRMHistoryCall }) => [CRMHistoryCall, effects]);
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
      type: 'CRMHistoryCall/GET_DATASOURCE',
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
        title: 'Ngày giờ gọi',
        key: 'call_date',
        width: 150,
        render: (record) => record?.call_date,
      },
      {
        title: 'Loại cuộc gọi',
        key: 'call_type',
        width: 150,
        render: (record) => record?.call_type,
      },
      {
        title: 'Tổng đài',
        key: 'switchboard',
        width: 150,
        render: (record) => record?.switchboard,
      },
      {
        title: 'Số nhánh',
        key: 'branchRedirect',
        width: 150,
        render: (record) => record?.branchRedirect,
      },
      {
        title: 'Số điện thoại',
        key: 'phone_number',
        width: 150,
        render: (record) => record?.phone_number,
      },
      {
        title: 'Nội dung',
        key: 'content',
        width: 150,
        render: (record) => record?.content,
      },
      {
        title: 'Sale gọi nhận',
        key: 'saler',
        width: 150,
        render: (record) => record?.saler,
      },
      {
        title: 'Trạng thái',
        key: 'status',
        width: 150,
        render: (record) => record?.status,
      },
      {
        title: 'Kết quả cuộc gọi',
        key: 'call_result',
        width: 150,
        render: (record) => record?.call_result,
      },
      {
        title: 'Ghi âm',
        key: 'recording',
        width: 150,
        render: (record) => record?.recording,
      },
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Lịch sử cuộc gọi" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark">Lịch sử cuộc gọi</Text>
        </div>
        <div className={styles['block-table']}>
          <Form
            initialValues={{
              ...search,
              switchboard: query?.switchboard || null,
              branchDirect: query?.branchDirect || null,
              employee: query?.employee || null,
              calling: query?.calling || null,
              status: query?.status || null,
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
                  data={[{ id: null, name: 'Tất cả tổng đài' }]}
                  name="switchboard"
                  onChange={(e) => onChangeSelect(e, 'switchboard_id')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả số nhánh' }]}
                  name="branchDirect"
                  onChange={(e) => onChangeSelect(e, 'branchDirect_id')}
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
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả cuộc gọi' }]}
                  name="calling"
                  onChange={(e) => onChangeSelect(e, 'calling_id')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả trạng thái' }]}
                  name="status"
                  onChange={(e) => onChangeSelect(e, 'status_id')}
                  type={variables.SELECT}
                  allowClear={false}
                />
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
