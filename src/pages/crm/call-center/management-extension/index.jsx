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

const Index = () => {
  const [
    { data, pagination },
    loading,
  ] = useSelector(({ loading: { effects }, crmSaleParentsLead }) => [crmSaleParentsLead, effects]);
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
      type: 'crmSaleParentsLead/GET_DATASOURCE',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  };

  useEffect(() => {
    onLoad();
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
        title: 'STT',
        key: 'index',
        width: 80,
        render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
      },
      {
        title: 'Tài khoản',
        key: 'username',
        width: 100,
        render: (record) => record?.username,
      },
      {
        title: 'Mật khẩu',
        key: 'password',
        width: 150,
        render: (record) => record?.call_type,
      },
      {
        title: 'Hostname',
        key: 'hostname',
        width: 150,
        render: (record) => record?.hostname,
      },
      {
        title: 'Port',
        key: 'port',
        width: 100,
        render: (record) => record?.port,
      },
      {
        title: 'Trạng thái',
        key: 'status',
        width: 150,
        render: (record) => record?.status,
      },
      {
        title: 'Nhân viên trực tổng đài',
        key: 'saler',
        width: 230,
        render: (record) => record?.saler,
      },
      {
        key: 'action',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="success"
              onClick={() => history.push(`${pathname}/${record?.id}/chi-tiet`)}
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Quản lý máy lẻ" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark">Quản lý máy lẻ</Text>
        </div>
        <div className={styles['block-table']}>
          <Form
            initialValues={{
              ...search,
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
                  placeholder="Tìm kiếm"
                  type={variables.INPUT_SEARCH}
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
            isEmpty
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
