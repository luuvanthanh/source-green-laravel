import { memo, useRef, useEffect, useState } from 'react';
import { Modal, Form } from 'antd';
import { useParams } from 'umi';
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
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
        key: 'status',
        className: 'min-width-150',
        render: (record) => get(record, 'name'),
      },
      {
        title: 'Người cập nhật',
        key: 'name',
        className: 'max-width-150',
        width: 150,
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
            Tình trạng lead
          </Heading>
          <div className="row">
            <Pane className="col-lg-12">
              <span>Mối liên hệ</span>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem className="mt-2" data={data} name="relationship" type={variables.SELECT} />
            </Pane>
            <Pane className={styles[('order-assignment-btn', 'col-lg-2')]}>
              <Button
                onClick={() => showModal()}
                className="text-uppercase mt-2"
                color="success"
                ghost
                icon="plus"
              >
                Chuyển tiềm năng
              </Button>
              <Modal
                title="Chuyển tiềm năng"
                className={stylesModule['wrapper-modal']}
                centered
                visible={isModalVisible}
                onOk={() => handleOk()}
                onCancel={() => handleCancel()}
                footer={[
                  <p
                    key="back"
                    role="presentation"
                    onClick={() => handleCancel()}
                    className={stylesModule['button-cancel']}
                  >
                    Hủy
                  </p>,
                  <Button
                    key="submit"
                    color="success"
                    type="primary"
                    onClick={() => handleOk()}
                    className={styles['cheack-btn-ok']}
                  >
                    Lưu
                  </Button>,
                ]}
              >
                <div>
                  <Pane className="row">
                    <div className="col-lg-6">
                      <FormItem name="parents" label="Phụ huynh tiềm năng" type={variables.INPUT} />
                    </div>
                    <div className="col-lg-6">
                      <FormItem name="phone" label="Số điện thoại" type={variables.INPUT} />
                    </div>
                    <div className="col-lg-6">
                      <FormItem name="address" label="Địa chỉ " type={variables.INPUT} />
                    </div>
                    <div className="col-lg-6">
                      <FormItem name="date" label="Ngày chuyển" type={variables.DATE_PICKER} />
                    </div>
                  </Pane>
                </div>
              </Modal>
            </Pane>
          </div>
          <div className={stylesModule['wrapper-btn']}>
            <Button color="success" size="large" htmlType="submit">
              Lưu
            </Button>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>
            Lịch sử chăm sóc
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
