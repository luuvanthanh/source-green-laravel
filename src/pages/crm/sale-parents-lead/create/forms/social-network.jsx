import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
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
        title: 'Ngày giờ gửi/nhận',
        key: 'updateDay',
        className: 'min-width-150',
        width: 150,
        render: (record) => get(record, 'updateDay'),
      },
      {
        title: 'Loại tương tác',
        key: 'email',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'email'),
      },
      {
        title: 'Hành động',
        key: 'status',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'status'),
      },
      {
        title: 'Id đối tượng',
        key: 'status',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'status'),
      },
      {
        title: 'Tên đối tượng',
        key: 'status',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'status'),
      },
      {
        title: 'Id khách hàng',
        key: 'status',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'status'),
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
              Thông tin chung
            </Heading>
            <div className="d-flex ">
              <Button color="primary" icon="facebook" className="ml-2">
                Chat facebook
              </Button>
              {/* <Button color="primary" icon="zalo" className="ml-2">
                Chat Zalo
              </Button> */}
            </div>
          </div>
          <div className="row">
            <Pane className="col-lg-4">
              <FormItem className="mt-2" label="Facebook" name="facebook" type={variables.INPUT} />
            </Pane>
            {/* <Pane className="col-lg-4">
              <FormItem className="mt-2" label="zalo" name="ID Zalo" type={variables.INPUT} />
            </Pane> */}
          </div>
        </div>
      </div>

      {/* <div className="card">
        <div style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>
            Lịch sử
          </Heading>
          <div className="row">
            <Pane className="col-lg-12">
              <div className={stylesModule['wrapper-table']}>
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
              </div>
            </Pane>
          </div>
        </div>
      </div> */}
    </Form>
  );
});

export default General;
