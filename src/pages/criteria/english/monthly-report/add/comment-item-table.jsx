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
    dispatch({
      type: 'EnglishMonthlyReportAdd/GET_SET_DATA_DETAIL',
      payload: { value, record, type: 'itemCheckBox' }
    });
  };

  const headerComment = () => [
    {
      title: 'Use',
      key: 'Use',
      className: 'min-width-200',
      render: (record) => (
        <div className={classnames(stylesModule['wrapper-checkbox'])}>
          <Checkbox
            className="mr15"
            onChange={(e) => onChangeUseTable(e, record)}
          />
          <p className={stylesModule.textChild} >{record?.sampleCommentDetail?.name}</p>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={headerComment()}
      dataSource={itemParent?.scriptReviewCommentDetail?.filter(k => k?.isCheck)}
      pagination={false}
      rowKey={(record) => record.id}
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