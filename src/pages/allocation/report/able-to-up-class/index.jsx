import React, { memo, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'umi';
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
import { useDispatch, useSelector } from 'dva';

const genders = { MALE: 'Nam', FEMALE: 'Nữ' };
const Index = memo(() => {
  const [
    { data, pagination, branches, classes, error },
    loading,
  ] = useSelector(({ loading: { effects }, allocationReportAbleToUpClass }) => [
    allocationReportAbleToUpClass,
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
      type: 'allocationRegister/GET_DATA',
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
        type: 'allocationRegister/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    dispatch({
      type: 'allocationRegister/GET_BRACHES',
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

  const onChangeSelect = (e, type) => {
    debouncedSearch(e, type);
  };

  const onChangeSelectBranch = (e, type) => {
    debouncedSearch(e, type);
    dispatch({
      type: 'allocationRegister/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
  };

  const debouncedSearchDateRank = debounce((from, to) => {
    setSearch((prev) => ({
      ...prev.search,
      from,
      to,
    }));
  }, 200);

  const onChangeDateRank = (e) => {
    debouncedSearchDateRank(
      moment(e[0]).format(variables.DATE_FORMAT.DATE_AFTER),
      moment(e[1]).format(variables.DATE_FORMAT.DATE_AFTER),
    );
  };

  const changePagination = ({ page, limit }) => {
    setSearch((prev) => ({
      ...prev.search,
      page,
      limit,
    }));
  };

  const exportData = () => {
    Helper.exportExcel('/v1/dismisseds-export-word', {}, 'THDiemdanh.docx');
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  const paginationFunction = (pagination) => {
    Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        changePagination(response);
      },
    });
  };

  /**
   * Function header table
   */
  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'time',
        className: 'min-width-100',
        width: 100,
        render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
      },
      {
        title: 'Mã HS',
        key: 'id',
        width: 100,
        render: (record) => <Text size="normal">{record?.id}</Text>,
      },
      {
        title: 'Họ và tên',
        key: 'name',
        width: 100,
        className: 'min-width-100',
        render: (record) => <Text size="normal">{record?.name}</Text>,
      },
      {
        title: 'Ngày sinh',
        key: 'birthday',
        width: 100,
        className: 'min-width-100',
        render: (record) => <Text size="normal">{record?.birthday}</Text>,
      },
      {
        title: 'Số tháng tuổi',
        key: 'age_month',
        width: 100,
        className: 'min-width-100 ',
        render: (record) => <Text size="normal">{record?.age_month}</Text>,
      },
      {
        title: 'Giới tính',
        key: 'gender',
        width: 100,
        className: 'min-width-100',
        render: (record) => <Text size="normal">{genders[record?.gender]}</Text>,
      },
      {
        title: 'Lớp',
        key: 'class',
        width: 100,
        className: 'min-width-100',
        render: (record) => <Text size="normal">{record?.class}</Text>,
      },
      {
        title: 'Cơ sở',
        key: 'division',
        width: 100,
        className: 'min-width-100',
        render: (record) => <Text size="normal">{record?.division}</Text>,
      },
      {
        title: 'Lớp học phù trợ',
        key: 'cover_class',
        width: 100,
        className: 'min-width-100',
        render: (record) => <Text size="normal">{record?.cover_class}</Text>,
      },
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Danh sách học sinh đủ tuổi chuyển lên lớp trên vào cuối mỗi tháng" />
      <div className={classnames(styles['content-form'], styles['content-form-children'], 'mt8')}>
        {/* FORM SEARCH */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <Text color="dark">
            Danh sách học sinh đủ tuổi chuyển lên lớp trên vào cuối mỗi tháng
          </Text>
          <Button color="success" onClick={exportData} icon="export">
            Tải file
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
                  name="date"
                  onChange={(event) => onChangeDateRank(event, 'date')}
                  type={variables.MONTH_PICKER}
                  allowClear={false}
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
                  data={[{ id: null, name: 'Tất cả học sinh' }, ...classes]}
                  name="classId"
                  onChange={(event) => onChangeSelect(event, 'classId')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
            </div>
          </Form>
          <Table
            columns={header()}
            dataSource={data}
            loading={loading['allocationRegister/GET_DATA']}
            error={error}
            isError={error.isError}
            childrenColumnName="noColumn"
            bordered
            pagination={paginationFunction(pagination)}
            params={{
              header: header(),
              type: 'table',
            }}
            rowKey={(record) => record.id || record?.class?.id}
            scroll={{ x: '100%' }}
          />
        </div>
      </div>
    </>
  );
});

export default Index;
