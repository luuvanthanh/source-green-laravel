import { memo, useRef, useState, useEffect } from 'react';
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
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';

const Index = memo(() => {
  const mounted = useRef(false);
  const mountedSet = (f) => (v) => mounted?.current && f(v);

  const dispatch = useDispatch();
  const [{ pagination, error, data }, loading] = useSelector(({ loading: { effects }, physicalStudentsUnderweight }) => [
    physicalStudentsUnderweight,
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
    key: query?.key,
    branchId: query?.branchId,
    classId: query?.classId,
  });

  const columns = [
    {
      title: 'Học sinh',
      key: 'student',
      className: 'min-width-140',
      render: (record) => (
        <AvatarTable
          fileImage={Helper.getPathAvatarJson(record?.fileImage)}
          fullName={record?.fullName || ''}
        />
      )
    },
    {
      title: 'Tuổi (tháng)',
      key: 'age',
      className: 'min-width-120',
      render: (record) => (
        <Text size="normal">{record?.age || 0} tháng</Text>
      ),
    },
    {
      title: 'Giới tính',
      key: 'gender',
      className: 'min-width-120',
      render: (record) => record?.gender || ''
    },
    {
      title: 'Cơ sở',
      key: 'branch',
      className: 'min-width-120',
      render: (record) => record?.branch || ''
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-120',
      render: (record) => record?.class || ''
    },
    {
      title: 'Chiều cao (cm)',
      key: 'height',
      className: 'min-width-150',
      render: (record) => record?.height ? (
        <>
          <span className="font-weight-bold mr5">{record?.height}</span>
          <span>(01/06)</span>
        </>
      ) : ''
    },
    {
      title: 'Cân nặng (kg)',
      children: [
        {
          title: 'Hiện tại',
          key: 'present',
          className: 'min-width-120',
          align: 'center',
          render: (record) => !record?.present ? (
            <span className="font-weight-bold text-danger">{record?.present || 30}</span>
          ) : ''
        },
        {
          title: 'Cần đạt',
          key: 'Finish',
          className: 'min-width-120',
          align: 'center',
          render: (record) => !record?.present ? (
            <span className="font-weight-bold text-success">{record?.present || 30}</span>
          ) : ''
        },
      ]
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
            onClick={() => history.push(`/phat-trien-the-chat/${record?.id}/chi-tiet`)}
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
  const paginationTable = (pagination) => Helper.paginationNet({
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
    dispatch({
      type: 'physicalStudentsUnderweight/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  }, [search]);

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <>
      <Helmet title="Học sinh thiếu cân" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Học sinh thiếu cân</Heading>
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
                    name="key"
                    type={variables.INPUT_SEARCH}
                    onChange={({ target: { value } }) => changeFilter('key')(value)}
                    placeholder="Nhập từ khóa tìm kiếm"
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="branchId"
                    type={variables.SELECT}
                    data={[{ name: 'Chọn tất cả', id: null }, ...category?.branches]}
                    onChange={(value) => changeFilterBranch('branchId')(value)}
                    allowClear={false}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="classId"
                    type={variables.SELECT}
                    data={[{ name: 'Chọn tất cả', id: null }, ...category?.classes]}
                    onChange={(value) => changeFilter('classId')(value)}
                    allowClear={false}
                  />
                </Pane>
              </Pane>
            </Form>

            <Table
              bordered
              columns={columns}
              dataSource={data}
              loading={loading['physicalStudentsUnderweight/GET_DATA']}
              isError={error.isError}
              pagination={paginationTable(pagination)}
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
