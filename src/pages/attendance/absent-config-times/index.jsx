import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams } from 'umi';
import { head, isEmpty, omit } from 'lodash';
import classnames from 'classnames';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils';
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
  const [dataSource, setDataSource] = useState([
    {
      id: uuidv4(),
      isAdd: true,
    },
  ]);
  const [deleteRows, setDeleteRows] = useState([]);

  const formRef = useRef();
  const mounted = useRef(false);

  const onFinish = () => {
    const createRows = dataSource
      .filter((item) => item.isAdd)
      .map((item) => ({ ...omit(item, 'isAdd') }));
    const updateRows = dataSource
      .filter((item) => !item.isAdd)
      .map((item) => ({ ...omit(item, 'isAdd') }));
    const payload = {
      createRows,
      updateRows,
      deleteRows,
    };
    dispatch({
      type: 'absentConfigTimes/ADD',
      payload,
      callback: (response, error) => {
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

  useEffect(() => {
    dispatch({
      type: 'absentConfigTimes/GET_DATA',
      payload: {
        ...params,
      },
      callback: (response) => {
        if (response) {
          setDataSource(
            response?.parsePayload.map((item) => ({
              ...item,
            })),
          );
        }
      },
    });
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const handleSave = (record) => {
    setDataSource((prevState) => prevState.map((item) => (item.id === record.id ? record : item)));
  };

  const onAdd = async () => {
    const objects = {
      id: uuidv4(),
      isAdd: true,
    };
    await setDataSource((prevState) => [...prevState, objects]);

    const itemsRow = document.querySelectorAll(
      `.ant-table-tbody tr[data-row-key='${objects.id}'] .editable-cell-value-wrap`,
    );
    if (!isEmpty(itemsRow)) {
      itemsRow[0].click();
    }
  };

  const onRemove = (record) => {
    setDataSource((prevState) => prevState.filter((item) => item.id !== record.id));
    setDeleteRows((prevState) => [...prevState, record.id]);
  };

  const header = () => {
    const columns = [
      {
        title: 'Nghỉ từ',
        dataIndex: 'from',
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
        dataIndex: 'to',
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
        dataIndex: 'advanceNotice',
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
                    dataSource={dataSource}
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
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={loading['absentConfigTimes/ADD'] || loading['absentConfigTimes/UPDATE']}
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
