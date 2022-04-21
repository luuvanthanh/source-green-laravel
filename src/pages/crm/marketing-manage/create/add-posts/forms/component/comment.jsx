import { memo } from 'react';
import PropTypes from 'prop-types';
import { Helper, variables } from '@/utils';
import Table from '@/components/CommonComponent/Table';

const Index = memo(({ dataComment, hanDleChangeComment, paginationComment }) => {
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
        title: 'Họ và tên',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: (record) => record?.full_name,
      },
      {
        title: 'Nội dung comment',
        className: 'min-width-250',
        width: 250,
        key: 'content',
        render: (record) => record?.content,
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

  const changeText = (page, limit) => {
    hanDleChangeComment(page, limit);
  };

  const changePagination = ({ page, limit }) => {
    changeText(page, limit);
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  const pagination = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        changePagination(response);
      },
    });

  return (
    <>
      <Table
        columns={header()}
        dataSource={dataComment}
        pagination={pagination(paginationComment)}
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
  dataComment: PropTypes.arrayOf(PropTypes.any),
  paginationComment: PropTypes.objectOf(PropTypes.any),
  hanDleChangeComment: PropTypes.func,
};

Index.defaultProps = {
  dataComment: [],
  paginationComment: {},
  hanDleChangeComment: () => {},
};
export default Index;
