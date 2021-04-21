import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { get, isEmpty } from 'lodash';

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
    dismisseds,
    error,
  } = useSelector(({ loading, HRMusersAdd }) => ({
    loading,
    details: HRMusersAdd.details,
    branches: HRMusersAdd.branches,
    divisions: HRMusersAdd.divisions,
    positions: HRMusersAdd.positions,
    dismisseds: HRMusersAdd.dismisseds,
    error: HRMusersAdd.error,
  }));
  const loadingSubmit =
    effects[`HRMusersAdd/ADD_DIMISSEDS`] || effects[`HRMusersAdd/UPDATE_DIMISSEDS`];
  const loading =
    effects[`HRMusersAdd/GET_BRANCHES`] ||
    effects[`HRMusersAdd/GET_DIVISIONS`] ||
    effects[`HRMusersAdd/GET_POSITIONS`] ||
    effects[`HRMusersAdd/GET_DISMISSEDS`];
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
        type: 'HRMusersAdd/ADD_DIMISSEDS',
        payload: {
          decisionNumber: values.decisionNumber,
          decisionDate: values.decisionDate,
          reason: values.reason,
          data: [
            {
              employeeId: params.id,
              branchId: values.branchId,
              divisionId: values.divisionId,
              positionId: values.positionId,
              note: values.note,
            },
          ],
        },
        callback: (response, error) => {
          if (response) {
            dispatch({
              type: 'HRMusersAdd/GET_DISMISSEDS',
              payload: params,
            });
            mountedSet(setVisible, false);
          }
          if (error) {
            if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
              error.data.errors.forEach((item) => {
                formRefModal.current.setFields([
                  {
                    name: get(item, 'source.pointer'),
                    errors: [get(item, 'detail')],
                  },
                ]);
              });
            }
          }
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
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Số QĐ',
        key: 'insurrance_number',
        className: 'min-width-100',
        width: 100,
        render: (record) => get(record, 'decisionNumber'),
      },
      {
        title: 'Ngày QĐ',
        key: 'decisionDate',
        className: 'min-width-120',
        width: 120,
        render: (record) => Helper.getDate(get(record, 'decisionDate'), variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Lý do',
        key: 'reason',
        className: 'min-width-100',
        width: 100,
        render: (record) => get(record, 'reason'),
      },
      {
        title: 'Cơ sở',
        key: 'branch',
        className: 'min-width-150',
        width: 150,
        render: (record) => get(record, 'dismissedDetails[0].branch.name'),
      },
      {
        title: 'Bộ phận',
        key: 'division',
        className: 'min-width-150',
        width: 150,
        render: (record) => get(record, 'dismissedDetails[0].division.name'),
      },
      {
        title: 'Chức vụ',
        key: 'position',
        className: 'min-width-150',
        width: 150,
        render: (record) => get(record, 'dismissedDetails[0].position.name'),
      },
      {
        title: 'Ghi chú',
        key: 'note',
        className: 'min-width-150',
        width: 150,
        render: (record) => get(record, 'dismissedDetails[0].note'),
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 130,
        className: 'min-width-130',
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

  /**
   * Load Items dismisseds
   */
  useEffect(() => {
    dispatch({
      type: 'HRMusersAdd/GET_DISMISSEDS',
      payload: params,
    });
  }, []);

  return (
    <>
      <Modal
        visible={visible}
        title="Miễn nhiệm"
        onOk={handleOk}
        centered
        width={700}
        onCancel={cancelModal}
        footer={
          <Pane className="d-flex justify-content-end align-items-center">
            <Button
              key="cancel"
              color="white"
              icon="fe-x"
              onClick={cancelModal}
              loading={loadingSubmit || loading}
            >
              Hủy
            </Button>
            <Button
              key="choose"
              color="success"
              icon="fe-save"
              onClick={save}
              loading={loadingSubmit || loading}
            >
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
                name="decisionNumber"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                label="Ngày quyết định"
                name="decisionDate"
                type={variables.DATE_PICKER}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-12">
              <FormItem
                label="Lý do"
                name="reason"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
              />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem
                data={branches}
                label="Cơ sở"
                name="branchId"
                type={variables.SELECT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                data={divisions}
                label="Bộ phận"
                name="divisionId"
                type={variables.SELECT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                data={positions}
                label="Chức vụ"
                name="positionId"
                type={variables.SELECT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                label="Ghi chú"
                name="note"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
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
            <Heading type="form-title">Miễn nhiệm</Heading>
          </Pane>
          <Pane style={{ padding: 20 }} className="pb-0">
            <Table
              bordered
              columns={header()}
              dataSource={dismisseds}
              pagination={false}
              loading={loading}
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
