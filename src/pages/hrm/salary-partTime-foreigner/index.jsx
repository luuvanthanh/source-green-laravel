import React, { useEffect, useState, useMemo } from 'react';
import { useHistory, useLocation } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import { useDispatch, useSelector } from 'dva';
import stylesModule from './styles.module.scss';

const Index = () => {
  const [formRef] = Form.useForm();
  const { query, pathname } = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const [
    { data, pagination, error,dataTable },
    loading,
  ] = useSelector(({ salaryPartTimeForeigner, loading: { effects } }) => [salaryPartTimeForeigner, effects]);

  const [search, setSearch] = useState({
    key: query?.key,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    month: query?.month ? moment(query.month) : moment().startOf('months'),
  });

  const onLoad = () => {
    dispatch({
      type: 'salaryPartTimeForeigner/GET_DATA_PAYROLL',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
        },
        variables.QUERY_STRING,
      )}`,
    );
  };
console.log("dataTable",dataTable)
  useEffect(() => {
    onLoad();
  }, [search]);

  useEffect(() => {
    if (data?.id) {
      dispatch({
        type: 'salaryPartTimeForeigner/GET_DATA',
        payload: {
          ...search,
          id: data?.id,
        },
      });
    }
  }, [data.id]);

  const debouncedSearch = debounce((value, type) => {
    setSearch((prev) => ({
      ...prev.search,
      [`${type}`]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const onChangeDate = (e, type) => {
    debouncedSearch( moment(e).startOf('months').format(variables.DATE_FORMAT.DATE_AFTER), type);
  };

  const changePagination = ({ page, limit }) => {
    setSearch((prev) => ({
      ...prev,
      page,
      limit,
    }));
  };

  const paginationFunction = useMemo(
    () =>
      Helper.paginationLavarel({
        pagination,
        callback: (response) => {
          changePagination(response);
        },
      }),
    [pagination],
  );

  const header = useMemo(
    () => [
      {
        title: 'Tên',
        key: 'index',
        className: 'min-width-60',
        width: 60,
        align: 'center',
        render: (text, record) => record?.name
      },
    ],
    [],
  );

  return (
    <>
      <Helmet title="cơ sở" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark" className={styles['title-header']}>
            Cơ sở
          </Text>
          <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
            Thêm mới
          </Button>
        </div>
        <div className={styles['block-table']}>
          <Form
            initialValues={{
              ...search,
            }}
            layout="vertical"
            form={formRef}
          >
            <div className="row">
              <div className="col-lg-4">
                <FormItem
                  name="month"
                  onChange={(event) => onChangeDate(event, 'month')}
                  type={variables.MONTH_PICKER}
                  allowClear={false}
                />
              </div>
            </div>
          </Form>
          <div className={stylesModule['wrapper-table']}>
          <Table
            bordered={false}
            columns={header}
            dataSource={dataTable}  
            loading={loading['salaryPartTimeForeigner/GET_DATA_PAYROLL']}
            pagination={paginationFunction}
            error={error}
            childrenColumnName="children"
            isError={error.isError}
            params={{
              header,
              type: 'table',
            }}
            rowKey={(record) => record.id}
            scroll={{ x: '100%' }}
          />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
