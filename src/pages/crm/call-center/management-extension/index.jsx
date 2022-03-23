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
  ] = useSelector(({ loading: { effects }, crmManagementExtension }) => [
    crmManagementExtension,
    effects,
  ]);

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
      type: 'crmManagementExtension/GET_DATA',
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
        key: 'user_id_cmc',
        width: 100,
        render: (record) => record?.user_id_cmc,
      },
      {
        title: 'Mật khẩu',
        key: 'password',
        width: 150,
        render: (record) => record?.password,
      },
      {
        title: 'Hostname',
        key: 'host_name',
        width: 150,
        render: (record) => record?.host_name,
      },
      {
        title: 'Port',
        key: 'port',
        width: 100,
        render: (record) => record?.port,
      },
      {
        title: 'Nhân viên trực tổng đài',
        align: 'center',
        key: 'employee_count',
        width: 230,
        render: (record) => record?.employee_count,
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
            </div>
          </Form>
          <Table
            bordered={false}
            columns={header(params)}
            dataSource={data}
            loading={loading['crmManagementExtension/GET_DATA']}
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
