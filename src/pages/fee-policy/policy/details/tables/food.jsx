import { memo, useMemo } from 'react';

import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';

const data = [{
  id: 1
}];

const Index = memo(() => {
  const columns = useMemo(() => [
    {
      title: 'Loại lớp',
      key: 'class',
      className: 'min-width-100',
      render: (text, record, index) => <Text size="normal">15 - 24  tháng (tuổi)</Text>
    },
    {
      title: 'Hình thức',
      key: 'format',
      className: 'min-width-100',
      render: (text, record, index) => <Text size="normal">NAM</Text>
    },
    {
      title: 'Nội dung',
      key: 'description',
      className: 'min-width-160',
      render: (text, record, index) => <Text size="normal">Đóng tiền ăn theo năm</Text>
    },
    {
      title: 'Thời gian đóng',
      key: 'deadline',
      className: 'min-width-100',
      render: (text, record, index) => <Text size="normal">01/08/2021</Text>
    },
    {
      title: 'Thời hạn nộp tiền',
      key: 'date',
      className: 'min-width-100',
      render: (text, record, index) => <Text size="normal">HOCKY1</Text>
    },
    {
      title: 'Tiền ăn',
      key: 'price',
      className: 'min-width-100',
      render: (text, record, index) => <Text size="normal">21,700,000</Text>
    }
  ]);

  const pagination = {
    size: 'default',
    hideOnSinglePage: true,
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
    />
  );
});

export default Index;
