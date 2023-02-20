import { memo } from 'react';
import { Checkbox, Spin } from 'antd';
import classnames from 'classnames';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import PropTypes from 'prop-types';
import Text from '@/components/CommonComponent/Text';

import stylesModule from '../styles.module.scss';


const Index = memo(({ dataSubject, onChangeUseItem, header, loadingSubject }) =>
(
  <div>
    {loadingSubject ? (
      <div className="w-100 d-flex justify-content-center p20">
        <Spin />
      </div>
    )
      :
      dataSubject?.map(i => (
        i?.isSubject && (
          <Pane className="col-lg-12">
            <div className={classnames(stylesModule['wrapper-checkbox'], 'border-top', 'p20')}>
              <Checkbox
                checked={i?.isChecked || false}
                onChange={(e) => onChangeUseItem(e, i?.id, 'SUBJECT')}
                className="mr15"
              />
              <p className={stylesModule.textParent} >{i?.name}</p>
            </div>
            {
              i?.isChecked && i?.content?.type === 'CRITERIA' && (
                <div className={stylesModule['wrapper-table-details']}>
                  <Table
                    columns={header('SUBJECT')}
                    dataSource={i?.content?.items}
                    pagination={false}
                    className="pl20 pr20 pb20"
                    rowKey={(record) => record.id}
                    scroll={{ x: '100%' }}
                    isEmpty
                  />
                </div>)
            }
            {
              i?.isChecked && i?.content?.type === 'INFORMATION' && (
                <Text color='dark' size='normal' className="mb15 ml20">Nhập thông tin</Text>
              )
            }
          </Pane>
        )
      ))}
  </div>
)
);

Index.propTypes = {
  dataSubject: PropTypes.objectOf(PropTypes.any),
  onChangeUseItem: PropTypes.arrayOf(PropTypes.any),
  header: PropTypes.objectOf(PropTypes.any),
  loadingSubject: PropTypes.objectOf(PropTypes.any)
};

Index.defaultProps = {
  dataSubject: [],
  onChangeUseItem: () => {},
  header: () => {},
  loadingSubject: false,
};

export default Index;