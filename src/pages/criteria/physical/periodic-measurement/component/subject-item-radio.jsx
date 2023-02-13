import React, { memo } from 'react';
import { Radio } from 'antd';
import { useDispatch } from 'dva';
import PropTypes from 'prop-types';
import '@/assets/styles/Modules/TimeTables/styles.module.scss';

const Index = memo(({
  itemDetailTable,
  record,
}) => {
  const dispatch = useDispatch();
  const onCheckBox = (e, record) => {
    if (itemDetailTable?.typeItem === 'add') {
      dispatch({
        type: 'physicalPeriodicMeasurementAdd/GET_SET_DATA_DETAIL',
        payload: { value: e.target.value, record, type: 'itemRadio' }
      });
    }
    if (itemDetailTable?.typeItem === 'confirmed') {
      dispatch({
        type: 'physicalPeriodicMeasurementConfirmed/GET_SET_DATA_DETAIL',
        payload: { value: e.target.value, record, type: 'itemRadio' }
      });
    }
  };
  return (
    <>
      <Radio.Group
        onChange={(e) => onCheckBox(e, itemDetailTable, 'avtActive')}
        value={record?.checkId}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Radio value={itemDetailTable?.checkId} />
      </Radio.Group>
    </>
  );
});

Index.propTypes = {
  itemDetailTable: PropTypes.PropTypes.any,
  record: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  itemDetailTable: {},
  record: {},
};

export default Index;