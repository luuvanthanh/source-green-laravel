import { memo, useRef, useEffect } from 'react';
import { Form, Steps } from 'antd';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import { CheckCircleOutlined } from '@ant-design/icons';
import Heading from '@/components/CommonComponent/Heading';
import Table from '@/components/CommonComponent/Table';
import { get } from 'lodash';
import stylesModule from '../../styles.module.scss';

const { Step } = Steps;
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
        title: 'Ngày cập nhật',
        key: 'updateDay',
        className: 'max-width-150',
        width: 150,
        render: (record) => get(record, 'updateDay'),
      },
      {
        title: 'Tên tình trạng chăm sóc',
        key: 'name',
        className: 'min-width-150',
        render: (record) => get(record, 'name'),
      },
      {
        title: 'Người cập nhật',
        key: 'status',
        width: 150,
        className: 'max-width-150',
        render: (record) => get(record, 'name'),
      },
    ];
    return columns;
  };

  return (
    <Form layout="vertical">
      <div className="card">
        <div style={{ padding: 20 }} className="border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>
            Tình trạng tiềm năng
          </Heading>
          <div className="row">
            <Pane className="col-lg-12 ">
            <Steps labelPlacement="vertical" current={3} size="small" className={stylesModule['wrapper-step']}>
                <Step title="Tiềm năng mới" icon={<CheckCircleOutlined />} />
                <Step title="Sale online" icon={<CheckCircleOutlined />} />
                <Step title="Tham quan" icon={<CheckCircleOutlined />} />
                <Step title="Đăng ký nhập học" icon={<CheckCircleOutlined />} />
                <Step title="Test đầu vào" icon={<CheckCircleOutlined />} />
                <Step title="Chính thức" icon={<CheckCircleOutlined />} />
              </Steps>
            </Pane>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>
            Lịch sử chăm sóc tiềm năng
          </Heading>
          <div className="row">
            <Pane className="col-lg-12">
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
            </Pane>
          </div>
        </div>
      </div>
    </Form>
  );
});

export default General;
