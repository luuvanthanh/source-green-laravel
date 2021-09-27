import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { useParams,  useLocation, history } from 'umi';
import { useSelector, useDispatch } from 'dva';
import styles from '@/assets/styles/Common/common.scss';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { get } from 'lodash';

import Table from '@/components/CommonComponent/Table';
import Button from '@/components/CommonComponent/Button';
import HelperModules from '../../utils/Helper';


const General = memo(() => {
  const dispatch = useDispatch();
  const params = useParams();
  const { pathname } = useLocation();
  const mounted = useRef(false);
  const { data } = useSelector(({ loading, crmSaleLeadAdd }) => ({
    loading,
    details: crmSaleLeadAdd.details,
    data: crmSaleLeadAdd.data,
    error: crmSaleLeadAdd.error,
  }));

  useEffect(() => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_DATA',
      payload: params,
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const header = () => {
    const columns = [
      {
        title: 'Ngày diễn ra',
        key: 'updateDay',
        className: 'min-width-150',
        width: 150,
        render: (record) => get(record, 'updateDay'),
      },
      {
        title: 'Tên sự kiện',
        key: 'email',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'name'),
      },
      {
        title: 'Địa điểm diễn ra',
        key: 'status',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'name'),
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
        key: 'status',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'name'),
      },
      {
        key: 'Thao tác',
        width: 100,
        fixed: 'right',
        render: () => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="edit"
            //   onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
            />
            <Button color="danger" icon="remove" />
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
          <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/them-su-kien`)}>
          Thêm sự kiện
      </Button>
          </div>
          <div className="row">
            <Pane className="col-lg-12">
            <Table
              columns={header()}
              dataSource={data}
              pagination={false}
              className="table-normal"
              isEmpty
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
