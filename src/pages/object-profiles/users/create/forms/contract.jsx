import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal, Tabs } from 'antd';
import { get } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';
import moment from 'moment';
import Table from '@/components/CommonComponent/Table';
import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';

const { TabPane } = Tabs;
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
        width: 60,
        className: 'min-width-60',
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Số hợp đồng',
        key: 'contract_number',
        className: 'min-width-120',
        render: (record) => get(record, 'contract_number'),
      },
      {
        title: 'Thông tin hợp đồng',
        key: 'contract_category',
        className: 'min-width-120',
        render: (record) => get(record, 'labourContractCategory.name'),
      },
      {
        title: 'Ngày ký',
        key: 'date',
        className: 'min-width-150',
        render: (record) => Helper.getDate(record.sign_date, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Ngày hiệu lực',
        key: 'date',
        className: 'min-width-150',
        render: (record) => Helper.getDate(record.start_date, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Ngày hết hạn',
        key: 'deadline',
        className: 'min-width-150',
        render: (record) => Helper.getDate(record.expiration_date, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Thời gian làm việc',
        key: 'work_time',
        className: 'min-width-150',
        render: (record) => get(record, 'work_time'),
      },
      {
        title: 'Công việc phải làm',
        key: 'work',
        className: 'min-width-150',
        render: (record) => get(record, 'work'),
      },
      {
        title: 'Mức lương chính',
        key: 'salary',
        className: 'min-width-150',
        render: (record) => get(record, 'salary'),
      },
      {
        title: 'Hình thức thanh toán',
        key: 'payment',
        className: 'min-width-150',
        render: (record) => get(record, 'payment'),
      },
      {
        title: 'Hình thức trả lương',
        key: 'payment_form',
        className: 'min-width-150',
        render: (record) => get(record, 'payment_form'),
      },
      {
        title: 'Đảm nhận vị trí',
        key: 'professional_titles',
        className: 'min-width-150',
        render: (record) => get(record, 'professional_titles'),
      },
      {
        title: 'Chức danh chuyên môn',
        key: 'position',
        className: 'min-width-150',
        render: (record) => get(record, 'position'),
      },
      {
        title: 'Bảo hiểm xã hội và bảo hiểm y tế',
        key: 'insurrance',
        className: 'min-width-150',
        render: (record) => get(record, 'insurrance'),
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
            <li className="list-inline-item">
              <Button color="success" icon="export" />
            </li>
          </ul>
        ),
      },
    ];
    return columns;
  };

  const headerEdit = (type = 'paramaterValues') => {
    if (type === 'paramaterFormulas') {
      return [
        {
          title: 'STT',
          key: 'text',
          width: 60,
          className: 'min-width-60',
          align: 'center',
          render: (text, record, index) => index + 1,
        },
        {
          title: 'Loại tham số',
          key: 'type',
          className: 'min-width-120',
          render: (record) => 'Lương chính thức',
        },
        {
          title: 'Công thức',
          key: 'recipe',
          className: 'min-width-120',
          render: (record) => 'LCB * NGAY_CONG',
        },
      ];
    }
    return [
      {
        title: 'STT',
        key: 'text',
        width: 60,
        className: 'min-width-60',
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Loại tham số',
        key: 'type',
        className: 'min-width-120',
        render: (record) => 'Lương cơ bản',
      },
      {
        title: 'Số tiền',
        key: 'values',
        className: 'min-width-120',
        render: (record) => Helper.getPrice(100000000),
      },
      {
        title: 'Ngày hiệu lực',
        key: 'application_date',
        className: 'min-width-120',
        render: (record) => Helper.getDate(moment()),
      },
    ];
  };

  return (
    <>
      <Modal
        visible={visible}
        title="Hợp đồng lao động"
        onOk={handleOk}
        centered
        className={styles['modal-fullscreen']}
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
            <Pane className="col-lg-4">
              <FormItem
                data={[]}
                label="Số hợp đồng"
                name="contract_number"
                type={variables.INPUT}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem label="Ngày hợp đồng" name="contract_date" type={variables.DATE_PICKER} />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                data={[]}
                label="Thông tin hợp đồng"
                name="labours_contract_category_id"
                type={variables.SELECT}
              />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem
                data={[]}
                label="Số năm hợp đồng"
                name="contract_year"
                type={variables.INPUT_COUNT}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                data={[]}
                label="Số tháng hợp đồng"
                name="contract_month"
                type={variables.INPUT_COUNT}
              />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem label="Thời hạn HĐ từ" name="start_date" type={variables.DATE_PICKER} />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem label="Thời hạn HĐ đến" name="end_date" type={variables.DATE_PICKER} />
            </Pane>
          </Pane>
          <hr className={styles['dot-bottom']} />
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem label="Công việc cụ thể" name="work" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem label="Thời gian làm việc" name="work_time" type={variables.INPUT} />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-12">
              <FormItem label="Nơi làm việc" name="position" type={variables.INPUT} />
            </Pane>
          </Pane>

          <Heading type="form-block-title">Chi tiết hợp đồng</Heading>
          <Tabs defaultActiveKey="paramaterValues">
            <TabPane tab="Tham số giá trị" key="paramaterValues">
              <Table
                bordered
                columns={headerEdit('paramaterValues')}
                dataSource={[{ id: 1 }]}
                pagination={false}
                params={{
                  header: headerEdit('paramaterValues'),
                  type: 'table',
                }}
                rowKey={(record) => record.id}
                scroll={{ x: '100%' }}
              />
            </TabPane>
            <TabPane tab="Tham số công thức" key="paramaterFormulas">
              <Table
                bordered
                columns={headerEdit('paramaterFormulas')}
                dataSource={[{ id: 1 }]}
                pagination={false}
                params={{
                  header: headerEdit('paramaterFormulas'),
                  type: 'table',
                }}
                rowKey={(record) => record.id}
                scroll={{ x: '100%' }}
              />
            </TabPane>
          </Tabs>
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
            <Heading type="form-title">Hợp đồng lao động</Heading>
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
