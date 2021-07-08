import { memo, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Skeleton, Timeline } from 'antd';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';

import Empty from '@/components/CommonComponent/Table/Empty';
import { Helper, variables } from '@/utils';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import styles from '../../../index.scss';

const { Item: TimelineItem } = Timeline;
const Index = memo(({ classId }) => {
  const dispatch = useDispatch();
  const [{ notes }, loading] = useSelector(({ loading: { effects }, activity }) => [
    activity,
    effects,
  ]);

  const [search] = useState({});

  const fetchData = () => {
    dispatch({
      type: 'activity/GET_DATA_NOTE',
      payload: {
        ...search,
        activityDate: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: moment(),
            targetValue: '23:59:59',
          }),
          isUTC: true,
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
              <img src="/images/home/pages.svg" alt="notification" className={styles.icon} />
              <span
                className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}
              >
                GHI CHÚ
              </span>
            </div>
            <p className={classnames('mb0', 'font-size-14')}>{notes?.totalActivity || 0}</p>
          </div>
          <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
            <div className="px20">
              {!loading['activity/GET_DATA_NOTE'] && _.isEmpty(notes) && (
                <div className="p20">
                  <Empty />
                </div>
              )}
              {loading['activity/GET_DATA_NOTE'] ? (
                <div className="mt20">
                  <Skeleton avatar paragraph={{ rows: 4 }} active />
                  <Skeleton avatar paragraph={{ rows: 4 }} active />
                </div>
              ) : (
                <Timeline className={classnames(styles['timeline-container'], 'mt20')}>
                  {notes?.changeLogs?.map((item, index) => (
                    <TimelineItem key={index}>
                      <p className={styles.norm}>{item.changeTime}</p>
                      {item?.changesGroupByTime?.map((itemChange, indexChange) => (
                        <div key={indexChange} className="mt5 mb5">
                          <AvatarTable
                            className="full-name-bold"
                            fileImage={Helper.getPathAvatarJson(
                              itemChange?.editor?.objectInfo?.fileImage,
                            )}
                            fullName={
                              itemChange?.editor?.objectInfo?.fullName ||
                              itemChange?.editor?.userName
                            }
                            description={itemChange?.editor?.role}
                            size={36}
                          />
                          <AvatarTable
                            className="full-name-bold"
                            fileImage={Helper.getPathAvatarJson(itemChange?.student?.fileImage)}
                            fullName={itemChange?.student?.fullName}
                            description={`${itemChange?.student?.age} Tháng tuổi - ${itemChange?.student?.class?.name}`}
                            size={36}
                          />
                          <p className={styles.norm}>
                            Đã nhận ghi chú {itemChange?.noteChanged?.name}
                          </p>
                        </div>
                      ))}
                    </TimelineItem>
                  ))}
                </Timeline>
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
};

Index.defaultProps = {
  classId: '',
};

export default Index;
