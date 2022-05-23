import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import { variables } from '@/utils';
import { useDispatch, useSelector } from 'dva';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { memo, useEffect, useMemo } from 'react';

const Index = memo(({ moneyMeal, setMoneyMeal, error, checkValidate }) => {
  const dispatch = useDispatch();
  const { classes, paymentForm } = useSelector(({ classType, paymentMethod }) => ({
    classes: classType.data,
    paymentForm: paymentMethod.data,
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
      [name]: value,
    };
    if (error) {
      checkValidate(newMoneyMeal, 'food');
    }
    setMoneyMeal(newMoneyMeal);
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
          {error && !record?.classTypeId && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      ),
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
          {error && !record?.paymentFormId && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      ),
    },
    {
      title: 'Tiền ăn',
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
          {error && !record?.money && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      ),
    },
  ]);

  return (
    <>
      <Table
        columns={columns}
        dataSource={moneyMeal}
        loading={false}
        error={{}}
        isError={false}
        pagination={false}
        rowKey="id"
        scroll={{ x: '100%' }}
      />
    </>
  );
});

Index.propTypes = {
  moneyMeal: PropTypes.arrayOf(PropTypes.any),
  setMoneyMeal: PropTypes.func,
  error: PropTypes.bool,
  checkValidate: PropTypes.func,
};

Index.defaultProps = {
  moneyMeal: [],
  setMoneyMeal: () => {},
  error: false,
  checkValidate: () => {},
};

export default Index;
