import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { get } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import { history, useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';

const Index = memo(() => {
  const [visible, setVisible] = useState(false);
  const {
    details,
    loading: { effects },
    branches,
    divisions,
    positions,
    error,
  } = useSelector(({ loading, HRMusersAdd }) => ({
    loading,
    details: HRMusersAdd.details,
    branches: HRMusersAdd.branches,
    divisions: HRMusersAdd.divisions,
    positions: HRMusersAdd.positions,
    error: HRMusersAdd.error,
  }));
  const dispatch = useDispatch();
  const params = useParams();
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

  const save = () => {
    formRefModal.current.validateFields().then((values) => {
      dispatch({
        type: 'HRMusersAdd/ADD_TRANSFERS',
        payload: {
          DecisionNumber: values.DecisionNumber,
          DecisionDate: values.DecisionDate,
          Reason: values.Reason,
          Data: [
            {
              EmployeeId: params.id,
              BranchId: values.BranchId,
              DivisionId: values.DivisionId,
              PositionId: values.PositionId,
              Note: values.Note,
            },
          ],
        },
      });
    });
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

  /**
   * Load Items Branches
   */
  useEffect(() => {
    dispatch({
      type: 'HRMusersAdd/GET_BRANCHES',
      payload: params,
    });
  }, []);

  /**
   * Load Items Divisions
   */
  useEffect(() => {
    dispatch({
      type: 'HRMusersAdd/GET_DIVISIONS',
      payload: params,
    });
  }, []);

  /**
   * Load Items Positions
   */
  useEffect(() => {
    dispatch({
      type: 'HRMusersAdd/GET_POSITIONS',
      payload: params,
    });
  }, []);

  return (
    <>
      <Modal
        visible={visible}
        title="Điều chuyển"
        onOk={handleOk}
        centered
        width={700}
        onCancel={cancelModal}
        footer={
          <Pane className="d-flex justify-content-end align-items-center">
            <Button key="cancel" color="white" icon="fe-x" onClick={cancelModal}>
              Hủy
            </Button>
            <Button key="choose" color="success" icon="fe-save" onClick={save}>
              Lưu
            </Button>
          </Pane>
        }
      >
        <Form layout="vertical" ref={formRefModal} initialValues={{}}>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem
                label="Số quyết định"
                name="DecisionNumber"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                label="Ngày quyết định"
                name="DecisionDate"
                type={variables.DATE_PICKER}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-12">
              <FormItem
                label="Lý do"
                name="Reason"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
              />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem
                data={branches.map((item) => ({ id: item.id, name: item.Name }))}
                label="Cơ sở"
                name="BranchId"
                type={variables.SELECT}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                data={divisions.map((item) => ({ id: item.id, name: item.Name }))}
                label="Bộ phận"
                name="DivisionId"
                type={variables.SELECT}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                data={positions.map((item) => ({ id: item.id, name: item.Name }))}
                label="Chức vụ"
                name="PositionId"
                type={variables.SELECT}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem label="Ghi chú" name="Note" type={variables.INPUT} />
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
            <Heading type="form-title">Điều chuyển</Heading>
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
