import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal } from 'antd';

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
        title: 'Mã ID',
        key: 'index',
        className: 'min-width-70',
        width: 70,
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Chi nhánh',
        key: 'store_id',
        className: 'min-width-100',
        render: (record) => <Text size="normal">Trụ Sở</Text>,
      },
      {
        title: 'Bộ phận	',
        key: 'division',
        className: 'min-width-100',
        render: (record) => <Text size="normal">Quản lý công ty</Text>,
      },
      {
        title: 'Chức vụ	',
        key: 'position',
        className: 'min-width-100',
        render: (record) => <Text size="normal">Chủ tịch SL</Text>,
      },
      {
        title: 'Hình thức làm việc',
        key: 'workForm',
        className: 'min-width-100',
        render: (record) => <Text size="normal">Chính thức</Text>,
      },
      {
        title: 'Cấp bậc',
        key: 'level',
        className: 'min-width-100',
        render: (record) => <Text size="normal">Phụ trách</Text>,
      },
      {
        title: 'Vai trò',
        key: 'role',
        className: 'min-width-100',
        render: (record) => <Text size="normal">Chủ tịch</Text>,
      },
      {
        title: 'Ngày bắt đầu',
        key: 'start_date',
        className: 'min-width-100',
        render: (record) => <Text size="normal">2020-09-10</Text>,
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="success"
              ghost
              onClick={() => history.push(`/ho-so-doi-tuong/nhan-vien/${record.id}/chi-tiet`)}
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    return columns;
  };

  return (
    <>
      <Modal
        visible={visible}
        title="Điều chuyển"
        onOk={handleOk}
        centered
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
              <FormItem data={[]} label="Chi nhánh" name="store_id" type={variables.SELECT} />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem data={[]} label="Bộ phận" name="division_id" type={variables.SELECT} />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem data={[]} label="Chức vụ" name="position_id" type={variables.SELECT} />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                data={[]}
                label="Hình thức làm việc"
                name="work_form_id"
                type={variables.SELECT}
              />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem data={[]} label="Cấp bậc" name="rank_id" type={variables.SELECT} />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem data={[]} label="Vai trò" name="role_id" type={variables.SELECT} />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem
                data={[]}
                label="Thời gian bắt đầu"
                name="start_date"
                type={variables.DATE_PICKER}
                disabledDate={Helper.disabledDate}
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
            <Heading type="form-title">Cấp bậc, chức vụ</Heading>
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
