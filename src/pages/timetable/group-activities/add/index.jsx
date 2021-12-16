import React, { memo, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'umi';
import { Form, Table, Input, Checkbox } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get, isEmpty, last, head } from 'lodash';
import moment from 'moment';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Loading from '@/components/CommonComponent/Loading';
import { EditableCell, EditableRow } from '@/components/CommonComponent/Table/EditableCell';
import { useDispatch, useSelector } from 'dva';
import { v4 as uuidv4 } from 'uuid';

const Index = memo(() => {
  const [formRef] = Form.useForm();
  const dispatch = useDispatch();
  const { params } = useRouteMatch();
  const history = useHistory();
  const [data, setData] = useState([
    {
      id: uuidv4(),
    },
  ]);

  const [
    { error, details },
    { menuLeftTimeTable },
  ] = useSelector(({ timetableGroupActivitiesAdd, menu }) => [timetableGroupActivitiesAdd, menu]);

  const loadCategories = () => {
    dispatch({
      type: 'timetableGroupActivitiesAdd/GET_CATEGORIES',
      payload: {},
    });
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'timetableGroupActivitiesAdd/GET_DETAILS',
        payload: {
          id: params.id,
        },
      });
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (!isEmpty(details) && get(params, 'id')) {
      formRef.setFieldsValue({
        ...details,
      });
    }
  }, [details]);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'timetableGroupActivitiesAdd/UPDATE' : 'timetableGroupActivitiesAdd/ADD',
      payload: {
        id: params.id,
        ...values,
        data: values.data.map((item) => ({
          ...item,
          birthday: moment(item.birthday).format(variables.DATE_FORMAT.DATE_AFTER),
          dedectionTimeFrom:
            head(item.date) && moment(head(item.date)).format(variables.DATE_FORMAT.DATE_AFTER),
          dedectionTimeTo:
            last(item.date) && moment(last(item.date)).format(variables.DATE_FORMAT.DATE_AFTER),
        })),
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              formRef.setFields([
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
  };

  const onAddLevels = () => {
    const objects = {
      id: uuidv4(),
    };
    setData((prevState) => [...prevState, objects]);

    const itemsRow = document.querySelectorAll(
      `.ant-table-tbody tr[data-row-key='${objects.id}'] .editable-cell-value-wrap`,
    );
    if (!isEmpty(itemsRow)) {
      itemsRow[0].click();
    }
  };

  const handleSaves = (record) => {
    setData((prevState) => prevState.map((item) => (item.id === record.id ? record : item)));
  };

  const onRemove = (record) => {
    setData((prevState) => prevState.filter((item) => item.id !== record.id));
  };

  const headers = () => {
    const columns = [
      {
        title: 'name',
        render: (value, record, index) => `Hoạt động ${index + 1}`,
      },
      {
        title: 'content',
        dataIndex: 'content',
        editable: true,
        type: variables.INPUT,
        render: (value) => <Input value={value} placeholder="Nhập" />,
      },
      {
        title: 'check',
        dataIndex: 'check',
        render: (record) => (
          <Checkbox className="d-flex" checkbox={record}>
            <p style={{ width: 'max-content' }}>Có giáo viên phụ trách</p>
          </Checkbox>
        ),
      },
      {
        title: 'action',
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

  const columnsTables = headers().map((col) => {
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
        handleSave: handleSaves,
      }),
    };
  });

  return (
    <>
      <Breadcrumbs
        last={params.id ? 'Chỉnh sửa nhóm hoạt động' : 'Tạo nhóm hoạt động'}
        menu={menuLeftTimeTable}
      />
      <Form
        className={styles['layout-form']}
        layout="vertical"
        form={formRef}
        initialValues={{
          data: [{}],
        }}
        onFinish={onFinish}
      >
        <div className={styles['content-form']}>
          <Loading
            isError={error.isError}
            params={{ error, goBack: '/thoi-khoa-bieu/danh-muc/nhom-hoat-dong' }}
          >
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className={classnames(styles['content-children'], 'mt10')}>
                  <Text color="dark" size="large-medium">
                    Thông tin thêm mới
                  </Text>
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      <FormItem
                        label="Tên nhóm hoạt động"
                        name="subject_id"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.INPUT}
                      />
                    </div>
                  </div>
                </div>

                <div className={classnames(styles['content-children'], 'mt10')}>
                  <Text color="dark" size="large-medium">
                    Chi tiết
                  </Text>
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      <Table
                        className="table-edit"
                        showHeader={false}
                        pagination={false}
                        bordered
                        components={{
                          body: {
                            row: EditableRow,
                            cell: EditableCell,
                          },
                        }}
                        rowKey={(record) => record.id}
                        dataSource={data}
                        columns={columnsTables}
                        scroll={{ x: '100%' }}
                        footer={() => (
                          <Button color="success" icon="plus" onClick={onAddLevels}>
                            Thêm
                          </Button>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className={classnames('d-flex', 'justify-content-center', 'mt-4')}>
                  <Button
                    color="gray"
                    icon="prev"
                    onClick={() => history.goBack()}
                    size="large"
                    className="mr-3"
                  >
                    HỦY
                  </Button>
                  <Button color="green" icon="save" htmlType="submit" size="large">
                    LƯU
                  </Button>
                </div>
              </div>
            </div>
          </Loading>
        </div>
      </Form>
    </>
  );
});

export default Index;
