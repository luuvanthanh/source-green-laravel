import { memo } from 'react';
import PropTypes from 'prop-types';
import { Helper, variables } from '@/utils';
import Table from '@/components/CommonComponent/Table';

const Index = memo(({ dataLike }) => {
  const header = () => {
    const columns = [
      {
        title: 'STT ',
        key: 'index',
        width: 80,
        render: (value, record, index) => index + 1,
      },
      {
        title: 'Thời gian',
        key: 'created_at',
        className: 'min-width-150',
        width: 150,
        render: (record) => Helper.getDate(record.created_at, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Trạng thái',
        className: 'min-width-100',
        width: 100,
        key: 'reaction_type',
        render: (record) => record?.reaction_type,
      },
      {
        title: 'Họ và tên',
        key: 'name',
        className: 'min-width-200',
        width: 200,
        render: (record) => record?.full_name,
      },
      {
        title: 'Số điện thoại',
        key: 'phone',
        className: 'min-width-150',
        width: 150,
      },
      {
        title: 'Email',
        key: 'email',
        className: 'min-width-150',
        width: 150,
      },
    ];
    return columns;
  };

  return (
    <>
      <Table
        columns={header()}
        dataSource={dataLike}
        pagination={false}
        className="table-normal"
        isEmpty
        params={{
          header: header(),
          type: 'table',
        }}
        bordered
        rowKey={(record) => record.id}
        scroll={{ x: '100%' }}
      />
    </>
  );
});

Index.propTypes = {
  dataLike: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  dataLike: [],
};

export default Index;
