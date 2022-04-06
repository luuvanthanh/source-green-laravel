import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Form, Radio } from 'antd';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'dva';
import { debounce, head, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation, useRouteMatch } from 'umi';
// import { handleOutboundCall } from '../pop-up/handleCallCenter';

const checkboxArr = [
  { id: 'total', name: 'Tất cả' },
  { id: 'yet_create', name: 'Chưa có lịch gọi' },
  { id: 'first', name: 'Gọi lần 1' },
  { id: 'second', name: 'Gọi lần 2' },
  { id: 'third', name: 'Gọi lần 3' },
  { id: 'four', name: 'Gọi lần 4' },
  { id: 'five', name: 'Gọi lần 5' },
  { id: 'overtime', name: 'Overtime' },
  { id: 'call_yet', name: 'Chưa gọi' },
  { id: 'called', name: 'Đã gọi' },
];

const leadStatus = [
  { id: 'LEAD_NEW', name: 'Lead mới' },
  { id: 'POTENTIAL', name: 'Có tiềm năng' },
  { id: 'NOT_POTENTIAL', name: 'Không tiềm năng' },
];

const Index = () => {
  const [
    { data, pagination, lead },
    loading,
    { user },
  ] = useSelector(({ loading: { effects }, crmManagementCall, user }) => [
    crmManagementCall,
    effects,
    user,
  ]);
  const { query, pathname } = useLocation();
  const { params } = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const [formRef] = Form.useForm();
  const [search, setSearch] = useState({
    search: query?.search,
    status_lead: query?.status_lead,
    status_parent_lead_id: query?.status_parent_lead_id,
    status_parent_potential_id: query?.status_parent_potential_id,
    from_date:
      query?.from_date || moment().startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
    to_date: query?.to_date || moment().endOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  });
  const [countCall, setCountCall] = useState({});
  const [isSaler, setIsSaler] = useState(false);
  const [crmIdUser, setCrmIdUser] = useState('');
  const [radioValue, setRadioValue] = useState('total');

  // const { outboundContext } = handleOutboundCall();
  const audioRef = useRef(null);

  useEffect(() => {
    dispatch({
      type: 'crmCallCenter/GET_CRM_ID',
      payload: {
        employee_id_hrm: user.objectInfo?.id,
      },
      callback: (response) => {
        if (response) {
          setCrmIdUser(head(response.parsePayload).id);
          dispatch({
            type: 'crmManagementCall/GET_DATA',
            payload: {
              ...search,
              employee_id: crmIdUser,
            },
          });
          history.push({
            pathname,
            query: Helper.convertParamSearch(search),
          });
        }
      },
    });
  }, [crmIdUser, search]);

  useEffect(() => {
    dispatch({
      type: 'crmCallCenter/GET_EXTENSIONS',
      payload: {
        employee_id_hrm: user.objectInfo?.id,
      },
      callback: (response) => {
        if (response && response.length === 1) {
          setIsSaler(true);
        }
      },
    });
    dispatch({
      type: 'crmManagementCall/GET_STATUS_LEAD',
      payload: {},
    });
    dispatch({
      type: 'crmManagementCall/GET_COUNTCALL',
      callback: (response) => {
        if (response) {
          setCountCall(response);
        }
      },
    });
  }, []);

  const debouncedSearch = debounce((value, type) => {
    setSearch((prev) => ({
      ...prev,
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

  const onChoose = (e, type) => {
    if (e.target.value === 'total') {
      debouncedSearch(null, type);
    } else {
      debouncedSearch(e.target.value.toUpperCase(), type);
    }
    setRadioValue(e.target.value);
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

  // const callNumber = (phone) => {
  //   outboundContext(phone, audioRef.current);
  //   dispatch({
  //     type: 'crmManagementCall/IS_CALL',
  //   });
  // };

  const header = () => {
    const columns = [
      {
        title: 'STT ',
        key: 'index',
        width: 80,
        render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
      },
      {
        title: 'Ngày nhận data',
        key: 'receive_date',
        width: 150,
        render: (record) => moment(record?.receive_date).format(variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Ngày dự kiến gọi',
        key: 'expected_date',
        width: 150,
        render: (record) =>
          !isEmpty(record?.expected_date) &&
          moment(record?.expected_date).format(variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Ngày gọi',
        key: 'date_call',
        width: 150,
        render: (record) =>
          !isEmpty(record?.date_call) &&
          moment(record?.date_call).format(variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Họ tên',
        key: 'customerLead.full_name',
        width: 150,
        render: (record) => record?.customerLead?.full_name,
      },
      {
        title: 'SĐT 1',
        key: 'customerLead.phone',
        width: 150,
        render: (record) =>
          record?.customerLead?.phone &&
          isSaler && (
            <div className="d-flex justify-content-center align-items-center">
              <p className="mr10">{record?.customerLead?.phone}</p>
              {/* <img
                src="/images/telephone-small.svg"
                alt="telephone-small"
                style={{ cursor: 'pointer' }}
                role="presentation"
                onClick={() => callNumber(record?.customerLead?.phone)}
              /> */}
            </div>
          ),
      },
      {
        title: 'SĐT 2',
        key: 'customerLead.other_phone',
        width: 150,
        render: (record) =>
          record?.customerLead?.other_phone &&
          isSaler && (
            <div className="d-flex justify-content-center align-items-center">
              <p className="mr10">{record?.customerLead?.other_phone}</p>
              {/* <img
                src="/images/telephone-small.svg"
                alt="telephone-small"
                style={{ cursor: 'pointer' }}
                role="presentation"
                onClick={() => callNumber(record?.customerLead?.phone)}
              /> */}
            </div>
          ),
      },
      {
        title: 'Nội dung gọi ',
        key: 'content',
        width: 150,
        render: (record) => record?.content,
      },
      {
        title: 'Phân loại PH',
        key: 'statusLeadLatest',
        width: 150,
        render: (record) =>
          variables.LEAD_STATUS[record?.customerLead?.statusLeadLatest[0]?.status],
      },
      {
        title: 'Tình trạng lead',
        key: 'leadStatus',
        width: 150,
        render: (record) => record?.customerLead?.statusCareLatest[0]?.statusParentLead?.name,
      },
      {
        title: 'Tình trạng tiềm năng',
        key: 'potentialStatus',
        width: 150,
        render: (record) => record?.customerLead?.customerPotential[0],
      },
      {
        title: 'Người gọi',
        key: 'saler',
        width: 150,
        render: () => user?.objectInfo?.fullName,
      },
      {
        title: 'Lần gọi',
        key: 'call_times',
        width: 150,
        render: (record) => variables.CALL_TIMES[record?.call_times],
      },
      {
        title: 'Trạng thái',
        key: 'status',
        width: 150,
        render: (record) => Helper.getManagerStatusCall(record?.status),
      },
      {
        title: 'Ghi âm',
        key: 'historyCall',
        width: 150,
        render: (record) => (
          <div className={styles['files-container']}>
            <div className={styles.item}>
              <a
                href={record?.historyCall[0]?.record_link}
                target="_blank"
                rel="noreferrer"
                className={styles['link-record']}
              >
                {record?.historyCall[0]?.record_link}
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
      <Helmet title="Quản lý lịch gọi" />
      <audio ref={audioRef} autoPlay>
        <track kind="captions" />
      </audio>
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark">Quản lý lịch gọi</Text>
          <Button
            color="success"
            icon="plus"
            onClick={() => history.push(`${pathname}/tao-moi`)}
            className="ml-2"
          >
            Tạo mới
          </Button>
        </div>
        <div className={styles['block-table']}>
          <Form
            initialValues={{
              ...search,
              status_lead: query?.status_lead || null,
              status_parent_lead_id: query?.status_parent_lead_id || null,
              status_parent_potential_id: query?.status_parent_potential_id || null,
              employee: query?.employee || null,
              date: [moment(search.from_date), moment(search.to_date)],
            }}
            layout="vertical"
            form={formRef}
          >
            <div className="row">
              <div className="col-lg-3">
                <FormItem
                  name="search"
                  onChange={(e) => onChange(e, 'search')}
                  placeholder="Số điện thoại"
                  type={variables.INPUT_SEARCH}
                />
              </div>
              <div className="col-lg-6">
                <FormItem
                  name="date"
                  onChange={(e) => onChangeSelect(e, 'date')}
                  placeholder="Nhập từ khóa"
                  type={variables.RANGE_PICKER}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Phân loại PH' }, ...leadStatus]}
                  name="status_lead"
                  onChange={(e) => onChangeSelect(e, 'status_lead')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tình trạng lead' }, ...lead]}
                  name="status_parent_lead_id"
                  onChange={(e) => onChangeSelect(e, 'status_parent_lead_id')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tình trạng tiềm năng' }]}
                  name="status_parent_potential_id"
                  onChange={(e) => onChangeSelect(e, 'status_parent_potential_id')}
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
            </div>
            {/* <div className="row">
              {checkboxArr.map((item) => (
                <div className="col-xl-2 col-lg-3 col-4" key={item.id}>
                  <FormItem
                    name={item.id}
                    label={`${item.name} (${countCall[item.id]})`}
                    type={variables.RADIO}
                    onChange={(e) => onChoose(e, item.id, 'call_times')}
                  />
                </div>
              ))}
            </div> */}
            <div className="row">
              <div className="col-lg-12 mb10">
                <Radio.Group value={radioValue}>
                  {checkboxArr.map((item) => (
                    <Radio
                      className="mb10"
                      value={item.id}
                      key={item.id}
                      onChange={(e) => onChoose(e, 'call_times')}
                      size="small"
                    >
                      {`${item.name} (${countCall[item.id]})`}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </div>
          </Form>
          <Table
            bordered
            columns={header(params)}
            dataSource={data}
            loading={loading['crmManagementCall/GET_DATA']}
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
