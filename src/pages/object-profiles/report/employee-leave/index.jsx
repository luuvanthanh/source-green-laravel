import React, { useEffect, useState, memo } from 'react';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import { useHistory, useLocation } from 'umi';
import { useDispatch, useSelector } from 'dva';
import stylesModule from './styles.module.scss';

const Index = memo(() => {
  const [
    { data, pagination, branches, classes, error },
    loading,
  ] = useSelector(({ loading: { effects }, OPEmployeeLeave }) => [OPEmployeeLeave, effects]);

  const formRef = React.createRef();
  const { query, pathname } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [search, setSearch] = useState({
    KeyWord: query?.KeyWord,
    branchId: query?.branchId,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    date: query.date ? moment(query.date) : moment(),
  });

  const onLoad = () => {
    dispatch({
      type: 'OPEmployeeLeave/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          date: Helper.getDate(search.from, variables.DATE_FORMAT.DATE_AFTER),
        },
        variables.QUERY_STRING,
      )}`,
    );
  };

  const loadCategories = () => {
    if (search.branchId) {
      dispatch({
        type: 'medicalStudentProblem/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    dispatch({
      type: 'medicalStudentProblem/GET_BRACHES',
      payload: {},
    });
  };

  useEffect(() => {
    onLoad();
    loadCategories();
  }, [search]);

  const debouncedSearch = debounce((value, type) => {
    setSearch((prev) => ({
      ...prev.search,
      [`${type}`]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const onChange = (e, type) => {
    debouncedSearch(e.target.value, type);
  };

  const onChangeSelect = (e, type) => {
    debouncedSearch(e, type);
  };

  const onChangeSelectBranch = (e, type) => {
    debouncedSearch(e, type);
    dispatch({
      type: 'medicalStudentProblem/GET_CLASSES',
      payload: {
        branch: e,
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

  const onChangeDate = (e, type) => {
    debouncedSearch(moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type);
  };

  const paginationFunction = (pagination) => {
    Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        changePagination(response);
      },
    });
  };

  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'name',
        align: 'center',
        width: 100,
      },
      {
        title: 'Mã NV',
        key: 'code',
        width: 100,
        render: (record) => <Text size="normal">{record?.code}</Text>,
      },
      {
        title: 'Tên nhân viên',
        key: 'name',
        width: 100,
        render: (record) => <Text size="normal">{record?.name}</Text>,
      },
      {
        title: 'Chức vụ',
        key: 'position',
        width: 100,
        render: (record) => <Text size="normal">{record?.position}</Text>,
      },
      {
        title: 'Cơ sở',
        key: 'branch',
        width: 100,
        render: (record) => <Text size="normal">{record?.branch}</Text>,
      },
      {
        title: 'Bộ phận',
        key: 'division',
        width: 100,
        render: (record) => <Text size="normal">{record?.division}</Text>,
      },
      {
        title: 'Ngày QĐ thôi việc',
        key: 'leave_date',
        width: 100,
        render: (record) => <Text size="normal">{record?.leave_date}</Text>,
      },
      {
        title: 'Số QĐ thôi việc',
        key: 'leave_num',
        width: 100,
        render: (record) => <Text size="normal">{record?.leave_num}</Text>,
      },
      {
        title: 'Ngày thôi việc',
        key: 'leave_date',
        width: 100,
        render: (record) => <Text size="normal">{record?.leave_date}</Text>,
      },
      {
        title: 'Ngày kết thúc thanh toán lương',
        key: 'end_salary_date',
        width: 100,
        render: (record) => <Text size="normal">{record?.end_salary_date}</Text>,
      },
      {
        title: 'Lý do',
        key: 'reason',
        width: 100,
        render: (record) => <Text size="normal">{record?.reason}</Text>,
      },
      {
        title: 'Ghi chú',
        key: 'note',
        width: 100,
        render: (record) => <Text size="normal">{record?.note}</Text>,
      },
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Danh sách học sinh theo năm học theo cơ sở hoặc tổng" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        {/* FORM SEARCH */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <Text color="dark">Danh sách học sinh theo năm học theo cơ sở hoặc tổng</Text>
          <Button color="primary" icon="export" className="ml-2">
            Tải danh sách
          </Button>
        </div>
        <div className={classnames(styles['block-table'])}>
          <Form
            initialValues={{
              ...search,
              branchId: search.branchId || null,
              classId: search.classId || null,
              date: search.date && moment(search.date),
            }}
            layout="vertical"
            ref={formRef}
          >
            <div className="row">
              <div className="col-lg-3">
                <FormItem
                  name="KeyWord"
                  onChange={(event) => onChange(event, 'KeyWord')}
                  placeholder="Nhập từ khóa tìm kiếm"
                  type={variables.INPUT_SEARCH}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả cơ sở ' }, ...branches]}
                  name="branchId"
                  onChange={(event) => onChangeSelectBranch(event, 'branchId')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả lớp' }, ...classes]}
                  name="classId"
                  onChange={(event) => onChangeSelect(event, 'classId')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  name="year"
                  onChange={(event) => onChangeDate(event, 'date')}
                  type={variables.RANGE_PICKER}
                  picker="year"
                  allowClear={false}
                />
              </div>
            </div>
          </Form>
          <div className={stylesModule['wrapper-table']}>
            <Table
              columns={header()}
              dataSource={data}
              loading={loading['medicalStudentProblem/GET_DATA']}
              error={error}
              isError={error.isError}
              defaultExpandAllRows
              childrenColumnName="children"
              bordered
              pagination={paginationFunction(pagination)}
              params={{
                header: header(),
                type: 'table',
              }}
              rowKey={(record) => record.key || record.id}
              scroll={{ x: '100%' }}
            />
          </div>
        </div>
      </div>
    </>
  );
});

export default Index;
