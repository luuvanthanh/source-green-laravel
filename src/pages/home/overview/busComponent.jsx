import { memo, useState, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from 'classnames';
import { Form, Modal, Skeleton, Avatar, Typography } from 'antd';
import { useSelector, useDispatch } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';

import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import styles from '../index.scss';
import variablesModule from '../variables';

const { Paragraph } = Typography;

const Index = memo(({ classId }) => {
  const dispatch = useDispatch();

  const {
    loading,
    bus,
    listBusByStatus,
    user,
  } = useSelector(({ loading, user, overView }) => ({
    user: user.user,
    loading: loading.effects,
    bus: overView.bus,
    listBusByStatus: overView.listBusByStatus,
  }));

  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState({});
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.PAGE_SIZE,
    keyWord: '',
    classId: ''
  });

  const fetchDataBus = () => {
    dispatch({
      type: 'overView/GET_DATA_BUS',
      payload: {
        ClassId: classId || undefined,
        date: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: moment(),
          }),
          format: variables.DATE_FORMAT.DATE_AFTER,
          isUTC: false,
        }),
        Status: variablesModule.TITLE_BUS.ABSENT.status
      },
    });
    dispatch({
      type: 'overView/GET_DATA_BUS',
      payload: {
        ClassId: classId || undefined,
        date: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: moment(),
          }),
          format: variables.DATE_FORMAT.DATE_AFTER,
          isUTC: false,
        }),
      },
    });
    dispatch({
      type: 'overView/GET_DATA_BUS',
      payload: {
        ClassId: classId || undefined,
        date: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: moment(),
          }),
          format: variables.DATE_FORMAT.DATE_AFTER,
          isUTC: false,
        }),
        Status: variablesModule.TITLE_BUS.HOME.status
      },
    });
    dispatch({
      type: 'overView/GET_DATA_BUS',
      payload: {
        ClassId: classId || undefined,
        date: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: moment(),
          }),
          format: variables.DATE_FORMAT.DATE_AFTER,
          isUTC: false,
        }),
        Status: variablesModule.TITLE_BUS.SCHOOL.status
      },
    });
  };

  const getListBusByStatus = () => {
    dispatch({
      type: 'overView/GET_DATA_BUS_BY_STATUS',
      payload: {
        date: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: moment(),
          }),
          format: variables.DATE_FORMAT.DATE_AFTER,
          isUTC: false,
        }),
        Status: details?.status || undefined,
        ...search,
      },
    });
  };

  const getClasses = () => {
    dispatch({
      type: 'categories/GET_CLASSES',
      payload: {
        branch: user?.objectInfo?.positionLevel?.branchId,
      },
      callback: (res) => {
        if (!_.isEmpty(res.items)) {
          setClasses(res.items);
        }
      },
    });
  };

  useEffect(() => {
    fetchDataBus();
  }, [classId]);

  useEffect(() => {
    if (visible) {
      getListBusByStatus();
    }
  }, [search, visible]);

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
        <div className="d-flex align-items-center">
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record?.student?.fileImage || record?.studentBusPlace?.student?.fileImage)}
            shape="square"
            size={40}
          />
          <p className="mb0 ml10">{record?.student?.fullName || record?.studentBusPlace?.student?.fullName || ''}</p>
        </div>
      ),
    },
    {
      title: 'Tuổi (tháng)',
      key: 'age',
      className: 'min-width-100',
      width: 100,
      render: (record) => `${record?.student?.age || record?.studentBusPlace?.student?.age || 0} tháng`,
    },
    {
      title: 'Phụ huynh',
      key: 'parents',
      className: 'min-width-150',
      width: 150,
      render: (record) => (
        <AvatarTable
          size={40}
          fileImage={_.head(
            (Helper.isJSON(
              _.get(record, 'student.studentParents[0].parent.fileImage') || _.get(record, 'student.studentBusPlace.studentParents[0].parent.fileImage')
            ) ||
              Helper.isJSON(
                _.get(record, 'student.studentParents[0].farther.fileImage') || _.get(record, 'student.studentBusPlace.studentParents[0].farther.fileImage'),
              )) &&
              JSON.parse(
                (_.get(record, 'student.studentParents[0].parent.fileImage') || _.get(record, 'student.studentBusPlace.studentParents[0].parent.fileImage'))
                  || (_.get(record, 'student.studentParents[0].farther.fileImage') || _.get(record, 'student.studentBusPlace.studentParents[0].farther.fileImage')),
              ),
          )}
          fullName={
            (_.get(record, 'student.studentParents[0].parent.fullName') || _.get(record, 'student.studentBusPlace.studentParents[0].parent.fullName')) ||
            (_.get(record, 'student.studentParents[0].farther.fullName') || _.get(record, 'student.studentBusPlace.studentParents[0].farther.fullName'))
          }
        />
      ),
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-120',
      width: 120,
      render: (record) => record?.class?.name || record?.studentBusPlace?.class?.name || '',
    },
    {
      title: 'Bảo mẫu',
      key: 'shuttler',
      width: 150,
      className: 'min-width-150',
      render: (record) => (
        <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}>
          {(record?.busPlace?.busRoute?.busRouteNannies || record?.studentBusPlace?.busPlace?.busRoute?.busRouteNannies)
            ?.map((item) => item?.nanny?.fullName)
            .join(',')}
        </Paragraph>
      ),
    },
  ];

  const absent = () => [
    {
      title: 'Nghỉ từ ngày',
      key: 'date',
      className: 'min-width-150',
      width: 150,
      render: (record) => {
        const date = record?.student?.absentStudents[0];
        return `${ date?.startDate ? Helper.getDate(date?.startDate, variables.DATE_FORMAT.DATE_MONTH) : ''}
        ${ date?.startDate ? `- ${Helper.getDate(date?.endDate, variables.DATE_FORMAT.DATE_MONTH)}` : ''}`;
      }
    },
    {
      title: 'Số lượng ngày nghỉ',
      key: 'absent',
      className: 'min-width-150',
      width: 150,
      render: (record) => {
        const date = record?.student?.absentStudents[0];
        return moment(date?.startDate).diff(moment(date?.endDate), 'days') + 1;
      }
    },
    {
      title: 'Bảo mẫu',
      key: 'shuttler',
      width: 150,
      className: 'min-width-150',
      render: (record) => (
        <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}>
          {record?.busPlace?.busRoute?.busRouteNannies
            ?.map((item) => item?.nanny?.fullName)
            .join(',')}
        </Paragraph>
      ),
    },
  ];

  const headerTime = () => [
    {
      title: 'Thời gian lên xe',
      key: 'getIn',
      className: 'min-width-110',
      width: 110,
      render: (record) => {
        const getIn = record[`${details?.status === "SCHOOLWARD" ? 'schoolwardGetIn' : 'homewardGetIn'}`];
        return `${ getIn ? Helper.getDate(getIn, variables.DATE_FORMAT.TIME_FULL) : ''}`;
      }
    },
    {
      title: 'Thời gian xuống xe',
      key: 'getOff',
      className: 'min-width-120',
      width: 120,
      render: (record) => {
        const getOff = record[`${details?.status === "SCHOOLWARD" ? 'schoolwardGetOff' : 'homewardGetOff'}`];
        return `${ getOff ? Helper.getDate(getOff, variables.DATE_FORMAT.TIME_FULL) : ''}`;
      }
    },
  ];

  const switchHeader = () => {
    switch(details?.status) {
      case 'HOMEWARD':
      case 'SCHOOLWARD':
        return [ ...(header().slice(0, 2)), ...headerTime(),  ...(header().slice(2, 5)) ];
      case 'ABSENCE': {
        return [ ...(_.initial(header())), ...absent() ];
      }
      default:
        return header();
    }
  };

  const getDetail = (record) => {
    setVisible(true);
    setDetails(record);
    getClasses();
  };

  const cancelModal = () => {
    setVisible(false);
  };

  const handleSearch = _.debounce((value, name) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  }, 300);

  /**
   * Function set pagination
   * @param {integer} page page of pagination
   * @param {integer} size size of pagination
   */
  const changePagination = (page, limit) => {
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
  const pagination = (pagination) => ({
    size: 'default',
    total: pagination?.total,
    pageSize: search.limit,
    defaultCurrent: Number(search.page),
    current: Number(search.page),
    hideOnSinglePage: pagination.total <= 10,
    showSizeChanger: variables.PAGINATION.SHOW_SIZE_CHANGER,
    pageSizeOptions: variables.PAGINATION.PAGE_SIZE_OPTIONS,
    locale: { items_per_page: variables.PAGINATION.PER_PAGE_TEXT },
    onChange: (page, size) => {
      changePagination(page, size);
    },
    onShowSizeChange: (current, size) => {
      changePagination(current, size);
    },
    showTotal: (total, [start, end]) => `Hiển thị ${start}-${end} trong ${total}`,
  });

  const renderQuantity = () => {
    switch(details?.status) {
      case 'SCHOOLWARD':
      case 'HOMEWARD':
        return (
          <div className="d-flex justify-content-end">
            <p className="d-flex align-items-center justify-content-end mb0 mr30">
              {details?.get_in?.title_quantity}:
              <span className="text-success font-size-30 font-weight-bold ml10">
                {bus[`${details?.get_in?.field}`]}
              </span>
            </p>
            <p className="d-flex align-items-center justify-content-end mb0">
              {details?.get_off?.title_quantity}:
              <span className="text-success font-size-30 font-weight-bold ml10">
                {bus[`${details?.get_off?.field}`]}
              </span>
            </p>
          </div>
        );
      default:
        return (
          <p className="d-flex align-items-center justify-content-end mb0">
            {details?.title_quantity}:
            <span className="text-success font-size-30 font-weight-bold ml10">
              {bus[`${details.field}`]}
            </span>
          </p>
        );
    }
  };

  return (
    <>
      <Modal
        className={styles['modal-student-detail']}
        visible={visible}
        title={details.title_popup}
        width="95%"
        onCancel={cancelModal}
        footer={null}
      >
        <div className="p20">
          <Form>
            <div className="row align-items-center">
              <div className="col-md-4 col-xl-3 mb15">
                <FormItem
                  className="mb0"
                  name="keyWord"
                  onChange={(event) => handleSearch(event.target.value, 'keyWord')}
                  placeholder="Nhập từ khóa tìm kiếm"
                  type={variables.INPUT_SEARCH}
                />
              </div>
              <div className="col-md-4 col-xl-3 mb15">
                <FormItem
                  className="mb0"
                  name="class"
                  type={variables.SELECT}
                  data={[{ id: '', name: 'Tất cả các lớp' }, ...classes]}
                  onChange={(event) => handleSearch(event, 'classId')}
                  allowClear={false}
                />
              </div>
              <div className="col-md-4 col-xl-6 mb15">
                {renderQuantity()}
              </div>
            </div>
          </Form>
          <Table
            bordered
            columns={switchHeader()}
            dataSource={listBusByStatus?.data}
            loading={loading['overView/GET_DATA_BUS_BY_STATUS']}
            pagination={pagination(listBusByStatus?.pagination)}
            params={{
              header: switchHeader(),
              type: 'table',
            }}
            rowKey={(record) => record.id}
            scroll={{ x: '100%' }}
          />
        </div>
      </Modal>
      <div className={classnames(styles['block-category'])}>
        <div className={styles['body-tab']}>
          <div className={styles['header-tab']}>
            <div>
              <img src="/images/home/road.svg" alt="notification" className={styles.icon} />
              <span
                className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}
              >
                Bus
              </span>
            </div>
          </div>
          <div className="mt50">
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
              <div className={classnames(styles['content-bus'], 'px20')}>
                {loading['overView/GET_DATA_BUS'] ? (
                  <>
                    <Skeleton avatar paragraph={{ rows: 4 }} active />
                    <Skeleton avatar paragraph={{ rows: 4 }} active />
                  </>
                ) : (
                  <>
                    <div
                      className={classnames(styles['content-tab'], styles.bus, 'width-100p', 'mb0')}
                      onClick={() =>
                        getDetail({
                          ...variablesModule.TITLE_BUS.TOTAL,
                          quantity: bus.studentTotal,
                        })
                      }
                      aria-hidden="true"
                    >
                      <div
                        className={classnames(
                          'd-flex',
                          'align-items-center',
                          'justify-content-between',
                          styles['header-content-tab'],
                        )}
                      >
                        <div className="d-flex align-items-center">
                          <AvatarTable fileImage="/images/icon/letter.svg" srcLocal size={27} />
                          <p className="mb0 ml10">{variablesModule.TITLE_BUS.TOTAL.title}</p>
                        </div>
                        <p
                          className={classnames(
                            'mb0',
                            'ml10',
                            'font-size-30',
                            'font-weight-bold',
                            'text-black',
                          )}
                        >
                          {bus?.studentTotal || 0}
                        </p>
                      </div>
                    </div>
                    <div
                      className={classnames(styles['content-tab'], styles.bus, 'width-100p', 'mb0')}
                      onClick={() =>
                        getDetail({
                          ...variablesModule.TITLE_BUS.ABSENT,
                          quantity: bus.absentStudentTotal || 0,
                        })
                      }
                      aria-hidden="true"
                    >
                      <div
                        className={classnames(
                          'd-flex',
                          'align-items-center',
                          'justify-content-between',
                          styles['header-content-tab'],
                        )}
                      >
                        <div className="d-flex align-items-center">
                          <AvatarTable fileImage="/images/icon/absent.svg" srcLocal size={27} />
                          <p className="mb0 ml10">{variablesModule.TITLE_BUS.ABSENT.title}</p>
                        </div>
                        <p
                          className={classnames(
                            'mb0',
                            'ml10',
                            'font-size-30',
                            'font-weight-bold',
                            'text-black',
                          )}
                        >
                          {bus?.absentStudentTotal || 0}
                        </p>
                      </div>
                    </div>
                    <div
                      className={classnames(
                        styles['content-tab'],
                        styles.bus,
                        'width-100p',
                        'mb12',
                      )}
                      onClick={() =>
                        getDetail({
                          ...variablesModule.TITLE_BUS.SCHOOL,
                          status: variablesModule.TITLE_BUS.SCHOOL.status,
                          quantity: bus.schoolGetInStatusTotal,
                        })
                      }
                      aria-hidden="true"
                    >
                      <div className="d-flex align-items-center">
                        <Avatar src="/images/icon/right-arrow-green.svg" size={27} />
                        <p className="mb0 ml10">{variablesModule.TITLE_BUS.SCHOOL.title}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>
                          <p className={classnames('mt15', 'mb0', 'font-size-13', 'text-black')}>
                            {variablesModule.TITLE_BUS.SCHOOL.get_in.title}
                          </p>
                          <p
                            className={classnames(
                              'mb0',
                              'font-size-30',
                              'font-weight-bold',
                              'text-black',
                              styles.number,
                            )}
                          >
                            {bus?.schoolGetInStatusTotal}
                          </p>
                        </div>
                        <div>
                          <p className={classnames('mt15', 'mb0', 'font-size-13', 'text-black')}>
                            {variablesModule.TITLE_BUS.SCHOOL.get_off.title}
                          </p>
                          <p
                            className={classnames(
                              'mb0',
                              'font-size-30',
                              'font-weight-bold',
                              'text-black',
                              'text-right',
                              styles.number,
                            )}
                          >
                            {bus?.schoolGetOffStatusTotal}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={classnames(
                        styles['content-tab'],
                        styles.bus,
                        'width-100p',
                        'mb20',
                      )}
                      onClick={() =>
                        getDetail({
                          ...variablesModule.TITLE_BUS.HOME,
                          status: variablesModule.TITLE_BUS.HOME.status,
                          quantity: bus.schoolGetInStatusTotal,
                        })
                      }
                      aria-hidden="true"
                    >
                      <div className="d-flex align-items-center">
                        <Avatar src="/images/icon/left-arrow-orange.svg" size={27} />
                        <p className="mb0 ml10">{variablesModule.TITLE_BUS.HOME.title}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>
                          <p className={classnames('mt15', 'mb0', 'font-size-13', 'text-black')}>
                            {variablesModule.TITLE_BUS.HOME.get_in.title}
                          </p>
                          <p
                            className={classnames(
                              'mb0',
                              'font-size-30',
                              'font-weight-bold',
                              'text-black',
                              styles.number,
                            )}
                          >
                            {bus?.homeGetInStatusTotal}
                          </p>
                        </div>
                        <div>
                          <p className={classnames('mt15', 'mb0', 'font-size-13', 'text-black')}>
                            {variablesModule.TITLE_BUS.HOME.get_off.title}
                          </p>
                          <p
                            className={classnames(
                              'mb0',
                              'font-size-30',
                              'font-weight-bold',
                              'text-black',
                              'text-right',
                              styles.number,
                            )}
                          >
                            {bus?.homeGetOffStatusTotal}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
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
};

Index.defaultProps = {
  classId: '',
};

export default Index;
