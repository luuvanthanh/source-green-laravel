import { memo, useEffect, useState } from 'react';
import { Form, Typography } from 'antd';
import { useSelector, useDispatch } from 'dva';
import _ from 'lodash';
import classnames from 'classnames';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Table from '@/components/CommonComponent/Table';

import styles from '../index.scss';

const { Paragraph } = Typography;

const Index = memo(() => {
  const dispatch = useDispatch();
  const [ { students }, loading] = useSelector(({ loading: { effects }, studentHomePage }) => [
    studentHomePage,
    effects,
  ]);

  const [search, setSearch] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.SIZEMAX,
    keyWord: '',
    class: undefined,
    classStatus: 'ALL',
  });

  // const fetchDataStudents = () => {
  //   dispatch({
  //     type: 'studentHomePage/GET_DATA_STUNDENT',
  //     payload: {
  //       ...search
  //     },
  //   });
  // };

  useEffect(() => {
    // fetchDataStudents();
  }, [search.keyWord]);


  /**
   * Function header table
   */
  const header = () => [
    {
      title: 'Thời gian',
      key: 'time',
      align: 'center',
      className: 'min-width-100',
      width: 200,
      render: () => '16/05',
    },
    {
      title: 'Vào lớp',
      key: 'getOnBus',
      align: 'center',
      width: 200,
      className: 'min-width-200',
      render: (value, row, index) => {
        const obj = {
          children: index === 1 ? 'Không đăng ký xe Bus' : value,
          props: {
            colSpan: index === 1 ? 2 : 1
          }
        };
        return obj;
      }
    },
    {
      title: 'Ra về',
      key: 'getOffBus',
      align: 'center',
      width: 200,
      className: 'min-width-200',
      render: (value, row, index) => {
        const obj = {
          children: '07:21:17',
          props: {
            colSpan: index === 1 ? 0 : 1
          }
        };
        return obj;
      }
    },
    {
      title: 'Bảo mẫu',
      key: 'shuttler',
      width: 200,
      className: 'min-width-200',
      render: (record) => (
        <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}>
          {record?.busPlace?.busRoute?.busRouteNannies
            ?.map((item) => item?.nanny?.fullName)
            .join(',')}
        </Paragraph>
      ),
    },
  ];

  const handleSearch = _.debounce((e) => {
    // setData
  }, 300);

  return (
    <div className={classnames(styles['container-bus'], 'mt20')}>
      <Form>
        <div className="row">
          <div className="col-md-4">
            <FormItem
              name="time"
              type={variables.RANGE_PICKER}
              onChange={handleSearch}
            />
          </div>
        </div>
      </Form>
      <Table
        bordered
        columns={header()}
        dataSource={[]}
        loading={loading['studentHomePage/GET_DATA_STUNDENT']}
        pagination={false}
        params={{
          header: header(),
          type: 'table',
        }}
        rowKey={(record) => record.id}
        scroll={{ x: '100%' }}
      />
    </div>
  );
});

export default Index;
