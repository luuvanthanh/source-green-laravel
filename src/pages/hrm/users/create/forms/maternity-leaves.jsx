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
    maternityLeaves,
    loading: { effects },
  } = useSelector(({ loading, HRMusersAdd }) => ({
    loading,
    maternityLeaves: HRMusersAdd.maternityLeaves,
    error: HRMusersAdd.error,
  }));
  const loadingSubmit =
    effects[`HRMusersAdd/UPDATE_MATERNITY_LEAVES`] || effects[`HRMusersAdd/ADD_MATERNITY_LEAVES`];
  const loading = effects[`HRMusersAdd/GET_MATERNITY_LEAVES`];
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
    formRefModal.current.resetFields();
  };

  const onEdit = (record) => {
    mountedSet(setVisible, true);
    mountedSet(setObjects, record);
    if (formRefModal.current) {
      formRefModal.current.setFieldsValue({
        ...record,
        startDate: record.startDate && moment(record.startDate),
        endDate: record.endDate && moment(record.endDate),
      });
    }
  };

  const save = () => {
    formRefModal.current.validateFields().then((values) => {
      dispatch({
        type: objects.id
          ? 'HRMusersAdd/UPDATE_MATERNITY_LEAVES'
          : 'HRMusersAdd/ADD_MATERNITY_LEAVES',
        payload: {
          id: objects.id,
          employeeId: params.id,
          ...values,
        },
        callback: (response, error) => {
          if (response) {
            dispatch({
              type: 'HRMusersAdd/GET_MATERNITY_LEAVES',
              payload: params,
            });
            cancelModal();
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
          type: 'HRMusersAdd/REMOVE_MATERNITY_LEAVES',
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
        title: 'Thời gian bắt đầu',
        key: 'startDate',
        className: 'min-width-150',
        width: 150,
        render: (record) => Helper.getDate(record.startDate, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Thời gian kết thúc',
        key: 'endDate',
        className: 'min-width-150',
        width: 150,
        render: (record) => Helper.getDate(record.endDate, variables.DATE_FORMAT.DATE),
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
      type: 'HRMusersAdd/GET_MATERNITY_LEAVES',
      payload: params,
    });
  }, []);

  return (
    <>
      <Modal
        visible={visible}
        title="Thông tin tăng thai sản"
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
            startDate: objects.startDate && moment(objects.startDate),
            endDate: objects.endDate && moment(objects.endDate),
          }}
        >
          <div className="row">
            <div className="col-lg-6">
              <FormItem
                name="startDate"
                type={variables.DATE_PICKER}
                disabledDate={(current) => Helper.disabledDateFrom(current, formRefModal)}
                allowClear={false}
              />
            </div>
            <div className="col-lg-6">
              <FormItem
                name="endDate"
                type={variables.DATE_PICKER}
                disabledDate={(current) => Helper.disabledDateTo(current, formRefModal)}
                allowClear={false}
              />
            </div>
          </div>
        </Form>
      </Modal>
      <Pane className="card">
        <Pane style={{ padding: 20 }} className="pb-0">
          <Heading type="form-title">Thông tin tăng thai sản</Heading>
        </Pane>
        <Pane style={{ padding: 20 }} className="pb-0">
          <Table
            columns={header()}
            dataSource={maternityLeaves}
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
