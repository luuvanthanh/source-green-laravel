import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { get, isEmpty, head } from 'lodash';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import { history, useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { variables, Helper } from '@/utils';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';

const { confirm } = Modal;
const Index = memo(() => {
  const [visible, setVisible] = useState(false);
  const [objects, setObjects] = useState({});

  const {
    details,
    loading: { effects },
    decisionRewards,
    error,
  } = useSelector(({ loading, HRMusersAdd }) => ({
    loading,
    details: HRMusersAdd.details,
    decisionRewards: HRMusersAdd.decisionRewards,
    error: HRMusersAdd.error,
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
        timeApply: record.timeApply && moment(record.timeApply),
        decisionDate: record.decisionDate && moment(record.decisionDate),
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
        callback: (response, error) => {
          if (response) {
            dispatch({
              type: 'HRMusersAdd/GET_DECISION_REWARDS',
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
   * Function remove items
   * @param {uid} id id of items
   */
  const onRemove = (id) => {
    confirm({
      title: 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content: 'Dữ liệu này đang được sử dụng, nếu xóa dữ liệu này sẽ ảnh hưởng tới dữ liệu khác?',
      onOk() {
        dispatch({
          type: 'HRMusersAdd/REMOVE_DECISION_REWARDS',
          payload: {
            id,
          },
        });
      },
      onCancel() {},
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
        width: 130,
        className: 'min-width-130',
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
            decisionDate: objects.decisionDate && moment(objects.decisionDate),
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
                  { id: 'Kỷ luật', name: 'Kỷ luật' },
                  { id: 'Khen thưởng', name: 'Khen thưởng' },
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
              bordered
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
