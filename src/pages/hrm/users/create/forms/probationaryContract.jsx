import { memo, useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Form, Modal, Tabs, InputNumber } from 'antd';
import { find, size, last, isEmpty, head, get } from 'lodash';
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
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);
  const formRefModal = useRef();

  const dispatch = useDispatch();
  const [
    { contractTypes, branches, divisions, positions, probationaryContracts, paramaterValues },
    loading,
  ] = useSelector(({ HRMusersAdd, loading }) => [HRMusersAdd, loading?.effects]);

  const {
    params: { id: employeeId },
  } = useRouteMatch();

  const [visible, setVisible] = useState(false);
  const [parameterValuesDetails, setParameterValuesDetails] = useState([]);
  const [details, setDetails] = useState({});
  const { params } = useRouteMatch();

  const [dataFormContarct, setDataFormContarct] = useState([]);

  const cancelModal = () => {
    mountedSet(setVisible, false);
    mountedSet(setParameterValuesDetails, []);
    mountedSet(setDetails, {});
    formRefModal.current.resetFields();
  };

  const changeContract = (value) => {
    const currentType = find(contractTypes, { id: value });
    mountedSet(
      setParameterValuesDetails,
      currentType.parameterValues.map((item, index) => ({ index, ...item })) || {},
    );
    formRefModal.current.setFieldsValue({
      month: currentType.month,
      year: currentType.year,
    });
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
    if (formRefModal.current) {
      formRefModal.current.setFieldsValue({
        ...record,
        contractFrom: record.contractFrom && moment(record.contractFrom),
        contractTo: record.contractTo && moment(record.contractTo),
        contractDate: record.contractDate && moment(record.contractDate),
      });
    }
    setDataFormContarct([record]);
  };

  const addParameterValues = () => {
    mountedSet(setParameterValuesDetails, [
      ...parameterValuesDetails,
      { index: last(parameterValuesDetails).index + 1, id: null, valueDefault: null },
    ]);
  };

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
          formatter={(value) => `${value}`.replace(variables.REGEX_NUMBER, ',')}
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

  const exportData = (id) => {
    Helper.exportExcel(`/v1/probationary-contracts-export-word/${id}`, {}, 'HopDongThuViec.docx');
  };

  const columns = useMemo(
    () => [
      {
        title: 'Thời gian tạo',
        key: 'creationTime',
        dataIndex: 'creationTime',
        className: 'min-width-160',
        render: (value) => Helper.getDate(value, variables.DATE_FORMAT.DATE_TIME),
      },
      {
        title: 'Số hợp đồng',
        key: 'contract_number',
        className: 'min-width-120',
        render: (record) => <> {record?.contractNumber ? <>{record?.contractNumber}</> :
          <>{(record?.ordinalNumber ? (<>{record?.ordinalNumber}/{record?.numberForm}</>) : "")}</>}</>
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
        title: 'Lương cơ bản',
        key: 'salary',
        className: 'min-width-150',
        render: (record) => Helper.getPrice(record.basicSalary),
      },
      {
        title: 'Tổng phụ cấp',
        key: 'payment',
        className: 'min-width-150',
        render: (record) => Helper.getPrice(record.totalAllowance),
      },
      {
        title: 'Nơi làm việc',
        key: 'branch',
        dataIndex: 'branch',
        className: 'min-width-150',
        render: (value) => value?.name,
      },
      {
        title: 'Chức vụ',
        key: 'position',
        dataIndex: 'position',
        className: 'min-width-150',
        render: (value) => value?.name,
      },
      {
        title: 'Trạng thái',
        key: 'status',
        width: 150,
        className: 'min-width-150',
        render: (record) =>
          Helper.getStatusContracts(moment(record?.contractFrom), moment(record?.contractTo)),
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

  const fetchProbationaryContracts = () => {
    dispatch({
      type: 'HRMusersAdd/GET_PROBATIONARY_CONTRACTS',
      payload: {
        employeeId,
      },
    });
  };

  const finishForm = () => {
    const formValues = formRefModal?.current?.getFieldsValue();

    const reqData = {
      ...formValues,
      id: details.id,
      employeeId,
      ordinalNumber: formValues.ordinalNumber,
      numberForm: head(dataFormContarct)?.numberForm,
      numberFormContractId: head(dataFormContarct)?.id,
      type: 'PROBATIONARY',
      contractDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: formValues.contractDate,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      contractFrom: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: formValues.contractFrom,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      contractTo: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: formValues.contractTo,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      detail: (parameterValuesDetails || []).map(({ id, valueDefault }) => ({
        parameterValueId: id,
        value: valueDefault,
      })),
    };

    dispatch({
      type: !isEmpty(details)
        ? 'HRMusersAdd/UPDATE_PROBATIONARY_CONTRACT'
        : 'HRMusersAdd/ADD_PROBATIONARY_CONTRACT',
      payload: reqData,
      callback: (res, err) => {
        if (res) {
          formValues?.current?.resetFields();
          mountedSet(setVisible, false);
          fetchProbationaryContracts();
          mountedSet(setDetails, {});
          formRefModal?.current?.resetFields();
        }
        if (err) {
          const { data } = err;
          if (data?.status === 400 && !!size(data?.errors)) {
            data?.errors.forEach((item) => {
              formRefModal?.current?.setFields([
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
    return mounted.current;
  }, []);

  useEffect(() => {
    dispatch({ type: 'HRMusersAdd/GET_BRANCHES' });
    dispatch({ type: 'HRMusersAdd/GET_DIVISIONS' });
    dispatch({ type: 'HRMusersAdd/GET_POSITIONS' });
    dispatch({
      type: 'HRMusersAdd/GET_CONTRACT_TYPES',
      payload: {
        type: 'THU_VIEC',
      },
    });
    dispatch({ type: 'HRMusersAdd/GET_PARAMATER_VALUES' });
    dispatch({ type: 'HRMusersAdd/GET_PARAMATER_FORMULAS' });
    fetchProbationaryContracts();
  }, []);


  const converNumber = (input) => {
    const pad = input;
    if ((Number(input) + 1)?.toString().length < pad?.length) {
      return pad?.substring(0, pad?.length - (Number(input) + 1).toString()?.length) + (Number(input) + 1);
    }
    return input ? `${Number(input) + 1}` : "";
  };

  const changeFormContarct = (value) => {
    dispatch({
      type: 'probationaryContractsAdd/GET_FORM_CONTRACTS',
      payload: {
        type: 'PROBATIONARY',
        contractDate: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: value,
          }),
          format: variables.DATE_FORMAT.DATE_AFTER,
          isUTC: false,
        }),
      },
      callback: (response) => {
        setDataFormContarct(response?.parsePayload);
        formRefModal.current.setFieldsValue({
          ordinalNumber: converNumber(head(response?.parsePayload)?.ordinalNumber),
        });
      }
    });
  };

  const openModal = () => {
    mountedSet(setVisible, true);
    setDataFormContarct([]);
    formRefModal?.current?.setFieldsValue({
      contractDate: undefined,
      contractNumber: undefined,
      ordinalNumber: undefined,
      typeOfContractId: undefined,
      year: undefined,
      month: undefined,
      divisionId: undefined,
      contractFrom: undefined,
      contractTo: undefined,
      positionId: undefined,
      work: undefined,
      workTime: undefined,
      branchId: undefined,
      isSocialInsurance: undefined,

    });
  };


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
              loading={
                loading['HRMusersAdd/ADD_PROBATIONARY_CONTRACT'] ||
                loading['HRMusersAdd/UPDATE_PROBATIONARY_CONTRACT']
              }
              onClick={() => formRefModal.current.submit()}
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
          onFinish={finishForm}
          onValuesChange={formUpdate}
        >
          <Pane className="row">
            {
              details?.contractNumber && params?.id ?
                <>
                  <div className="col-lg-4">
                    <FormItem
                      label="Ngày hợp đồng"
                      name="contractDate"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormItem
                      label="Số hợp đồng"
                      name="contractNumber"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                </>
                :
                <>
                  <div className="col-lg-4">
                    <FormItem
                      label="Ngày hợp đồng"
                      name="contractDate"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                      onChange={changeFormContarct}
                    />
                  </div>
                  <div className="col-lg-2">
                    <FormItem
                      label="Số hợp đồng"
                      name="ordinalNumber"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                      disabled={isEmpty(dataFormContarct)}
                    />
                  </div>
                  <div className="col-lg-2">
                    <p className="mb0 font-size-13 mt35 font-weight-bold">
                      {!isEmpty(dataFormContarct) ? `/${head(dataFormContarct)?.numberForm}` : ''}
                    </p>
                  </div>
                </>
            }
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
                label="Chức vụ"
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
            <Pane className="col-lg-12">
              <FormItem
                label="Không tham gia BHXH"
                name="isSocialInsurance"
                type={variables.CHECKBOX_FORM}
                valuePropName="checked"
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
          <Heading type="form-title">Hợp đồng thử việc</Heading>
        </Pane>
        <Pane style={{ padding: 20 }} className="pb-0">
          <Table
            columns={columns}
            loading={loading['HRMusersAdd/GET_PROBATIONARY_CONTRACTS']}
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
          <Button color="success" ghost icon="plus" onClick={openModal}>
            Thêm
          </Button>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
