import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { Switch } from 'antd';
import arrayMove from 'array-move';
import { Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);
const Index = memo(() => {
  const dispatch = useDispatch();
  const [{ error }, loading] = useSelector(({ loading: { effects }, medicalByTypes }) => [
    medicalByTypes,
    effects,
  ]);

  const history = useHistory();
  const { query, pathname } = useLocation();

  const mounted = useRef(false);

  const [dataSource, setDataSource] = useState([]);
  const [search] = useState({
    keyWord: query?.keyWord,
    isParent: 'false',
    type: 'MEDICAL',
  });

  const onLoad = () => {
    dispatch({
      type: 'medicalByTypes/GET_DATA',
      payload: { ...search },
      callback: (response) => {
        if (response) {
          setDataSource(response.map((item, index) => ({ ...item, index })));
        }
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
      }),
    });
  };

  const onChange = (invisible, record) => {
    dispatch({
      type: 'medicalByTypes/UPDATE_STATUS',
      payload: { invisible: !record.invisible, id: record.id },
      callback: (response) => {
        if (response) {
          onLoad();
        }
      },
    });
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter((el) => !!el);
      setDataSource(newData);
      // dispatch({
      //   type: 'meals/UPDATE_ORDER_INDEX',
      //   payload: newData.map((item) => ({
      //     mealId: item.id,
      //     meal: {
      //       code: item.code,
      //       name: item.name,
      //       isUsed: item.isUsed,
      //     },
      //   })),
      //   callback: () => {},
      // });
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

  const columns = [
    {
      key: 'invisible',
      className: 'min-width-80',
      align: 'left',
      render: (record) => (
        <Switch checked={!record.invisible} onChange={(e) => onChange(e, record)} />
      ),
    },
    {
      key: 'name',
      className: 'min-width-200',
      render: (record) => <Text size="normal">{record.description} </Text>,
    },
    {
      key: 'action',
      className: 'min-width-80',
      width: 80,
      render: (record) => (
        <div className={styles['list-button']}>
          <button
            className={classnames(styles['button-circle'], styles.success)}
            type="button"
            onClick={() => history.push(`${pathname}/${record?.id}/chi-tiet`)}
          >
            <span className="icon-edit" />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    onLoad();
  }, [search]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <>
      <Helmet title="Buổi" />
      <Pane className="p20">
        <Pane className="col-lg-6 offset-lg-3">
          <Pane className="d-flex mb20">
            <Heading type="page-title">Buổi</Heading>
            <Button
              className="ml-auto"
              color="success"
              icon="plus"
              onClick={() => history.push(`${pathname}/them-moi`)}
            >
              Tạo mới
            </Button>
          </Pane>

          <Pane className="card">
            <Table
              columns={columns}
              components={{
                body: {
                  wrapper: DraggableContainer,
                  row: DraggableBodyRow,
                },
              }}
              showHeader={false}
              dataSource={dataSource}
              loading={loading['medicalByTypes/GET_DATA']}
              isError={error.isError}
              pagination={false}
              rowKey="index"
              scroll={{ x: '100%' }}
            />
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
