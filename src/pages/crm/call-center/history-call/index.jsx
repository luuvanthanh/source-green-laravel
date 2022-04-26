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
import variablesModule from '../pop-up/variables';
import stylesModule from './styles.module.scss';

const STATUS_CALL = [
  { id: 1, type: 'NORMAL_CLEARING', name: 'Đã nhận', direction: 'INBOUND' },
  { id: 2, type: 'NORMAL_TEMPORARY_FAILURE', name: 'Từ chối', direction: 'INBOUND' },
  { id: 3, type: 'CALL_REJECTED', name: 'Gọi nhở', direction: 'INBOUND' },
  { id: 4, type: 'NORMAL_CLEARING', name: 'Đã gọi', direction: 'OUTBOUND' },
  { id: 5, type: 'NO_ANSWER,ORIGINATOR_CANCEL', name: 'Không bắt máy', direction: 'OUTBOUND' },
  { id: 6, type: 'CALL_REJECTED', name: 'Máy bận', direction: 'OUTBOUND' },
];

const Index = () => {
  const [
    { data, pagination, saler, extensions, switchboard },
    loading,
  ] = useSelector(({ loading: { effects }, crmHistoryCall }) => [crmHistoryCall, effects]);
  const { query, pathname } = useLocation();
  const { params } = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const [formRef] = Form.useForm();
  const [search, setSearch] = useState({
    phone: query?.phone,
    start_date:
      query?.start_date || moment().startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
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
    dispatch({
      type: 'crmHistoryCall/GET_SALER',
      payload: {
        sale: true,
      },
    });
    dispatch({
      type: 'crmHistoryCall/GET_EXTENSIONS',
    });
    dispatch({
      type: 'crmHistoryCall/GET_SWITCHBOARD',
    });
  }, []);

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

  const debouncedSearchDateRank = debounce((start_date, end_date) => {
    setSearch((prev) => ({
      ...prev,
      start_date,
      end_date,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const debouncedSearchStatus = debounce((value) => {
    setSearch((prev) => ({
      ...prev,
      direction: value?.direction,
      hangup_cause: value?.type,
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

  const onChangeSelectStatus = (e) => {
    const item = STATUS_CALL.find((i) => i.id === e);
    debouncedSearchStatus(item);
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
        render: (text, record, index) => (
          <p
            className={
              record?.call_status === variablesModule.STATUS.canceled &&
              record?.direction === variablesModule.STATUS.inbound &&
              record?.hangup_cause === variablesModule.SOCKET_STATUS.originator_cancel
                ? stylesModule['reminder-bg']
                : ''
            }
          >
            {Helper.serialOrder(search?.page, index, search?.limit)}
          </p>
        ),
      },
      {
        title: 'Ngày giờ gọi',
        key: 'call_date',
        width: 150,
        render: (record) => (
          <p
            className={
              record?.call_status === variablesModule.STATUS.canceled &&
              record?.direction === variablesModule.STATUS.inbound &&
              record?.hangup_cause === variablesModule.SOCKET_STATUS.originator_cancel
                ? stylesModule['reminder-bg']
                : ''
            }
          >
            {moment(record?.created_at).format(variables.DATE_FORMAT.DATE_TIME)}
          </p>
        ),
      },
      {
        title: 'Loại cuộc gọi',
        key: 'call_type',
        width: 150,
        render: (record) => (
          <p
            className={
              record?.call_status === variablesModule.STATUS.canceled &&
              record?.direction === variablesModule.STATUS.inbound &&
              record?.hangup_cause === variablesModule.SOCKET_STATUS.originator_cancel
                ? stylesModule['reminder-bg']
                : ''
            }
          >
            {variables.DIRECTION[record?.direction]}
          </p>
        ),
      },
      {
        title: 'Tổng đài',
        key: 'switchboard',
        width: 150,
        render: (record) => (
          <p
            className={
              record?.call_status === variablesModule.STATUS.canceled &&
              record?.direction === variablesModule.STATUS.inbound &&
              record?.hangup_cause === variablesModule.SOCKET_STATUS.originator_cancel
                ? stylesModule['reminder-bg']
                : ''
            }
          >
            {record?.switchboard}
          </p>
        ),
      },
      {
        title: 'Số nhánh',
        key: 'employee.extension',
        width: 150,
        render: (record) => record?.employee?.extension[0].user_id_cmc,
      },
      {
        title: 'Số điện thoại',
        key: 'phone',
        width: 150,
        render: (record) => (
          <p
            className={
              record?.call_status === variablesModule.STATUS.canceled &&
              record?.direction === variablesModule.STATUS.inbound &&
              record?.hangup_cause === variablesModule.SOCKET_STATUS.originator_cancel
                ? stylesModule['reminder-bg']
                : ''
            }
          >
            {record?.phone}
          </p>
        ),
      },
      {
        title: 'Nội dung',
        key: 'content',
        width: 300,
        render: (record) => record?.content,
      },
      {
        title: 'Sale gọi nhận',
        key: 'employee.full_name',
        width: 150,
        render: (record) => record?.employee?.full_name,
      },
      {
        title: 'Trạng thái',
        key: 'call_status',
        width: 150,
        render: (record) => Helper.getStatusCall(record?.direction, record?.hangup_cause),
      },
      {
        title: 'Kết quả cuộc gọi',
        key: 'result',
        width: 150,
        render: (record) => record?.result || record?.refuse,
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
              date: [moment(search.start_date), moment(search.end_date)],
              switchboard: query?.switchboard || null,
              extension_id: query?.extension_id || null,
              employee_id: query?.employee || null,
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
                  data={[{ id: null, name: 'Tất cả tổng đài' }, ...switchboard]}
                  name="switchboard"
                  onChange={(e) => onChangeSelect(e, 'switchboard')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả số nhánh' }, ...extensions]}
                  name="extension_id"
                  onChange={(e) => onChangeSelect(e, 'extension_id')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả nhân viên' }, ...saler]}
                  name="employee_id"
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
                  data={[{ id: null, name: 'Tất cả trạng thái' }, ...STATUS_CALL]}
                  name="call_status"
                  onChange={(e) => onChangeSelectStatus(e)}
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
            loading={loading['crmHistoryCall/GET_DATA']}
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
