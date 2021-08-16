import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Upload, message, Input } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import { head, isEmpty, last } from 'lodash';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import { variables, Helper } from '@/utils';
import CustomListUpload from '@/components/CommonComponent/CustomListUpload';
import { CloudUploadOutlined } from '@ant-design/icons';
import { EditableCell, EditableRow } from '@/components/CommonComponent/Table/EditableCell';
import TableCus from '@/components/CommonComponent/Table';
import { v4 as uuidv4 } from 'uuid';
import Select from '@/components/CommonComponent/Select';

const Index = memo(() => {
  const [
    { menuLeftCriteria },
    loading,
    { error, classTypes, sensitivePeriods },
  ] = useSelector(({ menu, loading: { effects }, criteriaToolCreate }) => [
    menu,
    effects,
    criteriaToolCreate,
  ]);
  const dispatch = useDispatch();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [toolDetailSensitives, setToolDetailSensitives] = useState([
    {
      id: uuidv4(),
    },
  ]);

  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'criteriaToolCreate/UPDATE' : 'criteriaToolCreate/ADD',
      payload: {
        ...values,
        ...params,
        fileUrl: JSON.stringify(files),
        toolDetailClassTypes: values.toolDetailClassTypes.map((item) => ({
          classTypeId: item,
        })),
        toolDetailSensitives,
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

  const remove = () => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'criteriaToolCreate/REMOVE',
          payload: {
            ...params,
          },
          callback: (response) => {
            if (response) {
              history.goBack();
            }
          },
        });
      },
    });
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'criteriaToolCreate/GET_DATA',
        payload: {
          ...params,
        },
        callback: (response) => {
          if (Helper.isJSON(response?.fileUrl)) {
            mountedSet(setFiles, JSON.parse(response?.fileUrl));
          }
          if (response) {
            formRef.current.setFieldsValue({
              ...response,
              toolDetailClassTypes: response?.toolDetailClassTypes?.map(
                (item) => item?.classType?.id,
              ),
            });
            setToolDetailSensitives(
              response?.toolDetailSensitives.map((item) => ({
                ...item,
                sensitivePeriodId: item?.sensitivePeriod?.id,
              })),
            );
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    dispatch({
      type: 'criteriaToolCreate/GET_CLASS_TYPES',
      payload: {},
    });
    dispatch({
      type: 'criteriaToolCreate/GET_SENSITIVE_PERIODS',
      payload: {},
    });
  }, []);

  const onUpload = (files) => {
    dispatch({
      type: 'upload/UPLOAD',
      payload: files,
      callback: (response) => {
        if (response) {
          setFiles((prevState) => [...prevState, head(response.results)?.fileInfo]);
        }
      },
    });
  };

  const onRemoFile = (record) => {
    setFiles((prevState) => prevState.filter((item) => item.id !== record.id));
  };

  const props = {
    beforeUpload() {
      return null;
    },
    customRequest({ file }) {
      const { name, size } = file;
      const allowTypes = ['jpeg', 'jpg', 'png'];
      const maxSize = 5 * 2 ** 20;
      if (!allowTypes.includes(last(name.split('.'))) || size > maxSize) {
        message.error('Định dạng hỗ trợ:  .jpeg, .jpg, .png. Tổng dung lượng không vượt quá 20MB');
        return;
      }
      onUpload(file);
    },
    showUploadList: false,
    fileList: [],
  };

  const handleSave = (record) => {
    setToolDetailSensitives((prevState) =>
      prevState.map((item) => (item.id === record.id ? record : item)),
    );
  };

  const onAdd = async () => {
    const objects = {
      id: uuidv4(),
    };
    await setToolDetailSensitives((prevState) => [...prevState, objects]);

    const itemsRow = document.querySelectorAll(
      `.ant-table-tbody tr[data-row-key='${objects.id}'] .editable-cell-value-wrap`,
    );
    if (!isEmpty(itemsRow)) {
      itemsRow[0].click();
    }
  };

  const onRemove = (record) => {
    setToolDetailSensitives((prevState) => prevState.filter((item) => item.id !== record.id));
  };

  const header = () => {
    const columns = [
      {
        title: 'Thời kỳ nhạy cảm',
        key: 'sensitivePeriodId',
        dataIndex: 'sensitivePeriodId',
        className: 'min-width-200',
        width: 200,
        editable: true,
        type: variables.SELECT,
        dataSelect: sensitivePeriods.map((item) => ({ value: item.id, label: item.name })),
        render: (value) => (
          <Select
            value={value}
            dataSet={sensitivePeriods}
            style={{ width: '100%' }}
            placeholder="Chọn"
          />
        ),
      },
      {
        title: 'Diễn giải',
        key: 'explaination',
        dataIndex: 'explaination',
        className: 'min-width-200',
        width: 200,
        editable: true,
        type: variables.INPUT,
        render: (value) => <Input value={value} placeholder="Nhập" />,
      },
      {
        title: 'Tham gia phụ huynh',
        key: 'parentInvolvement',
        dataIndex: 'parentInvolvement',
        className: 'min-width-200',
        width: 200,
        editable: true,
        type: variables.INPUT,
        render: (value) => <Input value={value} placeholder="Nhập" />,
      },
      {
        key: 'action',
        className: 'min-width-50',
        width: 50,
        align: 'center',
        render: (record) => (
          <div className="groups-input">
            <span
              className="icon icon-remove"
              role="presentation"
              onClick={() => onRemove(record)}
            />
          </div>
        ),
      },
    ];
    return columns;
  };

  const columnsTable = header().map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        type: col.type,
        title: col.title,
        dataIndex: col.dataIndex,
        dataSelect: col.dataSelect,
        editable: col.editable,
        handleSave,
      }),
    };
  });

  return (
    <>
      <Helmet title="Tạo giáo cụ" />
      <Pane style={{ paddingTop: 20 }}>
        <Breadcrumbs last="Tạo giáo cụ" menu={menuLeftCriteria} />
        <Pane style={{ padding: 20, paddingTop: 0 }}>
          <Form layout="vertical" ref={formRef} onFinish={onFinish} initialValues={{}}>
            <Pane className="my20 mb0 card">
              <Loading
                loading={loading['criteriaToolCreate/GET_DATA']}
                isError={error.isError}
                params={{ error, type: 'container', goBack: '/chuong-trinh-hoc/cau-hinh/giao-cu' }}
              >
                <Pane className="border-bottom p20">
                  <Heading type="form-title" className="mb20">
                    Thông tin chung
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-12">
                      <label className="ant-col ant-form-item-label d-block">
                        <span>Hình ảnh</span>
                      </label>
                      <Upload {...props}>
                        <Pane className="upload-container">
                          <CloudUploadOutlined />
                        </Pane>
                      </Upload>
                    </Pane>
                  </Pane>
                  {!isEmpty(files) && (
                    <CustomListUpload data={files} remove={(item) => onRemoFile(item)} />
                  )}
                  <Pane className="row mt20">
                    <Pane className="col-lg-6">
                      <FormItem
                        label="Tên giáo cụ"
                        name="name"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>
                    <Pane className="col-lg-6">
                      <FormItem
                        data={classTypes}
                        label="Loại lớp áp dụng"
                        name="toolDetailClassTypes"
                        type={variables.SELECT_MUTILPLE}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>
                  </Pane>
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <FormItem label="Nội dung" name="content" type={variables.TEXTAREA} />
                    </Pane>
                    <Pane className="col-lg-6">
                      <FormItem label="Ý nghĩa" name="meanOfLife" type={variables.TEXTAREA} />
                    </Pane>
                  </Pane>
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <FormItem
                        label="Kỹ năng trẻ đạt được"
                        name="skillGained"
                        type={variables.TEXTAREA}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        label="Cấp độ giáo cụ từ"
                        name="levelFrom"
                        type={variables.INPUT_COUNT}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem label="Đến" name="levelTo" type={variables.INPUT_COUNT} />
                    </Pane>
                  </Pane>
                </Pane>
              </Loading>
            </Pane>
            <Pane className="my20 mb0 card">
              <Pane className="border-bottom p20">
                <Heading type="form-title" className="mb20">
                  Thời kỳ nhạy cảm
                </Heading>
                <TableCus
                  bordered
                  className="table-edit mt20"
                  columns={columnsTable}
                  components={{
                    body: {
                      row: EditableRow,
                      cell: EditableCell,
                    },
                  }}
                  dataSource={toolDetailSensitives}
                  pagination={false}
                  rowKey={(record) => record.id}
                  scroll={{ x: '100%' }}
                  footer={() => (
                    <Button color="success" icon="plus" onClick={onAdd}>
                      Thêm
                    </Button>
                  )}
                />
              </Pane>
            </Pane>
            <Pane className="d-flex justify-content-between align-items-center mb20">
              {params.id && (
                <p className="btn-delete" role="presentation" onClick={remove}>
                  Xóa
                </p>
              )}
              <Button
                className="ml-auto px25"
                color="success"
                htmlType="submit"
                size="large"
                loading={loading['criteriaToolCreate/ADD'] || loading['criteriaToolCreate/UPDATE']}
                disabled={!!toolDetailSensitives.find((item) => !item.sensitivePeriodId)}
              >
                Lưu
              </Button>
            </Pane>
          </Form>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
