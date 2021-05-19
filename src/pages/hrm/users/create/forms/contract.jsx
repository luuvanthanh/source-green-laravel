import { memo, useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Form, Modal, Tabs, InputNumber } from 'antd';
import { find, size, last, toNumber, isEmpty } from 'lodash';
import moment from 'moment';
import { useSelector, useDispatch } from 'dva';
import { useRouteMatch } from 'umi';
import csx from 'classnames';

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
    { contractTypes, branches, divisions, positions, contracts, paramaterValues },
    loading,
  ] = useSelector(({ HRMusersAdd, loading }) => [HRMusersAdd, loading?.effects]);

  const {
    params: { id: employeeId },
  } = useRouteMatch();

  const [visible, setVisible] = useState(false);
  const [contractDetails, setContractDetails] = useState({});
  const [details, setDetails] = useState({});
  const [parameterValuesDetails, setParameterValuesDetails] = useState([]);

  const cancelModal = () => {
    mountedSet(setVisible, false);
    mountedSet(setParameterValuesDetails, []);
    mountedSet(setDetails, {});
    formRefModal.current.resetFields();
  };

  const changeContract = (value) => {
    const currentType = find(contractTypes, { id: value });
    mountedSet(setContractDetails, currentType || {});
    mountedSet(
      setParameterValuesDetails,
      currentType.parameterValues.map((item, index) => ({ index, ...item })) || {},
    );
    formRefModal.current.setFieldsValue({
      month: currentType.month,
      year: currentType.year,
    });
  };

  const addParameterValues = () => {
    mountedSet(setParameterValuesDetails, [
      ...parameterValuesDetails,
      { index: last(parameterValuesDetails).index + 1, id: null, valueDefault: null },
    ]);
  };

  const onEdit = (record) => {
    mountedSet(setVisible, true);
    mountedSet(setDetails, record);
    mountedSet(
      setParameterValuesDetails,
      record.parameterValues.map((item, index) => ({
        ...item,
        index,
        valueDefault: item.pivot.value,
        id: item.pivot.parameterValueId,
      })),
    );
    setParameterValuesDetails;
    if (formRefModal.current) {
      formRefModal.current.setFieldsValue({
        ...record,
        contractFrom: record.contractFrom && moment(record.contractFrom),
        contractTo: record.contractTo && moment(record.contractTo),
        contractDate: record.contractDate && moment(record.contractDate),
      });
    }
  };

  const exportData = (id) => {
    Helper.exportExcel(`/v1/labours-contracts-export-word/${id}`, {}, 'HopDongLaoDong.docx');
  };

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
        title: 'Thông tin hợp đồng',
        key: 'contract_category',
        dataIndex: 'typeOfContract',
        className: 'min-width-120',
        render: (value) => value?.name,
      },
      {
        title: 'Số năm/tháng hợp đồng',
        key: 'contract_category',
        className: 'min-width-150',
        render: (record) => `${record.year} năm ${record.month} tháng`,
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
        title: 'Lương cơ bản',
        key: 'salary',
        className: 'min-width-150',
        render: (record) => {
          const parameterValues = record?.parameterValues?.find((item) => item.code === 'LUONG');
          return Helper.getPrice(parameterValues?.pivot?.value);
        },
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
                color="success"
                icon="export"
                className="ml-2"
                onClick={() => exportData(record.id)}
              />
            </li>
          </ul>
        ),
      },
    ],
    [],
  );

  const changeValue = useCallback((record) => (value) => {
    mountedSet(setParameterValuesDetails, (prev) =>
      prev.map((item) =>
        item.index === record.index
          ? {
              ...item,
              valueDefault: value,
            }
          : item,
      ),
    );
  });

  const changeValueSelect = useCallback((record) => (value) => {
    const itemParameter = paramaterValues.find((item) => item.id === value);
    mountedSet(setParameterValuesDetails, (prev) =>
      prev.map((item) =>
        item.index === record.index
          ? {
              ...item,
              ...itemParameter,
            }
          : item,
      ),
    );
  });

  const onRemove = (record) => {
    setParameterValuesDetails((prev) => prev.filter((item) => item.index !== record.index));
  };

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
      className: 'min-width-120',
      render: (record) => (
        <Select
          value={record.id}
          dataSet={paramaterValues}
          onChange={changeValueSelect(record)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Giá trị',
      key: 'values',
      dataIndex: 'valueDefault',
      className: 'min-width-120',
      render: (value, record) => (
        <InputNumber
          value={value}
          className={csx('input-number')}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          onChange={changeValue(record)}
          placeholder="Nhập"
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      className: 'min-width-100',
      fixed: 'right',
      align: 'center',
      render: (record) => (
        <ul className="list-unstyled list-inline">
          <li className="list-inline-item">
            <Button
              color="danger"
              icon="remove"
              className="ml-2"
              onClick={() => onRemove(record)}
            />
          </li>
        </ul>
      ),
    },
  ];

  const finishForm = () => {
    const formValues = formRefModal?.current?.getFieldsValue();

    const reqData = {
      ...formValues,
      id: details.id,
      employeeId,
      contractDate: moment(formValues.contractDate),
      contractFrom: formValues.contractFrom && moment(formValues.contractFrom),
      contractTo: formValues.contractTo && moment(formValues.contractTo),
      detail: (parameterValuesDetails || []).map(({ id, valueDefault }) => ({
        parameterValueId: id,
        value: valueDefault,
      })),
    };

    dispatch({
      type: !isEmpty(details) ? 'HRMusersAdd/UPDATE_CONTRACT' : 'HRMusersAdd/ADD_CONTRACT',
      payload: reqData,
      callback: (res, err) => {
        if (res) {
          formValues?.current?.resetFields();
          mountedSet(setContractDetails, {});
          mountedSet(setVisible, false);
          fetchContracts();
          mountedSet(setParameterValuesDetails, []);
          mountedSet(setDetails, {});
          formRefModal.current.resetFields();
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

  const fetchContracts = () => {
    dispatch({
      type: 'HRMusersAdd/GET_CONTRACTS',
      payload: {
        employeeId,
      },
    });
  };

  const formUpdate = (value, values) => {
    const { month, year, contractFrom } = values;

    if (moment.isMoment(contractFrom)) {
      formRefModal?.current?.setFieldsValue({
        contractTo: moment(contractFrom)
          .add(month || 0, 'months')
          .add(year || 0, 'years'),
      });
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    dispatch({ type: 'HRMusersAdd/GET_BRANCHES' });
    dispatch({ type: 'HRMusersAdd/GET_DIVISIONS' });
    dispatch({ type: 'HRMusersAdd/GET_POSITIONS' });
    dispatch({
      type: 'HRMusersAdd/GET_CONTRACT_TYPES',
      payload: {
        type: 'HOP_DONG',
      },
    });
    dispatch({ type: 'HRMusersAdd/GET_PARAMATER_VALUES' });
  }, []);

  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <>
      <Modal
        visible={visible}
        title="Hợp đồng lao động"
        centered
        className={styles['modal-fullscreen']}
        onCancel={cancelModal}
        footer={
          <Pane className="d-flex justify-content-end">
            <Button
              key="cancel"
              color="white"
              size="large"
              onClick={cancelModal}
              disabled={loading['HRMusersAdd/ADD_CONTRACT']}
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
              htmlType="submit"
              loading={
                loading['HRMusersAdd/ADD_CONTRACT'] || loading['HRMusersAdd/UPDATE_CONTRACT']
              }
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
            ...details,
            contractFrom: details.contractFrom && moment(details.contractFrom),
            contractTo: details.contractTo && moment(details.contractTo),
            contractDate: details.contractDate && moment(details.contractDate),
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
              />
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col-lg-4">
              <FormItem
                label="Số năm hợp đồng"
                name="year"
                type={variables.INPUT_COUNT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                label="Số tháng hợp đồng"
                name="month"
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
          </Pane>

          <Pane className="row">
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
          {!isEmpty(parameterValuesDetails) && (
            <>
              <Heading type="form-block-title">Chi tiết hợp đồng</Heading>
              <Tabs defaultActiveKey="paramaterValues">
                <TabPane tab="Tham số giá trị" key="paramaterValues">
                  <Table
                    bordered
                    columns={parameterValuesColumns}
                    dataSource={parameterValuesDetails || []}
                    pagination={false}
                    params={{
                      header: parameterValuesColumns,
                      type: 'table',
                    }}
                    rowKey="index"
                    scroll={{ x: '100%' }}
                    footer={() => (
                      <Button color="success" ghost icon="plus" onClick={addParameterValues}>
                        Thêm dòng
                      </Button>
                    )}
                  />
                </TabPane>
              </Tabs>
            </>
          )}
        </Form>
      </Modal>

      <Pane className="card">
        <Pane style={{ padding: 20 }} className="pb-0">
          <Heading type="form-title">Hợp đồng lao động</Heading>
        </Pane>
        <Pane style={{ padding: 20 }} className="pb-0">
          <Table
            bordered
            columns={columns}
            dataSource={contracts}
            pagination={false}
            loading={loading['HRMusersAdd/GET_CONTRACTS']}
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
