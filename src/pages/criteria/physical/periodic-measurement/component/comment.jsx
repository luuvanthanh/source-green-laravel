import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Pane from '@/components/CommonComponent/Pane';

import Heading from '@/components/CommonComponent/Heading';
import ComentItemInput from './comment-item-input';
import TableItem from './comment-item-table';
import '@/assets/styles/Modules/TimeTables/styles.module.scss';
import stylesModule from '../styles.module.scss';


const Index = memo(({
  itemParent
}) => (
  <Pane className="card mb20">
    <Pane className="p20">
      <Heading type="form-title">
        {itemParent?.name}
      </Heading>
    </Pane>
    <Pane className="row pl20 pb20 pr20">
      <Pane className="col-lg-12">
        <div className={stylesModule['wrapper-table-item']}>
          <TableItem
            itemParent={itemParent}
          />
        </div>
      </Pane>
      <Pane className="col-lg-12">
        <ComentItemInput itemParent={itemParent} />
      </Pane>
    </Pane>
  </Pane>
));

Index.propTypes = {
  itemParent: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  itemParent: () => { },
};

export default Index;