import { memo, useMemo, useState } from 'react';
import { Input } from 'antd';

import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
import commonStyles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import Text from '@/components/CommonComponent/Text';

const dataDefault = [{
  id: 1
}];

const Index = memo((props) => {
  const [data, setData] = useState(dataDefault);

  const header = useMemo(() => [
    {
      title: 'Mã CT',
      key: 'mact',
      className: 'min-width-60',
      align: 'center',
      render: (record) => <Text size="normal">CT02</Text>,
    },
    {
      title: 'Tên chương trình',
      key: 'tenChuongTrinh',
      className: 'min-width-150',
      render: (record) => <Text size="normal">Chương trình phát triển suy luận cho trẻ</Text>,
    },
    {
      title: 'Loại Chương Trình',
      key: 'loaiChuongTrinh',
      className: 'min-width-150',
      render: (record) => <Text size="normal">Cá Nhân</Text>,
    },
    {
      title: 'Tên trẻ áp dụng',
      key: 'tenTreApDung',
      className: 'min-width-150',
      width: 150,
      render: (record) => <Text size="normal">Su Beo</Text>,
    },
    {
      title: 'Thời gian',
      key: 'thoiGian',
      className: 'min-width-150',
      width: 150,
      render: (record) => <Text size="normal">01/05/2021 - 01/07/2021</Text>,
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
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  const pagination = (pagination) => ({
    classNames: "p20",
    size: 'default',
    total: pagination.total,
    pageSize: variables.PAGINATION.PAGE_SIZE,
    defaultCurrent: Number(props.search.page),
    current: Number(props.search.page),
    hideOnSinglePage: pagination.total <= 10,
    showSizeChanger: false,
    pageSizeOptions: false,
    onChange: (page, size) => {
      changePagination(page, size);
    },
  });

    /**
  * Function set pagination
  * @param {integer} page page of pagination
  * @param {integer} size size of pagination
  */
  const changePagination = (page, limit) => {
    this.setState(
      (prevState) => ({
        search: {
          ...prevState.search,
          page,
          limit,
        },
      }),
      () => {
        this.onLoad();
      },
    );
  };

  /**
 * Function remove items
 * @param {uid} id id of items
 */
  const onRemove = (id) => {
    const { dispatch } = props;
    const { search } = props;
    confirm({
      title: 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content: 'Dữ liệu này đang được sử dụng, nếu xóa dữ liệu này sẽ ảnh hưởng tới dữ liệu khác?',
      onOk() {
        dispatch({
          type: 'criteriaLearn/REMOVE',
          payload: {
            id,
            pagination: {
              limit: search.limit,
              page: search.page,
            },
          },
        });
      },
      onCancel() {},
    });
  };

  /**
   * Function remove items
   * @param {objects} record value of items
   */
  const details = (objects) => {

  };

  return (
    <Table
      className="p-pagination-20"
      columns={header}
      dataSource={[{ id: 1 }, { id: 2 }]}
      // loading={props.loading}
      pagination={pagination(pagination)}
      params={{
        header: header,
        type: 'table',
      }}
      rowKey={(record) => record.id}
      scroll={{ x: '100%' }}
    />
  );
});

export default Index;
