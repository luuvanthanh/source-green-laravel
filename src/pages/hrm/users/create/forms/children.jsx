import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal, Checkbox, Upload, message } from 'antd';
import { get, isEmpty, head, last } from 'lodash';

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
  const [fileImage, setFileImage] = useState([]);

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
      setFileImage(Helper.isJSON(record.fileImage) ? JSON.parse(record.fileImage) : []);
      formRefModal.current.setFieldsValue({
        ...record,
        data: [
          {
            ...record,
            birthday: record.birthday && moment(record.birthday),
            date: record.dedectionTimeFrom &&
              record.dedectionTimeTo && [
                moment(record.dedectionTimeFrom),
                moment(record.dedectionTimeTo),
              ],
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
            dedectionTimeFrom:
              head(item.date) && moment(head(item.date)).format(variables.DATE_FORMAT.DATE_AFTER),
            dedectionTimeTo:
              last(item.date) && moment(last(item.date)).format(variables.DATE_FORMAT.DATE_AFTER),
            fileImage: !isEmpty(fileImage) ? JSON.stringify(fileImage) : undefined,
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

  const onChange = (e, record) => {
    dispatch({
      type: 'HRMusersAdd/UPDATE_CHILDREN',
      payload: {
        id: record.id,
        data: [
          {
            ...record,
            isDependentPerson: e.target.checked,
          },
        ],
      },
      callback: () => {},
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
          type: 'HRMusersAdd/REMOVE_CHILDREN',
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
        title: 'Họ và tên',
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
        title: 'Mối quan hệ',
        key: 'relationship',
        className: 'min-width-130',
        width: 130,
        render: (record) => record.relationship,
      },
      {
        title: 'Mã số thuế',
        key: 'relationship',
        className: 'min-width-130',
        width: 130,
        render: (record) => record.taxCode,
      },
      {
        title: 'Thời gian bắt đầu giảm từ',
        key: 'relationship',
        className: 'min-width-200',
        width: 200,
        render: (record) =>
          Helper.getDateRank(
            record.dedectionTimeFrom,
            record.dedectionTimeTo,
            variables.DATE_FORMAT.DATE,
          ),
      },
      {
        title: 'Phụ thuộc',
        key: 'isDependentPerson',
        className: 'min-width-130',
        width: 130,
        align: 'center',
        render: (record) => (
          <Checkbox
            defaultChecked={record.isDependentPerson}
            onChange={(e) => onChange(e, record)}
          />
        ),
      },
      {
        title: 'Đính kèm file',
        key: 'FileImage',
        className: 'min-width-150',
        width: 150,
        align: 'center',
        render: (record) => (
          <div className={classnames(styles['files-container'], 'mt5')}>
            {Helper.isJSON(record.fileImage) &&
              JSON.parse(record.fileImage)?.map((item) => (
                <div className={styles.item} key={item.id}>
                  <a
                    className={styles['link-wrap']}
                    href={`${API_UPLOAD}${item.url}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.name}
                  </a>
                </div>
              ))}
          </div>
        ),
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

  const onRemoFile = (record) => {
    setFileImage((prev) => prev.filter((item) => item.id !== record.id));
  };

  const onUpload = (files) => {
    dispatch({
      type: 'upload/UPLOAD',
      payload: files,
      callback: (response) => {
        if (response) {
          setFileImage((prev) => [...prev, head(response.results)?.fileInfo]);
        }
      },
    });
  };

  const props = {
    beforeUpload() {
      return null;
    },
    customRequest({ file }) {
      const { name, size } = file;
      const allowTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpeg', 'jpg', 'png'];
      const maxSize = 5 * 2 ** 20;
      if (!allowTypes.includes(last(name.split('.'))) || size > maxSize) {
        message.error(
          'Định dạng hỗ trợ: .pdf, .doc, .docx, .xls, .xlsx, .jpeg, .jpg, .png. Tổng dung lượng không vượt quá 20MB',
        );
        return;
      }
      onUpload(file);
    },
    showUploadList: false,
    fileList: [],
  };

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
                ...objects,
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
                        <div className="col-lg-6">
                          <FormItem
                            label="MỐI QUAN HỆ"
                            name={[field.name, 'relationship']}
                            fieldKey={[field.fieldKey, 'relationship']}
                            rules={[variables.RULES.EMPTY]}
                            type={variables.INPUT}
                          />
                        </div>
                        <div className="col-lg-6">
                          <FormItem
                            label="MÃ SỐ THUẾ"
                            name={[field.name, 'taxCode']}
                            fieldKey={[field.fieldKey, 'taxCode']}
                            rules={[variables.RULES.EMPTY]}
                            type={variables.INPUT}
                          />
                        </div>
                        <div className="col-lg-6">
                          <FormItem
                            label="THỜI GIAN BẮT ĐẦU TÍNH GIẢM TỪ"
                            name={[field.name, 'date']}
                            fieldKey={[field.fieldKey, 'date']}
                            rules={[variables.RULES.EMPTY]}
                            type={variables.RANGE_PICKER}
                          />
                        </div>
                        <div className="col-lg-6">
                          <FormItem
                            className="checkbox-row checkbox-small"
                            label="NGƯỜI PHỤ THUỘC"
                            name={[field.name, 'isDependentPerson']}
                            fieldKey={[field.fieldKey, 'isDependentPerson']}
                            type={variables.CHECKBOX_FORM}
                            valuePropName="checked"
                          />
                        </div>
                        <div className="col-lg-12">
                          <div className="row">
                            <div className="col-lg-12">
                              <label className="ant-col ant-form-item-label d-block">
                                <span>Đính kèm file</span>
                              </label>
                              <Upload {...props}>
                                <Button color="primary" icon="upload1">
                                  Tải lên
                                </Button>
                              </Upload>
                              {!isEmpty(fileImage) && (
                                <div className={classnames(styles['files-container'], 'mt5')}>
                                  {fileImage.map((item) => (
                                    <div className={styles.item} key={item.id}>
                                      <a
                                        href={`${API_UPLOAD}${item.url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {item.name}
                                      </a>
                                      <span
                                        role="presentation"
                                        className="icon-cross"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onRemoFile(item);
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
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
