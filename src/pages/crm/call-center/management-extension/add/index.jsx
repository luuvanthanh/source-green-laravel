import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'umi';
import { Form, Select } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import { v4 as uuidv4 } from 'uuid';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Loading from '@/components/CommonComponent/Loading';
import Table from '@/components/CommonComponent/Table';
import { useDispatch, useSelector } from 'dva';
import Heading from '@/components/CommonComponent/Heading';
import { head, isEmpty } from 'lodash';

const { Option } = Select;

function Index() {
  const [formRef] = Form.useForm();
  const dispatch = useDispatch();
  const { params } = useRouteMatch();
  const history = useHistory();

  const [
    { error, employees },
    loading,
    { menuLeftCRM },
  ] = useSelector(({ loading: { effects }, crmManagementExtensionAdd, menu }) => [
    crmManagementExtensionAdd,
    effects,
    menu,
  ]);

  const [listEmployees, setListEmployees] = useState([]);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'crmManagementExtensionAdd/GET_DETAIL',
        payload: {
          id: params.id,
        },
        callback: (response) => {
          formRef.setFieldsValue({
            ...response,
          });
          setListEmployees(response?.employee.map((item) => ({ ...item })));
        },
      });
    }
  }, []);

  const onSelectEmployees = (value, index) => {
    const findEmployees = employees.find((item) => item.id === value);
    const newListEmployees = [...listEmployees];
    const newTeacher = {
      ...newListEmployees[index],
      id: findEmployees.id,
      full_name: findEmployees.full_name,
    };
    newListEmployees[index] = newTeacher;
    setListEmployees(newListEmployees);
  };

  useEffect(() => {
    dispatch({
      type: 'crmManagementExtensionAdd/GET_EMPLOYEES',
      payload: {},
    });
  }, []);

  const handleAdd = () => {
    setListEmployees((prev) => [
      ...prev,
      {
        id: uuidv4(),
      },
    ]);
  };

  const header = () => {
    const columns = [
      {
        title: 'STT',
        align: 'center',
        className: 'min-width-100',
        width: 100,
        render: (value, record, index) => index + 1,
      },
      {
        title: 'Tên nhân viên',
        key: 'full_name',
        render: (value, record, index) => (
          <Select
            className="w-100"
            defaultValue={record.full_name}
            onChange={(val) => onSelectEmployees(val, index)}
          >
            {employees?.map((item) => (
              <Option key={item.id}>{item?.full_name}</Option>
            ))}
          </Select>
        ),
      },
      {
        key: 'action',
        align: 'center',
        className: 'min-width-100',
        width: 100,
        render: (record) => (
          <div className="groups-input">
            <span
              className="icon icon-remove"
              role="presentation"
              onClick={() => {
                setListEmployees((prev) => prev.filter((item) => item.id !== record.id));
              }}
            />
          </div>
        ),
      },
    ];
    return columns;
  };

  const onFinish = () => {
    const payload = {
      employee_id: listEmployees.map((item) => item.id),
      extension_id: params.id,
    };
    dispatch({
      type: 'crmManagementExtensionAdd/UPDATE',
      payload,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.setFields([
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

  return (
    <>
      <Breadcrumbs last="Chi tiết" menu={menuLeftCRM} />
      <Form className={styles['layout-form']} layout="vertical" form={formRef} onFinish={onFinish}>
        <div className={styles['content-form']}>
          <Loading
            isError={error.isError}
            params={{ error, type: 'container', goBack: '/quan-ly-nhan-su/hop-dong-thoi-vu' }}
          >
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className={classnames(styles['content-children'], 'mt0')}>
                  <Heading type="form-title" className="mb15">
                    Thông tin máy lẻ
                  </Heading>
                  <div className="row">
                    <div className="col-lg-4">
                      <FormItem
                        label="Tài khoản"
                        name="user_id_cmc"
                        type={variables.INPUT}
                        disabled
                        placeholder=" "
                      />
                    </div>
                    <div className="col-lg-4">
                      <FormItem
                        label="Mật khẩu"
                        name="password"
                        type={variables.INPUT}
                        disabled
                        placeholder=" "
                      />
                    </div>
                    <div className="col-lg-4">
                      <FormItem
                        label="Hostname"
                        name="host_name"
                        type={variables.INPUT}
                        disabled
                        placeholder=" "
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-4">
                      <FormItem
                        label="Port"
                        name="port"
                        type={variables.INPUT}
                        disabled
                        placeholder=" "
                      />
                    </div>
                    <div className="col-lg-4">
                      <FormItem
                        label="Path"
                        name="path"
                        type={variables.INPUT}
                        disabled
                        placeholder=" "
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                      <div className="ant-col ant-form-item-label">
                        <label htmlFor="table">
                          <span>Nhân viên trực máy lẻ</span>
                        </label>
                      </div>
                      <Table
                        bordered
                        className={classnames(
                          styles['statistical-table'],
                          styles['table-edit'],
                          'mb20',
                        )}
                        isEmpty
                        columns={header()}
                        dataSource={listEmployees}
                        pagination={false}
                        rowKey={(record) => record.id}
                        scroll={{ x: '100%' }}
                        footer={() => (
                          <Button color="transparent-success" icon="plus" onClick={handleAdd}>
                            Thêm nhân viên
                          </Button>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className={classnames('d-flex', 'justify-content-between', 'mt-4')}>
                  <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                    Hủy
                  </p>
                  <Button
                    color="success"
                    htmlType="submit"
                    loading={
                      loading['crmManagementExtensionAdd/ADD'] ||
                      loading['crmManagementExtensionAdd/UPDATE']
                    }
                  >
                    Lưu
                  </Button>
                </div>
              </div>
            </div>
          </Loading>
        </div>
      </Form>
    </>
  );
}

export default Index;
