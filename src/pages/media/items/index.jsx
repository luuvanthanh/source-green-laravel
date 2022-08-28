import { memo, useRef, useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useLocation, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import moment from 'moment';
import { debounce } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';

import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
import localVariables from '../utils/variables';

const Index = memo(() => {
  const mounted = useRef(false);
  const mountedSet = (f) => (v) => mounted?.current && f(v);

  const dispatch = useDispatch();
  const [
    { pagination, error, data, years },
    loading,
    { defaultBranch,user },
  ] = useSelector(({ loading: { effects }, media, user }) => [media, effects, user]);

  const history = useHistory();
  const { query, pathname } = useLocation();

  const filterRef = useRef();

  const [category, setCategory] = useState({
    branches: [],
    classes: [],
  });

  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    sentDateFrom: query?.sentDateFrom || moment().startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
    sentDateTo: query?.sentDateTo || moment().endOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
    description: query?.description,
    branchId: query?.branchId || defaultBranch?.id,
    classId: query?.classId,
    schoolYearId: query?.schoolYearId || user?.schoolYear?.id,
  });

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      className: 'min-width-70',
      align: 'center',
      render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
    },
    {
      title: 'Thời gian',
      key: 'creationTime',
      className: 'min-width-180',
      width: 180,
      render: (record) => (
        <Text size="normal">
          {Helper.getDate(record.sentDate, variables.DATE_FORMAT.DATE_TIME)}
        </Text>
      ),
    },
    {
      title: 'Năm học',
      key: 'year',
      width: 180,
      className: 'min-width-180',
      render: (record) => record?.schoolYear?.yearFrom ? <Text size="normal">{record?.schoolYear?.yearFrom} - {record?.schoolYear?.yearTo}</Text> : "",
    },
    {
      title: 'Cơ sở',
      key: 'branch',
      width: 120,
      className: 'min-width-120',
      render: (record) => (
        <Text size="normal">{record?.studentMaster?.student?.class?.branch?.name || record?.studentMaster?.student?.branch?.name}</Text>
      ),
    },
    {
      title: 'Lớp',
      key: 'class',
      width: 120,
      className: 'min-width-120',
      render: (record) => <Text size="normal">{record?.studentMaster?.student?.class?.name}</Text>,
    },
    {
      title: 'Mô tả',
      key: 'description',
      width: 150,
      className: 'min-width-150',
      render: (record) => <Text size="normal">{record?.description}</Text>,
    },
    {
      title: 'Phụ huynh',
      key: 'parent',
      width: 120,
      className: 'min-width-120',
      render: (record) => (
        <Text size="normal">
          {record?.studentMaster?.farther?.fullName || record?.studentMaster?.mother?.fullName}
        </Text>
      ),
    },
    {
      title: 'Học sinh',
      key: 'student',
      width: 120,
      className: 'min-width-120',
      render: (record) => <Text size="normal">{record?.studentMaster?.student?.fullName}</Text>,
    },
    {
      key: 'action',
      className: 'min-width-100',
      width: 100,
      fixed: 'right',
      render: (record) => (
        <div className={styles['list-button']}>
          <Button
            color="success"
            ghost
            onClick={() => history.push(`/hinh-anh/${record?.id}/chi-tiet`)}
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  /**
   * Function set pagination
   * @param {integer} page page of pagination
   * @param {integer} size size of pagination
   */
  const changePagination = ({ page, limit }) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      page,
      limit,
    }));
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  const paginationTable = (pagination) =>
    Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        changePagination(response);
      },
    });

  const changeFilterDebouce = debounce((name, value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  }, 300);

  const changeFilter = (name) => (value) => {
    changeFilterDebouce(name, value);
  };

  const fetchClasses = (branchId) => {
    dispatch({
      type: 'categories/GET_CLASSES',
      payload: {
        branch: branchId,
      },
      callback: (res) => {
        if (res) {
          mountedSet(setCategory)((prev) => ({
            ...prev,
            classes: res?.items || [],
          }));
        }
      },
    });
  };

  const changeFilterBranch = (name) => (value) => {
    changeFilterDebouce(name, value);
    fetchClasses(name);
  };

  const changeFilterDate = (values) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      sentDateFrom: values ? values[0].format(variables.DATE_FORMAT.DATE_AFTER) : null,
      sentDateTo: values ? values[1].format(variables.DATE_FORMAT.DATE_AFTER) : null,
    }));
  };

  const fetchMedia = useCallback(() => {
    dispatch({
      type: 'media/GET_DATA',
      payload: {
        ...search,
        status: localVariables.CLASSIFY_STATUS.POST,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
        sentDateFrom: Helper.getDate(search.sentDateFrom, variables.DATE_FORMAT.DATE_AFTER),
        sentDateTo: Helper.getDate(search.sentDateTo, variables.DATE_FORMAT.DATE_AFTER),
      }),
    });
  }, [search]);

  const fetchBranches = () => {
    if (search.branchId) {
      fetchClasses(search.branchId);
    }
    dispatch({
      type: 'categories/GET_BRANCHES',
      callback: (res) => {
        if (res) {
          mountedSet(setCategory)((prev) => ({
            ...prev,
            branches: res?.parsePayload || [],
          }));
        }
      },
    });
    dispatch({
      type: 'media/GET_YEARS',
      payload: {},
    });
  };

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <>
      <Helmet title="Danh sách hình ảnh" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Danh sách hình ảnh</Heading>
        </Pane>

        <Pane className="card">
          <Pane className="p20">
            <Form
              layout="vertical"
              ref={filterRef}
              initialValues={{
                ...search,
                rangeTime: [
                  search?.sentDateFrom ? moment(search?.sentDateFrom) : null,
                  search?.sentDateTo ? moment(search?.sentDateTo) : null,
                ],
                branchId: search.branchId || null,
                classId: search.classId || null,
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    name="description"
                    type={variables.INPUT_SEARCH}
                    onChange={({ target: { value } }) => changeFilter('description')(value)}
                    placeholder="Nhập từ khóa tìm kiếm"
                  />
                </Pane>
                {!defaultBranch?.id && (
                  <Pane className="col-lg-3">
                    <FormItem
                      name="branchId"
                      type={variables.SELECT}
                      data={[{ name: 'Chọn tất cả', id: null }, ...category?.branches]}
                      onChange={(value) => changeFilterBranch('branchId')(value)}
                      allowClear={false}
                    />
                  </Pane>
                )}
                {defaultBranch?.id && (
                  <Pane className="col-lg-3">
                    <FormItem
                      name="branchId"
                      type={variables.SELECT}
                      data={defaultBranch?.id ? [defaultBranch] : []}
                      onChange={(value) => changeFilterBranch('branchId')(value)}
                      allowClear={false}
                    />
                  </Pane>
                )}
                <Pane className="col-lg-3">
                  <FormItem
                    name="classId"
                    type={variables.SELECT}
                    data={[{ name: 'Chọn tất cả', id: null }, ...category?.classes]}
                    onChange={(value) => changeFilter('classId')(value)}
                    allowClear={false}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="rangeTime"
                    type={variables.RANGE_PICKER}
                    onChange={changeFilterDate}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Chọn tất cả năm học' }, ...years]}
                    name="schoolYearId"
                    onChange={(value) => changeFilter('schoolYearId')(value)}
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
              loading={loading['media/GET_DATA']}
              isError={error.isError}
              pagination={paginationTable(pagination)}
              rowKey={(record) => record.id}
              scroll={{ x: '100%', y: '60vh' }}
            />
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
