import { memo, useMemo, useState } from 'react';

import Table from '@/components/CommonComponent/Table';
import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import Text from '@/components/CommonComponent/Text';
import moment from 'moment';

const Index = memo(() => {
  const [search, setSearch] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.PAGE_SIZE,
    nameStudent: '',
    date: moment(),
    status: null,
  });

  const header = useMemo(() => [
    {
      title: 'Mã CT',
      key: 'mact',
      className: 'min-width-60',
      align: 'center',
      render: () => <Text size="normal">CT02</Text>,
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
      title: 'Action',
      key: 'action',
      className: 'min-width-80',
      width: 80,
      render: (record) => (
        <div className={styles['list-button']}>
          <Button color="primary" icon="Chi tiết" onClick={() => this.details(record)} />
        </div>
      ),
    },
  ]);

  /**
   * Function set pagination
   * @param {integer} page page of pagination
   * @param {integer} size size of pagination
   */
  const changePagination = (page, limit) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      page,
      limit,
    }));
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  const pagination = (pagination) =>
    Helper.paginationNet({
      pagination,
      search,
      callback: (response) => {
        changePagination(response);
      },
    });

  return (
    <Table
      className="p-pagination-20"
      columns={header}
      dataSource={[{ id: 1 }, { id: 2 }]}
      // loading={props.loading}
      pagination={pagination(pagination)}
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
