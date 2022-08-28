import React, { useEffect, useState, useMemo } from 'react';
import {useHistory,  useLocation } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import { useDispatch, useSelector } from 'dva';
import stylesModule from './styles.module.scss';

const Index = () => {
  const [formRef] = Form.useForm();
  const { query, pathname  } = useLocation();
  const dispatch = useDispatch();

  const [
    { data, pagination,dataTable },
    loading,
  ] = useSelector(({ salaryPartTimeVn, loading: { effects } }) => [salaryPartTimeVn, effects]);

  const history = useHistory();
  const [search, setSearch] = useState({
    key: query?.key,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    month: query?.month ? moment(query.month) : moment().startOf('months'),
  });


  useEffect(() => {
      dispatch({
        type: 'salaryPartTimeVn/GET_DATA',
        payload: {
          ...search,
          id: data?.id,
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
  }, [search]);

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
        title: 'STT/NO',
        key: 'index',
        width: 100,
        lassName: 'min-width-100',
        render: (value, _, index) => {
          const obj = {
              children: (
                  <div className={stylesModule['table-name']}>
                      {value?.children || value?.key ?
                          <>
                              {value?.name}
                          </> : <> {Helper.serialOrder(search?.page, index, search?.limit)}</>
                      }
                  </div>
              ),
              props: {},
          };
          if (value?.children && value?.name || value?.key) {
              obj.props.colSpan = 3;
          }
          return obj;
      },
      },
      {
        title: 'Mã NV/Code ee',
        key: 'code',
        className: 'min-width-60',
        width: 60,
        align: 'center',
        render: (value) => {
          const obj = {
              children: (
                  <div className={stylesModule['table-name']}>
                     {!value?.children &&
                          <>
                            {value?.employee?.Code}
                          </> 
                      }
                  </div>
              ),
              props: {},
          };
          if (value?.children  || value?.key) {
              obj.props.colSpan = 0;
          }
          return obj;
      },
      },
      {
        title: 'Học và tên',
        key: 'FullName',
        className: 'min-width-250',
        width: 250,
        align: 'center',
        render: (value) => {
          const obj = {
              children: (
                  <div className={stylesModule['table-name']}>
                     {!value?.children &&
                          <>
                            {value?.employee?.FullName}
                          </> 
                      }
                  </div>
              ),
              props: {},
          };
          if (value?.children  || value?.key) {
              obj.props.colSpan = 0;
          }
          return obj;
      },
      },
      {
        title: 'Ngày công',
        key: 'WorkDay',
        width: 100,
        className: 'min-width-100',
        render: (record) => <Text size="normal">{record?.WorkDay || record?.TotalWorkDay}</Text>,
       },
       {
        title: 'Thu nhập',
        key: 'valueSalary',
        width: 170,
        className: 'min-width-170',
        render: (record) => <Text size="normal">{  Helper.getPrice(record?.ValueSalary) || Helper.getPrice(record?.TotalValueSalary)}</Text>,
       },
       {
        title: 'Phụ cấp',
        key: 'Allowance',
        width: 170,
        className: 'min-width-170',
        render: (record) => <Text size="normal">{Helper.getPrice(record?.Allowance) || Helper.getPrice(record?.TotalAllowance)}</Text>,
       },
       {
        title: 'Lương thực tế',
        key: 'ValueSalary',
        width: 170,
        className: 'min-width-170',
        render: (record) => <Text size="normal">{Helper.getPrice(record?.ValueSalary) || Helper.getPrice(record?.TotalValueSalary)}</Text>,
       },
       {
        title: 'Tổng thu nhập',
        key: 'branchTotalInCome',
        width: 170,
        className: 'min-width-170',
        render: (record) => <Text size="normal">{Helper.getPrice(record?.TotalInCome) || Helper.getPrice(record?.TotalTotalInCome)}</Text>,
       },
       {
        title: 'Tổng thu nhập chịu thuế',
        key: 'PersonalIncomeTax',
        width: 170,
        className: 'min-width-170',
        render: (record) => <Text size="normal">{Helper.getPrice(record?.PersonalIncomeTax) || Helper.getPrice(record?.TotalPersonalIncomeTax)}</Text>,
       },
       {
        title: 'Thanh toán thế TNCN',
        key: 'TaxPayment',
        width: 170,
        className: 'min-width-170',
        render: (record) => <Text size="normal">{Helper.getPrice(record?.TaxPayment) || Helper.getPrice(record?.TotalTaxPayment)}</Text>,
       },
      {
        title: 'Lãnh thực',
        key: 'index',
        className: 'min-width-170',
        width: 170,
        align: 'center',
        render: ( record) => <Text size="normal">{Helper.getPrice(record?.TotalInCome) || Helper.getPrice(record?.BranchTotalInCome)}</Text>,
      },
    ],
    [],
  );

  return (
    <>
      <Helmet title="Bảng lương cộng tác viên Việt Nam" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark" className={styles['title-header']}>
            Bảng lương cộng tác viên Việt Nam
          </Text>
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
            bordered
            columns={header}
            dataSource={dataTable}  
            loading={loading['salaryPartTimeVn/GET_DATA']}
            pagination={paginationFunction}
            defaultExpandAllRows
            childrenColumnName="children"
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
