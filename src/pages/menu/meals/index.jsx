import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Switch } from 'antd';
import { useLocation, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { MenuOutlined } from '@ant-design/icons';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';

import { variables } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);
const DragHandle = sortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const Index = memo(() => {
  const dispatch = useDispatch();
  const [{ error }, loading] = useSelector(({ loading: { effects }, meals }) => [meals, effects]);

  const history = useHistory();
  const { query, pathname } = useLocation();

  const mounted = useRef(false);

  const [search] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    keyWord: query?.keyWord,
  });

  const [dataSource, setDataSource] = useState([]);

  const onChangeSwitch = (isUsed, record) => {
    dispatch({
      type: 'meals/UPDATE',
      payload: { ...record, isUsed },
      callback: (response) => {
        if (response) {
          dispatch({
            type: 'meals/GET_DATA',
            payload: { ...search },
            callback: (response) => {
              if (response) setDataSource(response);
            },
          });
        }
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'meals/GET_DATA',
      payload: { ...search },
      callback: (response) => {
        if (response) setDataSource(response);
      },
    });
  }, [search]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const columns = [
    {
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Mã bữa ăn',
      key: 'code',
      className: 'min-width-150',
      width: 150,
      render: (record) => <Text size="normal">{record.code}</Text>,
    },
    {
      title: 'Tên bữa ăn',
      key: 'name',
      className: 'min-width-100',
      render: (record) => <Text size="normal">{record.name}</Text>,
    },
    {
      title: 'Sử dụng',
      key: 'isUsed',
      className: 'min-width-100',
      width: 100,
      render: (record) => (
        <Switch checked={record.isUsed} onChange={(e) => onChangeSwitch(e, record)} />
      ),
    },
    {
      key: 'action',
      className: 'min-width-80',
      width: 80,
      fixed: 'right',
      render: (record) => (
        <div className={styles['list-button']}>
          <Button
            color="success"
            ghost
            onClick={() => history.push(`${pathname}/${record?.id}/chi-tiet`)}
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter((el) => !!el);
      setDataSource(newData);
      dispatch({
        type: 'meals/UPDATE_ORDER_INDEX',
        payload: newData.map((item) => ({
          mealId: item.id,
          meal: {
            code: item.code,
            name: item.name,
            isUsed: item.isUsed,
          },
        })),
        callback: () => {},
      });
    }
  };

  const DraggableContainer = (props) => (
    <SortableContainer useDragHandle helperClass="row-dragging" onSortEnd={onSortEnd} {...props} />
  );

  const DraggableBodyRow = ({ ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <>
      <Helmet title="Danh mục bữa ăn" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Danh mục bữa ăn</Heading>
          <Button
            className="ml-auto"
            color="success"
            icon="plus"
            onClick={() => history.push(`${pathname}/tao-moi`)}
          >
            Tạo danh mục
          </Button>
        </Pane>

        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading['meals/GET_DATA']}
          isError={error.isError}
          pagination={false}
          rowKey="index"
          scroll={{ x: '100%' }}
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
      </Pane>
    </>
  );
});

export default Index;
