import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import { head, isEmpty } from 'lodash';
import classnames from 'classnames';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { variables, Helper } from '@/utils';
import { EditableCell, EditableRow } from '@/components/CommonComponent/Table/EditableCell';
import TableCus from '@/components/CommonComponent/Table';
import { v4 as uuidv4 } from 'uuid';
import styles from '@/assets/styles/Common/common.scss';

const Index = memo(() => {
  const [{ menuLeftSchedules }, loading] = useSelector(({ menu, loading: { effects } }) => [
    menu,
    effects,
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
      type: params.id ? 'attendanceTimeline/UPDATE' : 'attendanceTimeline/ADD',
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
          type: 'attendanceTimeline/REMOVE',
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
        type: 'attendanceTimeline/GET_DATA',
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
      type: 'attendanceTimeline/GET_CLASS_TYPES',
      payload: {},
    });
    dispatch({
      type: 'attendanceTimeline/GET_SENSITIVE_PERIODS',
      payload: {},
    });
  }, []);

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
        title: 'Nghỉ từ',
        dataIndex: 'fromDate',
        editable: true,
        className: classnames('min-width-130', 'max-width-130'),
        type: variables.INPUT_DATE,
        render: (value) => (
          <InputNumber
            className={classnames(
              'input-number',
              styles['input-number-container'],
              styles['input-number-date'],
            )}
            value={value}
            placeholder="Nhập"
          />
        ),
      },
      {
        title: 'Đến',
        dataIndex: 'toDate',
        editable: true,
        className: classnames('min-width-130', 'max-width-130'),
        type: variables.INPUT_DATE,
        render: (value) => (
          <InputNumber
            className={classnames(
              'input-number',
              styles['input-number-container'],
              styles['input-number-date'],
            )}
            value={value}
            placeholder="Nhập"
          />
        ),
      },
      {
        title: 'Thì xin trước',
        dataIndex: 'date',
        editable: true,
        className: classnames('min-width-130', 'max-width-130'),
        type: variables.INPUT_DATE,
        render: (value) => (
          <InputNumber
            className={classnames(
              'input-number',
              styles['input-number-container'],
              styles['input-number-date'],
            )}
            value={value}
            placeholder="Nhập"
          />
        ),
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
      <Helmet title="Thời gian xin phép" />
      <Breadcrumbs menu={menuLeftSchedules} />
      <Pane style={{ padding: 20, paddingTop: 0 }}>
        <Pane className="row">
          <Pane className="col-lg-8 offset-lg-2">
            <Form layout="vertical" ref={formRef} onFinish={onFinish} initialValues={{}}>
              <Pane className="my20 mb0 card">
                <Pane className="border-bottom p20">
                  <Heading type="form-title" className="mb20">
                    Thông tin cấu hình
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
                  loading={
                    loading['attendanceTimeline/ADD'] || loading['attendanceTimeline/UPDATE']
                  }
                >
                  Lưu
                </Button>
              </Pane>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
