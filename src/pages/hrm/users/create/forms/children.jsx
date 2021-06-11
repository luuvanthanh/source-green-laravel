import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { get, isEmpty } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import classnames from 'classnames';
import Table from '@/components/CommonComponent/Table';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { variables, Helper } from '@/utils';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';

const Index = memo(() => {
  const [visible, setVisible] = useState(false);
  const [objects, setObjects] = useState({});

  const {
    children,
    loading: { effects },
  } = useSelector(({ loading, HRMusersAdd }) => ({
    loading,
    children: HRMusersAdd.children,
    error: HRMusersAdd.error,
  }));
  const loadingSubmit =
    effects[`HRMusersAdd/ADD_CHILDREN`] || effects[`HRMusersAdd/UPDATE_CHILDREN`];
  const loading = effects[`HRMusersAdd/GET_CHILDREN`];
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
        data: [
          {
            fullName: record.fullName,
            gender: record.gender,
            birthday: record.birthday && moment(record.birthday),
          },
        ],
      });
    }
  };

  const save = () => {
    formRefModal.current.validateFields().then((values) => {
      dispatch({
        type: objects.id ? 'HRMusersAdd/UPDATE_CHILDREN' : 'HRMusersAdd/ADD_CHILDREN',
        payload: {
          id: objects.id,
          employeeId: params.id,
          ...values,
          data: values.data.map((item) => ({
            ...item,
            birthday: moment(item.birthday).format(variables.DATE_FORMAT.DATE_AFTER),
          })),
        },
        callback: (response, error) => {
          if (response) {
            dispatch({
              type: 'HRMusersAdd/GET_CHILDREN',
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
        title: 'Họ tên con',
        key: 'fullName',
        className: 'min-width-150',
        width: 150,
        render: (record) => record.fullName,
      },
      {
        title: 'Ngày sinh',
        key: 'birthday',
        className: 'min-width-150',
        width: 150,
        render: (record) => Helper.getDate(record.birthday, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Giới tính',
        key: 'gender',
        className: 'min-width-130',
        width: 130,
        render: (record) => record.gender,
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
      type: 'HRMusersAdd/GET_CHILDREN',
      payload: params,
    });
  }, []);

  return (
    <>
      <Modal
        visible={visible}
        title="Thông tin quan hệ gia đình"
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
            data: [
              {
                fullName: objects.fullName,
                gender: objects.gender,
                birthday: objects.birthday && moment(objects.birthday),
              },
            ],
          }}
        >
          <div className="row">
            <div className="col-lg-12">
              <Form.List name="data">
                {(fields) => (
                  <div>
                    {fields.map((field) => (
                      <div
                        className={classnames(
                          'row',
                          styles['form-item'],
                          styles['form-item-advance'],
                        )}
                        key={field.key}
                      >
                        <div className="col-lg-6">
                          <FormItem
                            label="HỌ VÀ TÊN"
                            name={[field.name, 'fullName']}
                            fieldKey={[field.fieldKey, 'fullName']}
                            rules={[variables.RULES.EMPTY]}
                            type={variables.INPUT}
                          />
                        </div>
                        <div className="col-lg-6">
                          <FormItem
                            label="NGÀY SINH"
                            name={[field.name, 'birthday']}
                            fieldKey={[field.fieldKey, 'birthday']}
                            rules={[variables.RULES.EMPTY]}
                            type={variables.DATE_PICKER}
                          />
                        </div>
                        <div className="col-lg-6">
                          <FormItem
                            label="GIỚI TÍNH"
                            name={[field.name, 'gender']}
                            fieldKey={[field.fieldKey, 'gender']}
                            rules={[variables.RULES.EMPTY]}
                            type={variables.INPUT}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Form.List>
            </div>
          </div>
        </Form>
      </Modal>
      <Pane className="card">
        <Pane style={{ padding: 20 }} className="pb-0">
          <Heading type="form-title">Thông tin quan hệ gia đình</Heading>
        </Pane>
        <Pane style={{ padding: 20 }} className="pb-0">
          <Table
            columns={header()}
            dataSource={children}
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
