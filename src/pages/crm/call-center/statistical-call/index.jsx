import styles from '@/assets/styles/Common/common.scss';
import FormItem from '@/components/CommonComponent/FormItem';
import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Form, Table } from 'antd';
import classnames from 'classnames';
import { useDispatch } from 'dva';
import { debounce, get } from 'lodash';
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
  // const [
  //   { data, pagination },
  //   loading,
  // ] = useSelector(({ loading: { effects }, crmHistoryCall }) => [crmHistoryCall, effects]);
  const { query, pathname } = useLocation();
  // const { params } = useRouteMatch();
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
        key: 'name',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'name'),
      },
      {
        title: 'Leads',
        key: 'leads',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'leads'),
      },
      {
        title: 'Lead mới',
        key: 'newLead',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'newLead'),
      },
      {
        title: 'Gọi lần 1',
        key: 'callOne',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'callOne'),
      },
      {
        title: 'Gọi lần 2',
        key: 'callTwo',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'callTwo'),
      },
      {
        title: 'Gọi lần 3',
        key: 'callThree',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'callThree'),
      },
      {
        title: 'Gọi lần 4',
        key: 'callFour',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'callFour'),
      },
      {
        title: 'Gọi lần 5',
        key: 'callFive',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'callFive'),
      },
      {
        title: 'Có TN',
        key: 'hasTN',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'hasTN'),
      },
      {
        title: 'Không có TN',
        key: 'hasntTN',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'hasntTN'),
      },
      {
        title: 'Quá hạn',
        key: 'expire',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'expire'),
      },
      {
        title: 'Tỉ lệ có location',
        key: 'locationOne',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'locationOne'),
      },
      {
        title: 'Tỉ lệ có location 2',
        key: 'locationTwo',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'locationTwo'),
      },
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Thống kê" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <Form form={formRef}>
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
              // dataSource={data}
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

          <Pane className={classnames('card p20 mb-0 mt20', styles['c3-chart'])}>
            <Heading type="form-title" className="mb20">
              Theo dõi tình trạng lead của sale
            </Heading>
            <div className="row">
              <div className="col-lg-3">
                <FormItem
                  name="employee"
                  onChange={(e) => onChangeSelect(e, 'employee_id')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
            </div>
            <C3Chart
              data={leadStatusData}
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
