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
        width: 60,
        className: 'min-width-60',
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Loại hợp đồng',
        key: 'contract_category',
        className: 'min-width-150',
        render: (record) => get(record, 'labours_contract_category_id'),
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
        title: 'Thời gian bắt đầu thử việc',
        key: 'time_start_probation',
        className: 'min-width-200',
        render: (record) => Helper.getDate(record.time_start_probation, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Thời gian kết thúc thử việc',
        key: 'time_end_probation',
        className: 'min-width-200',
        render: (record) => Helper.getDate(record.time_end_probation, variables.DATE_FORMAT.DATE),
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
        title: 'Địa chỉ làm việc',
        key: 'work_adress',
        className: 'min-width-150',
        render: (record) => get(record, 'work_adress'),
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
        title: 'Phần trăm được hưởng',
        key: 'percent_enjoyed',
        className: 'min-width-150',
        render: (record) => get(record, 'percent_enjoyed'),
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

  return (
    <>
      <Modal
        visible={visible}
        title="Biên bản thỏa thuận"
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
              <FormItem
                dataa={[]}
                label="Loại hợp đồng"
                name="labours_contract_category_id"
                type={variables.SELECT}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem label="Số quyết địn" name="decision_number" type={variables.INPUT} />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem label="Ngày ký" name="sign_date" type={variables.DATE_PICKER} />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem label="Ngày hiệu lực" name="start_date" type={variables.DATE_PICKER} />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem label="Ngày hết hạn" name="expiration_date" type={variables.DATE_PICKER} />
            </Pane>
          </Pane>
          <hr className={styles['dot-bottom']} />
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem
                label="Thời gian bắt đầu thử việc"
                name="time_start_probation"
                type={variables.DATE_PICKER}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                label="Thời gian kết thúc thử việcc"
                name="time_end_probation"
                type={variables.DATE_PICKER}
              />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem label="Công việc phải làm" name="work" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem label="Thời gian làm việc" name="work_time" type={variables.INPUT} />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem label="Địa chỉ làm việc" name="work_adress" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem label="Mức lương chính" name="salary" type={variables.INPUT} />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem label="Hình thức trả lương" name="payment_form" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem label="Hình thức thanh toán" name="payment" type={variables.SELECT} />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem
                label="Nhập đảm nhận vị trí"
                name="professional_titles"
                type={variables.INPUT}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                label="Phần trăm được hưởng"
                name="percent_enjoyed"
                type={variables.SELECT}
              />
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
            <Heading type="form-title">Biên bản thỏa thuận</Heading>
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
