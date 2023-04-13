import { memo, useRef, useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useLocation, useHistory } from 'umi';
import csx from 'classnames';
import moment from 'moment';
import { debounce } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';

import styles from '@/assets/styles/Common/common.scss';
import { Helper, variables } from '@/utils';
import Modal from './component/modal-exchange-dishes';
import HelperModules from '../utils/Helper';

const Index = memo(() => {
  const [
    loadingReducer,
    paginationReducer,
    data,
    years,
    defaultBranch,
  ] = useSelector(({ loading, menuStudentExchangeFood = {}, user = {} }) => [
    loading,
    menuStudentExchangeFood?.paginationReducer,
    menuStudentExchangeFood?.data,
    menuStudentExchangeFood?.years,
    user?.user,
  ]);
  const loading = loadingReducer?.effects['menuStudentExchangeFood/GET_DATA'];

  const history = useHistory();
  const { query, pathname } = useLocation();
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const filterRef = useRef();
  const [checkModal, setCheckModal] = useState(false);
  const [dataModal, setDataModal] = useState();
  const [dataYear, setDataYear] = useState(defaultBranch ? defaultBranch?.schoolYear : {});
  const [category, setCategory] = useState({
    branches: [],
    classes: [],
  });

  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    keyWord: query?.keyWord,
    schoolYearId: query?.schoolYearId || defaultBranch?.schoolYear?.id,
    branchId: query?.branchId || defaultBranch?.defaultBranch?.id,
    classId: query?.classId,
  });

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

  const loadData = useCallback(() => {
    dispatch({
      type: 'menuStudentExchangeFood/GET_DATA',
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

  const onChangeDate = (e, type) => {
    debouncedSearch(moment(e).startOf('month').format('YYYY-MM-DD'), type);
  };

  const onModal = (record) => {
    setCheckModal(true);
    setDataModal(record);
  };

  const header = () => [
    {
      title: 'STT',
      key: 'no',
      width: 80,
      render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
    },
    {
      title: 'Tên học sinh',
      key: 'studentName',
      className: 'min-width-200',
      width: 200,
      render: (record) => <Text size="normal">{record.studentName}</Text>,
    },
    {
      title: 'Cơ sở',
      key: 'branchName',
      className: 'min-width-150',
      width: 150,
      render: (record) => <Text size="normal">{record.branchName}</Text>,
    },
    {
      title: 'Lớp',
      key: 'className',
      className: 'min-width-150',
      width: 150,
      render: (record) => <Text size="normal">{record.className}</Text>,
    },
    {
      title: 'Ngày thực đơn',
      key: 'date',
      className: 'min-width-150',
      width: 150,
      render: (record) => (
        <Text size="normal">{Helper.getDate(record.date, variables.DATE_FORMAT.DATE)}</Text>
      ),
    },
    {
      title: 'Món theo thực đơn',
      key: 'foodName',
      className: 'min-width-150',
      width: 150,
      render: (record) => <Text size="normal">{record.foodName}</Text>,
    },
    {
      title: 'Nguyên liệu dị ứng',
      key: 'materialName',
      className: 'min-width-150',
      width: 150,
      render: (record) => <Text size="normal">{record.materialName}</Text>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      className: 'min-width-150',
      width: 150,
      render: (record) => HelperModules.tagStatusConfirm(record.status),
    },
    {
      title: 'Món đã đổi',
      key: 'newFoodName',
      className: 'min-width-150',
      width: 150,
      render: (record) => <Text size="normal">{record.newFoodName}</Text>,
    },
    {
      key: 'action',
      width: 100,
      render: (record) => (
        <div className={styles['list-button']}>
          {new Date(record?.date).getTime() >= new Date().getTime() && (
            <Button color="primary" icon="spinner9" onClick={() => onModal(record)} />
          )}
        </div>
      ),
    },
  ];

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
    dispatch({
      type: 'menuStudentExchangeFood/GET_YEARS',
      payload: {},
    });
  }, []);

  const onChangeSelect = (e, type) => {
    debouncedSearch(e, type);
    if (type === 'branchId') {
      fetchClasses(e);
    }
    if (type === 'schoolYearId') {
      const data = years?.find((i) => i.id === e);
      setDataYear(data);
      fetchClasses(e);
    }
  };

  return (
    <>
      <Helmet title="Học sinh cần đổi món" />
      <Modal setCheckModal={setCheckModal} checkModal={checkModal} dataModal={dataModal} />
      <Pane className={csx(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Text color="dark">Học sinh cần đổi món</Text>
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
                    name="keyWord"
                    onChange={(event) => onChange(event, 'keyWord')}
                    placeholder="Nhập từ khóa"
                    type={variables.INPUT_SEARCH}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="schoolYearId"
                    data={[{ id: null, name: 'Chọn tất cả năm học' }, ...years]}
                    onChange={(event) => onChangeSelect(event, 'schoolYearId')}
                    placeholder="Chọn năm học"
                    type={variables.SELECT}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="month"
                    onChange={(event) => onChangeDate(event, 'month')}
                    placeholder="Chọn tháng"
                    type={variables.MONTH_PICKER}
                    disabledDate={(current) =>
                      (dataYear?.startDate &&
                        current < moment(dataYear?.startDate).startOf('day')) ||
                      (dataYear?.endDate && current >= moment(dataYear?.endDate).endOf('day'))
                    }
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
