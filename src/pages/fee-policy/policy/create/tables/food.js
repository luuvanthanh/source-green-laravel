import { memo, useMemo, useState } from 'react';
import { Input } from 'antd';

import Button from '@/components/CommonComponent/Button';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';

const dataDefault = [{
  id: 1
}];

const Index = memo(() => {
  const [data, setData] = useState(dataDefault);

  const columns = useMemo(() => [
    {
      title: 'Loại lớp',
      key: 'class',
      className: 'min-width-100',
      render: (text, record, index) => (
        <FormItem
          className="mb-0"
          name="class"
          data={[]}
          onChange={(event) => {}}
          type={variables.SELECT}
        />
      )
    },
    {
      title: 'Hình thức',
      key: 'format',
      className: 'min-width-100',
      render: (text, record, index) => (
        <FormItem
          className="mb-0"
          name="hinhThuc"
          data={[]}
          onChange={(event) => {}}
          type={variables.SELECT}
        />
      )
    },
    {
      title: 'Nội dung',
      key: 'description',
      className: 'min-width-160',
      render: (text, record, index) => (
        <Input
          placeholder="Nhập"
        />)
    },
    {
      title: 'Thời gian đóng',
      key: 'deadline',
      className: 'min-width-100',
      render: (text, record, index) => (
        <FormItem
          className="mb-0"
          name="thoiGianDong"
          type={variables.RANGE_PICKER}
        />
      )
    },
    {
      title: 'Thời hạn nộp tiền',
      key: 'date',
      className: 'min-width-100',
      render: (text, record, index) => (
        <FormItem
          className="mb-0"
          name="hanNopTien"
          type={variables.DATE_PICKER}
        />
      )
    },
    {
      title: 'Tiền ăn',
      key: 'price',
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

  const addLine = () => {
    setData([
      ...data,
      {
        id: data?.length + 1
      }
    ])
  }

  return (
    <>
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
      <Pane className="m20">
        <Button
          className="btn-create"
          color="success"
          icon="plus"
          onClick={addLine}
        >
          Thêm dòng
        </Button>
      </Pane>
    </>
  );
});

export default Index;
