import { memo, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useSelector, useDispatch } from 'dva';

import { DeleteOutlined } from '@ant-design/icons';
import Button from '@/components/CommonComponent/Button';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';

const Index = memo(({ otherMoneyDetail, setOtherMoneyDetail, error, checkValidate }) => {
  const dispatch = useDispatch();
  const {
    classes,
    paymentForm,
    fees
  } = useSelector(({ classType, paymentMethod, fees }) => ({
    classes: classType.data,
    paymentForm: paymentMethod.data,
    fees: fees.data
  }));

  useEffect(() => {
    dispatch({
      type: 'classType/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    dispatch({
      type: 'paymentMethod/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    dispatch({
      type: 'fees/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
        type: 'KHAC'
      },
    });
  }, []);

  const onChange = (value, record, name) => {
    const index = _.findIndex(otherMoneyDetail, (item) => item.id === record?.id);
    const newOtherMoneyDetail = [...otherMoneyDetail];
    newOtherMoneyDetail[index] = {
      ...record,
      [name]: value
    };
    if (error) {
      checkValidate(newOtherMoneyDetail, 'other');
    }
    setOtherMoneyDetail(newOtherMoneyDetail);
  };

  const removeLine = (record) => {
    const newOtherMoneyDetail = [...otherMoneyDetail].filter(item => item.id !== record.id);
    setOtherMoneyDetail(newOtherMoneyDetail);
  };

  const columns = useMemo(() => [
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-200',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            type={variables.SELECT}
            placeholder="Chọn"
            onChange={(e) => onChange(e, record, 'classTypeId')}
            allowClear={false}
            data={classes}
            value={record?.classTypeId}
            rules={[variables.RULES.EMPTY]}
          />
          {error && !(record?.classTypeId) && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      )
    },
    {
      title: 'Hình thức',
      key: 'format',
      className: 'min-width-150',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            type={variables.SELECT}
            placeholder="Chọn"
            onChange={(e) => onChange(e, record, 'paymentFormId')}
            allowClear={false}
            data={paymentForm}
            value={record?.paymentFormId}
            rules={[variables.RULES.EMPTY]}
          />
          {error && !(record?.paymentFormId) && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      )
    },
    {
      title: 'Loại phí',
      key: 'feeId',
      className: 'min-width-200',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            type={variables.SELECT}
            placeholder="Chọn"
            onChange={(e) => onChange(e, record, 'feeId')}
            allowClear={false}
            data={fees}
            value={record?.feeId}
            rules={[variables.RULES.EMPTY]}
          />
          {error && !(record?.feeId) && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      )
    },
    {
      title: 'Tiền nộp',
      key: 'money',
      className: 'min-width-200',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            type={variables.INPUT_NUMBER}
            rules={[variables.RULES.EMPTY]}
            value={record?.money}
            onChange={(e) => onChange(e, record, 'money')}
          />
          {error && !(record?.money) && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      )
    },
    {
      title: '',
      key: 'delete',
      with: 40,
      render: (record) => (
        <DeleteOutlined
          className="btn-delete-table"
          onClick={() => {
            removeLine(record);
          }}
        />
      )
    }
  ]);

  const addLine = () => {
    setOtherMoneyDetail([
      ...otherMoneyDetail,
      {
        id: uuidv4(),
        classTypeId: "",
        paymentFormId: "",
        feeId: "",
        money: ""
      }
    ]);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={otherMoneyDetail}
        loading={false}
        error={{}}
        isError={false}
        pagination={false}
        rowKey="id"
        scroll={{ x: '100%' }}
      />
      <Pane className="m20">
        <Button
          className="btn-create"
          color="success"
          icon="plus"
          onClick={addLine}
        >
          Thêm dòng
        </Button>
      </Pane>
    </>
  );
});

Index.propTypes = {
  otherMoneyDetail: PropTypes.arrayOf(PropTypes.any),
  setOtherMoneyDetail: PropTypes.func,
  error: PropTypes.bool,
  checkValidate: PropTypes.func,
};

Index.defaultProps = {
  otherMoneyDetail: [],
  setOtherMoneyDetail: () => {},
  error: false,
  checkValidate: () => {},
};

export default Index;
