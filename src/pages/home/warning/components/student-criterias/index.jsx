import { memo, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Skeleton } from 'antd';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';

import Empty from '@/components/CommonComponent/Table/Empty';
import { Helper, variables } from '@/utils';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import styles from '../../../index.scss';

const Index = memo(({ classId, branchId }) => {
  const dispatch = useDispatch();
  const [{ studentCriterias }, loading] = useSelector(({ loading: { effects }, warning }) => [
    warning,
    effects,
  ]);

  const [search] = useState({});

  const fetchData = () => {
    dispatch({
      type: 'warning/GET_STUDENT_CRITERIAS',
      payload: {
        ...search,
        branchId,
        classId,
        currentTime: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: moment(),
          }),
          isUTC: false,
        }),
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, [search.status, classId]);

  return (
    <>
      <div className={classnames(styles['block-category'])}>
        <div className={styles['body-tab']}>
          <div className={styles['header-tab']}>
            <div>
              <img src="/images/home/tumblr.svg" alt="notification" className={styles.icon} />
              <span
                className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}
              >
                Sức khỏe
              </span>
            </div>
            <p className={classnames('mb0', 'font-size-14')}>{studentCriterias?.totalCount || 0}</p>
          </div>
          <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
            <div className="px20">
              {!loading['warning/GET_STUDENT_CRITERIAS'] && _.isEmpty(studentCriterias) && (
                <div className="p20">
                  <Empty />
                </div>
              )}
              {loading['warning/GET_STUDENT_CRITERIAS'] ? (
                <div className="mt20">
                  <Skeleton avatar paragraph={{ rows: 4 }} active />
                  <Skeleton avatar paragraph={{ rows: 4 }} active />
                </div>
              ) : (
                <div className="mt20">
                  {studentCriterias?.items?.map((item, index) => (
                    <div className={styles['content-tab']} key={index} aria-hidden="true">
                      <div
                        className={classnames(
                          'd-flex',
                          'align-items-center',
                          'justify-content-between',
                          styles['header-content-tab'],
                        )}
                      >
                        <AvatarTable
                          className="full-name-bold"
                          fileImage={Helper.getPathAvatarJson(item?.student?.fileImage)}
                          fullName={item?.student?.fullName}
                          size={36}
                        />
                        <p className={classnames('mb0', styles.date)}>
                          {Helper.getDate(
                            moment()
                              .startOf('days')
                              .add(item?.time?.hours, 'hours')
                              .add(item?.time?.minutes, 'minutes'),
                            variables.DATE_FORMAT.HOUR,
                          )}
                        </p>
                      </div>
                      <p className={classnames('mt10', 'mb0', 'font-size-14')}>
                        {item?.content || ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Scrollbars>
        </div>
      </div>
    </>
  );
});

Index.propTypes = {
  classId: PropTypes.string,
  branchId: PropTypes.string,
};

Index.defaultProps = {
  classId: '',
  branchId: '',
};

export default Index;
