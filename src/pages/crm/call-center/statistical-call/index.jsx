import styles from '@/assets/styles/Common/common.scss';
import FormItem from '@/components/CommonComponent/FormItem';
import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Form, Table } from 'antd';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'dva';
import { debounce, get, head } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import C3Chart from 'react-c3js';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'umi';

const boxArr = [
  { id: 1, title: 'LEADS', number: 124, color: '#F8755F' },
  { id: 2, title: 'LEAD MỚI', number: 14, color: '#4760BF' },
  { id: 3, title: 'ĐÃ GỌI', number: 240, color: '#2FB4BD' },
  { id: 4, title: 'CÓ TIỀM NĂNG', number: 200, color: '#1E9F4E' },
  { id: 5, title: 'QUÁ HẠN', number: 5, color: '#CB0616' },
];

const Index = () => {
  const [{ data, saler }, user] = useSelector(({ crmStatisticalCall, user }) => [
    crmStatisticalCall,
    user,
  ]);
  const { query, pathname } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [formRef] = Form.useForm();
  const [formSaler] = Form.useForm();
  const [search, setSearch] = useState({
    key: query?.key,
    from_date:
      query?.from_date || moment().startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
    to_date: query?.to_date || moment().endOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  });
  // const [crmIdUser, setCrmIdUser] = useState('');
  const [crmIdEmployee, setCrmIdEmployee] = useState('');
  const [employeeDataChart, setEmployeeDataChart] = useState({});

  // useEffect(() => {
  //   dispatch({
  //     type: 'crmCallCenter/GET_CRM_ID',
  //     payload: {
  //       employee_id_hrm: user.objectInfo?.id,
  //     },
  //     callback: (response) => {
  //       if (response) {
  //         setCrmIdUser(head(response.parsePayload).id);
  //         dispatch({
  //           type: 'crmStatisticalCall/GET_DATA',
  //           payload: {
  //             ...search,
  //             employee_id: crmIdUser,
  //           },
  //         });
  //         history.push({
  //           pathname,
  //           query: Helper.convertParamSearch(search),
  //         });
  //       }
  //     },
  //   });
  // }, [crmIdUser, search]);

  useEffect(() => {
    dispatch({
      type: 'crmStatisticalCall/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  }, [search]);

  const onChangeSelectEmployee = (e) => {
    setCrmIdEmployee(e);
  };

  useEffect(() => {
    dispatch({
      type: 'crmStatisticalCall/GET_CHART_EMPLOYEE',
      payload: {
        ...search,
        employee_id: crmIdEmployee,
      },
      callback: (response) => {
        if (response) {
          setEmployeeDataChart(response?.parsePayload);
        }
      },
    });
  }, [crmIdEmployee]);

  useEffect(() => {
    dispatch({
      type: 'crmStatisticalCall/GET_SALER',
      payload: {
        sale: true,
      },
    });
  }, []);

  const debouncedSearch = debounce((value, type) => {
    setSearch((prev) => ({
      ...prev,
      [`${type}`]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const onChangeSelect = (e, type) => {
    debouncedSearch(e, type);
  };

  const leadStatusData = {
    columns: [
      ['Leads', 120],
      ['Lead mới', 20],
      ['Gọi lần 1', 160],
      ['Gọi lần 2', 120],
      ['Gọi lần 3', 40],
      ['Gọi lần 4', 20],
      ['Gọi lần 5', 10],
      ['Có tiềm năng', 200],
      ['Không tiềm năng', 20],
      ['Quá hạn', 10],
    ],
    type: 'bar',
    colors: {
      Leads: '#F8755F',
      'Lead mới': '#4760BF',
      'Gọi lần 1': '#2FB4BD',
      'Gọi lần 2': '#22ADB7',
      'Gọi lần 3': '#16A5AF',
      'Gọi lần 4': '#089DA8',
      'Gọi lần 5': '#038F99',
      'Có tiềm năng': '#1E9F4E',
      'Không tiềm năng': '#FFC700',
      'Quá hạn': '#CB0616',
    },
    empty: {
      label: {
        text: 'Chưa có dữ liệu',
      },
    },
  };

  const leadStatusAxis = {
    y: {
      label: {
        text: 'Số lượng',
        position: 'outer-top',
      },
    },
  };

  const emplpoyeeChart = {
    columns: [
      ['Leads', head(employeeDataChart)?.total_lead ?? null],
      ['Lead mới', head(employeeDataChart)?.lead_new ?? null],
      ['Gọi lần 1', head(employeeDataChart)?.first_call ?? null],
      ['Gọi lần 2', head(employeeDataChart)?.second_call ?? null],
      ['Gọi lần 3', head(employeeDataChart)?.third_call ?? null],
      ['Gọi lần 4', head(employeeDataChart)?.fourth_call ?? null],
      ['Gọi lần 5', head(employeeDataChart)?.fiveth_call ?? null],
      ['Có tiềm năng', head(employeeDataChart)?.potential ?? null],
      ['Không tiềm năng', head(employeeDataChart)?.not_potential ?? null],
      ['Quá hạn', head(employeeDataChart)?.out_of_date ?? null],
    ],
    type: 'bar',
    colors: {
      Leads: '#F8755F',
      'Lead mới': '#4760BF',
      'Gọi lần 1': '#2FB4BD',
      'Gọi lần 2': '#22ADB7',
      'Gọi lần 3': '#16A5AF',
      'Gọi lần 4': '#089DA8',
      'Gọi lần 5': '#038F99',
      'Có tiềm năng': '#1E9F4E',
      'Không tiềm năng': '#FFC700',
      'Quá hạn': '#CB0616',
    },
    empty: {
      label: {
        text: 'Chưa có dữ liệu',
      },
    },
  };

  const header = () => {
    const columns = [
      {
        title: 'Mã số',
        key: 'code',
        className: 'min-width-80',
        width: 80,
        render: (record) => get(record, 'code'),
      },
      {
        title: 'Tên nhân viên',
        key: 'full_name',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'full_name'),
      },
      {
        title: 'Leads',
        key: 'total_lead',
        align: 'center',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'total_lead'),
      },
      {
        title: 'Lead mới',
        key: 'lead_new',
        align: 'center',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'lead_new'),
      },
      {
        title: 'Gọi lần 1',
        key: 'first_call',
        align: 'center',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'first_call'),
      },
      {
        title: 'Gọi lần 2',
        key: 'second_call',
        align: 'center',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'second_call'),
      },
      {
        title: 'Gọi lần 3',
        key: 'third_call',
        align: 'center',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'third_call'),
      },
      {
        title: 'Gọi lần 4',
        key: 'fourth_call',
        align: 'center',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'fourth_call'),
      },
      {
        title: 'Gọi lần 5',
        key: 'fiveth_call',
        align: 'center',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'fiveth_call'),
      },
      {
        title: 'Có TN',
        key: 'potential',
        align: 'center',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'potential'),
      },
      {
        title: 'Không có TN',
        key: 'not_potential',
        align: 'center',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'not_potential'),
      },
      {
        title: 'Quá hạn',
        key: 'out_of_date',
        align: 'center',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'out_of_date'),
      },
      // {
      //   title: 'Tỉ lệ có location',
      //   key: 'locationOne',
      //   width: 80,
      //   className: 'min-width-80',
      //   render: (record) => get(record, 'locationOne'),
      // },
      // {
      //   title: 'Tỉ lệ có location 2',
      //   key: 'locationTwo',
      //   width: 80,
      //   className: 'min-width-80',
      //   render: (record) => get(record, 'locationTwo'),
      // },
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Thống kê" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <Form
          form={formRef}
          initialValues={{ ...search, date: [moment(search.from_date), moment(search.to_date)] }}
        >
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Thống kê</Text>
            <div className="col-lg-3">
              <FormItem
                name="date"
                className="m0"
                onChange={(e) => onChangeSelect(e, 'date')}
                placeholder="Nhập từ khóa"
                type={variables.RANGE_PICKER}
              />
            </div>
          </div>
        </Form>

        <div className="row">
          {boxArr.map((item) => (
            <div className={styles['cols-5']} key={item.id}>
              <div className={styles['box-count']}>
                <p className={styles['box-title']}>{item.title}</p>
                <p className={styles['box-number']} style={{ color: item.color }}>
                  {item.number}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Pane className={classnames('card p20 mb-0 mt20', styles['c3-chart'])}>
          <Heading type="form-title" className="mb20">
            Tổng quan tình trạng Lead (không tinh overTAT)
          </Heading>
          <C3Chart
            data={leadStatusData}
            axis={leadStatusAxis}
            grid={variables.CHART.grid}
            bar={{ width: 60 }}
            tooltip={{ show: false }}
            legend={{ position: 'right' }}
          />
        </Pane>

        <Pane className="card p20 mb-0 mt20">
          <Heading type="form-title" className="mb20">
            Báo cáo theo tình hình chăm sóc khách hàng
          </Heading>
          <Table
            columns={header()}
            dataSource={data}
            pagination={false}
            className={styles['statistical-table']}
            isEmpty
            params={{
              header: header(),
              type: 'table',
            }}
            bordered
            rowKey={(record) => record.id}
            scroll={{ x: '100%' }}
          />
        </Pane>

        <Form form={formSaler}>
          <Pane className={classnames('card p20 mb-0 mt20', styles['c3-chart'])}>
            <Heading type="form-title" className="mb20">
              Theo dõi tình trạng lead của sale
            </Heading>
            <div className="row">
              <div className="col-lg-3">
                <FormItem
                  data={saler}
                  name="employee"
                  onChange={(e) => onChangeSelectEmployee(e)}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
            </div>
            <C3Chart
              data={emplpoyeeChart}
              axis={leadStatusAxis}
              grid={variables.CHART.grid}
              bar={{ width: 60 }}
              tooltip={{ show: false }}
              legend={{ position: 'right' }}
            />
          </Pane>
        </Form>
      </div>
    </>
  );
};

export default Index;
