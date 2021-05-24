import { memo, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Tabs, Modal, Avatar, Image, Skeleton } from 'antd';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';
import _ from 'lodash';

import { Helper, variables } from '@/utils';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import styles from '../index.scss';
import variablesModules from '../variables';

const { TabPane } = Tabs;

const Index = memo(() => {
  const dispatch = useDispatch();
  const [ { notes, detailsNote }, loading] = useSelector(({ loading: { effects }, overView }) => [
    overView,
    effects,
  ]);

  const [visible, setVisible ] = useState(false);
  const [search, setSearch] = useState({
    classId: undefined,
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.SIZEMAX,
    status: variables.STATUS.CONFIRMING
  });

  const fetchDataNotes = () => {
    dispatch({
      type: 'overView/GET_DATA_NOTE',
      payload: {
        ...search
      },
    });
  };

  useEffect(() => {
    fetchDataNotes();
  }, [search.status]);

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
              <p className="mb0">{Helper.getDate(detailsNote?.creationTime, variables.DATE_FORMAT.TIME_DATE_VI)}</p>
              <h5 className="font-size-24 my5">{detailsNote?.name}</h5>
              <p className="font-size-16">{detailsNote?.description}</p>
              {
                !_.isEmpty(detailsNote.fileImage) && (
                  <Image.PreviewGroup>
                    {detailsNote.fileImage.map((item, index) => (
                      <Image
                        key={index}
                        width={110}
                        className="mb10"
                        src={`${API_UPLOAD}${Helper.getPathAvatarJson(item)}`}
                      />
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
                <Avatar
                  src={`${API_UPLOAD}${Helper.getPathAvatarJson(detailsNote?.employee?.fileImage)}`}
                  size={50}
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
              <p className="mb5">Giáo viên đã nhận</p>
              <p className="font-weight-bold">
                {`${detailsNote?.employee?.fullName} lúc ${Helper.getDate(detailsNote?.creationTime, variables.DATE_FORMAT.TIME_DATE_VI)}`}
              </p>
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
            <p className={classnames('mb0', 'font-size-14')}>15</p>
          </div>
          <Tabs onChange={changeTab} activeKey={search?.tab}>
            {variablesModules.NOTE.map(({ id, name }) => (
              <TabPane tab={name} key={id} />
            ))}
          </Tabs>
          <Scrollbars autoHeight autoHeightMax={window.innerHeight - 335}>
            {!loading['overView/GET_DATA_MEDICAL'] && _.isEmpty(notes) && (
              <p className="mb0 p20 border text-center font-weight-bold">{variables.NO_DATA}</p>
            )}
            {loading['overView/GET_DATA_NOTE'] ? (
              <>
                <Skeleton avatar paragraph={{ rows: 4 }} active />
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
          </Scrollbars>
        </div>
      </div>
    </>
  );
});

export default Index;
