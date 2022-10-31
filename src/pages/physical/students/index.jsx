import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useLocation, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import moment from 'moment';
import { debounce, head } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import classnames from 'classnames';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
import styleModule from './styles.module.scss';

const Index = memo(() => {
  const mounted = useRef(false);
  const mountedSet = (f) => (v) => mounted?.current && f(v);

  const dispatch = useDispatch();
  const [
    { pagination, years },
    loading,
    { defaultBranch, user },
  ] = useSelector(({ loading: { effects }, physicalStudents, user }) => [
    physicalStudents,
    effects,
    user,
  ]);

  const history = useHistory();
  const { query, pathname } = useLocation();

  const filterRef = useRef();
  const [dataTable, setDataTable] = useState([]);


  const [category, setCategory] = useState({
    branches: [],
    classes: [],
  });
  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    keyWord: query?.keyWord,
    schoolYearId: query?.schoolYearId || user?.schoolYear?.id,
    branchId: query?.branchId || defaultBranch?.id,
    classId: query?.classId || user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER && head(user?.objectInfo?.classTeachers)?.classId,
  });

  const onchangOpen = (e, key, keyName, record) => {
    setDataTable(dataTable?.map((i, index) => ({
      ...i,
      openHeight: key === 'height' && e === index ? !i?.openHeight : i?.openHeight,
      openWight: key === 'weight' && e === index ? !i?.openWight : i?.openWight,
      inputHeight: key === 'height' && e === index ? !i?.inputHeight : i?.inputHeight,
      inputWight: key === 'weight' && e === index ? !i?.inputWight : i?.inputWight,
    })));
    const id = key === 'height' ? record?.height?.id : record?.weight?.id;
    if (keyName === 'save') {
      dispatch({
        type: 'physicalStudents/PUT',
        payload: { id, value: key === 'height' ? record?.height?.value : record?.weight?.value },
        callback: () => {
        },
      });
    }
  };

  const onChangeInput = (indexValue, e, key) => {
    setDataTable(dataTable?.map((i, index) => ({
      ...i,
      height: {
        ...i?.height,
        value: key === 'height' && e >= 0 && e && indexValue === index ? e : i?.height?.value,
      },
      weight: {
        ...i?.weight,
        value: key === 'weight' && e >= 0 && e && indexValue === index ? e : i?.weight?.value,
      }
    })));
  };

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
      width: 120,
      align: 'center',
      render: (record) => <Text size="normal">{record?.student?.age || 0} tháng</Text>,
    },
    {
      title: 'Giới tính',
      key: 'gender',
      className: 'min-width-120',
      width: 120,
      align: 'center',
      render: (record) => variables.GENDERS[record?.student?.sex] || '',
    },
    {
      title: 'Cơ sở',
      key: 'branch',
      className: 'min-width-200',
      width: 200,
      render: (record) => record?.student?.class?.branch?.name || '',
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-200',
      width: 200,
      render: (record) => record?.student?.class?.name || '',
    },
    {
      title: 'Chiều cao (cm)',
      key: 'height',
      className: 'min-width-170',
      width: 170,
      align: 'center',
      render: (text, record, index) =>
        record?.height?.value ? (
          <div className={styleModule['wrapper-value']}>
            {
              record?.inputHeight && record?.openHeight ?
                <FormItem
                  className={classnames('mb-0', styleModule['icon-input'])}
                  type={variables.INPUT_COUNT}
                  value={record?.height?.value || ''}
                  min={0}
                  onChange={(e) => onChangeInput(index, e, 'height')}
                />
                :
                <>
                  <span className="font-weight-bold mr5">{record?.height?.value}</span>
                  <span>
                    ({Helper.getDate(record?.height?.reportDate, variables.DATE_FORMAT.DATE_MONTH)})
                  </span>
                </>
            }
            {user?.schoolYear?.id === search?.schoolYearId && (
              record?.openHeight ?
                <img src="/images/icon/save.svg" alt="group" className={styleModule['icon-edit']} onClick={() => onchangOpen(index, 'height', 'save', record)} role="presentation" />
                :
                <img src="/images/icon/edit.svg" alt="group" className={styleModule['icon-edit']} onClick={() => onchangOpen(index, 'height', 'edit', record)} role="presentation" />
            )}
          </div>
        ) : (
          ''
        ),
    },
    {
      title: 'Cân nặng (kg)',
      key: 'wight',
      className: 'min-width-170',
      width: 170,
      align: 'center',
      render: (text, record, index) =>
        record?.weight?.value ? (
          <div className={styleModule['wrapper-value']}>
            {
              record?.inputWight ?
                <FormItem
                  className={classnames('mb-0', styleModule['icon-input'])}
                  type={variables.INPUT_COUNT}
                  value={record?.weight?.value || ''}
                  onChange={(e) => onChangeInput(index, e, 'weight')}
                />
                :
                <>
                  <span className="font-weight-bold mr5">{record?.weight?.value}</span>
                  <span>
                    ({Helper.getDate(record?.weight?.reportDate, variables.DATE_FORMAT.DATE_MONTH)})
                  </span>
                </>
            }
            {user?.schoolYear?.id === search?.schoolYearId && (
              record?.openWight ?
                <img src="/images/icon/save.svg" alt="group" className={styleModule['icon-edit']} onClick={() => onchangOpen(index, 'weight', 'save', record)} role="presentation" />
                :
                <img src="/images/icon/edit.svg" alt="group" className={styleModule['icon-edit']} onClick={() => onchangOpen(index, 'weight', 'edit', record)} role="presentation" />
            )}
          </div>
        ) : (
          ''
        ),
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
      },
      callback: (res) => {
        if (res) {
          setDataTable(res?.items?.map(i => ({
            ...i,
            openWight: false,
            openHeight: false,
            inputHeight: false,
            inputWight: false,
          })));
        }
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  }, [search]);

  useEffect(() => {
    fetchBranches();
    dispatch({
      type: 'physicalStudents/GET_YEARS',
      payload: {},
    });
  }, []);

  return (
    <>
      <Helmet title="Tất cả học sinh" />
      <Pane className="p20">
        <Pane className="d-flex justify-content-between align-items-center mb20">
          <Heading type="page-title">Tất cả học sinh</Heading>
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
                    placeholder="Nhập từ khóa tìm kiếm theo tên"
                  />
                </Pane>
                {!defaultBranch?.id && (
                  <Pane className="col-lg-3">
                    <FormItem
                      name="branchId"
                      type={variables.SELECT}
                      data={[{ name: 'Chọn tất cả cơ sở', id: null }, ...category?.branches]}
                      onChange={(value) => changeFilterBranch('branchId', value)}
                      allowClear={false}
                      loading={loading['categories/GET_BRANCHES']}
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
                      loading={loading['categories/GET_BRANCHES']}
                    />
                  </Pane>
                )}
                <Pane className="col-lg-3">
                  <FormItem
                    name="classId"
                    type={variables.SELECT}
                    data={user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER ? [...category?.classes?.filter(i => i?.id === head(user?.objectInfo?.classTeachers)?.classId)] : [{ name: 'Chọn tất cả lớp', id: null }, ...category?.classes]}
                    onChange={(value) => changeFilter('classId')(value)}
                    allowClear={false}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="schoolYearId"
                    type={variables.SELECT}
                    data={[{ name: 'Chọn tất cả năm học', id: null }, ...years]}
                    onChange={(value) => changeFilter('schoolYearId')(value)}
                    allowClear={false}
                  />
                </Pane>
              </Pane>
            </Form>

            <Table
              bordered
              columns={columns}
              dataSource={dataTable}
              loading={loading['physicalStudents/GET_DATA']}
              // isError={error.isError}
              pagination={paginationTable(pagination)}
              rowKey={(record) => record?.student?.id}
              scroll={{ x: '100%', y: '60vh' }}
            />
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
