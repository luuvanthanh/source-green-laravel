import { memo } from 'react';
import { Checkbox, Spin } from 'antd';
import classnames from 'classnames';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import PropTypes from 'prop-types';

import stylesModule from '../styles.module.scss';


const Index = memo(({ dataSubjec, onChangeUseItem, header, onChangeUseItemTable, loadingSubject }) =>
(
  <>
    {loadingSubject ? (
      <div className="w-100 d-flex justify-content-center p20">
        <Spin />
      </div>
    )
      :
      dataSubjec?.map(i => (
        i?.isSubject && (
          <Pane className="col-lg-12">
            <div className={classnames(stylesModule['wrapper-checkbox'], 'border-top', 'p20')}>
              <Checkbox
                checked={i?.isCheck || false}
                onChange={(e) => onChangeUseItem(e, i?.id, 'OBJECT')}
                className="mr15"
              />
              <p className={stylesModule.textParent} >{i?.name}</p>
            </div>
            {i?.isCheck && (
              i?.subjectSection?.map(item => (
                <div className={stylesModule['wrapper-table-object']}>
                  <div className={stylesModule['table-object']}>
                    <div className={classnames(stylesModule['wrapper-checkbox'], 'p20')}>
                      <Checkbox
                        checked={item?.isCheck || false}
                        className="mr15"
                        onChange={(e) => onChangeUseItemTable(e, item?.id)}
                      />
                      <p className={stylesModule.textParent} >{item?.name}</p>
                    </div>
                    {
                      item?.isCheck && (
                        <Table
                          columns={header('OBJECT')}
                          dataSource={item?.subjectSectionDetail}
                          pagination={false}
                          border
                          className="pl20 pr20 pb20"
                          rowKey={(record) => record.id}
                          scroll={{ x: '100%' }}
                          isEmpty
                        />
                      )
                    }
                  </div>
                </div>
              ))
            )}
          </Pane>
        )
      ))
    }
  </>
)
);

Index.propTypes = {
  dataSubjec: PropTypes.objectOf(PropTypes.any),
  onChangeUseItem: PropTypes.arrayOf(PropTypes.any),
  header: PropTypes.objectOf(PropTypes.any),
  loadingSubject: PropTypes.objectOf(PropTypes.any),
  onChangeUseItemTable: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  dataSubjec: [],
  onChangeUseItem: () => { },
  header: () => { },
  onChangeUseItemTable: () => { },
  loadingSubject: false,
};

export default Index;