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

const Index = memo(() => {
  const [
    { data, pagination, branches, error },
    loading,
  ] = useSelector(({ loading: { effects }, OPWorkingSeniority }) => [OPWorkingSeniority, effects]);

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
      type: 'OPWorkingSeniority/GET_DATA',
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
        align: 'center',
        render: (record) => <Text size="normal">{record?.key}</Text>,
      },
      {
        title: 'Mã NV',
        key: 'code',
        render: (record) => <Text size="normal">{record?.code}</Text>,
      },
      {
        title: 'Tên nhân viên',
        key: 'name',
        render: (record) => <Text size="normal">{record?.name}</Text>,
      },
      {
        title: 'Chức vụ',
        key: 'position',
        render: (record) => <Text size="normal">{record?.position}</Text>,
      },
      {
        title: 'Cơ sở',
        key: 'division',
        render: (record) => <Text size="normal">{record?.division}</Text>,
      },
      {
        title: 'Thâm niên công tác',
        children: [
          {
            title: 'Ngày bắt đầu làm việc',
            key: 'start_date',
            render: (record) => <Text size="normal">{record?.start_date}</Text>,
          },
          {
            title: 'Số năm làm việc',
            key: 'year_working',
            render: (record) => <Text size="normal">{record?.year_working}</Text>,
          },
          {
            title: 'Số tháng làm việc',
            key: 'month_working',
            render: (record) => <Text size="normal">{record?.month_working}</Text>,
          },
        ],
      },
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Báo cáo thâm niên công tác" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        {/* FORM SEARCH */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <Text color="dark">Báo cáo thâm niên công tác</Text>
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
                  name="year_working"
                  onChange={(event) => onChange(event, 'year_working')}
                  placeholder="Số năm làm việc"
                  type={variables.INPUT_SEARCH}
                />
              </div>
            </div>
          </Form>
          <div>
            <Table
              columns={header()}
              dataSource={data}
              loading={loading['medicalStudentProblem/GET_DATA']}
              error={error}
              isError={error.isError}
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
