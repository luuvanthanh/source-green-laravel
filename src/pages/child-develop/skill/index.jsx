import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'dva';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { useHistory, useLocation } from 'umi';
import { MenuOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { Form, Switch } from 'antd';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';

import { variables, Helper } from '@/utils';
import ability from '@/utils/ability';
import styles from '@/assets/styles/Common/common.scss';
import FormItem from '@/components/CommonComponent/FormItem';

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);
const DragHandle = sortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const Index = memo(() => {
  const dispatch = useDispatch();
  const filterRef = useRef();
  const [{ error }, loading] = useSelector(({ loading: { effects }, childDevelopSkill }) => [
    childDevelopSkill,
    effects,
  ]);

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
      type: 'childDevelopSkill/GET_DATA',
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
          type: 'childDevelopSkill/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              dispatch({
                type: 'childDevelopSkill/GET_DATA',
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
      title: 'Mã KN',
      key: 'code',
      width: 200,
      className: 'min-width-200',
      render: (record) => <Text size="normal">{record.code}</Text>,
    },
    {
      title: 'Tên kỹ năng',
      key: 'name',
      width: 200,
      className: 'min-width-200',
      render: (record) => <Text size="normal">{record.name}</Text>,
    },
    {
      title: 'Sử dụng',
      dataIndex: 'use',
      width: 160,
      className: 'min-width-160',
      render: (use, record) => (
        <div
          role="presentation"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Switch
            defaultChecked={use}
            disabled={
              !ability.can(
                `${FLATFORM.WEB}${permissions.SPTCT_DANHMUC_KYNANG}${ACTION.EDIT}`,
                `${FLATFORM.WEB}${permissions.SPTCT_DANHMUC_KYNANG}${ACTION.EDIT}`,
              )
            }
            onChange={() => {
              const payload = {
                id: record?.id,
                use: !use,
              };
              dispatch({
                type: 'childDevelopSkill/UPDATE',
                payload,
                callback: (response) => {
                  if (response) {
                    dispatch({
                      type: 'childDevelopSkill/GET_DATA',
                      payload: {},
                      callback: (response) => {
                        if (response) setDataSource(response);
                      },
                    });
                  }
                },
              });
            }}
          />
        </div>
      ),
    },
    {
      key: 'action',
      className: 'min-width-80',
      width: 125,
      render: (record) => (
        <div className={styles['list-button']}>
          <Button
            color="primary"
            icon="edit"
            permission={`${FLATFORM.WEB}${permissions.SPTCT_DANHMUC_KYNANG}${ACTION.EDIT}`}
            onClick={(e) => {
              e.stopPropagation();
              history.push(`${pathname}/${record?.id}/chi-tiet`);
            }}
          />
          <Button
            color="danger"
            icon="remove"
            permission={`${FLATFORM.WEB}${permissions.SPTCT_DANHMUC_KYNANG}${ACTION.DELETE}`}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(record.id);
            }}
          />
        </div>
      ),
    },
  ];

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter((el) => !!el);
      setDataSource(newData);
      dispatch({
        type: 'childDevelopSkill/UPDATE_ORDER_INDEX',
        payload: {
          id: newData.map((item) => item.id).join(','),
        },
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
      <Helmet title="Kỹ năng" />
      <Pane className="pl20 pr20 pb20">
        <Pane className=" mb20">
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Kỹ năng</Text>
            <Button
              permission={`${FLATFORM.WEB}${permissions.SPTCT_DANHMUC_KYNANG}${ACTION.CREATE}`}
              color="success"
              icon="plus"
              onClick={() => history.push(`${pathname}/tao-moi`)}
            >
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
              loading={loading['childDevelopSkill/GET_DATA']}
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
