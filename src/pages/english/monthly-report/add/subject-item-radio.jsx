import React, { memo } from 'react';
import { Radio } from 'antd';
import { useDispatch } from 'dva';
import PropTypes from 'prop-types';
import '@/assets/styles/Modules/TimeTables/styles.module.scss';

const Index = memo(({
  record,
  itemDetailTable,

}) => {

  const dispatch = useDispatch();
  const onCheckBox = (e, record) => {
    dispatch({
      type: 'EnglishMonthlyReportAdd/GET_SET_DATA_DETAIL',
      payload: { value: e, record, type: 'itemRadio' }
    });
  };

  return (
    <>
      <Radio.Group
        onChange={(e) => onCheckBox(e, record, 'avtActive')}
        value={record?.radioId}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Radio value={itemDetailTable?.id} />
      </Radio.Group>
    </>
  );
});

Index.propTypes = {
  record: PropTypes.PropTypes.any,
  itemDetailTable: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  itemDetailTable: {},
  record: {},
};

export default Index;