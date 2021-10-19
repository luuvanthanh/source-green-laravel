import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { useParams, useLocation, history } from 'umi';
import { useSelector, useDispatch } from 'dva';
import styles from '@/assets/styles/Common/common.scss';
import Pane from '@/components/CommonComponent/Pane';
import Text from '@/components/CommonComponent/Text';
import { get } from 'lodash';
import Heading from '@/components/CommonComponent/Heading';
import { Helper } from '@/utils';
import Table from '@/components/CommonComponent/Table';
import Button from '@/components/CommonComponent/Button';
import HelperModules from '../../utils/Helper';

const General = memo(() => {
  const dispatch = useDispatch();
  const params = useParams();
  const { pathname } = useLocation();
  const mounted = useRef(false);
  const {
    events,
    loading: { effects },
  } = useSelector(({ loading, crmSaleLeadAdd }) => ({
    loading,
    events: crmSaleLeadAdd.events,
    details: crmSaleLeadAdd.details,
    data: crmSaleLeadAdd.data,
    error: crmSaleLeadAdd.error,
  }));
  const loading = effects[`crmSaleLeadAdd/EVENTS`];

  useEffect(() => {
    dispatch({
      type: 'crmSaleLeadAdd/EVENTS',
      payload: {
        customer_lead_id: params.id,
      },
    });
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onRemove = (id) => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'crmSaleLeadAdd/REMOVE_EVENTS',
          payload: {
            id,
          },
          callback: () => {
            dispatch({
              type: 'crmSaleLeadAdd/EVENTS',
              payload: {
                customer_lead_id: params.id,
              },
            });
          },
        });
      },
    });
  };

  const header = () => {
    const columns = [
      {
        title: 'Ngày diễn ra',
        key: 'date',
        className: 'min-width-150',
        width: 200,
        render: (record) => (
          <Text size="normal">
            {Helper.getDate(record.date)}, {record.time}
          </Text>
        ),
      },
      {
        title: 'Tên sự kiện',
        key: 'name',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'name'),
      },
      {
        title: 'Địa điểm diễn ra',
        key: 'location',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'location'),
      },
      {
        title: 'Trạng thái',
        key: 'status',
        className: 'min-width-120',
        width: 120,
        render: (record) => HelperModules.tagStatus(record.status),
      },
      {
        title: 'Kết quả sự kiện',
        key: 'result',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'result'),
      },
      {
        key: 'Thao tác',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="edit"
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet-su-kien`)}
            />
            <Button color="danger" icon="remove" onClick={() => onRemove(record.id)} />
          </div>
        ),
      },
    ];
    return columns;
  };

  return (
    <Form layout="vertical">
      <div className="card">
        <div style={{ padding: 20 }} className="pb-0 border-bottom">
          <div className="d-flex justify-content-between">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Thông tin sự kiện
            </Heading>
            <Button
              color="success"
              icon="plus"
              onClick={() => history.push(`${pathname}/them-su-kien`)}
            >
              Thêm sự kiện
            </Button>
          </div>
          <div className="row">
            <Pane className="col-lg-12">
              <Table
                columns={header()}
                dataSource={events}
                pagination={false}
                className="table-normal"
                isEmpty
                loading={loading}
                params={{
                  header: header(),
                  type: 'table',
                }}
                bordered
                rowKey={(record) => record.id}
                scroll={{ x: '100%' }}
              />
            </Pane>
          </div>
        </div>
      </div>
    </Form>
  );
});

export default General;
