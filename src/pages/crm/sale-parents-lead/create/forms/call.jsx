import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { useLocation, useParams, history } from 'umi';
import { useSelector, useDispatch } from 'dva';
import styles from '@/assets/styles/Common/common.scss';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { variables } from '@/utils';
import Table from '@/components/CommonComponent/Table';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { get } from 'lodash';
import stylesModule from '../../styles.module.scss';

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
  /**
   * Load Items Degres
   */
  useEffect(() => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_DEGREES',
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
        title: 'Ngày giờ gọi',
        key: 'updateDay',
        width: 150,
        render: (record) => get(record, 'updateDay'),
      },
      {
        title: 'Số gọi',
        key: 'phone',
        width: 150,
        render: (record) => get(record, 'phone'),
      },
      {
        title: 'Số nhận',
        key: 'phone',
        width: 150,
        render: (record) => get(record, 'phone'),
      },
      {
        title: 'Nội dung cuộc gọi',
        key: 'contents',
        width: 150,
        render: (record) => get(record, 'contents'),
      },
      {
        title: 'Người gọi',
        key: 'name',
        width: 150,
        render: (record) => get(record, 'name'),
      },
      {
        title: 'Ghi âm',
        key: 'record',
        width: 150,
        render: (record) => get(record, 'record'),
      },
      {
        key: 'action',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="edit"
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet-cuoc-goi`)}
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
          <Heading type="form-title" style={{ marginBottom: 20 }}>
            Thông tin cuộc gọi
          </Heading>
          <div className="row">
            <div className="col-lg-2">
              <FormItem name="phoneNumberCompany" label="Số điện thoại" type={variables.INPUT} />
            </div>
            <div className="col-lg-3 d-flex align-items-center">
              <Button
                color="success"
                size="large"
                htmlType="submit"
                className={stylesModule['wrapper-btn-call']}
              >
                <span className="icon-phone" />
              </Button>
            </div>
            <div className="col-lg-2">
              <FormItem name="phoneNumberCompany" label="Số điện thoại" type={variables.INPUT} />
            </div>
            <div className="col-lg-3 d-flex align-items-center">
              <Button
                color="success"
                size="large"
                htmlType="submit"
                className={stylesModule['wrapper-btn-call']}
              >
                <span className="icon-phone" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ padding: 20 }} className="pb-0 border-bottom">
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Heading type="form-title">Lịch sử chăm sóc</Heading>
            <Button
              color="success"
              icon="plus"
              onClick={() => history.push(`${pathname}/them-lich-su`)}
            >
              Thêm lịch sử
            </Button>
          </div>
          <div className="row">
            <Pane className="col-lg-12">
              <div className={stylesModule['wrapper-table']}>
                <Table
                  columns={header()}
                  dataSource={data}
                  pagination={false}
                  className="table-edit"
                  isEmpty
                  params={{
                    header: header(),
                    type: 'table',
                  }}
                  bordered={false}
                  rowKey={(record) => record.id}
                  scroll={{ x: '100%' }}
                />
              </div>
            </Pane>
          </div>
        </div>
      </div>
    </Form>
  );
});

export default General;
