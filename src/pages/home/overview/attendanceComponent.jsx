import { memo, useState, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Modal, List, Tabs } from 'antd';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'dva';
import moment from 'moment';
import PropTypes from 'prop-types';

import Table from '@/components/CommonComponent/Table';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { variables, Helper } from '@/utils';
import { head, isEmpty } from 'lodash';
import styles from '../index.scss';

const { TabPane } = Tabs;

const Index = memo(({ classId, branchId }) => {
  const dispatch = useDispatch();
  const [
    { classAttendanceSummary, listAttendancesByStatus, classDetails },
    loading,
  ] = useSelector(({ loading: { effects }, overView }) => [overView, effects]);

  const [visible, setVisible] = useState(false);
  const [report, setReport] = useState({});
  const [search, setSearch] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.PAGE_SIZE,
    nameStudent: '',
    date: moment(),
    status: null,
  });

  const fetchDataNotes = () => {
    dispatch({
      type: 'overView/GET_CLASS_ATTENDANCE_SUMMARY',
      payload: {
        classId,
        branchId,
        date: search.date,
      },
    });
  };

  const getListAttendanceByStatus = (record) => {
    dispatch({
      type: 'overView/GET_DATA_ATTENDANCE_BY_STATUS',
      payload: {
        ...record,
      },
    });
  };

  const getClassDetails = (record) => {
    dispatch({
      type: 'overView/GET_CLASS_DETAILS',
      payload: {
        ...record,
      },
    });
  };

  const onChangeStatus = (e) => {
    getListAttendanceByStatus({
      ...search,
      ...report,
      classId: report.id,
      status: e,
      isAttendance: true,
    });
  };

  const onShowInfo = (record) => {
    setReport({ ...record, ...record?.report });
    setVisible(true);
    getListAttendanceByStatus({
      ...search,
      ...record,
      classId: record.id,
      status: 'HAVE_IN',
      isAttendance: true,
    });
    getClassDetails(record);
  };

  useEffect(() => {
    fetchDataNotes();
  }, [classId]);

  const headerAttendances = () => [
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-80 max-width-80',
      width: 80,
      render: (record) => record.name,
    },
    {
      title: 'Vào lớp',
      key: 'absent',
      className: 'min-width-60',
      width: 60,
      align: 'center',
      render: (record) => (
        <div>
          <strong style={{ color: '#27A600' }}>{record?.report?.haveIn}</strong>
          <span>/{record?.report?.totalStudent}</span>
        </div>
      ),
    },
    {
      title: 'Về',
      key: 'absent',
      className: 'min-width-40',
      width: 40,
      align: 'center',
      render: (record) => (
        <div>
          <strong style={{ color: '#6D7177' }}>{record?.report?.haveOut}</strong>
          <span>/{record?.report?.totalStudent}</span>
        </div>
      ),
    },
    {
      title: 'KP',
      key: 'absent',
      className: 'min-width-40',
      width: 40,
      align: 'center',
      render: (record) => (
        <div>
          <strong style={{ color: '#FF8300' }}>{record?.report?.unpaidLeave}</strong>
          <span>/{record?.report?.totalStudent}</span>
        </div>
      ),
    },
    {
      title: 'CP',
      key: 'absent',
      className: 'min-width-40',
      width: 40,
      align: 'center',
      render: (record) => (
        <div>
          <strong style={{ color: '#3B5CAD' }}>{record?.report?.annualLeave}</strong>
          <span>/{record?.report?.totalStudent}</span>
        </div>
      ),
    },
  ];
  const cancelModal = () => {
    setVisible(false);
    setSearch({
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
      classId: '',
      nameStudent: '',
      date: moment(),
      status: null,
    });
  };

  useEffect(() => {
    if (visible) {
      getListAttendanceByStatus();
    }
  }, [search]);

  return (
    <>
      <Modal
        className={styles['modal-student-detail']}
        visible={visible}
        title="Chi tiết điểm danh"
        width="500px"
        onCancel={cancelModal}
        footer={null}
      >
        <div className={styles['modal-container']}>
          <div className={styles['info-contaner']}>
            <div className="d-flex align-items-center">
              <span className={styles.icon}>
                <span className="icon-open-book" />
              </span>
              <div className="ml10">
                <p className={styles.label}>Lớp</p>
                <p className={styles.title}>{report?.name}</p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              {classDetails.classTeachers && !isEmpty(classDetails.classTeachers) && (
                <AvatarTable
                  fileImage={Helper.getPathAvatarJson(
                    head(classDetails.classTeachers)?.employee?.fileImage,
                  )}
                  fullName="Giáo viên chủ nhiệm"
                  description={head(classDetails.classTeachers)?.employee?.fullName}
                />
              )}
            </div>
          </div>
          <Tabs defaultActiveKey="1" className={styles.tabs} onChange={onChangeStatus}>
            <TabPane tab={`Vào lớp (${report?.haveIn})`} key="HAVE_IN" />
            <TabPane tab={`Về (${report?.haveOut})`} key="HAVE_OUT" />
            <TabPane tab={`Không phép (${report?.unpaidLeave})`} key="UNPAID_LEAVE" />
            <TabPane tab={`Có phép (${report?.annualLeave})`} key="ANNUAL_LEAVE" />
          </Tabs>
          <Scrollbars autoHeight autoHeightMax={340}>
            {!isEmpty(listAttendancesByStatus?.data) && (
              <List
                className={styles['list-container']}
                dataSource={listAttendancesByStatus?.data || []}
                renderItem={(record) => (
                  <List.Item key={record.id}>
                    <AvatarTable
                      fileImage={Helper.getPathAvatarJson(record.fileImage)}
                      fullName={record.fullName}
                    />
                  </List.Item>
                )}
              />
            )}
          </Scrollbars>
        </div>
      </Modal>
      <div className={classnames(styles['block-category'])}>
        <div className={styles['body-tab']}>
          <div className={styles['header-tab']}>
            <div>
              <img src="/images/home/note.svg" alt="notification" className={styles.icon} />
              <span
                className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}
              >
                Điểm danh vào lớp
              </span>
            </div>
          </div>
          <div className="mt20">
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
              <Table
                bordered
                columns={headerAttendances()}
                dataSource={classAttendanceSummary}
                pagination={false}
                loading={loading['overView/GET_CLASS_ATTENDANCE_SUMMARY']}
                className="table-attendances"
                params={{
                  header: headerAttendances('ATTENDANCES'),
                  type: 'table',
                }}
                isEmpty
                rowKey={(record) => record.id}
                scroll={{ x: '100%' }}
                onRow={(record) => ({
                  onClick: () => onShowInfo(record),
                })}
              />
            </Scrollbars>
          </div>
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
