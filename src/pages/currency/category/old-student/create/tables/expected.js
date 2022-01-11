import { memo, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'dva';

import Table from '@/components/CommonComponent/Table';
import { variables } from '@/utils';

const Index = memo(({ moneyMeal }) => {
  const dispatch = useDispatch();
  const {_} = useSelector(({ classType, paymentMethod }) => ({
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

  const columns = useMemo(() => [
    {
      title: 'Tháng',
      key: 'class',
      className: 'min-width-200',
      render: (record) => record?.month || '',
    },
    {
      title: 'Học phí (đ)',
      key: 'format',
      className: 'min-width-150',
      render: (record) => record?.Tuition || '',
    },
    {
      title: 'Tiền ăn',
      key: 'money',
      className: 'min-width-200',
      render: (record) => record?.money || '',
    },
    {
      title: 'Tiếng Anh (đ)',
      key: 'class',
      className: 'min-width-200',
      render: (record) => record?.english || '',
    },
    {
      title: 'Bus (đ)',
      key: 'class',
      className: 'min-width-200',
      render: (record) => record?.bus || '',
    },
    {
      title: 'Ngoài giờ (đ)',
      key: 'class',
      className: 'min-width-200',
      render: (record) => record?.outTime || '',
    },
    {
      title: 'Giảm trừ (đ)',
      key: 'class',
      className: 'min-width-200',
      render: (record) => record?.Unless || '',
    },
    {
      title: 'Tổng tiền (đ)',
      key: 'class',
      className: 'min-width-200',
      render: (record) => record?.Total || '',
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
};

Index.defaultProps = {
  moneyMeal: [],
};

export default Index;
