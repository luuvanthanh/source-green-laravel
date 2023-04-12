import { memo, useEffect, useRef } from 'react';
import { Checkbox } from 'antd';
import Table from '@/components/CommonComponent/Table';
import stylesModule from '../styles.module.scss';

const Index = memo(() => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const header = () => {
    const columns = [
      {
        title: 'Khoảng điểm từ',
        key: 'a',
        className: 'min-width-150',
        render: () =>
          <Checkbox />,
      },
      {
        title: 'Tiêu chí',
        key: 'a',
        className: 'min-width-400',
        render: (record) => record?.name,
      },
    ];
    return columns;
  };

  return (
    <div className={stylesModule['wrapper-table']}>
      <Table
        columns={header()}
        dataSource={[{ name: 'Trình độ chuyên môn' }]}
        pagination={false}
        className="table-edit"
        isEmpty
        params={{
          header: header(),
          type: 'table',
        }}
        bordered={false}
        rowKey={(record) => record.id}
        scroll={{ x: '100%' }}
      />
    </div>
  );
});

export default Index;