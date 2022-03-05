import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { useLocation, useParams, history } from 'umi';
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
  const { pathname } = useLocation();
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
        className: 'max-width-150',
        width: 150,
        render: (record) => get(record, 'updateDay'),
      },
      {
        title: 'Email gửi',
        key: 'email',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'name'),
      },
      {
        title: 'Email nhận',
        key: 'status',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'name'),
      },
      {
        title: 'Chủ đề',
        key: 'status',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'name'),
      },
    ];
    return columns;
  };

  return (
    <Form layout="vertical">
      <div className="card">
        <div style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>
            Thông tin email
          </Heading>
          <div className="row">
            <Pane className="col-lg-4">
              <FormItem className="mt-2" label="Email" name="email" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-8 d-flex flex-row-reverse align-items-center">
              <Button
                color="success"
                size="large"
                icon="envelop"
                htmlType="submit"
                onClick={() => history.push(`${pathname}/gui-email`)}
              >
                Gửi email
              </Button>
            </Pane>
          </div>
        </div>
      </div>

      <div className="card">
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
