import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'dva';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { useHistory, useLocation } from 'umi';
import { MenuOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { Form } from 'antd';

import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';

import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
import FormItem from '@/components/CommonComponent/FormItem';

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);
const DragHandle = sortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const Index = memo(() => {
  const dispatch = useDispatch();
  const filterRef = useRef();
  const [{ error }, loading] = useSelector(({ loading: { effects }, city }) => [city, effects]);

  const { query } = useLocation();

  const mounted = useRef(false);

  const history = useHistory();
  const { pathname } = useLocation();

  const [search, setSearch] = useState({
    key: query?.key,
  });

  const changeFilterDebouce = debounce((name, value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const changeFilter = (name) => (value) => {
    changeFilterDebouce(name, value);
  };

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    dispatch({
      type: 'city/GET_DATA',
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

  /**
   * Function remove items
   * @param {uid} id id of items
   */
  const onRemove = (id) => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'city/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              dispatch({
                type: 'city/GET_DATA',
                payload: { ...search },
                callback: (response) => {
                  if (response) setDataSource(response);
                },
              });
            }
          },
        });
      },
    });
  };

  const columns = [
    {
      dataIndex: 'sort',
      width: 50,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Tên',
      key: 'name',
      className: 'min-width-200',
      render: (record) => <Text size="normal">{record.name}</Text>,
    },
    {
      key: 'action',
      className: 'min-width-80',
      width: 125,
      fixed: 'right',
      render: (record) => (
        <div className={styles['list-button']}>
          <Button
            color="primary"
            icon="edit"
            onClick={(e) => {
              e.stopPropagation();
              history.push(`${pathname}/${record?.id}/chi-tiet`);
            }}
          />
          <Button color="danger" icon="remove"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(record.id);
            }} />
        </div>
      ),
    },
  ];

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter((el) => !!el);
      setDataSource(newData);
      dispatch({
        type: 'city/UPDATE_ORDER_INDEX',
        payload: {
          id: newData.map((item) => item.id).join(','),
        },
        callback: () => { },
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
      <Helmet title="Tỉnh thành" />
      <Pane className="p20">
        <Pane className=" mb20">
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Tỉnh thành</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Thêm mới
            </Button>
          </div>
        </Pane>
        <Pane className="card mt20">
          <Pane className="p20">
            <Form
              layout="vertical"
              ref={filterRef}
              initialValues={{
                ...search,
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    type={variables.INPUT_SEARCH}
                    name="key"
                    onChange={({ target: { value } }) => changeFilter('key')(value)}
                    placeholder="Nhập từ khóa tìm kiếm"
                  />
                </Pane>
              </Pane>
            </Form>
            <Table
              columns={columns}
              dataSource={dataSource}
              loading={loading['city/GET_DATA']}
              isError={error.isError}
              pagination={false}
              rowKey="index"
              scroll={{ x: '100%', y: '70vh' }}
              components={{
                body: {
                  wrapper: DraggableContainer,
                  row: DraggableBodyRow,
                },
              }}
              onRow={(record) => ({
                onClick: () => {
                  history.push(`${pathname}/${record?.id}/chi-tiet`);
                },
              })}
            />
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;