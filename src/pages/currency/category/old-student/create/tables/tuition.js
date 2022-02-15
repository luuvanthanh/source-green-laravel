import { memo, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useSelector, useDispatch } from 'dva';

import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';

const Index = memo(({ feeDetail, setFeeDetail, error, checkValidate }) => {
  const dispatch = useDispatch();
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

  const onChange = (event, record, name) => {
    let value = event;
    if (name === 'content') {
      value = event.target.value;
    }
    const index = _.findIndex(feeDetail, (item) => item.id === record?.id);
    const newFeeDetail = [...feeDetail];
    newFeeDetail[index] = {
      ...record,
      [name]: value
    };
    if (error) {
      checkValidate(newFeeDetail, 'tuition');
    }
    setFeeDetail(newFeeDetail);
  };


  const columns = useMemo(() => [
    {
      title: 'Loại phí',
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
  ]);

  return (
    <>
      <Table
        columns={columns}
        dataSource={feeDetail}
        loading={false}
        error={{}}
        isError={false}
        pagination={false}
        rowKey="id"
        scroll={{ x: '100%' }}
      />
      {_.isEmpty(feeDetail) && error && (
        <p className="text-danger px20">{variables.RULES.EMPTY_INPUT.message}</p>
      )}
    </>
  );
});

Index.propTypes = {
  feeDetail: PropTypes.arrayOf(PropTypes.any),
  setFeeDetail: PropTypes.func,
  error: PropTypes.bool,
  checkValidate: PropTypes.func,
};

Index.defaultProps = {
  feeDetail: [],
  setFeeDetail: () => {},
  error: false,
  checkValidate: () => {},
};

export default Index;
