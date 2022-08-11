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
  const [
    { pagination, error, data },
    loading,
    { defaultBranch },
  ] = useSelector(({ loading: { effects }, physicalStudents, user }) => [
    physicalStudents,
    effects,
    user,
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
    keyWord: query?.keyWord,
    branchId: query?.branchId || defaultBranch?.id,
    classId: query?.classId,
  });

  const columns = [
    {
      title: 'Học sinh',
      key: 'student',
      className: 'min-width-300',
      width: 300,
      render: (record) => (
        <AvatarTable
          fileImage={Helper.getPathAvatarJson(record?.student?.fileImage)}
          fullName={record?.student?.fullName || ''}
        />
      ),
    },
    {
      title: 'Tuổi (tháng)',
      key: 'age',
      className: 'min-width-120',
      align: 'center',
      render: (record) => <Text size="normal">{record?.student?.age || 0} tháng</Text>,
    },
    {
      title: 'Giới tính',
      key: 'gender',
      className: 'min-width-120',
      align: 'center',
      render: (record) => variables.GENDERS[record?.student?.sex] || '',
    },
    {
      title: 'Cơ sở',
      key: 'branch',
      className: 'min-width-200',
      with: 200,
      render: (record) => record?.student?.class?.branch?.name || '',
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-200',
      render: (record) => record?.student?.class?.name || '',
    },
    {
      title: 'Chiều cao (cm)',
      key: 'height',
      className: 'min-width-120',
      align: 'center',
      render: (record) =>
        record?.height?.value ? (
          <>
            <span className="font-weight-bold mr5">{record?.height?.value}</span>
            <span>
              ({Helper.getDate(record?.height?.reportDate, variables.DATE_FORMAT.DATE_MONTH)})
            </span>
          </>
        ) : (
          ''
        ),
    },
    {
      title: 'Cân nặng (kg)',
      children: [
        {
          title: 'Hiện tại',
          key: 'present',
          className: 'min-width-120',
          align: 'center',
          render: (record) =>
            record?.weight?.value ? (
              <span className="font-weight-bold text-danger">{record?.weight?.value || 0}</span>
            ) : (
              ''
            ),
        },
        {
          title: 'Cần đạt',
          key: 'Finish',
          className: 'min-width-120',
          align: 'center',
          render: (record) => (
            <span className="font-weight-bold text-success">
              {record?.recommendWeight ? record?.recommendWeight.toFixed(1) : 0}
            </span>
          ),
        },
      ],
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
            onClick={() => history.push(`/phat-trien-the-chat/${record?.student?.id}/chi-tiet`)}
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

  const changeFilterBranch = debounce((name, value) => {
    filterRef?.current?.setFieldsValue({ classId: undefined });
    fetchClasses(value);
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
      classId: undefined,
    }));
  }, 300);

  const fetchBranches = () => {
    if (search.branchId) {
      fetchClasses(search.branchId);
    }
    if (!defaultBranch?.id) {
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
    }
  };

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    dispatch({
      type: 'physicalStudents/GET_DATA',
      payload: {
        ...search,
        isOverWeight: 'true',
      },
      callback: () => {},
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
      <Helmet title="Học sinh thừa cân" />
      <Pane className="p20">
        <Pane className="d-flex justify-content-between align-items-center mb20">
          <Heading type="page-title">Học sinh thừa cân</Heading>
          <Button
            color="success"
            icon="plus"
            onClick={() => history.push('/phat-trien-the-chat/tao-the-chat')}
          >
            Tạo nhập thể chất
          </Button>
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
                    name="keyWord"
                    type={variables.INPUT_SEARCH}
                    onChange={({ target: { value } }) => changeFilter('keyWord')(value)}
                    placeholder="Nhập từ khóa tìm kiếm"
                  />
                </Pane>
                {!defaultBranch?.id && (
                  <Pane className="col-lg-3">
                    <FormItem
                      name="branchId"
                      type={variables.SELECT}
                      data={[{ name: 'Chọn tất cả', id: null }, ...category?.branches]}
                      onChange={(value) => changeFilterBranch('branchId', value)}
                      allowClear={false}
                    />
                  </Pane>
                )}
                {defaultBranch?.id && (
                  <Pane className="col-lg-3">
                    <FormItem
                      name="branchId"
                      type={variables.SELECT}
                      data={[defaultBranch]}
                      onChange={(value) => changeFilterBranch('branchId', value)}
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
              </Pane>
            </Form>

            <Table
              bordered
              columns={columns}
              dataSource={data}
              loading={loading['physicalStudents/GET_DATA']}
              isError={error.isError}
              pagination={paginationTable(pagination)}
              rowKey={(record) => record?.student?.id}
              scroll={{ x: '100%' }}
            />
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
