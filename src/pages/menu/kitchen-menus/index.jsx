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
import moment from 'moment';

const Index = memo(() => {
  const dispatch = useDispatch();
  const [
    { pagination, error, data, branches, classTypes,years },
    loading,
    { defaultBranch, user },
  ] = useSelector(({ loading: { effects }, kitchenMenus, user }) => [kitchenMenus, effects, user]);

  const history = useHistory();
  const { query, pathname } = useLocation();

  const filterRef = useRef();
  const mounted = useRef(false);
  const [search, setSearch] = useState({
    ...query,
    branchId: query.branchId || defaultBranch?.id,
    page: query?.page || variables.PAGINATION.PAGE,
    schoolYearId: query?.schoolYearId || user?.schoolYear?.id,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    Month: query?.Month ? query?.Month : moment().startOf('month').format('MM'),
    Year: query?.Year ? query?.Year : Helper.getDate(moment(), variables.DATE_FORMAT.YEAR),
  });

  const onRemove = (id) => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'kitchenMenus/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              dispatch({
                type: 'kitchenMenus/GET_DATA',
                payload: { ...search },
              });
              history.push(
                `${pathname}?${Helper.convertParamSearchConvert(
                  {
                    ...search,
                    Month: Helper.getDate(search.date, variables.DATE_FORMAT.DATE_MONTH),
                    Year: Helper.getDate(search.date, variables.DATE_FORMAT.YEAR),
                  },
                  variables.QUERY_STRING,
                )}`,
              );
            }
          },
        });
      },
    });
  };

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
      width: `${user?.roleCode === "sale" || user?.roleCode === "teacher" ? 80 : 125}`,
      fixed: 'right',
      render: (record) => (
        <div className="d-flex justify-content-end">
         {user?.roleCode === "sale" || user?.roleCode === "teacher" ? ""  :  (
            <Button color="danger" icon="remove" onClick={() => onRemove(record.id)} />
          )}
          <Button
            color="primary"
            icon="edit"
            className="ml10"
            onClick={() => history.push(`${pathname}/${record?.id}/chi-tiet`)}
          />
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

  const changeFilterDebouce = debounce(() => {
    setSearch((prevSearch) => ({
      ...prevSearch,
    }));
  }, 300);

  const changeFilter = (e) => (value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [e]: value,
    }));
  };

  const changeMonthFilter = (name) => (value) => {
    changeFilterDebouce(name, value);
    setSearch((prevSearch) => ({
      ...prevSearch,
      Month: moment(value).startOf('month').format('MM'),
      Year: Helper.getDate(value, variables.DATE_FORMAT.YEAR),
    }));
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
          Month: Helper.getDate(search.date, variables.DATE_FORMAT.DATE_MONTH),
          Year: Helper.getDate(search.date, variables.DATE_FORMAT.YEAR),
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
    if (!defaultBranch?.id) {
      dispatch({
        type: 'kitchenMenus/GET_BRANCHES',
        payload: {},
      });
    }
    dispatch({
      type: 'kitchenMenus/GET_YEARS',
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
          {user?.roleCode === "sale" || user?.roleCode === "teacher" ? ""  :  (
            <Button
              className="ml-auto"
              color="success"
              icon="plus"
              onClick={() => history.push(`${pathname}/tao-moi`)}
            >
              Tạo thực đơn
            </Button>
          )}
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
                date: moment(search.date),
              }}
            >
              <Pane className="row">
                {!defaultBranch?.id && (
                  <Pane className="col-lg-3">
                    <FormItem
                      type={variables.SELECT}
                      name="branchId"
                      onChange={(e) => changeFilter('branchId')(e)}
                      data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                      allowClear={false}
                    />
                  </Pane>
                )}
                {defaultBranch?.id && (
                  <Pane className="col-lg-3">
                    <FormItem
                      type={variables.SELECT}
                      name="branchId"
                      onChange={(e) => changeFilter('branchId')(e)}
                      data={[defaultBranch]}
                      allowClear={false}
                    />
                  </Pane>
                )}
                <Pane className="col-lg-3">
                  <FormItem
                    type={variables.SELECT}
                    name="classTypeId"
                    onChange={(e) => changeFilter('classTypeId')(e)}
                    data={[{ id: null, name: 'Chọn tất loại lớp' }, ...classTypes]}
                    allowClear={false}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    type={variables.MONTH_PICKER}
                    name="date"
                    onChange={(e) => changeMonthFilter('date')(e)}
                    allowClear={false}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Chọn tất cả năm học' }, ...years]}
                    name="schoolYearId"
                    onChange={(e) => changeFilter('schoolYearId')(e)}
                    type={variables.SELECT}
                    placeholder="Chọn năm học"
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
