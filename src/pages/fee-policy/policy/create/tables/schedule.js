import { memo, useMemo } from 'react';
import { Table as TableAntd, Input } from 'antd';

import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';

const { Summary } = TableAntd;

const data = [
  {
    id: 1,
  },
  {
    id: 2,
  },
];

const Index = memo(() => {
  const columns = useMemo(() => [
    {
      title: 'Lịch học',
      key: 'date',
      className: 'min-width-60',
      render: (text, record, index) => (
        <Input
          placeholder="Nhập"
        />
      )
    },
    {
      title: 'Học kỳ',
      key: 'semester',
      className: 'min-width-100',
      render: (text, record, index) => (
        <Input
          placeholder="Nhập"
        />
      )
    },
    {
      title: 'Số ngày học trong tháng',
      key: 'day',
      className: 'min-width-100',
      render: (text, record, index) => (
        <Input
          placeholder="Nhập"
        />
      )
    }
  ]);

  const pagination = {
    size: 'default',
    hideOnSinglePage: true,
  };

  const summary = (data) => {
    return (
      <>
        <Summary.Row>
          <Summary.Cell colSpan={2}><Text size="normal" className="font-weight-bold">SỐ NGÀY HỌC KỲ 1</Text></Summary.Cell>
          <Summary.Cell><Text size="normal" className="font-weight-bold">108</Text></Summary.Cell>
        </Summary.Row>
        <Summary.Row>
          <Summary.Cell colSpan={2}><Text size="normal" className="font-weight-bold">SỐ NGÀY HỌC KỲ 2</Text></Summary.Cell>
          <Summary.Cell><Text size="normal" className="font-weight-bold">93</Text></Summary.Cell>
        </Summary.Row>
        <Summary.Row>
          <Summary.Cell colSpan={2}><Text size="normal" className="font-weight-bold">TỔNG SỐ NGÀY HỌC</Text></Summary.Cell>
          <Summary.Cell><Text size="normal" className="font-weight-bold">201</Text></Summary.Cell>
        </Summary.Row>
      </>
    );
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={false}
      error={{}}
      isError={false}
      pagination={pagination}
      rowKey="id"
      scroll={{ x: '100%' }}
      summary={summary}
    />
  );
});

export default Index;
