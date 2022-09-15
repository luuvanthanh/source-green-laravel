import { memo, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Tabs, Modal, Image, Skeleton } from 'antd';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';

import Empty from '@/components/CommonComponent/Table/Empty';
import { Helper, variables } from '@/utils';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import styles from '../index.scss';
import variablesModules from '../variables';

const { TabPane } = Tabs;

const Index = memo(({ classId, branchId }) => {
  const dispatch = useDispatch();
  const [{ notes, detailsNote }, loading] = useSelector(({ loading: { effects }, overView }) => [
    overView,
    effects,
  ]);

  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.SIZEMAX,
    status: variables.STATUS.CONFIRMING
  });

  const fetchDataNotes = () => {
    dispatch({
      type: 'overView/GET_DATA_NOTE',
      payload: {
        classId,
        branchId,
        ...search,
        From: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: moment(),
            targetValue: '00:00:00',
          }),
          isUTC: false,
        }),
        To: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: moment(),
            targetValue: '23:59:59',
          }),
          isUTC: false,
        }),
      },
    });
  };

  useEffect(() => {
    fetchDataNotes();
  }, [search.status, classId]);

  const cancelModal = () => {
    setVisible(false);
  };

  const getDetails = (id) => {
    setVisible(true);
    dispatch({
      type: 'overView/GET_DETAILS_NOTE',
      payload: { id }
    });
  };

  const changeTab = (tab) => {
    setSearch((prev) => ({
      ...prev,
      status: tab
    }));
  };

  return (
    <>
      <Modal
        className={styles['modal-note']}
        title="Ghi chú"
        visible={visible}
        width={576}
        onCancel={cancelModal}
        footer={null}
      >
        <div className={classnames('px15', styles['header-modal'])}>
          <div className="row">
            <div className="col-12 mt20">
              <p className="mb0">{Helper.getDate(detailsNote?.creationTime, variables.DATE_FORMAT.TIME_DATE_MONTH)}</p>
              <h5 className="font-size-24 my5 font-weight-bold">{detailsNote?.name}</h5>
              <p className="font-size-16">{detailsNote?.description}</p>
              {
                !_.isEmpty(detailsNote.fileImage) && (
                  <Image.PreviewGroup>
                    {JSON.parse(detailsNote.fileImage).map((item, index) => (
                      <div key={index} className="container-preview-image" style={{ backgroundImage: `url(${API_UPLOAD}${item})` }}>
                        <Image
                          key={index}
                          width={129}
                          height={100}
                          className="mb10"
                          src={`${API_UPLOAD}${item}`}
                        />
                      </div>
                    ))}
                  </Image.PreviewGroup>
                )
              }
            </div>
            <div className="col-md-6 py20 border-top">
              <AvatarTable
                fileImage={Helper.getPathAvatarJson(detailsNote?.student?.studentParents[0]?.parent?.fileImage)}
                fullName={detailsNote?.student?.studentParents[0]?.parent?.fullName}
                description="Phụ huynh"
                size={50}
              />
            </div>
            <div className="col-md-6 py20 border-top">
              <AvatarTable
                fileImage={Helper.getPathAvatarJson(detailsNote?.student?.fileImage)}
                fullName={detailsNote?.student?.fullName || ''}
                description={`${detailsNote?.student?.age || ''} tháng tuổi`}
                size={50}
              />
            </div>
            <div className="col-md-6 py20 border-top">
              <div className="d-flex">
                <span className={styles.circleIcon}>
                  <span className="icon-open-book" />
                </span>
                <div className="ml10">
                  <p className={classnames('mb0', styles.class)}>Lớp</p>
                  <p className="font-weight-bold font-size-14 mb0">{detailsNote?.student?.class?.name || ''}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 py20 border-top">
              <div className="d-flex">
                <AvatarTable
                  src={`${API_UPLOAD}${Helper.getPathAvatarJson(detailsNote?.employee?.fileImage)}`}
                  fileImage={Helper.getPathAvatarJson(detailsNote?.employee?.fileImage)}
                  size={50}
                  shape="circle"
                />
                <div className="ml10">
                  <p className={classnames('mb0', styles.class)}>Giáo viên</p>
                  <p className="font-weight-bold font-size-14 mb0">{detailsNote?.employee?.fullName || ''}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 py20 border-top">
              <p className="mb5">Trạng thái</p>
              <div className={styles['btn-status']}>
                {Helper.tagStatus(
                  `${detailsNote?.status === variables.STATUS.CONFIRMING ? variables.STATUS.VALID : ''}`,
                  `${detailsNote?.status === variables.STATUS.CONFIRMING ? 'Chưa nhận' : 'Đã nhận'}`
                )}
              </div>
            </div>
            <div className="col-md-6 py20 border-top">
              {
                detailsNote?.status === variables.STATUS.CONFIRMING ?
                  "" :
                  <>
                    <p className="mb5">Giáo viên đã nhận</p>
                    <p className="font-weight-bold">
                      {`${detailsNote?.employee?.fullName || ''} lúc ${Helper.getDate(detailsNote?.creationTime, variables.DATE_FORMAT.TIME_DATE_MONTH)}`}
                    </p>
                  </>
              }
            </div>
          </div>
        </div>
      </Modal>

      <div className={classnames(styles['block-category'])}>
        <div className={styles['body-tab']}>
          <div className={styles['header-tab']}>
            <div>
              <img src='/images/home/speech.svg' alt="notification" className={styles.icon} />
              <span className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}>Ghi chú</span>
            </div>
            <p className={classnames('mb0', 'font-size-14')}>{notes?.length || 0}</p>
          </div>
          <Tabs onChange={changeTab} activeKey={search?.tab}>
            {variablesModules.NOTE.map(({ id, name }) => (
              <TabPane tab={name} key={id} />
            ))}
          </Tabs>
          <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
            <div className="px20">
              {!loading['overView/GET_DATA_NOTE'] && _.isEmpty(notes) && (
                <div className="p20">
                  <Empty />
                </div>
              )}
              {loading['overView/GET_DATA_NOTE'] ? (
                <>
                  <Skeleton avatar paragraph={{ rows: 4 }} active />
                  <Skeleton avatar paragraph={{ rows: 4 }} active />
                </>
              ) : (
                notes.map((item, index) => (
                  <div
                    className={styles['content-tab']}
                    key={index}
                    onClick={() => getDetails(item.id)}
                    aria-hidden="true"
                  >
                    <div className={classnames('d-flex', 'align-items-center', 'justify-content-between', styles['header-content-tab'])}>
                      <AvatarTable
                        className="full-name-bold"
                        fileImage={Helper.getPathAvatarJson(item?.student?.fileImage)}
                        fullName={item?.student?.fullName}
                        size={36}
                      />
                      <p className={classnames('mb0', styles.date)}>{Helper.getDate(item?.creationTime, variables.DATE_FORMAT.TIME_DATE_MONTH)}</p>
                    </div>
                    <p className={classnames('mt10', 'mb0', 'font-size-14')}>{item?.name || ''}</p>
                  </div>
                ))
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
