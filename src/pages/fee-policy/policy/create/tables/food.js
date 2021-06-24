import { memo, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { useParams } from 'umi';

import { DeleteOutlined } from '@ant-design/icons';
import Button from '@/components/CommonComponent/Button';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';

const Index = memo(({ moneyMeal, setMoneyMeal }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const {
    classes,
    paymentForm
  } = useSelector(({ classType, paymentMethod }) => ({
    classes: classType.data,
    paymentForm: paymentMethod.data
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
  }, []);

  const onChange = (value, record, name) => {
    const index = _.findIndex(moneyMeal, (item) => item.id === record?.id);
    const newMoneyMeal = [...moneyMeal];
    newMoneyMeal[index] = {
      ...record,
      [name]: value
    };
    setMoneyMeal(newMoneyMeal);
  };

  const removeLine = (record) => {
    const newMoneyMeal = [...moneyMeal].filter(item => item.id !== record.id);
    setMoneyMeal(newMoneyMeal);
  };

  const columns = useMemo(() => [
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-200',
      render: (record) => (
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
      )
    },
    {
      title: 'Hình thức',
      key: 'format',
      className: 'min-width-150',
      render: (record) => (
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
      )
    },
    {
      title: 'Tiền ăn',
      key: 'money',
      className: 'min-width-200',
      render: (record) => (
        <FormItem
          className="mb-0"
          type={variables.INPUT_NUMBER}
          rules={[variables.RULES.EMPTY]}
          value={record?.money}
          onChange={(e) => onChange(e, record, 'money')}
        />
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
    setMoneyMeal([
      ...moneyMeal,
      {
        id: uuidv4(),
        classTypeId: "",
        paymentFormId: "",
        money: 0
      }
    ]);
  };

  return (
    <>
      <Table
        columns={params?.id ? _.initial(columns) : columns}
        dataSource={moneyMeal}
        loading={false}
        error={{}}
        isError={false}
        pagination={false}
        rowKey="id"
        scroll={{ x: '100%' }}
      />
      {!(params?.id) && (
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
      )}
    </>
  );
});

Index.propTypes = {
  moneyMeal: PropTypes.arrayOf(PropTypes.any),
  setMoneyMeal: PropTypes.func,
};

Index.defaultProps = {
  moneyMeal: [],
  setMoneyMeal: () => {}
};

export default Index;
