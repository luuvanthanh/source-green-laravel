import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { get } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';

const Index = memo(() => {
  const [visible, setVisible] = useState(false);
  const formRef = useRef();
  const mounted = useRef(false);
  const formRefModal = useRef();
  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleOk = () => {
    mountedSet(setVisible, true);
  };

  const cancelModal = () => {
    mountedSet(setVisible, false);
  };

  /**
   * Function header table
   */
  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'text',
        width: 100,
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Số BH',
        key: 'insurrance_number',
        className: 'min-width-150',
        render: (record) => get(record, 'insurrance_number'),
      },
      {
        title: 'Người thụ hưởng',
        key: 'beneficiary',
        className: 'min-width-150',
        render: (record) => get(record, 'beneficiary.name'),
      },
      {
        title: 'Ngày bắt đầu',
        key: 'start_time',
        className: 'min-width-150',
        render: (record) => Helper.getDate(get(record, 'start_time'), variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Ngày kết thúc',
        key: 'end_time',
        className: 'min-width-150',
        render: (record) => Helper.getDate(get(record, 'end_time'), variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 180,
        className: 'min-width-180',
        fixed: 'right',
        align: 'center',
        render: (record) => (
          <ul className="list-unstyled list-inline">
            <li className="list-inline-item">
              <Button color="primary" icon="edit" />
            </li>
            <li className="list-inline-item">
              <Button color="danger" icon="remove" className="ml-2" />
            </li>
          </ul>
        ),
      },
    ];
    return columns;
  };

  return (
    <>
      <Modal
        visible={visible}
        title="Bảo hiểm y tế"
        onOk={handleOk}
        centered
        width={700}
        onCancel={cancelModal}
        footer={
          <Pane className="d-flex justify-content-end align-items-center">
            <Button key="cancel" color="white" icon="fe-x" onClick={cancelModal}>
              Hủy
            </Button>
            <Button key="choose" color="success" icon="fe-save">
              Lưu
            </Button>
          </Pane>
        }
      >
        <Form layout="vertical" ref={formRefModal} initialValues={{}}>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem data={[]} label="Số BH" name="insurrance_number" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem label="Người thụ hưởng" name="beneficiary_id" type={variables.SELECT} />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem label="Ngày bắt đầu" name="start_date" type={variables.DATE_PICKER} />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem label="Ngày kết thúc" name="end_date" type={variables.DATE_PICKER} />
            </Pane>
          </Pane>
        </Form>
      </Modal>
      <Form
        layout="vertical"
        ref={formRef}
        onFinish
        initialValues={{
          shuttlers: [{}],
        }}
      >
        <Pane className="card">
          <Pane style={{ padding: 20 }} className="pb-0">
            <Heading type="form-title">Bảo hiểm y tế</Heading>
          </Pane>
          <Pane style={{ padding: 20 }} className="pb-0">
            <Table
              bordered
              columns={header()}
              dataSource={[{ id: 1 }]}
              pagination={false}
              params={{
                header: header(),
                type: 'table',
              }}
              bordered={false}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
            />
          </Pane>

          <Pane style={{ padding: 20 }}>
            <Button color="success" ghost icon="plus" onClick={handleOk}>
              Thêm
            </Button>
          </Pane>
        </Pane>
      </Form>
    </>
  );
});

export default Index;
