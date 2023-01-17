import React, { memo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Table from '@/components/CommonComponent/Table';

import ItemRadio from './subject-item-radio';

import '@/assets/styles/Modules/TimeTables/styles.module.scss';

const Index = memo(({
  itemDetail,
  dataEvaluetionCriteria,

}) => {
  const header = () => [
    {
      title: 'Content',
      key: 'student',
      className: 'min-width-200',
      render: (record) => record?.scriptReviewSubjectDetailChildren?.subjectSectionDetail?.name,
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
  console.log("itemDetail?.monthlyCommentDetailSubjectChildren", itemDetail?.monthlyCommentDetailSubjectChildren);
  return (
    <Table
      columns={header()}
      dataSource={itemDetail?.monthlyCommentDetailSubjectChildren}
      pagination={false}
      rowKey={(record) => record.id}
      scroll={{ x: '100%' }}
      isEmpty
    />
  );
});

Index.propTypes = {
  itemDetail: PropTypes.PropTypes.any,
  dataEvaluetionCriteria: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  itemDetail: () => { },
  dataEvaluetionCriteria: [],
};

export default Index;