import { memo } from 'react';
import { Checkbox, Spin } from 'antd';
import classnames from 'classnames';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import PropTypes from 'prop-types';

import stylesModule from '../styles.module.scss';


const Index = memo(({ dataSubjec, header, loadingSubject }) =>
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
              <div className={classnames(stylesModule['wrapper-checkbox'])}>
                <Checkbox
                  checked={i?.isCheck}
                  className="mr15"
                />
                <p className={stylesModule.textChild} >{i?.name}</p>
              </div>
            </div>
            {i?.isCheck && (
              i?.subjectSection?.map(item => (
                <div className={stylesModule['wrapper-table-object']}>
                  <div className={stylesModule['table-object']}>
                    <div className={classnames(stylesModule['wrapper-checkbox'], 'p20')}>
                      <div className={classnames(stylesModule['wrapper-checkbox'])}>
                        <Checkbox
                          checked={item?.isCheck}
                          className="mr15"
                        />
                        <p className={stylesModule.textChild} >{item?.name}</p>
                      </div>
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
  header: PropTypes.objectOf(PropTypes.any),
  loadingSubject: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  dataSubjec: [],
  header: () => { },
  loadingSubject: false,
};

export default Index;