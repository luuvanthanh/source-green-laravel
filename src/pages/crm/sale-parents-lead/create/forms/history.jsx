import { memo, useRef, useEffect, useState } from 'react';
import { Form, Select, Input } from 'antd';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Text from '@/components/CommonComponent/Text';
import Loading from '@/components/CommonComponent/Loading';
import { useDispatch } from 'dva';
import { isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { variables, Helper } from '@/utils';
import Table from '@/components/CommonComponent/Table';
import stylesModule from '../../styles.module.scss';

const { Option } = Select;
const genders = [
  { id: 'LEAD_NEW', name: 'Lead mới' },
  { id: 'POTENTIAL', name: 'Có tiềm năng' },
  { id: 'NOT_POTENTIAL', name: 'Không tiềm năng' },
];

const dataCategory = [
  { id: 'PHONE', name: 'Điện thoại' },
  { id: 'EMAIL', name: 'Email' },
  { id: 'FACEBOOK', name: 'Facebook' },
];

const mapStateToProps = ({ loading, crmSaleLeadAdd }) => ({
  loading,
  details: crmSaleLeadAdd.details,
});
const General = memo(
  ({ loading: { effects }, error, match: { params }, details }) => {
    const [data, setData] = useState([
      //   {
      //     config_profile_info_id: undefined,
      //     status: true,
      //     file_image: undefined,
      //     id: uuidv4(),
      //   },
    ]);
    const [remove, setRemove] = useState([]);

    const formRef = useRef();
    const mounted = useRef(false);
    const loadingSubmit = '';
    const loading = effects[``];
    const dispatch = useDispatch();

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    useEffect(() => {
      if (params.id) {
        dispatch({
          type: 'crmSaleLeadAdd/GET_DETAILS',
          payload: params,
        });
      }
    }, [params.id]);

    const onSelectEmployees = (productId, record, type) => {
      setData((prev) =>
        prev.map((item) => ({
          ...item,
          [`${type}`]: item.id === record.id ? productId : item?.[`${type}`],
        })),
      );
    };

    const onChangeInput = (e, record, key) => {
      setData((prev) =>
        prev.map((item) =>
          item.test === record.test && item.id === record.id
            ? { ...item, [key]: e.target.value }
            : { ...item },
        ),
      );
    };

    const header = () => {
      const columns = [
        {
          title: 'Thời gian',
          key: 'date',
          className: 'min-width-150',
          width: 200,
          render: (record) => (
            <Text size="normal">
              {Helper.getDate(record.created_at, variables.DATE_FORMAT.DATE_TIME)}
            </Text>
          ),
        },
        {
          title: 'Tên phụ huynh',
          key: 'type',
          className: 'min-width-250',
          width: 250,
          render: () => details?.full_name,
        },
        {
          title: 'SĐT',
          key: 'type',
          className: 'min-width-150',
          width: 150,
          render: () => details?.phone,
        },
        {
          title: 'Tình trạng chăm sóc',
          key: 'type',
          className: 'min-width-200',
          width: 200,
          render: (value, record) => (
            <Select
              placeholder="Chọn"
              showSearch
              className="w-100"
              defaultValue={record.status}
              onChange={(val) => onSelectEmployees(val, record, 'status')}
            >
              {genders?.map((item) => (
                <Option key={item.id}>{item?.name}</Option>
              ))}
            </Select>
          ),
        },
        {
          title: 'Loại tương tác',
          key: 'type',
          className: 'min-width-200',
          width: 200,
          render: (value, record) => (
            <Select
              placeholder="Chọn"
              showSearch
              className="w-100"
              defaultValue={record.category}
              onChange={(e) => onSelectEmployees(e, record, 'category')}
            >
              {dataCategory?.map((item) => (
                <Option key={item.id}>{item?.name}</Option>
              ))}
            </Select>
          ),
        },
        {
          title: 'Nội dung tương tác',
          key: 'content',
          className: 'min-width-150',
          width: 150,
          render: (record) => (
            <>
              <Input.TextArea
                value={record.content}
                autoSize={{ minRows: 2, maxRows: 3 }}
                placeholder="Nhập"
                onChange={(e) => onChangeInput(e, record, 'content')}
              />
            </>
          ),
        },
        {
          title: 'Kết quả tương tác',
          key: 'name',
          className: 'min-width-150',
          width: 150,
          render: (record) => (
            <>
              <Input.TextArea
                value={record.result}
                autoSize={{ minRows: 2, maxRows: 3 }}
                placeholder="Nhập"
                onChange={(e) => onChangeInput(e, record, 'result')}
              />
            </>
          ),
        },
        {
          title: 'Các hoạt động offline',
          key: 'offline',
          className: 'min-width-200',
          width: 200,
          render: (record) => (
            <>
              <Input.TextArea
                value={record.offline}
                autoSize={{ minRows: 2, maxRows: 3 }}
                placeholder="Nhập"
                onChange={(e) => onChangeInput(e, record, 'offline')}
              />
            </>
          ),
        },
        {
          title: 'SL chăm sóc',
          key: 'type',
          className: 'min-width-150',
          width: 150,
          render: (record) => record?.quantity_care,
        },
        {
          title: 'Thao tác',
          key: 'action',
          width: 100,
          fixed: 'right',
          render: (record) => (
            <div className={stylesModule['list-button']}>
              <Button
                onClick={() => {
                  setData(
                    data.filter(
                      (val) =>
                        (val.key || val.id || val.test) !==
                        (record.key || record.id || record.test),
                    ),
                  );
                  setRemove([...remove, record.id]);
                }}
                type="button"
                color="danger"
                icon="remove"
                className={stylesModule.remove}
              />
            </div>
          ),
        },
      ];
      return columns;
    };

    const onFinish = () => {
      const items = data.map((item) => ({
        ...item,
        customer_lead_id: params.id,
        history_care_id: item.type && item?.id,
      }));
      const payload = {
        create_rows: items.filter((item) => !item.type),
        update_rows: items.filter((item) => item.type),
        delete_rows: remove,
      };
      dispatch({
        type: 'crmSaleLeadAdd/ADD_HISTORY',
        payload,
        callback: (response, error) => {
          if (error) {
            if (error?.errors && !isEmpty(error?.errors)) {
              error?.errors.forEach((item) => {
                formRef.current.setFields([
                  {
                    name: item?.source?.pointer,
                    errors: [item.detail],
                  },
                ]);
              });
            }
          }
        },
      });
    };

    useEffect(() => {
      dispatch({
        type: 'crmSaleLeadAdd/HISTORY',
        payload: { customer_lead_id: params?.id },
        callback: (response) => {
          if (response?.parsePayload.length > 0) {
            setData(
              response.parsePayload.map((item) => ({
                ...item,
              })),
            );
          }
        },
      });
    }, []);

    return (
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <Pane className="card">
            <Pane className="border-bottom">
              <Pane className="p20">
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  Lịch sử chăm sóc
                </Heading>
                <div className={stylesModule['wrapper-table']}>
                  <Table
                    columns={header()}
                    dataSource={data}
                    pagination={false}
                    loading={loading}
                    className="table-edit"
                    isEmpty
                    params={{
                      header: header(),
                      type: 'table',
                    }}
                    bordered={false}
                    rowKey={(record) => record.id}
                    scroll={{ x: '100%' }}
                    footer={(item, index) =>
                      details?.register_status === 'CANCEL_REGISTER' ? (
                        ''
                      ) : (
                        <Button
                          key={index}
                          onClick={() =>
                            setData([
                              ...data,
                              {
                                id: uuidv4(),
                                status: true,
                                file_image: undefined,
                                quantity_care: data?.length > 0 ? (Math.max(...data.map(i => i.quantity_care)) + 1) : 1,
                              },
                            ])
                          }
                          color="transparent-success"
                          icon="plus"
                        >
                          Thêm lịch sử
                        </Button>
                      )
                    }
                  />
                </div>
              </Pane>
            </Pane>
            <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
              {details?.register_status === 'CANCEL_REGISTER' ? (
                ''
              ) : (
                <Button color="success" htmlType="submit" loading={loadingSubmit} className="ml-2">
                  Lưu
                </Button>
              )}
            </Pane>
          </Pane>
        </Loading>
      </Form>
    );
  },
);

General.propTypes = {
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  loading: {},
  error: {},
  match: {},
  details: {},
};

export default withRouter(connect(mapStateToProps)(General));
