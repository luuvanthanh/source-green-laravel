import React, { memo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Table from '@/components/CommonComponent/Table';

import ItemRadio from './subject-item-radio';

import '@/assets/styles/Modules/TimeTables/styles.module.scss';

const Index = memo(({
  itemDetail,
  checkFinish,
  dataEvaluetionCriteria,

}) => {
  const header = () => [
    {
      title: 'Content',
      key: 'student',
      className: 'min-width-200',
      render: (record) => <div className={!record?.radioId && checkFinish ? "text-danger" : "text-dark"}>{record?.subjectSectionDetail?.name}</div>,
    },
    ...(dataEvaluetionCriteria?.length > 0 ?
      (dataEvaluetionCriteria?.map(itemDetailTable => (
        {
          title: `${itemDetailTable?.name}`,
          key: 'img',
          align: 'center',
          width: 200,
          className: classnames('min-width-200', 'max-width-200'),
          render: (record) => (
            <ItemRadio record={record} itemDetailTable={itemDetailTable} />
          ),
        }
      )))
      : []),
  ];

  return (
    <Table
      columns={header()}
      dataSource={itemDetail?.scriptReviewSubjectDetailChildren?.filter(k => k?.isCheck)}
      pagination={false}
      rowKey={(record) => record.id}
      scroll={{ x: '100%' }}
      isEmpty
    />
  );
});

Index.propTypes = {
  itemDetail: PropTypes.PropTypes.any,
  checkFinish: PropTypes.PropTypes.any,
  dataEvaluetionCriteria: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  itemDetail: () => { },
  checkFinish: {},
  dataEvaluetionCriteria: [],
};

export default Index;