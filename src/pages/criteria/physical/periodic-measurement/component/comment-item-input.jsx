import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { useDispatch } from 'dva';
import FormDetail from '@/components/CommonComponent/FormDetail';
import '@/assets/styles/Modules/TimeTables/styles.module.scss';

const Index = memo(({
  itemParent,
}) => {
  const dispatch = useDispatch();

  const { TextArea } = Input;

  const onChangeInput = (value, record) => {
    if (record?.typeItem === 'add') {
      dispatch({
        type: 'physicalPeriodicMeasurementAdd/GET_SET_DATA_DETAIL',
        payload: { value: value?.target?.value, record, type: 'itemInputComment' }
      });
    }
    if (record?.typeItem === 'confirmed') {
      dispatch({
        type: 'physicalPeriodicMeasurementConfirmed/GET_SET_DATA_DETAIL',
        payload: { value: value?.target?.value, record, type: 'itemInputComment' }
      });
    }
  };

  return (
    <>
      <FormDetail label="Content" type="label" />
      <TextArea rows={4} placeholder="Nhập" onChange={(e) => onChangeInput(e, itemParent)} defaultValue={itemParent?.contentInput} />
    </>
  );
});

Index.propTypes = {
  itemParent: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  itemParent: () => { },
};

export default Index;