import { memo, useMemo } from 'react';

import Table from '@/components/CommonComponent/Table';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import Text from '@/components/CommonComponent/Text';

const Index = memo(() => {
  const header = useMemo(() => [
    {
      title: 'Mã CT',
      key: 'mact',
      className: 'min-width-60',
      align: 'center',
      render: () => <Text size="normal">CT01</Text>,
    },
    {
      title: 'Tên chương trình',
      key: 'tenChuongTrinh',
      className: 'min-width-150',
      render: () => <Text size="normal">Chương trình phát triển suy luận cho trẻ</Text>,
    },
    {
      title: 'Loại Chương Trình',
      key: 'loaiChuongTrinh',
      className: 'min-width-150',
      render: () => <Text size="normal">Cá Nhân</Text>,
    },
    {
      title: 'Tên trẻ áp dụng',
      key: 'tenTreApDung',
      className: 'min-width-150',
      width: 150,
      render: () => <Text size="normal">Su Beo</Text>,
    },
    {
      title: 'Thời gian',
      key: 'thoiGian',
      className: 'min-width-150',
      width: 150,
      render: () => <Text size="normal">01/05/2021 - 01/07/2021</Text>,
    },
    {
      key: 'action',
      className: 'min-width-80',
      width: 80,
      render: () => (
        <div className={styles['list-button']}>
          <Button color="success">Chi tiết</Button>
        </div>
      ),
    },
  ]);

  return (
    <Table
      className="p-pagination-20"
      columns={header}
      dataSource={[{ id: 1 }]}
      // loading={props.loading}
      params={{
        header,
        type: 'table',
      }}
      rowKey={(record) => record.id}
      scroll={{ x: '100%' }}
    />
  );
});

export default Index;
