import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useLocation, useHistory } from 'umi';
import csx from 'classnames';
import { debounce } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
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
    defaultBranch,
  ] = useSelector(({ loading, menuStudentAllergy = {}, user = {} }) => [
    loading,
    menuStudentAllergy?.paginationReducer,
    menuStudentAllergy?.data,
    user?.user,
  ]);
  const loading = loadingReducer?.effects['menuStudentAllergy/GET_DATA'];

  const history = useHistory();
  const [category, setCategory] = useState({
    branches: [],
    classes: [],
  });

  const { query, pathname } = useLocation();
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const filterRef = useRef();

  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    keyWord: query?.keyWord,
    branchId: query?.branchId || defaultBranch?.defaultBranch?.id,
    classId: query?.classId,
  });

  const fetchClasses = (branchId) => {
    dispatch({
      type: 'categories/GET_CLASSES',
      payload: {
        branch: branchId,
      },
      callback: (res) => {
        if (res) {
          setCategory((prev) => ({
            ...prev,
            classes: res?.items || [],
          }));
        }
      },
    });
  };

  const changePagination = ({ page, limit }) => {
    setSearch((prev) => ({
      ...prev.search,
      page,
      limit,
    }));
  };

  const paginationFunction = (pagination) =>
    Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        changePagination(response);
      },
    });

  const loadData = () => {
    dispatch({
      type: 'menuStudentAllergy/GET_DATA',
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
  };
  // console.log('search', search);
  useEffect(() => {
    loadData();
  }, [search]);

  useEffect(() => {
    dispatch({
      type: 'categories/GET_BRANCHES',
      callback: (res) => {
        if (res) {
          if (query?.classId || defaultBranch?.defaultBranch?.id) {
            fetchClasses(query?.branchId);
          }
          setCategory((prev) => ({
            ...prev,
            branches: res?.parsePayload || [],
          }));
        }
      },
    });
  }, []);

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

  const onChangeSelect = (e, type) => {
    debouncedSearch(e, type);
    if (type === 'branchId') {
      fetchClasses(e);
    }
  };

  const header = () => [
    {
      title: 'STT',
      key: 'no',
      className: 'min-width-150',
      render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
    },
    {
      title: 'Tên học sinh',
      key: 'studentName',
      className: 'min-width-200',
      render: (record) => <Text size="normal">{record.studentName}</Text>,
    },
    {
      title: 'Cơ sở',
      key: 'branchName',
      className: 'min-width-400',
      render: (record) => <Text size="normal">{record.branchName}</Text>,
    },
    {
      title: 'Lớp',
      key: 'className',
      className: 'min-width-400',
      render: (record) => <Text size="normal">{record.className}</Text>,
    },
    {
      title: 'Nguyên liệu dị ứng',
      key: 'materialName',
      className: 'min-width-400',
      render: (record) => <Text size="normal">{record.materialName}</Text>,
    },
  ];

  return (
    <>
      <Helmet title="Học sinh bị dị ứng" />
      <Pane className={csx(styles['content-form'], styles['content-form-children'])}>
        <div className="d-  flex justify-content-between align-items-center mb-4">
          <Text color="dark">Học sinh bị dị ứng</Text>
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
                    name="Keyword"
                    onChange={(event) => onChange(event, 'keyWord')}
                    placeholder="Nhập từ khóa"
                    type={variables.INPUT}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  {!defaultBranch?.objectInfo?.id && (
                    <FormItem
                      name="branchId"
                      type={variables.SELECT}
                      data={[{ name: 'Chọn tất cả cơ sở', id: null }, ...category?.branches]}
                      onChange={(event) => onChangeSelect(event, 'branchId')}
                      allowClear={false}
                    />
                  )}
                  {defaultBranch?.objectInfo?.id && (
                    <FormItem
                      name="branchId"
                      type={variables.SELECT}
                      data={[defaultBranch?.defaultBranch]}
                      onChange={(event) => onChangeSelect(event, 'branchId')}
                      placeholder="Chọn cơ sở"
                    />
                  )}
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="classId"
                    data={[{ name: 'Chọn tất cả lớp', id: null }, ...category?.classes]}
                    onChange={(event) => onChangeSelect(event, 'classId')}
                    placeholder="Chọn lớp"
                    type={variables.SELECT}
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
              />
            </div>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
