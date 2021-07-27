import { memo, useState, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Modal, Form, Skeleton } from 'antd';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';

import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { variables, Helper } from '@/utils';

import styles from '../index.scss';

const Index = memo(({ classId, branchId }) => {
  const dispatch = useDispatch();
  const [
    { attendances, listAttendancesByStatus },
    loading,
  ] = useSelector(({ loading: { effects }, overView }) => [overView, effects]);

  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState({});
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.PAGE_SIZE,
    nameStudent: '',
    date: moment(),
    status: null,
  });

  const fetchDataNotes = () => {
    dispatch({
      type: 'overView/GET_DATA_ATTENDANCE',
      payload: {
        classId,
        branchId,
        date: search.date,
      },
    });
  };

  const getListAttendanceByStatus = () => {
    dispatch({
      type: 'overView/GET_DATA_ATTENDANCE_BY_STATUS',
      payload: {
        ...search,
      },
    });
  };

  const getClasses = () => {
    dispatch({
      type: 'categories/GET_CLASSES',
      payload: {
        branch: '',
      },
      callback: (res) => {
        if (!_.isEmpty(res.items)) {
          setClasses(res.items);
        }
      },
    });
  };

  useEffect(() => {
    fetchDataNotes();
  }, [classId]);

  /**
   * Function header table
   */
  const header = () => [
    {
      title: 'Trẻ',
      key: 'children',
      className: 'min-width-250',
      width: 250,
      render: (record) => (
        <AvatarTable
          fileImage={Helper.getPathAvatarJson(record.fileImage)}
          fullName={record.fullName}
        />
      ),
    },
    {
      title: 'Tuổi (tháng)',
      key: 'age',
      className: 'min-width-150',
      width: 150,
      render: (record) => `${record.age} tháng`,
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-150',
      width: 150,
      render: (record) => record?.classStudent?.class?.name,
    },
    {
      title: 'Phụ huynh',
      key: 'parents',
      className: 'min-width-250',
      width: 250,
      render: (record) => (
        <AvatarTable
          size={40}
          fileImage={_.head(
            (Helper.isJSON(_.get(record, 'parent[0].fileImage')) ||
              Helper.isJSON(_.get(record, 'parent[1].fileImage'))) &&
              JSON.parse(
                _.get(record, 'parent[0].fileImage') || _.get(record, 'parent[1].fileImage'),
              ),
          )}
          fullName={_.get(record, 'parent[0].fullName') || _.get(record, 'parent[1].fullName')}
        />
      ),
    },
    {
      title: 'Giáo viên',
      key: 'teacher',
      className: 'min-width-200',
      width: 200,
      render: (record) =>
        !_.isEmpty(record?.classStudent?.class?.teacher)
          ? _.map(record?.classStudent?.class?.teacher, 'fullName').join(', ')
          : '',
    },
  ];

  const absent = () => [
    {
      title: 'Nghỉ từ ngày',
      key: 'date',
      className: 'min-width-120',
      width: 120,
      render: (record) => {
        const date = record?.absent?.[0];
        return `${
          date?.startDate ? Helper.getDate(date?.startDate, variables.DATE_FORMAT.DATE_MONTH) : ''
        }
        ${
          date?.startDate
            ? `- ${Helper.getDate(date?.endDate, variables.DATE_FORMAT.DATE_MONTH)}`
            : ''
        }`;
      },
    },
    {
      title: 'Số lượng ngày nghỉ',
      key: 'absent',
      className: 'min-width-120',
      width: 120,
      render: (record) => {
        const date = record?.absent?.[0];
        return moment(date?.startDate).diff(moment(date?.endDate), 'days') + 1;
      },
    },
  ];

  const switchHeader = () => {
    switch (details?.status) {
      case 'UNPAID_LEAVE': {
        const newHeader = [...header()];
        const teacher = newHeader.pop();
        return [...newHeader, ...absent(), teacher];
      }
      default:
        return header();
    }
  };

  const getDetails = (record) => {
    setVisible(true);
    setTitle(record?.title);
    setDetails(record);
    setSearch((prevSearch) => ({
      ...prevSearch,
      status: record.status,
      isAttendance: record.isAttendance,
    }));
    getClasses();
  };

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

  const handleSearch = _.debounce((value, name) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  /**
   * Function set pagination
   * @param {integer} page page of pagination
   * @param {integer} size size of pagination
   */
  const changePagination = ({ page, limit }) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      page,
      limit,
    }));
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  const pagination = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        changePagination(response);
      },
    });

  const getTitleAmount = (record) => {
    if (
      record?.id === variables.STATUS_ABSENT.ANNUAL_LEAVE ||
      record?.id === variables.STATUS_ABSENT.UNPAID_LEAVE
    ) {
      return `số trẻ ${record?.name?.toLowerCase()}`;
    }
    return record?.name;
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
        title={title}
        width="90%"
        onCancel={cancelModal}
        footer={null}
      >
        <div className="p20">
          <Form
            initialValues={{
              classId: search.classId || null,
            }}
          >
            <div className="row">
              <div className="col-md-4 col-xl-3">
                <FormItem
                  className="mb-10"
                  name="nameStudent"
                  onChange={(event) => handleSearch(event.target.value, 'nameStudent')}
                  placeholder="Nhập từ khóa tìm kiếm"
                  type={variables.INPUT_SEARCH}
                />
              </div>
              <div className="col-md-4 col-xl-3">
                <FormItem
                  className="mb-10"
                  name="classId"
                  type={variables.SELECT}
                  data={[{ id: null, name: 'Tất cả các lớp' }, ...classes]}
                  onChange={(event) => handleSearch(event, 'classId')}
                  allowClear={false}
                />
              </div>
              <div className="col-md-4 col-xl-6">
                <p className="d-flex align-items-center justify-content-end mb0">
                  {getTitleAmount(details)}
                  <span
                    className={`${
                      details?.id === variables.STATUS_ABSENT.UNPAID_LEAVE
                        ? 'text-warning'
                        : 'text-success'
                    } font-size-30 font-weight-bold ml10`}
                  >
                    {details?.number}
                  </span>
                </p>
              </div>
            </div>
          </Form>
          <Table
            bordered
            columns={switchHeader()}
            dataSource={listAttendancesByStatus?.data}
            loading={loading['overView/GET_DATA_ATTENDANCE_BY_STATUS']}
            pagination={pagination(listAttendancesByStatus?.pagination)}
            params={{
              header: switchHeader(),
              type: 'table',
            }}
            rowKey={(record) => record.id}
            scroll={{ x: '100%', y: '50vh' }}
          />
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
          <div className="mt50">
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
              <div className={classnames(styles['content-bus'], 'px20')}>
                {loading['overView/GET_DATA_ATTENDANCE'] ? (
                  <>
                    <Skeleton avatar paragraph={{ rows: 4 }} active />
                    <Skeleton avatar paragraph={{ rows: 4 }} active />
                  </>
                ) : (
                  attendances.map((item, index) => (
                    <div
                      key={index}
                      className={classnames('pointer', styles['half-width'])}
                      onClick={() => getDetails(item)}
                      aria-hidden="true"
                    >
                      <AvatarTable fileImage={item.image} srcLocal size={30} />
                      <p className={classnames('mt15', 'mb0', 'font-size-13', 'text-black')}>
                        {item.name}
                      </p>
                      <p
                        className={classnames(
                          'mb0',
                          'font-size-30',
                          'font-weight-bold',
                          'text-black',
                          'mt-auto',
                          styles.number,
                        )}
                      >
                        {item.number}
                      </p>
                    </div>
                  ))
                )}
              </div>
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
