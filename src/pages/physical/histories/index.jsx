import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Spin } from 'antd';
import { useLocation, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import moment from 'moment';
import { debounce, isEmpty, map,head } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import { variables, Helper } from '@/utils';

const Index = memo(() => {
  const dispatch = useDispatch();
  const [
    { pagination, error, data, branches },
    loading,
    { defaultBranch }
  ] = useSelector(({ loading: { effects }, physicalHistory, user }) => [physicalHistory, effects, user]);

  const mounted = useRef(false);
  const history = useHistory();
  const { query, pathname } = useLocation();
  const filterRef = useRef();
  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    employeeId: query?.employeeId,
    fromDate: query?.fromDate || moment().startOf('weeks')?.format(variables.DATE_FORMAT.DATE_AFTER),
    toDate: query?.toDate ||  moment().endOf('weeks')?.format(variables.DATE_FORMAT.DATE_AFTER),
    branchId: query?.branchId || defaultBranch?.id,
    // schoolYearId: query?.schoolYearId || user?.schoolYear?.id,
  });
  const [employee, setEmployee] = useState([]);
  const [defaultBranchs] = useState(defaultBranch?.id ? [defaultBranch] : []);

  const columns = [
    {
      title: 'Thời gian',
      key: 'creationTime',
      className: 'min-width-200',
      with: 200,
      render: (record) => (
        <Text size="normal">
          {Helper.getDate(record?.logTime, variables.DATE_FORMAT.TIME_DATE_VI)}
        </Text>
      ),
    },
    {
      title: 'Tên tài khoản',
      key: 'name',
      className: 'min-width-200',
      with: 200,
      render: (record) => <Text size="normal">{record?.editor?.name || ''}</Text>,
    },
    {
      title: 'Nội dung',
      key: 'content',
      className: 'min-width-400',
      render: (record) =>
        !isEmpty(record?.editedStudentPhysicals)
          ? `Nhập thể chất cho ${map(record?.editedStudentPhysicals, 'student.fullName').join(
            ', ',
          )}`
          : '',
    },
    {
      title: 'Cơ sở',
      key: 'branch',
      className: 'min-width-200',
      with: 200,
      render: (record) => <Text size="normal">{head(record?.editedStudentPhysicals)?.student?.branch?.name || ''}</Text>,
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

  const changeFilter = debounce((name, value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  }, 300);

  const changeFilterDate = debounce((values) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      fromDate: values ? values[0].format(variables.DATE_FORMAT.DATE_AFTER) : null,
      toDate: values ? values[1].format(variables.DATE_FORMAT.DATE_AFTER) : null,
    }));
  }, 300);

  const getEmployees = (fullName) => {
    dispatch({
      type: 'categories/GET_TEACHERS',
      payload: {
        fullName,
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
        include: Helper.convertIncludes(['positionLevel']),
      },
      callback: (res) => {
        if (res) {
          setEmployee(res?.parsePayload);
        }
      },
    });
  };

  useEffect(() => {
    mounted.current = true;
    getEmployees('');
    return mounted.current;
  }, []);

  useEffect(() => {
    dispatch({
      type: 'physicalHistory/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  }, [search]);

  const onSearch = debounce((val) => {
    getEmployees(val);
  }, 300);


  useEffect(() => {
    dispatch({
      type: 'physicalHistory/GET_YEARS',
      payload: {},
    });
    dispatch({
      type: 'physicalHistory/GET_BRANCHES',
      payload: {},
    });
  }, []);

  return (
    <>
      <Helmet title="Lịch sử" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Lịch sử</Heading>
        </Pane>

        <Pane className="card">
          <Pane className="p20">
            <Form
              layout="vertical"
              ref={filterRef}
              initialValues={{
                ...search,
                rangeTime: [
                  search?.fromDate ? moment(search?.fromDate) : null,
                  search?.toDate ? moment(search?.toDate) : null,
                ],
                branchId: search.branchId || null,
                classId: search.classId || null,
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    name="employeeId"
                    data={
                      loading['categories/GET_TEACHERS']
                        ? []
                        : employee.map((item) => ({ ...item, name: item?.fullName || '-' }))
                    }
                    type={variables.SELECT}
                    onChange={(value) => changeFilter('employeeId', value)}
                    onSearch={onSearch}
                    notFoundContent={
                      loading['categories/GET_TEACHERS'] ? <Spin size="small" /> : null
                    }
                    filterOption
                    placeholder="Tất cả nhân viên"
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    name="rangeTime"
                    type={variables.RANGE_PICKER}
                    onChange={changeFilterDate}
                  />
                </Pane>
                {/* <Pane className="col-lg-3">
                  <FormItem
                    name="schoolYearId"
                    type={variables.SELECT}
                    data={[{ name: 'Chọn tất cả năm học', id: null }, ...years]}
                    onChange={(value) => changeFilter('schoolYearId', value)}
                    allowClear={false}
                  />
                </Pane> */}
                {!defaultBranch?.id && (
                  <div className="col-lg-3">
                    <FormItem
                      data={[{ id: '', name: 'Tất cả cơ sở' }, ...branches]}
                      name="branchId"
                      placeholder="Chọn cơ sở"
                      onChange={(event) => changeFilter('branchId', event)}
                      type={variables.SELECT}
                      allowClear={false}
                    />
                  </div>
                )}
                {defaultBranch?.id && (
                  <div className="col-lg-3">
                    <FormItem
                      data={defaultBranchs}
                      name="branchId"
                      placeholder="Chọn cơ sở"
                      onChange={(event) => changeFilter('branchId', event)}
                      type={variables.SELECT}
                      allowClear={false}
                    />
                  </div>
                )}
              </Pane>
            </Form>

            <Table
              bordered
              columns={columns}
              dataSource={data}
              loading={loading['physicalHistory/GET_DATA']}
              isError={error.isError}
              pagination={paginationTable(pagination)}
              rowKey={() => uuidv4()}
              scroll={{ x: '100%' }}
            />
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
