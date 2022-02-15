import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { get, isEmpty, head } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { variables, Helper } from '@/utils';
import moment from 'moment';

const Index = memo(() => {
  const [visible, setVisible] = useState(false);
  const [objects, setObjects] = useState({});

  const {
    loading: { effects },
    decisionRewards,
  } = useSelector(({ loading, HRMusersAdd }) => ({
    loading,
    decisionRewards: HRMusersAdd.decisionRewards,
  }));
  const loadingSubmit =
    effects[`HRMusersAdd/ADD_DECISION_REWARDS`] || effects[`HRMusersAdd/UPDATE_DECISION_REWARDS`];
  const loading =
    effects[`HRMusersAdd/GET_BRANCHES`] ||
    effects[`HRMusersAdd/GET_DIVISIONS`] ||
    effects[`HRMusersAdd/GET_POSITIONS`] ||
    effects[`HRMusersAdd/GET_DECISION_REWARDS`];
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
    mountedSet(setObjects, {});
  };

  const onEdit = (record) => {
    mountedSet(setVisible, true);
    mountedSet(setObjects, record);
    if (formRefModal.current) {
      formRefModal.current.setFieldsValue({
        ...record,
        ...head(record.decisionRewardDetails),
        timeApply:
          head(record.decisionRewardDetails)?.timeApply &&
          moment(head(record.decisionRewardDetails)?.timeApply),
        decisionDate: record.decisionDate && moment(record.decisionDate),
        type: record.type,
      });
    }
  };

  const save = () => {
    formRefModal.current.validateFields().then((values) => {
      dispatch({
        type: objects.id
          ? 'HRMusersAdd/UPDATE_DECISION_REWARDS'
          : 'HRMusersAdd/ADD_DECISION_REWARDS',
        payload: {
          id: objects.id,
          decisionNumber: values.decisionNumber,
          decisionDate: values.decisionDate,
          timeApply: values.timeApply,
          type: values.type,
          reason: values.reason,
          data: [
            {
              employeeId: params.id,
              money: values.money,
              timeApply: values.timeApply,
              note: values.note,
            },
          ],
        },
        callback: (response, err) => {
          if (response) {
            dispatch({
              type: 'HRMusersAdd/GET_DECISION_REWARDS',
              payload: params,
            });
            mountedSet(setVisible, false);
          }
          if (err) {
            if (get(err, 'data.status') === 400 && !isEmpty(err?.data?.errors)) {
              err.data.errors.forEach((item) => {
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
   * Function remove items
   * @param {uid} id id of items
   */
  const onRemove = (id) => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'HRMusersAdd/REMOVE_DECISION_REWARDS',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              dispatch({
                type: 'HRMusersAdd/GET_DECISION_REWARDS',
                payload: params,
              });
            }
          },
        });
      },
    });
  };

  const exportData = (id) => {
    Helper.exportExcel(`/v1/decision-rewards-export-word/${id}`, {}, 'QD-KyLuat-KhenThuong.docx');
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
        title: 'Thời gian tạo',
        key: 'creationTime',
        dataIndex: 'creationTime',
        className: 'min-width-160',
        render: (value) => Helper.getDate(value, variables.DATE_FORMAT.DATE_TIME),
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
        title: 'Ngày áp dụng',
        key: 'timeApply',
        className: 'min-width-120',
        width: 120,
        render: (record) =>
          Helper.getDate(
            get(record, 'decisionRewardDetails[0].timeApply'),
            variables.DATE_FORMAT.DATE,
          ),
      },
      {
        title: 'Lý do',
        key: 'reason',
        className: 'min-width-100',
        width: 100,
        render: (record) => get(record, 'reason'),
      },
      {
        title: 'Mức thưởng, Mức phạt',
        key: 'money',
        className: 'min-width-100',
        width: 100,
        render: (record) => Helper.getPrice(get(record, 'decisionRewardDetails[0].money')),
      },
      {
        title: 'Ghi chú',
        key: 'note',
        className: 'min-width-150',
        width: 150,
        render: (record) => get(record, 'decisionRewardDetails[0].note'),
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
              <Button color="primary" icon="edit" onClick={() => onEdit(record)} />
            </li>
            <li className="list-inline-item">
              <Button
                color="danger"
                icon="remove"
                className="ml-2"
                onClick={() => onRemove(record.id)}
              />
            </li>
            <li className="list-inline-item">
              <Button
                color="success"
                icon="export"
                className="ml-2"
                onClick={() => exportData(record.id)}
              />
            </li>
          </ul>
        ),
      },
    ];
    return columns;
  };

  /**
   * Load Items dismisseds
   */
  useEffect(() => {
    dispatch({
      type: 'HRMusersAdd/GET_DECISION_REWARDS',
      payload: params,
    });
  }, []);

  return (
    <>
      <Modal
        visible={visible}
        title="Quyết định khen thưởng, kỷ luật"
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
        <Form
          layout="vertical"
          ref={formRefModal}
          initialValues={{
            ...objects,
            ...head(objects.decisionRewardDetails),
            decisionDate: objects.decisionDate && moment(objects.decisionDate),
            timeApply:
              head(objects.decisionRewardDetails)?.timeApply &&
              moment(head(objects.decisionRewardDetails)?.timeApply),
            type: objects.type,
          }}
        >
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
                disabledDate={Helper.disabledDate}
                type={variables.DATE_PICKER}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                label="Ngày áp dụng"
                name="timeApply"
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
                label="Loại QĐ"
                name="type"
                type={variables.SELECT}
                data={[
                  { id: 'REWARD', name: 'Khen thưởng' },
                  { id: 'DISCIPLINE', name: 'Kỷ luật' },
                ]}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                label="Mức thưởng, mức phạt"
                name="money"
                type={variables.INPUT_NUMBER}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                label="Ghi chú"
                name="note"
                type={variables.INPUT}
                rules={[variables.RULES.MAX_LENGTH_INPUT]}
              />
            </Pane>
          </Pane>
        </Form>
      </Modal>
      <Form layout="vertical" ref={formRef} onFinish>
        <Pane className="card">
          <Pane style={{ padding: 20 }} className="pb-0">
            <Heading type="form-title">Quyết định khen thưởng, kỷ luật</Heading>
          </Pane>
          <Pane style={{ padding: 20 }} className="pb-0">
            <Table
              columns={header()}
              dataSource={decisionRewards}
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
