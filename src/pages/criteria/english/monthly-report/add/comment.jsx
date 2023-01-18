import React, { memo } from 'react';
import { Input } from 'antd';
import { useDispatch } from 'dva';
import PropTypes from 'prop-types';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Pane from '@/components/CommonComponent/Pane';

import Heading from '@/components/CommonComponent/Heading';
import TableItem from './comment-item-table';
import '@/assets/styles/Modules/TimeTables/styles.module.scss';
import stylesModule from '../styles.module.scss';


const Index = memo(({
  itemParent
}) => {
  const { TextArea } = Input;
  const dispatch = useDispatch();

  const onChangeInput = (value, record) => {
    dispatch({
      type: 'EnglishMonthlyReportAdd/GET_SET_DATA_DETAIL',
      payload: { value, record, type: 'itemCheckInput' }
    });
  };

  return (
    <Pane className="card mb20">
      <Pane className="p20">
        <Heading type="form-title">
          {itemParent?.sampleComment?.name}
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
          <FormDetail label="Content" type="label" />
          <TextArea rows={4} placeholder="Nhập" onChange={(e) => onChangeInput(e, itemParent)} />
        </Pane>
      </Pane>
    </Pane>
  );
});

Index.propTypes = {
  itemParent: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  itemParent: () => { },
};

export default Index;