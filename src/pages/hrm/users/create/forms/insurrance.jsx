import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { get, isEmpty } from 'lodash';

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
    insurrances,
  } = useSelector(({ loading, HRMusersAdd }) => ({
    loading,
    insurrances: HRMusersAdd.insurrances,
  }));
  const loadingSubmit =
    effects[`HRMusersAdd/ADD_INSURRANCES`] || effects[`HRMusersAdd/UPDATE_INSURRANCES`];
  const loading = effects[`HRMusersAdd/GET_INSURRANCES`];
  const dispatch = useDispatch();
  const params = useParams();
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

  const onEdit = (record) => {
    mountedSet(setVisible, true);
    mountedSet(setObjects, record);
    if (formRefModal.current) {
      formRefModal.current.setFieldsValue({
        ...record,
        timeJoin: record.timeJoin && moment(record.timeJoin),
        timeStart: record.timeStart && moment(record.timeStart),
      });
    }
  };

  const save = () => {
    formRefModal.current.validateFields().then((values) => {
      dispatch({
        type: objects.id ? 'HRMusersAdd/UPDATE_INSURRANCES' : 'HRMusersAdd/ADD_INSURRANCES',
        payload: {
          id: objects.id,
          employeeId: params.id,
          ...values,
        },
        callback: (response, error) => {
          if (response) {
            dispatch({
              type: 'HRMusersAdd/GET_INSURRANCES',
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
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'HRMusersAdd/REMOVE',
          payload: {
            id,
          },
        });
      },
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
        width: 80,
        className: 'min-width-80',
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Số sổ bảo hiểm',
        key: 'insurranceNumber',
        className: 'min-width-150',
        render: (record) => record.insurranceNumber,
      },
      {
        title: 'Thời gian hiệu lực (từ ngày),',
        key: 'timeJoin',
        className: 'min-width-130',
        width: 130,
        render: (record) => Helper.getDate(record.timeJoin, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Thời gian hiệu lực (đến ngày)',
        key: 'timeStart',
        className: 'min-width-130',
        width: 130,
        render: (record) => Helper.getDate(record.timeStart, variables.DATE_FORMAT.DATE),
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
   * Load Items Apointes
   */
  useEffect(() => {
    dispatch({
      type: 'HRMusersAdd/GET_INSURRANCES',
      payload: params,
    });
  }, []);

  return (
    <>
      <Modal
        visible={visible}
        title="Bảo hiểm xã hội"
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
              loading={loadingSubmit}
            >
              Hủy
            </Button>
            <Button
              key="choose"
              color="success"
              icon="fe-save"
              onClick={save}
              loading={loadingSubmit}
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
            timeJoin: objects.timeJoin && moment(objects.timeJoin),
            timeStart: objects.timeStart && moment(objects.timeStart),
          }}
        >
          <div className="row">
            <div className="col-lg-6">
              <FormItem
                label="Số sổ bảo hiểm"
                name="insurranceNumber"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <FormItem
                label="Thời gian hiệu lực (từ ngày)"
                name="timeJoin"
                type={variables.DATE_PICKER}
                rules={[variables.RULES.EMPTY]}
              />
            </div>
            <div className="col-lg-6">
              <FormItem
                label="Thời gian hiệu lực (đến ngày)"
                name="timeStart"
                type={variables.DATE_PICKER}
                rules={[variables.RULES.EMPTY]}
              />
            </div>
          </div>
        </Form>
      </Modal>
      <Pane className="card">
        <Pane style={{ padding: 20 }} className="pb-0">
          <Heading type="form-title">Bảo hiểm xã hội</Heading>
        </Pane>
        <Pane style={{ padding: 20 }} className="pb-0">
          <Table
            columns={header()}
            dataSource={insurrances}
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
    </>
  );
});

export default Index;
