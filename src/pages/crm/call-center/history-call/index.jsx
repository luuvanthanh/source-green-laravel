import styles from '@/assets/styles/Common/common.scss';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Form } from 'antd';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'dva';
import { debounce, head, isEmpty, last } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation, useRouteMatch } from 'umi';

const Index = () => {
  const [
    { data, pagination },
    loading,
  ] = useSelector(({ loading: { effects }, crmHistoryCall }) => [crmHistoryCall, effects]);
  const { query, pathname } = useLocation();
  const { params } = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const [formRef] = Form.useForm();
  const [search, setSearch] = useState({
    phone: query?.phone,
    from_date:
      query?.from_date || moment().startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
    end_date: query?.end_date || moment().endOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  });

  const onLoad = () => {
    dispatch({
      type: 'crmHistoryCall/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  };

  useEffect(() => {
    onLoad();
  }, [search]);

  const debouncedSearch = debounce((value, type) => {
    setSearch((prev) => ({
      ...prev,
      [`${type}`]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const debouncedSearchDateRank = debounce((from_date, to_date) => {
    setSearch((prev) => ({
      ...prev,
      from_date,
      to_date,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const onChange = (e, type) => {
    debouncedSearch(e.target.value, type);
  };

  const onChangeDateRank = (e) => {
    if (!isEmpty(e)) {
      debouncedSearchDateRank(
        moment(head(e))?.format(variables.DATE_FORMAT.DATE_AFTER),
        moment(last(e))?.format(variables.DATE_FORMAT.DATE_AFTER),
      );
    } else {
      debouncedSearchDateRank(
        moment().startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
        moment().endOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
      );
    }
  };

  const onChangeSelect = (e, type) => {
    debouncedSearch(e, type);
  };

  const changePagination = ({ page, limit }) => {
    setSearch((prev) => ({
      ...prev,
      page,
      limit,
    }));
  };

  const paginationFunction = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        changePagination(response);
      },
    });

  const header = () => {
    const columns = [
      {
        title: 'STT ',
        key: 'index',
        width: 80,
        render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
      },
      {
        title: 'Ngày giờ gọi',
        key: 'call_date',
        width: 150,
        render: (record) => moment(record?.created_at).format(variables.DATE_FORMAT.DATE_TIME),
      },
      {
        title: 'Loại cuộc gọi',
        key: 'call_type',
        width: 150,
        render: (record) => variables.DIRECTION[record?.direction],
      },
      {
        title: 'Tổng đài',
        key: 'switchboard',
        width: 150,
        render: (record) => record?.switchboard,
      },
      {
        title: 'Số nhánh',
        key: 'branchRedirect',
        width: 150,
        render: (record) => record?.branchRedirect,
      },
      {
        title: 'Số điện thoại',
        key: 'phone',
        width: 150,
        render: (record) => record?.phone,
      },
      {
        title: 'Nội dung',
        key: 'content',
        width: 150,
        render: (record) => record?.content,
      },
      {
        title: 'Sale gọi nhận',
        key: 'saler',
        width: 150,
        render: (record) => record?.saler,
      },
      {
        title: 'Trạng thái',
        key: 'call_status',
        width: 150,
        render: (record) => Helper.getStatusCall(record?.call_status),
      },
      {
        title: 'Kết quả cuộc gọi',
        key: 'call_result',
        width: 150,
        render: (record) => record?.call_result,
      },
      {
        title: 'Ghi âm',
        key: 'record_link',
        width: 150,
        render: (record) => (
          <div className={styles['files-container']}>
            <div className={styles.item}>
              <a
                href={record?.record_link}
                target="_blank"
                rel="noreferrer"
                className={styles['link-record']}
              >
                {record?.record_link}
              </a>
            </div>
          </div>
        ),
      },
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Lịch sử cuộc gọi" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark">Lịch sử cuộc gọi</Text>
        </div>
        <div className={styles['block-table']}>
          <Form
            initialValues={{
              ...search,
              date: [moment(search.from_date), moment(search.end_date)],
              switchboard: query?.switchboard || null,
              branchDirect: query?.branchDirect || null,
              employee: query?.employee || null,
              call_type: query?.call_type || null,
              call_status: query?.call || null,
            }}
            layout="vertical"
            form={formRef}
          >
            <div className="row">
              <div className="col-lg-3">
                <FormItem
                  name="phone"
                  onChange={(e) => onChange(e, 'phone')}
                  placeholder="Số điện thoại"
                  type={variables.INPUT_SEARCH}
                />
              </div>
              <div className="col-lg-6">
                <FormItem
                  name="date"
                  onChange={(event) => onChangeDateRank(event, 'date')}
                  placeholder="Nhập từ khóa"
                  type={variables.RANGE_PICKER}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả tổng đài' }]}
                  name="switchboard"
                  onChange={(e) => onChangeSelect(e, 'switchboard_id')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả số nhánh' }]}
                  name="branchDirect"
                  onChange={(e) => onChangeSelect(e, 'branchDirect_id')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả nhân viên' }]}
                  name="employee"
                  onChange={(e) => onChangeSelect(e, 'employee_id')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả cuộc gọi' }, ...variables.DIRECTION_TYPE]}
                  name="call_type"
                  onChange={(e) => onChangeSelect(e, 'call_type')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả trạng thái' }, ...variables.CALL_TYPE]}
                  name="call_status"
                  onChange={(e) => onChangeSelect(e, 'call_status')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
            </div>
          </Form>
          <Table
            bordered={false}
            columns={header(params)}
            dataSource={data}
            loading={loading['crmSaleParentsLead/GET_DATA']}
            disabled
            pagination={paginationFunction(pagination)}
            params={{
              header: header(),
              type: 'table',
            }}
            rowKey={(record) => record.id}
            scroll={{ x: '100%', y: 'calc(100vh - 150px)' }}
          />
        </div>
      </div>
    </>
  );
};

export default Index;
