import { memo, useRef, useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useLocation, useHistory } from 'umi';
import csx from 'classnames';
import moment from 'moment';
import { debounce, isEmpty } from 'lodash';
import ability from '@/utils/ability';

import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import styles from '@/assets/styles/Common/common.scss';
import { Helper, variables } from '@/utils';
import VariablesModules from '../utils/variables';

import stylesModule from './styles.module.scss';



const Index = memo(() => {
  const [
    loadingReducer,
    paginationReducer,
    data,
  ] = useSelector(({ loading, crmListPostsChildren = {} }) => [
    loading,
    crmListPostsChildren?.paginationReducer,
    crmListPostsChildren?.data,
  ]);
  const loading = loadingReducer?.effects['crmListPostsChildren/GET_DATA'];

  const history = useHistory();
  const { query, pathname } = useLocation();
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const filterRef = useRef();

  const [search, setSearch] = useState({
    id: query?.id,
    from_date: query?.from_date ? query?.from_date : null,
    to_date: query?.to_date ? query?.to_date : null,
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

  const loadData = useCallback(() => {
    dispatch({
      type: 'crmListPostsChildren/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
        date: search.date && Helper.getDate(search.date, variables.DATE_FORMAT.DATE_AFTER),
      }),
    });
  }, [search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const onChangeDate = (e) => {
    if (!isEmpty(e)) {
      setSearch({
        ...search,
        from_date: moment(e[0]).format(variables.DATE_FORMAT.DATE_AFTER),
        to_date: moment(e[1]).format(variables.DATE_FORMAT.DATE_AFTER),
      });
    }
    else {
      setSearch({
        ...search,
        from_date: undefined,
        to_date: undefined,
      });
    }
  };

  const onRemove = (id) => {
    const text = VariablesModules?.RULES?.TEXT_WARNING_CATEGORY;
    Helper.confirmDelete({
      callback: () => {
        dispatch({
          type: 'crmListPostsChildren/REMOVE',
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
    }, text);
  };

  const header = () => [
    {
      title: 'Mã danh mục',
      key: 'code',
      className: 'min-width-150',
      width: 150,
      render: (record) => <Text size="normal">{record.code}</Text>,
    },
    {
      title: 'Tên danh mục',
      key: 'name',
      width: 200,
      className: 'min-width-200',
      render: (record) => <Text size="normal">{record.name}</Text>,
    },
    {
      title: 'Mô tả',
      key: 'description',
      className: 'min-width-150',
      width: 500,
      render: (record) => <Text size="normal">{record.description}</Text>,
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
            // permission="WEB_KIENTHUCNUOIDAYTRE_DANHMUC_EDIT"
            onClick={(e) => {
              e.stopPropagation();
              history.push(`${pathname}/${record.id}/chinh-sua`);
            }}
          />
          <Button
            // permission="WEB_KIENTHUCNUOIDAYTRE_DANHMUC_DELETE"
            color="danger" icon="remove" onClick={(e) => {
              e.stopPropagation();
              onRemove(record.id);
            }
            } />
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet title="Danh mục" />
      <Pane className={csx(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Text color="dark">Danh mục</Text>
          <Button
            //  permission="WEB_KIENTHUCNUOIDAYTRE_DANHMUC_CREATE"
            color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
            Thêm mới
          </Button>
        </div>
        <Pane className="card">
          <Pane className={csx(styles['block-table'], styles['block-table-tab'])}>
            <Form
              layout="vertical"
              ref={filterRef}
              className="pt20"
              initialValues={{
                ...search, date: search.from_date &&
                  search.to_date ? [moment(search.from_date), moment(search.to_date)] : ["", ""],
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
                <Pane className="col-lg-3">
                  <FormItem
                    name="date"
                    onChange={(event) => onChangeDate(event, 'date')}
                    type={variables.RANGE_PICKER}
                    disabled={search?.start_date_history_care && true}
                  />
                </Pane>
              </Pane>
            </Form>
            <div className={stylesModule['wrapper-table-header']} >
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
                    // if (ability.can('WEB_KIENTHUCNUOIDAYTRE_DANHMUC_DETAIL', 'WEB_KIENTHUCNUOIDAYTRE_DANHMUC_DETAIL')) {
                    //   history.push(`${pathname}/${record.id}/chi-tiet`);
                    // }
                    history.push(`${pathname}/${record.id}/chi-tiet`);
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
