import { memo, useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Form, Modal, Tabs, InputNumber } from 'antd';
import { find } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { useRouteMatch } from 'umi';
import csx from 'classnames';
import moment from 'moment';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Select from '@/components/CommonComponent/Select';

import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';

const { TabPane } = Tabs;

const Index = memo(() => {
  const mounted = useRef(false);
  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };
  const formRefModal = useRef();

  const dispatch = useDispatch();
  const [
    {
      contractTypes,
      branches,
      divisions,
      positions,
      probationaryContracts,
      paramaterValues,
      paramaterFormulas,
    },
    loading,
  ] = useSelector(({ HRMusersAdd, loading }) => [HRMusersAdd, loading?.effects]);

  const {
    params: { id: employeeId },
  } = useRouteMatch();

  const [visible, setVisible] = useState(false);
  const [contractDetails, setContractDetails] = useState({});

  const cancelModal = () => {
    mountedSet(setVisible, false);
  };

  const changeContract = (value) => {
    const currentType = find(contractTypes, { id: value });
    mountedSet(setContractDetails, currentType || {});
  };

  const parameterFormulasColumns = useMemo(
    () => [
      {
        title: 'STT',
        key: 'index',
        width: 60,
        className: 'min-width-60',
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Loại tham số',
        key: 'name',
        dataIndex: 'name',
        className: 'min-width-120',
      },
      {
        title: 'Công thức',
        key: 'recipe',
        dataIndex: 'recipe',
        className: 'min-width-120',
      },
    ],
    [],
  );

  const changeValue = useCallback((id) => (value) => {
    mountedSet(setContractDetails, (prev) => ({
      ...prev,
      parameterValues: prev.parameterValues.map((item) =>
        item.id === id
          ? {
              ...item,
              valueDefault: value,
            }
          : item,
      ),
    }));
  });

  const onChangeParameterValues = (id, value) => {
    const paramater = paramaterValues.find((item) => item.id === value);
    mountedSet(setContractDetails, (prev) => ({
      ...prev,
      parameterValues: prev.parameterValues.map((item) =>
        item.id === id
          ? {
              ...paramater,
            }
          : item,
      ),
    }));
  };

  console.log(paramaterValues);

  const parameterValuesColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      className: 'min-width-60',
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Loại tham số',
      key: 'name',
      dataIndex: 'name',
      className: 'min-width-120',
    },
    {
      title: 'Số tiền',
      key: 'values',
      dataIndex: 'valueDefault',
      className: 'min-width-120',
      render: (value, record) => (
        <InputNumber
          defaultValue={value}
          className={csx('input-number', styles['input-number-container'])}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          onChange={changeValue(record.id)}
          placeholder="Nhập"
        />
      ),
    },
  ];

  const columns = useMemo(
    () => [
      {
        title: 'Số hợp đồng',
        key: 'contract_number',
        dataIndex: 'contractNumber',
        className: 'min-width-120',
      },
      {
        title: 'Ngày hợp đồng',
        key: 'date',
        dataIndex: 'contractDate',
        className: 'min-width-150',
        render: (value) => Helper.getDate(value, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Loại hợp đồng',
        key: 'contract_category',
        dataIndex: 'typeOfContract',
        className: 'min-width-120',
        render: (value) => value?.name,
      },
      {
        title: 'Số tháng thử việc',
        key: 'contract_category',
        dataIndex: 'month',
        className: 'min-width-150',
      },
      {
        title: 'Thời hạn HĐ từ',
        key: 'date',
        dataIndex: 'contractFrom',
        className: 'min-width-150',
        render: (value) => Helper.getDate(value, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Thời hạn HĐ đến',
        key: 'deadline',
        dataIndex: 'contractTo',
        className: 'min-width-150',
        render: (value) => Helper.getDate(value, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Tỷ lệ lương',
        key: 'contract_category',
        dataIndex: 'salaryRatio',
        className: 'min-width-150',
        render: (value) => Helper.getPercent(value * 100),
      },
      {
        title: 'Lương cơ bản',
        key: 'salary',
        dataIndex: 'parameterValues[0]',
        className: 'min-width-150',
        render: (value) => Helper.getPrice(value?.pivot?.value),
      },
      {
        title: 'Tổng phụ cấp',
        key: 'payment',
        dataIndex: 'parameterValues',
        className: 'min-width-150',
        render: (value) =>
          Helper.getPrice(
            (value || []).reduce(
              (result, item, index) => (!!index ? result + item?.pivot?.value : result),
              0,
            ),
          ),
      },
      {
        title: 'Nơi làm việc',
        key: 'branch',
        dataIndex: 'branch',
        className: 'min-width-150',
        render: (value) => value?.name,
      },
      {
        title: 'Chức danh',
        key: 'position',
        dataIndex: 'position',
        className: 'min-width-150',
        render: (value) => value?.name,
      },
      // {
      //   title: 'Thao tác',
      //   key: 'actions',
      //   width: 180,
      //   className: 'min-width-180',
      //   fixed: 'right',
      //   align: 'center',
      //   render: (record) => (
      //     <ul className="list-unstyled list-inline">
      //       <li className="list-inline-item">
      //         <Button color="primary" icon="edit" />
      //       </li>
      //       <li className="list-inline-item">
      //         <Button color="danger" icon="remove" className="ml-2" />
      //       </li>
      //       <li className="list-inline-item">
      //         <Button color="success" icon="export" />
      //       </li>
      //     </ul>
      //   ),
      // },
    ],
    [],
  );

  const finishForm = () => {
    const formValues = formRefModal?.current?.getFieldsValue();

    const reqData = {
      ...formValues,
      employeeId,
      contractDate: moment(formValues.contractDate),
      contractFrom: formValues.contractFrom && moment(formValues.contractFrom),
      contractTo: formValues.contractTo && moment(formValues.contractTo),
      detail: (contractDetails?.parameterValues || []).map(({ id, valueDefault }) => ({
        parameterValueId: id,
        value: ++valueDefault,
      })),
    };

    dispatch({
      type: 'HRMusersAdd/ADD_PROBATIONARY_CONTRACT',
      payload: reqData,
      callback: (res, err) => {
        if (res) {
          formValues?.current?.resetFields();
          mountedSet(setContractDetails, {});
          mountedSet(setVisible, false);
          fetchProbationaryContracts();
        }
        if (err) {
          const { data } = err;
          if (data?.status === 400 && !!size(data?.errors)) {
            for (const item of data?.errors) {
              formRefModal?.current?.setFields([
                {
                  name: item?.source?.pointer,
                  errors: [item?.details],
                },
              ]);
            }
          }
        }
      },
    });
  };

  const fetchProbationaryContracts = () => {
    dispatch({
      type: 'HRMusersAdd/GET_PROBATIONARY_CONTRACTS',
      payload: {
        employeeId,
      },
    });
  };

  const formUpdate = (value, values) => {
    const { month, contractFrom } = values;

    if (moment.isMoment(contractFrom)) {
      formRefModal?.current?.setFieldsValue({
        contractTo: moment(contractFrom).add(month || 0, 'months'),
      });
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    dispatch({ type: 'HRMusersAdd/GET_BRANCHES' });
    dispatch({ type: 'HRMusersAdd/GET_DIVISIONS' });
    dispatch({ type: 'HRMusersAdd/GET_POSITIONS' });
    dispatch({ type: 'HRMusersAdd/GET_CONTRACT_TYPES' });
    dispatch({ type: 'HRMusersAdd/GET_PARAMATER_VALUES' });
    dispatch({ type: 'HRMusersAdd/GET_PARAMATER_FORMULAS' });
  }, []);

  useEffect(() => {
    fetchProbationaryContracts();
  }, []);

  return (
    <>
      <Modal
        visible={visible}
        title="Hợp đồng thử việc"
        centered
        className={styles['modal-fullscreen']}
        onCancel={cancelModal}
        footer={
          <Pane className="d-flex justify-content-end">
            <Button
              disabled={loading['HRMusersAdd/ADD_PROBATIONARY_CONTRACT']}
              key="cancel"
              color="white"
              size="large"
              onClick={cancelModal}
            >
              Hủy
            </Button>
            <Button
              disabled={
                loading['categories/GET_BRANCHES'] ||
                loading['HRMusersAdd/GET_DIVISIONS'] ||
                loading['HRMusersAdd/GET_POSITIONS'] ||
                loading['HRMusersAdd/GET_CONTRACT_TYPES']
              }
              key="choose"
              color="success"
              size="large"
              loading={loading['HRMusersAdd/ADD_PROBATIONARY_CONTRACT']}
              onClick={finishForm}
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
            contractDate: moment(),
          }}
          onValuesChange={formUpdate}
        >
          <Pane className="row">
            <Pane className="col-lg-4">
              <FormItem
                label="Số hợp đồng"
                name="contractNumber"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                label="Ngày hợp đồng"
                name="contractDate"
                type={variables.DATE_PICKER}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                data={contractTypes}
                label="Loại hợp đồng"
                name="typeOfContractId"
                type={variables.SELECT}
                onChange={changeContract}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col-lg-4">
              <FormItem
                label="Số tháng thử việc"
                name="month"
                type={variables.INPUT_COUNT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                label="Thời hạn HĐ từ"
                name="contractFrom"
                type={variables.DATE_PICKER}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                label="Thời hạn HĐ đến"
                name="contractTo"
                type={variables.DATE_PICKER}
                rules={[variables.RULES.EMPTY]}
                disabled
              />
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col-lg-4">
              <FormItem
                label="Tỷ lệ thử việc"
                name="salaryRatio"
                type={variables.INPUT_COUNT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                data={divisions}
                label="Bộ phận"
                name="divisionId"
                type={variables.SELECT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                data={positions}
                label="Chức danh"
                name="positionId"
                type={variables.SELECT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col-lg-12">
              <FormItem
                label="Công việc cụ thể"
                name="work"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-12">
              <FormItem
                label="Thời gian làm việc"
                name="workTime"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col-lg-3">
              <FormItem
                data={branches}
                label="Nơi làm việc"
                name="branchId"
                type={variables.SELECT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
          </Pane>

          <Heading type="form-block-title">Chi tiết hợp đồng</Heading>
          <Tabs defaultActiveKey="paramaterValues">
            <TabPane tab="Tham số giá trị" key="paramaterValues">
              <Table
                bordered
                columns={parameterValuesColumns}
                dataSource={contractDetails?.parameterValues || []}
                pagination={false}
                params={{
                  header: parameterValuesColumns,
                  type: 'table',
                }}
                rowKey="id"
                scroll={{ x: '100%' }}
                footer={() => (
                  <Button color="success" ghost icon="plus">
                    Thêm dòng
                  </Button>
                )}
              />
            </TabPane>

            <TabPane tab="Tham số công thức" key="paramaterFormulas">
              <Table
                bordered
                columns={parameterFormulasColumns}
                dataSource={contractDetails?.parameterFormulas || []}
                pagination={false}
                params={{
                  header: parameterFormulasColumns,
                  type: 'table',
                }}
                rowKey="id"
                scroll={{ x: '100%' }}
                footer={() => (
                  <Button color="success" ghost icon="plus">
                    Thêm dòng
                  </Button>
                )}
              />
            </TabPane>
          </Tabs>
        </Form>
      </Modal>

      <Pane className="card">
        <Pane style={{ padding: 20 }} className="pb-0">
          <Heading type="form-title">Hợp đồng thử việc</Heading>
        </Pane>
        <Pane style={{ padding: 20 }} className="pb-0">
          <Table
            bordered
            columns={columns}
            dataSource={probationaryContracts}
            pagination={false}
            params={{
              header: columns,
              type: 'table',
            }}
            bordered={false}
            rowKey="id"
            scroll={{ x: '100%' }}
          />
        </Pane>

        <Pane style={{ padding: 20 }}>
          <Button color="success" ghost icon="plus" onClick={() => mountedSet(setVisible, true)}>
            Thêm
          </Button>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
