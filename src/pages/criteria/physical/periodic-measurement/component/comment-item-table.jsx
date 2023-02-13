import React, { memo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { useDispatch } from 'dva';
import Table from '@/components/CommonComponent/Table';

import stylesModule from '../styles.module.scss';

import '@/assets/styles/Modules/TimeTables/styles.module.scss';

const Index = memo(({
  itemParent,
}) => {
  const dispatch = useDispatch();
  const onChangeUseTable = (value, record) => {
    if (record?.typeItem === 'add') {
      dispatch({
        type: 'physicalPeriodicMeasurementAdd/GET_SET_DATA_DETAIL',
        payload: { value: value.target.checked, record, type: 'itemCheckBox' }
      });
    }
    if (record?.typeItem === 'confirmed') {
      dispatch({
        type: 'physicalPeriodicMeasurementConfirmed/GET_SET_DATA_DETAIL',
        payload: { value: value.target.checked, record, type: 'itemCheckBox' }
      });
    }
  };

  const headerComment = () => [
    {
      title: 'Sử dụng',
      key: 'Use',
      className: 'min-width-200',
      render: (record) => (
        <div className={classnames(stylesModule['wrapper-checkbox'])}>
          <Checkbox
            className="mr15"
            onChange={(e) => onChangeUseTable(e, record)}
            checked={record?.isChecked}
          />
          <p className={stylesModule.textChild} >{record?.name}</p>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={headerComment()}
      dataSource={itemParent?.content?.items}
      pagination={false}
      rowKey={(record) => record?.checkId}
      scroll={{ x: '100%' }}
      isEmpty
    />
  );
});

Index.propTypes = {
  itemParent: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  itemParent: () => { },
};

export default Index;