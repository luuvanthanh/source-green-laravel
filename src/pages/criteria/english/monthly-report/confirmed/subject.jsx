import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Pane from '@/components/CommonComponent/Pane';
import '@/assets/styles/Modules/TimeTables/styles.module.scss';
import ItemTable from './subject-item-table';
import stylesModule from '../styles.module.scss';

const Index = memo(({
  item,
  dataEvaluetionCriteria,
}) => (
  <>
    <Pane className="col-lg-12 pt20 border-top">
      <h3 className={stylesModule['item-text-header']}>{item?.scriptReviewSubject?.subject?.name}</h3>
    </Pane>
    <Pane className="col-lg-12 pb20">
      {
        item?.monthlyCommentDetailSubject?.map(itemDetail => (
          (
            <div className={stylesModule['wrapper-table-item']}>
              <h3 className={stylesModule['text-item-table']}>{itemDetail?.scriptReviewSubjectDetail?.subjectSection?.name}</h3>
              <ItemTable
                itemDetail={itemDetail}
                dataEvaluetionCriteria={dataEvaluetionCriteria}
              />
            </div>
          )
        ))
      }
    </Pane>
  </>
));

Index.propTypes = {
  item: PropTypes.PropTypes.any,
  dataEvaluetionCriteria: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  item: () => { },
  dataEvaluetionCriteria: [],
};

export default Index;