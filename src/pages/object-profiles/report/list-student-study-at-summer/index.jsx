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

const genders = { MALE: 'Nam', FEMALE: 'Nữ' };
const Index = memo(() => {
  const [
    { data, pagination, branches, classes, error },
    loading,
  ] = useSelector(({ loading: { effects }, OPListStudentStudyInSummer }) => [
    OPListStudentStudyInSummer,
    effects,
  ]);

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
      type: 'medicalStudentProblem/GET_DATA',
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
      },
      {
        title: 'Họ và tên',
        key: 'name',
        render: (record) => <Text size="normal">{record?.name}</Text>,
      },
      {
        title: 'Ngày sinh',
        key: 'birthDay',
        render: (record) => <Text size="normal">{record?.birthDay}</Text>,
      },
      {
        title: 'Giới tính',
        key: 'gender',
        render: (record) => <Text size="normal">{genders[record?.gender]}</Text>,
      },
      {
        title: 'Số tháng tuổi',
        key: 'age',
        render: (record) => <Text size="normal">{record?.age}</Text>,
      },
      {
        title: 'Ngày nhập học',
        key: 'date',
        render: (record) => <Text size="normal">{record?.date}</Text>,
      },
      {
        title: 'Họ và tên phụ huynh',
        children: [
          {
            title: 'Họ và tên cha',
            key: 'father_name',
            render: (record) => <Text size="normal">{record?.father_name}</Text>,
          },
          {
            title: 'Họ và tên mẹ',
            key: 'mother_name',
            render: (record) => <Text size="normal">{record?.mother_name}</Text>,
          },
        ],
      },
      {
        title: 'Địa chỉ',
        key: 'address',
        render: (record) => <Text size="normal">{record?.address}</Text>,
      },
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Danh sách học sinh hè theo cơ sở/theo lớp của cơ sở hoặc tổng" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        {/* FORM SEARCH */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <Text color="dark">Danh sách học sinh hè theo cơ sở/theo lớp của cơ sở hoặc tổng</Text>
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
