import { memo, useRef, useEffect, useState } from 'react';
import { Form, Radio, Upload, message, Select } from 'antd';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { useDispatch } from 'dva';
import { last, head, isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import Table from '@/components/CommonComponent/Table';
import stylesModule from '../../styles.module.scss';

const { Option } = Select;
const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
  loading,
  configuration: crmSaleAdmissionAdd.configuration,
  details: crmSaleAdmissionAdd.details
});
const General = memo(({ loading: { effects }, error, configuration, match: { params }, details }) => {
  const [data, setData] = useState([
    {
      config_profile_info_id: undefined,
      status: true,
      file_image: undefined,
      id: uuidv4(),
    },
  ]);
  const [remove, setRemove] = useState([]);

  const formRef = useRef();
  const mounted = useRef(false);
  const loadingSubmit = "";
  const loading = effects[``];
  const dispatch = useDispatch();

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onUpload = (file, record) => {
    dispatch({
      type: 'upload/UPLOAD',
      payload: file,
      callback: (response) => {
        if (response) {
          setData((prev) =>
            prev.map((item) =>
              item.id === record.id
                ? {
                  ...item,
                  file_image: head(response.results)?.fileInfo,
                }
                : item,
            ),
          );
        }
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'crmSaleAdmissionAdd/GET_FILE_CONFIGURATION',
      payload: {},
    });
    dispatch({
      type: 'crmSaleAdmissionAdd/GET_DATA_FILE',
      payload: params?.id,
      callback: (response) => {
        if (response?.length > 0) {
          setData(response?.map(i => ({
            ...i,
            file_image: JSON.parse(i?.file_image)
          })));
        }
      },
    });
  }, [params?.id]);


  const props = (record) => ({
    beforeUpload() {
      return null;
    },
    customRequest({ file }) {
      const { name } = file;
      const allowTypes = ['pdf', 'docx', 'xlsx'];
      if (!allowTypes.includes(last(name.split('.')))) {
        message.error('Chỉ hỗ trợ định dạng .pdf, .docx, .xlsx. Dung lượng không được quá 5mb');
        return;
      }
      onUpload(file, record);
    },
    showUploadList: false,
    fileList: [],
  });

  const onSelectEmployees = (productId, record, type) => {
    setData((prev) =>
      prev.map((item) => ({
        ...item,
        [`${type}`]: item.id === record.id ? productId : item?.[`${type}`],
      })),
    );
  };

  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'type',
        className: 'min-width-80',
        width: 80,
        render: (value, record, index) => index + 1,
      },
      {
        title: 'Tên giấy tờ',
        key: 'type',
        className: 'min-width-200',
        width: 200,
        render: (value, record) => (
          <Select
            placeholder="Chọn"
            showSearch
            className="w-100"
            defaultValue={record.config_profile_info_id}
            onChange={(val) => onSelectEmployees(val, record, 'config_profile_info_id')}
          >
            {configuration?.map((item) => (
              <Option key={item.id}>{item?.name}</Option>
            ))}
          </Select>
        )
      },
      {
        title: 'Tình trạng',
        key: 'format',
        className: 'min-width-250',
        width: 250,
        render: (record) => (
          <>
            <Radio.Group
              value={record.status}
              onChange={(val) => onSelectEmployees(val?.target?.value, record, 'status')}
            >
              <Radio value >Đã nhận</Radio>
              <Radio value={false} >Chưa nhận</Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'File đính kèm',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: (record) => (
          <>
            {record?.file_image?.name}
          </>
        ),
      },
      {
        title: 'Thao tác',
        key: 'action',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={stylesModule['list-button']}>
            <Upload {...props(record)} >
              <Button icon="cloud-upload" className={stylesModule.plan} />
            </Upload>
            <Button
              onClick={() => {
                setData(
                  data.filter(
                    (val) =>
                      (val.key || val.id || val.test) !== (record.key || record.id || record.test),
                  ),
                );
                setRemove([...remove, record.id]);
              }}
              type="button"
              color="danger"
              icon="remove"
              className={stylesModule.remove}
            />
          </div>
        ),
      },
    ];
    return columns;
  };

  const onFinish = () => {
    const items = data.map((item) => ({
      ...item,
      file_image: JSON.stringify(item?.file_image),
      admission_register_id: params.id,
    }));
    const payload = {
      create_rows: items.filter((item) => !item.type),
      update_rows: items.filter((item) => item.type),
      delete_rows: remove,
    };
    dispatch({
      type: 'crmSaleAdmissionAdd/ADD_FILE',
      payload,
      callback: (response, error) => {
        if (error) {
          if (error?.errors && !isEmpty(error?.errors)) {
            error?.errors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: item?.source?.pointer,
                  errors: [item.detail],
                },
              ]);
            });
          }
        }
      },
    });
  };

  return (
    <Form layout="vertical" ref={formRef} onFinish={onFinish} >
      <Loading loading={loading} isError={error.isError} params={{ error }}>
        <Pane className="card">
          <Pane className="border-bottom">
            <Pane className="p20">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Thông tin hồ sơ
              </Heading>
              <div className={stylesModule['wrapper-table']}>
                <Table
                  columns={header()}
                  dataSource={data}
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
                  footer={(item, index) => (

                    details?.register_status === "CANCEL_REGISTER" ? "" :
                      <Button
                        key={index}
                        onClick={() =>
                          setData([
                            ...data,
                            {
                              id: uuidv4(),
                              status: true,
                              file_image: undefined,
                            },
                          ])
                        }
                        color="transparent-success"
                        icon="plus"
                      >
                        Thêm hồ sơ
                      </Button>

                  )}
                />
              </div>
            </Pane>
          </Pane>
          <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
            {
              details?.register_status === "CANCEL_REGISTER" ? "" :
                <Button color="success" htmlType="submit" loading={loadingSubmit} className="ml-2">
                  Lưu
                </Button>
            }
          </Pane>
        </Pane>
      </Loading>
    </Form>
  );
});

General.propTypes = {
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  configuration: PropTypes.arrayOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  loading: {},
  error: {},
  match: {},
  configuration: [],
  details: {},
};

export default withRouter(connect(mapStateToProps)(General));
