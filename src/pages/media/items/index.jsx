import { memo, useMemo, useRef, useState, useCallback, useEffect } from 'react';
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
  const [{ pagination, error, data }, loading] = useSelector(({ loading: { effects }, media }) => [
    media,
    effects,
  ]);

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
    sentDateFrom: query?.sentDateFrom,
    sentDateTo: query?.sentDateTo,
    description: query?.description,
    branchId: query?.branchId,
    classId: query?.classId,
  });

  const columns = [
    {
      title: 'STT',
      key: 'index',
      className: 'min-width-70',
      align: 'center',
      render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
    },
    {
      title: 'Thời gian',
      key: 'creationTime',
      className: 'min-width-140',
      render: (record) => (
        <Text size="normal">
          {Helper.getDate(record.creationTime, variables.DATE_FORMAT.DATE_TIME)}
        </Text>
      ),
    },
    {
      title: 'Cơ sở',
      key: 'branch',
      className: 'min-width-120',
      render: (record) => (
        <Text size="normal">{record?.studentMaster?.student?.class?.branch?.name}</Text>
      ),
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-120',
      render: (record) => <Text size="normal">{record?.studentMaster?.student?.class?.name}</Text>,
    },
    {
      title: 'Mô tả',
      key: 'description',
      className: 'min-width-150',
      render: (record) => <Text size="normal">{record?.description}</Text>,
    },
    {
      title: 'Phụ huynh',
      key: 'parent',
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
      className: 'min-width-120',
      render: (record) => <Text size="normal">{record?.studentMaster?.student?.fullName}</Text>,
    },
    {
      key: 'action',
      className: 'min-width-80',
      width: 80,
      render: (record) => (
        <div className={styles['list-button']}>
          <Button
            color="success"
            ghost
            onClick={() => history.push(`/ghi-nhan/${record?.id}/chi-tiet`)}
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
      pageSize: query?.limit || variables.PAGINATION.PAGE_SIZE,
      defaultCurrent: Number(search.page),
      current: Number(search.page),
      hideOnSinglePage: (pagination?.total || 0) <= 10,
      showSizeChanger: variables.PAGINATION.SHOW_SIZE_CHANGER,
      pageSizeOptions: variables.PAGINATION.PAGE_SIZE_OPTIONS,
      locale: { items_per_page: variables.PAGINATION.PER_PAGE_TEXT },
      onChange: (page, limit) => {
        setSearch((prev) => ({
          ...prev,
          page,
          limit,
        }));
        // callback
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
      query: Helper.convertParamSearch(search),
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
      <Helmet title="Danh sách ghi nhận" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Danh sách ghi nhận</Heading>
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
                <Pane className="col-lg-3">
                  <FormItem
                    name="branchId"
                    type={variables.SELECT}
                    data={category?.branches || []}
                    onChange={(value) => changeFilterBranch('branchId')(value)}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="classId"
                    type={variables.SELECT}
                    data={category?.classes || []}
                    onChange={(value) => changeFilter('classId')(value)}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="rangeTime"
                    type={variables.RANGE_PICKER}
                    onChange={changeFilterDate}
                  />
                </Pane>
              </Pane>
            </Form>

            <Table
              columns={columns}
              dataSource={data}
              loading={loading['media/GET_DATA']}
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
