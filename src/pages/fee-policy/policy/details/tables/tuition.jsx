import { memo, useMemo } from 'react';

import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';

const data = [{
  id: 1
}];

const Index = memo(() => {
  const columns = useMemo(() => [
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-80',
      render: (text, record, index) => <Text size="normal">15 - 24  tháng (tuổi)</Text>
    },
    {
      title: 'Hình thức',
      key: 'format',
      className: 'min-width-60',
      render: (text, record, index) => <Text size="normal">NAM</Text>
    },
    {
      title: 'Nội dung',
      key: 'description',
      className: 'min-width-120',
      render: (text, record, index) => <Text size="normal">Đóng học phí cả năm</Text>
    },
    {
      title: 'Thời gian đóng',
      key: 'deadline',
      className: 'min-width-120',
      render: (text, record, index) => <Text size="normal">01/06/21 - 31/05/22</Text>
    },
    {
      title: 'Thời hạn nộp tiền',
      key: 'date',
      className: 'min-width-120',
      render: (text, record, index) => <Text size="normal"></Text>
    },
    {
      title: 'Học sinh cũ',
      key: 'oldStudentPrice',
      className: 'min-width-120',
      render: (text, record, index) => <Text size="normal">90,200,000</Text>
    },
    {
      title: 'Học sinh mới',
      key: 'newStudentPrice',
      className: 'min-width-120',
      render: (text, record, index) => <Text size="normal">106,600,000</Text>
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
