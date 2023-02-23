import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Table from '@/components/CommonComponent/Table';
import Pane from '@/components/CommonComponent/Pane';
import ItemRadio from './subject-item-radio';
import SubjectItemInput from './subject-item-input';

import '@/assets/styles/Modules/TimeTables/styles.module.scss';
import stylesModule from '../styles.module.scss';

const Index = memo(({
  item,
}) => {
  const header = () => [
    ...(item?.content?.items?.length > 0 ?
      (item?.content?.items?.map(itemDetailTable => (
        {
          title: `${itemDetailTable?.name}`,
          key: 'img',
          align: 'center',
          width: 200,
          className: classnames('min-width-200', 'max-width-200'),
          render: (record) => (
            <ItemRadio itemDetailTable={itemDetailTable} record={record} />
          ),
        }
      )))
      : []),
  ];

  return (
    <>
      <Pane className="col-lg-12 pt20 border-top">
        <h3 className={stylesModule['item-text-header']}>{item?.name}</h3>
      </Pane>
      <Pane className="col-lg-12 pb20">
        {item?.content?.type === "INFORMATION" ?
          <SubjectItemInput itemParent={item} />
          :
          <div className={stylesModule['wrapper-table']}>
            <Table
              columns={header()}
              dataSource={item?.content?.items ? [{ checkId: item?.content?.checkId }] : undefined}
              pagination={false}
              rowKey={(record) => record?.checkId}
              scroll={{ x: '100%' }}
              isEmpty
            />
          </div>
        }
      </Pane>
    </>
  );
});

Index.propTypes = {
  item: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  item: () => { },
};

export default Index;