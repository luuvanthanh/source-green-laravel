import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Table from '@/components/CommonComponent/Table';

import stylesModule from '../styles.module.scss';

import '@/assets/styles/Modules/TimeTables/styles.module.scss';

const Index = memo(({
  rates,
}) => {
  const headerComment = () => [
    {
      title: 'Môn học',
      key: 'name',
      className: 'min-width-200',
      render: (record) => (record?.physicalStudyProgram?.name),
    },
    {
      title: 'Tỉ lệ tham gia',
      key: 'name',
      className: 'min-width-200',
      render: (record) => (<p style={{ color: !record?.isLevelOut ? "#B11010" : "#36383A" }}>{record?.rate} %</p>),
    },
  ];
  return (
    <div className={stylesModule['wrapper-table']}>
      <Table
        columns={headerComment()}
        dataSource={rates}
        pagination={false}
        rowKey={(record) => record?.id}
        scroll={{ x: '100%' }}
        isEmpty
      />
    </div>
  );
});

Index.propTypes = {
  rates: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  rates: [],
};

export default Index;