import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useLocation, useHistory } from 'umi';
import csx from 'classnames';
import { debounce } from 'lodash';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';
import ability from '@/utils/ability';

import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import styles from '@/assets/styles/Common/common.scss';
import { Helper, variables } from '@/utils';

const Index = memo(() => {
  const [
    loadingReducer,
    paginationReducer,
    data,
  ] = useSelector(({ loading, hrmInterviewManagerCategoryInterviewConfiguration = {} }) => [
    loading,
    hrmInterviewManagerCategoryInterviewConfiguration?.paginationReducer,
    hrmInterviewManagerCategoryInterviewConfiguration?.data,
  ]);
  const loading =
    loadingReducer?.effects['hrmInterviewManagerCategoryInterviewConfiguration/GET_DATA'];

  const history = useHistory();
  const { query, pathname } = useLocation();
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const filterRef = useRef();

  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    key: query?.key,
  });

  const changePagination = ({ page, limit }) => {
    setSearch((prev) => ({
      ...prev.search,
      page,
      limit,
    }));
  };

  const paginationFunction = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        changePagination(response);
      },
    });

  const loadData = () => {
    dispatch({
      type: 'hrmInterviewManagerCategoryInterviewConfiguration/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
      }),
    });
  };

  useEffect(() => {
    loadData();
  }, [search]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const debouncedSearch = debounce((value, type) => {
    mountedSet(setSearch, {
      ...search,
      [`${type}`]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    });
  }, 300);

  const onChange = (e, type) => {
    debouncedSearch(e.target.value, type);
  };

  const onRemove = (id) => {
    const text = 'Bạn có chắc chắn muốn xóa cầu hình này không?';
    Helper.confirmDelete(
      {
        callback: () => {
          dispatch({
            type: 'hrmInterviewManagerCategoryInterviewConfiguration/REMOVE',
            payload: {
              id,
            },
            callback: (response) => {
              if (response) {
                loadData();
              }
            },
          });
        },
      },
      text,
    );
  };

  const header = () => [
    {
      title: 'ID',
      key: 'code',
      className: 'min-width-150',
      render: (record) => <Text size="normal">{record.code}</Text>,
    },
    {
      title: 'Tên cấu hình',
      key: 'name',
      className: 'min-width-200',
      render: (record) => <Text size="normal">{record.name}</Text>,
    },
    {
      title: 'Ghi chú',
      key: 'note',
      className: 'min-width-150',
      render: (record) => <Text size="normal">{record.note}</Text>,
    },
    {
      key: 'action',
      className: 'min-width-100',
      width: 100,
      render: (record) => (
        <div className={styles['list-button']}>
          <Button
            color="primary"
            icon="edit"
            permission={`${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHMUC_CAUHINHPHONGVAN}${ACTION.EDIT}`}
            onClick={(e) => {
              e.stopPropagation();
              history.push(`${pathname}/${record.id}/chinh-sua`);
            }}
          />
          <Button
            color="danger"
            icon="remove"
            permission={`${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHMUC_CAUHINHPHONGVAN}${ACTION.DELETE}`}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(record.id);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet title="Cấu hình phỏng vấn" />
      <Pane className={csx(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Text color="dark">Cấu hình phỏng vấn</Text>
          <Button
            permission={`${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHMUC_CAUHINHPHONGVAN}${ACTION.CREATE}`}
            color="success"
            icon="plus"
            onClick={() => history.push(`${pathname}/tao-moi`)}
          >
            Tạo mới
          </Button>
        </div>
        <Pane className="card">
          <Pane className={csx(styles['block-table'], styles['block-table-tab'])}>
            <Form
              layout="vertical"
              ref={filterRef}
              className="pt20"
              initialValues={{
                ...search,
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    name="key"
                    onChange={(event) => onChange(event, 'key')}
                    placeholder="Nhập từ khóa"
                    type={variables.INPUT_SEARCH}
                  />
                </Pane>
              </Pane>
            </Form>
            <div className={styles['wrapper-table-header']}>
              <Table
                columns={header()}
                dataSource={data}
                loading={loading}
                pagination={paginationFunction(paginationReducer)}
                rowKey={(record) => record.id}
                scroll={{ x: '100%', y: '60vh' }}
                className="table-edit"
                params={{
                  header: header(),
                  type: 'table',
                }}
                onRow={(record) => ({
                  onClick: () => {
                    if (
                      ability.can(
                        `${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHMUC_CAUHINHPHONGVAN}${ACTION.DETAIL}`,
                        `${FLATFORM.WEB}${permissions.HRM_PHONGVAN_DANHMUC_CAUHINHPHONGVAN}${ACTION.DETAIL}`,
                      )
                    ) {
                      history.push(`${pathname}/${record.id}/chi-tiet`);
                    }
                  },
                })}
              />
            </div>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
