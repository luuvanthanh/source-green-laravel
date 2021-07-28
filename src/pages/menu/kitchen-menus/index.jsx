import { memo, useMemo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useLocation, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { debounce } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';

import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';

const Index = memo(() => {
  const dispatch = useDispatch();
  const [
    { pagination, error, data, branches, classTypes },
    loading,
  ] = useSelector(({ loading: { effects }, kitchenMenus }) => [kitchenMenus, effects]);

  const history = useHistory();
  const { query, pathname } = useLocation();

  const filterRef = useRef();
  const mounted = useRef(false);

  const [search, setSearch] = useState({
    ...query,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  });

  const columns = [
    {
      title: 'STT',
      key: 'id',
      className: 'min-width-70',
      align: 'center',
      render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
    },
    {
      title: 'Cơ sở',
      key: 'classType',
      className: 'min-width-200',
      render: (record) => <Text size="normal">{record?.branch?.name}</Text>,
    },
    {
      title: 'Loại lớp',
      key: 'class',
      className: 'min-width-200',
      render: (record) => <Text size="normal">{record?.classType?.name}</Text>,
    },
    {
      title: 'Ngày tạo',
      key: 'class',
      className: 'min-width-200',
      render: (record) => (
        <Text size="normal">
          {Helper.getDate(record.creationTime, variables.DATE_FORMAT.DATE_TIME)}
        </Text>
      ),
    },
    {
      title: 'Người tạo',
      key: 'class',
      className: 'min-width-200',
      render: (record) => (
        <Text size="normal">
          {record?.creator?.objectInfo?.fullName || record?.creator?.userName}
        </Text>
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

  const paginationProps = useMemo(
    () => ({
      size: 'default',
      total: pagination?.total || 0,
      pageSize: variables.PAGINATION.PAGE_SIZE,
      defaultCurrent: Number(search.page),
      current: Number(search.page),
      hideOnSinglePage: (pagination?.total || 0) <= 10,
      showSizeChanger: false,
      pageSizeOptions: false,
      onChange: (page, limit) => {
        setSearch((prev) => ({
          ...prev,
          page,
          limit,
        }));
      },
    }),
    [pagination],
  );

  const changeFilterDebouce = debounce((name, value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  }, 300);

  const changeFilter = (name) => (value) => {
    changeFilterDebouce(name, value);
  };

  useEffect(() => {
    dispatch({
      type: 'kitchenMenus/GET_DATA',
      payload: { ...search },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
        },
        variables.QUERY_STRING,
      )}`,
    );
  }, [search]);

  useEffect(() => {
    dispatch({
      type: 'kitchenMenus/GET_CLASS_TYPES',
      payload: {},
    });
    dispatch({
      type: 'kitchenMenus/GET_BRANCHES',
      payload: {},
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <>
      <Helmet title="Danh sách thực đơn" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Danh sách thực đơn</Heading>
          <Button
            className="ml-auto"
            color="success"
            icon="plus"
            onClick={() => history.push(`${pathname}/tao-moi`)}
          >
            Tạo mới
          </Button>
        </Pane>

        <Pane className="card">
          <Pane className="p20">
            <Form
              layout="vertical"
              ref={filterRef}
              initialValues={{
                ...search,
                branchId: search?.branchId || null,
                classTypeId: search?.classTypeId || null,
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    type={variables.SELECT}
                    name="branchId"
                    onChange={(e) => changeFilter('branchId')(e)}
                    data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                    allowClear={false}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    type={variables.SELECT}
                    name="classTypeId"
                    onChange={(e) => changeFilter('classTypeId')(e)}
                    data={[{ id: null, name: 'Chọn tất loại lớp' }, ...classTypes]}
                    allowClear={false}
                  />
                </Pane>
              </Pane>
            </Form>

            <Table
              columns={columns}
              dataSource={data}
              loading={loading['kitchenMenus/GET_DATA']}
              isError={error.isError}
              pagination={paginationProps}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
            />
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
