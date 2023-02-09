import { memo } from 'react';
import { Checkbox, Spin } from 'antd';
import classnames from 'classnames';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import PropTypes from 'prop-types';

import stylesModule from '../styles.module.scss';


const Index = memo(({ dataComment, header, loadingComment }) => (
  <div>
    {loadingComment ? (
      <div className="w-100 d-flex justify-content-center p20">
        <Spin />
      </div>
    )
      :
      dataComment?.map(i => (
        i?.isComment && (
          <Pane className="col-lg-12">
            <div className={classnames(stylesModule['wrapper-checkbox'], 'border-top', 'p20')}>
              <Checkbox
                checked={i?.isChecked || false}
                className="mr15"
              />
              <p className={stylesModule.textParent} >{i?.name}</p>
            </div>
            {i?.isChecked && (
              <div className={stylesModule['wrapper-table-details']}>
                <Table
                  columns={header('COMMENT')}
                  dataSource={i?.content?.items}
                  pagination={false}
                  className="pl20 pr20 pb20"
                  rowKey={(record) => record.id}
                  scroll={{ x: '100%' }}
                  isEmpty
                />
              </div>)
            }
          </Pane>
        )
      ))}
  </div>
));

Index.propTypes = {
  dataComment: PropTypes.objectOf(PropTypes.any),
  header: PropTypes.objectOf(PropTypes.any),
  loadingComment: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  dataComment: [],
  header: () => {},
  loadingComment: false,
};

export default Index;