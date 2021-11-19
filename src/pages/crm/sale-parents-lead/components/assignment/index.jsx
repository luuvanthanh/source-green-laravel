import { memo, useEffect, useState } from 'react';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import Pane from '@/components/CommonComponent/Pane';
import Select from '@/components/CommonComponent/Select';
import TableCus from '@/components/CommonComponent/Table';
import { EditableCell, EditableRow } from '@/components/CommonComponent/Table/EditableCell';
import { variables } from '@/utils';
import { Form, Modal } from 'antd';
import { useDispatch } from 'dva';
import { useLocation } from 'umi';
import stylesModule from '../../styles.module.scss';

const Index = memo((props) => { 
  // eslint-disable-next-line react/prop-types
  const {dataSource} = props;
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [employeeAllotment, setEmployeeAllotment] = useState([]);
  const [dataUser, setDataUser] = useState([]);

  const [employeesId, setEmployeesId] = useState([]);
  const { query } = useLocation();
  const handleChangeEmployee = (val, record) => {
    const result = [...employeeAllotment];
    const orderItem = result.find((item) => item.customer_lead_id === record.id);
    if (orderItem) {
      orderItem.employee_id = val;
    } else {
      result.push({ customer_lead_id: record.id, employee_id: val, employee_info: [] });
    }
    setEmployeeAllotment(result);
    const newData = [...data];
    const indexItem = newData?.findIndex((val) => val.id === record.id);
    if (indexItem > -1) {
      newData[indexItem] = {
        ...newData[indexItem],
        employee_id: val,
      };
      setData(newData);
    }
  };


  const columns = [
    {
      title: 'Phụ huynh',
      dataIndex: 'full_name',
      width: 160,
      className: 'min-width-160',
    },

    {
      title: 'Nhân viên chăm sóc',
      key: 'employee_id',
      dataIndex: 'employee_id',
      width: 180,
      className: 'min-width-180',
      render: (value, record) => (
        <Select
          value={value}
          onChange={(val) => handleChangeEmployee(val, record)}
          dataSet={dataUser}
          placeholder="Chọn"
          options={['id', 'full_name']}
          className="w-100"
        />
      ),
    },
  ];

  const onLoad = () => {
    dispatch({
      type: 'crmSaleAssignment/GET_EMPLOYEES',
      callback: (response) => {
        if (response) {
          setDataUser(response?.parsePayload);
        }
      },
    });
    const dataAssignment = dataSource;
    const payload = {
      customer_lead_id: dataAssignment.filter((item) => item.isActive === true).map((item) => item.id).join(","),
    };
    if (dataAssignment.length > 0 ) {
      dispatch({
        type: 'crmSaleAssignment/GET_DATA',
        payload,
        callback: (response) => {
          if (response) setData(response.parsePayload);
        }
      });
    };
  };

  useEffect(() => {
    onLoad();
  }, []);
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        type: col.type,
        prefix: col.prefix,
        dataSelect: col.dataSelect,
      }),
    };
  });

  const showModal = () => {
    setIsModalVisible(true);
    onLoad();
  };

  const handleOk = () => {
    dispatch({
      type: 'crmSaleAssignment/ASSIGNMENT',
      payload: employeeAllotment,
      callback: (response) => {
        if (response) {
          onLoad();
          setIsModalVisible(false);
          dispatch({
            type: 'orders/GET_DATA',
            payload: {
              page: query?.page,
              limit: query?.limit,
              status: query?.status,
              key: query?.key,
              employee_id: query?.employee_id,
            },
          });
        }
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEmployeeAllotment([]);
  };

  const onApply = () => {
    if (!(employeesId || []).length) return;
    const newData = [...data];
    let count = 0;
    const mapData = newData.map((val) => {
      let index = count;
      if (count < employeesId.length) {
        count += 1;
      } else {
        count = 0;
        index = 0;
      }
      return {
        ...val,
        employee_id: employeesId[index],
      };
    });
    setData(mapData);
    const mapEmployeeAllotment = mapData.map((val) => ({
      customer_lead_id: val.id,
      employee_id: val.employee_id,
      employee_info: [],
      // employee_info: employeeAllotment.find((item) => item.id === val.employee_id),
    }));
    setEmployeeAllotment(mapEmployeeAllotment);
  };

  return (
    <>
      <div>
        <Button color="success" icon="list" className="ml-2" onClick={showModal}>
          Phân công
        </Button>
        <Modal
          title="Phân công nhân viên Sale chăm sóc"
          className={stylesModule['wrapper-modal']}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={960}
          centered
          footer={[
            <p
              key="back"
              role="presentation"
              className={stylesModule['button-cancel']}
              onClick={() => handleCancel()}
            >
              Hủy
            </p>,
            <Button
              key="submit"
              color="success"
              type="primary"
              onClick={handleOk}
              className={styles['cheack-btn-ok']}
            >
              Lưu
            </Button>,
          ]}
        >
          <div>
            <Pane className="row mt20">
              <Pane className="col-lg-12">
                <span className={styles['assignment-title']}>Phân công</span>
              </Pane>
              <Pane className="col-lg-9">
                <Form.Item name="name" type={variables.INPUT}>
                  <Select
                    mode="tags"
                    placeholder="Chọn"
                    dataSet={dataUser}
                    options={['id', 'full_name']}
                    style={{ width: '100%' }}
                    onChange={setEmployeesId}
                  />
                </Form.Item>
              </Pane>
              <Pane className={styles[('order-assignment-btn', 'col-lg-3')]}>
                <Button
                  onClick={onApply}
                  color="success"
                  style={{ backgroundColor: '#3B5CAD', border: 'none', borderRadius: '2px' }}
                >
                  Áp dụng
                </Button>
              </Pane>
            </Pane>

            <span className={styles['assignment-title']}>Nhân viên sale</span>

            <TableCus
              bordered
              className="table-edit order-assignment-table"
              columns={mergedColumns}
              rowKey={(record) => record?.id}
              components={{
                body: {
                  row: EditableRow,
                  cell: EditableCell,
                },
              }}
              dataSource={data}
              isEmpty
              pagination={false}
              scroll={{ x: '100%', y: '50vh' }}
            />
          </div>
        </Modal>
      </div>
    </>
  );
});

export default Index;
