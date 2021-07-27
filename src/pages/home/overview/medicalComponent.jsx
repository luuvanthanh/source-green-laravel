import { memo, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Tabs, Modal, Image, Skeleton } from 'antd';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import PropTypes from 'prop-types';

import Empty from '@/components/CommonComponent/Table/Empty';
import { Helper, variables } from '@/utils';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Table from '@/components/CommonComponent/Table';

import styles from '../index.scss';
import variablesModules from '../variables';

const { TabPane } = Tabs;
const Index = memo(({ classId, branchId }) => {
  const dispatch = useDispatch();
  const [ { medicals, detailsMedical, medicalsStudent }, loading] = useSelector(({ loading: { effects }, overView }) => [
    overView,
    effects,
  ]);

  const [visible, setVisible ] = useState(false);
  const [search, setSearch] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.SIZEMAX,
    status: variables.STATUS.PENDING
  });

  const fetchData = () => {
    dispatch({
      type: 'overView/GET_DATA_MEDICAL',
      payload: {
        classId,
        branchId,
        ...search,
        AppliedDateFrom: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: moment(),
            targetValue: '00:00:00',
          }),
          isUTC: false,
        }),
        AppliedDateTo: Helper.getDateTime({
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
    fetchData();
  }, [search.status, classId]);

  const cancelModal = () => {
    setVisible(false);
  };

  const getDetails = (record) => {
    setVisible(true);
    dispatch({
      type: 'overView/GET_DETAILS_MEDICAL',
      payload: {
        id:record.id
      }
    });
    dispatch({
      type: 'overView/GET_LIST_MEDICAL_BY_STUDENT',
      payload: {
        StudentId: record.studentId,
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
        AppliedDate: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: record.creationTime,
          }),
          isUTC: true,
        }),
      }
    });
  };

  const changeTab = (tab) => {
    setSearch((prev) => ({
      ...prev,
      status: tab
    }));
  };

  /**
   * Function header table
   */
   const header = () => [
    {
      title: 'Tên Bệnh',
      key: 'diseaseName',
      className: 'min-width-170',
      width: 250,
      render: (record) => {
        const obj = {
          children:  record?.diseaseName || '',
          props: {
            rowSpan: record?.lengthDrinkingTimes || 0
          }
        };
        return obj;
      }
    },
    {
      title: 'Thời gian uống',
      key: 'timeCode',
      className: 'min-width-140',
      width: 140,
      render: (row) => {
        const obj = {
          children: row?.timeCode ? variablesModules.STATUS_TIME_CODE_NAME[row?.timeCode] : '',
          props: {
            rowSpan: row?.lengthMedicineTime || 0
          }
        };
        return obj;
      }
    },
    {
      title: 'Thuốc',
      key: 'image',
      className: 'min-width-250',
      width: 250,
      render: (record) => (
        <div className="d-flex align-items-center">
          <Image.PreviewGroup>
            {Helper.isJSON(record?.medicine?.files) &&
              JSON.parse(record?.medicine?.files).map((item, index) => (
                <div key={index} className={styles['group-image']}>
                  <Image
                    key={index}
                    width={42}
                    height={42}
                    src={`${API_UPLOAD}${item}`}
                    data-viewmore={`+${JSON.parse(record?.medicine?.files)?.length - 1}`}
                    fallback="/default-upload.png"
                  />
                </div>
            ))}
          </Image.PreviewGroup>
          <p className="mb0 ml10">{record?.medicine?.name}</p>
        </div>
      ),
    },
    {
      title: 'Đơn vị',
      key: 'position',
      className: 'min-width-80',
      align: 'center',
      width: 120,
      render: (record) => record?.medicine.unit || ''
    },
    {
      title: 'Liều lượng',
      key: 'amount',
      className: 'min-width-90',
      align: 'center',
      width: 120,
      render: (record) => record?.medicineAmount || ''
    },
    {
      title: 'Ghi chú',
      key: 'note',
      className: 'min-width-200',
      width: 300,
      render: (record) => record?.medicine?.note
    },
    {
      title: 'Nhận thuốc',
      key: 'getMedicine',
      align: 'center',
      className: 'min-width-80',
      width: 120,
      render: (record) => record?.isReceived ? <span className={classnames('color-success', 'icon-checkmark')} />: ''
    },
    {
      title: 'Cho thuốc',
      key: 'giveMedicine',
      align: 'center',
      className: 'min-width-80',
      width: 120,
      render: (record) => record?.isDrunk ? <span className={classnames('color-success', 'icon-checkmark')} />: ''
    },
  ];

  const getLengthMedicineTime = (data, index) => {
    if (data?.length > 0) {
      if (index === 0) {
        return data?.length;
      }
      return 0;
    }
    return 1;
  };

  const getLenghtDrinkingTimes = (data, index, indexChild) => {
    let length = 0;
    data.forEach(item => {
      length += item.medicineTimes.length;
    });
    if (length > 0) {
      if (index === 0 && indexChild === 0) {
        return length;
      }
      return 0;
    }
    return 1;
  };

  const convertMedical = (data) => {
    if (_.isEmpty(data)) {
      return [];
    }
    const result = [];
    data.forEach(item => {
      if (!_.isEmpty(item.drinkingTimes)) {
        item.drinkingTimes.forEach((child, index) => {
          if (!_.isEmpty(child.medicineTimes)) {
            child?.medicineTimes.forEach((itemChild, indexChild) => result.push({
              id: uuidv4(),
              lengthDrinkingTimes: getLenghtDrinkingTimes(item.drinkingTimes, index, indexChild),
              appliedDate: item.medical.appliedDate,
              creationTime: item.medical.creationTime,
              diseaseName: item.medical.diseaseName,
              medicineLocation: item.medical.medicineLocation,
              status: item.medical.status,
              timeCode: child.timeCode,
              lengthMedicineTime: getLengthMedicineTime(child?.medicineTimes, indexChild),
              medicineAmount: itemChild.medicineAmount,
              isDrunk: itemChild?.isDrunk,
              isReceived: itemChild?.isReceived,
              medicine: { ...itemChild?.medicine }
            }));
          }
        });
      }
    });
    return result;
  };

  return (
    <>
      <Modal
        className={styles['modal-student-detail']}
        visible={visible}
        title="Y tế"
        width="90%"
        onCancel={cancelModal}
        footer={null}
      >
        <div className={classnames('p20', 'border-bottom', styles['header-modal'])}>
          <div className="row">
            <div className="col-lg-3 mt10">
              <AvatarTable
                fileImage={Helper.getPathAvatarJson(detailsMedical?.studentMaster?.farther?.fileImage || detailsMedical?.studentMaster?.mother?.fileImage)}
                fullName={detailsMedical?.studentMaster?.farther?.fullName || detailsMedical?.studentMaster?.mother?.fullName}
                description="Phụ huynh"
                size={50}
              />
            </div>
            <div className="col-lg-3 mt10">
              <AvatarTable
                fileImage={Helper.getPathAvatarJson(detailsMedical?.studentMaster?.student?.fileImage)}
                fullName={detailsMedical?.studentMaster?.student?.fullName || ''}
                description={`${detailsMedical?.studentMaster?.student?.age}tháng tuổi`}
                size={50}
              />
            </div>
            <div className="col-lg-3 mt10">
              <div className="d-flex">
                <span className={styles.circleIcon}>
                  <span className="icon-open-book" />
                </span>
                <div className="ml10">
                  <p className={classnames('mb0', styles.class)}>Lớp</p>
                  <p className="font-weight-bold font-size-14 mb0">{detailsMedical?.studentMaster?.student?.class?.name || 'Preschool'}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mt10">
              <div className="d-flex">
                <AvatarTable
                  fileImage={Helper.getPathAvatarJson(detailsMedical?.studentMaster?.student?.employee?.fileImage)}
                  size={50}
                  shape="circle"
                />
                <div className="ml10">
                  <p className={classnames('mb0', styles.class)}>Giáo viên</p>
                  <p className="font-weight-bold font-size-14 mb0">{detailsMedical?.studentMaster?.student?.employee?.fullName || ''}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p20">
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <p className="mb20">Thời gian gửi: <span className="font-weight-bold">
                {Helper.getDate(detailsMedical?.creationTime, variables.DATE_FORMAT.TIME_DATE_MONTH)}
              </span></p>
            </div>
            <div className="col-md-6 col-lg-3">
              <p className="mb20">Tên bệnh: <span className="font-weight-bold">{detailsMedical?.diseaseName || ''}</span></p>
            </div>
            <div className="col-md-6 col-lg-3">
              <p className="mb20">Vị trí đặt thuốc: <span className="font-weight-bold">{detailsMedical?.medicineLocation || ''}</span></p>
            </div>
            <div className="col-md-6 col-lg-3">
              <p className="mb20">Nhân viên y tế: <span className="font-weight-bold">{detailsMedical?.creator?.userName}</span></p>
            </div>
          </div>
          <Table
            bordered
            columns={header()}
            dataSource={convertMedical(medicalsStudent)}
            loading={loading['overView/GET_LIST_MEDICAL_BY_STUDENT']}
            pagination={false}
            params={{
              header: header(),
              type: 'table',
            }}
            rowKey={(record) => record.id}
            scroll={{ x: '100%'}}
          />
        </div>
      </Modal>
      <div className={classnames(styles['block-category'])}>
        <div className={styles['body-tab']}>
          <div className={styles['header-tab']}>
            <div>
              <img src="/images/home/balloons.svg" alt="notification" className={styles.icon} />
              <span className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}>Y tế</span>
            </div>
            <p className={classnames('mb0', 'font-size-14')}>{medicals?.length || 0}</p>
          </div>
          <Tabs onChange={changeTab} activeKey={search?.tab}>
            {variablesModules.MEDICAL.map(({ id, name }) => (
              <TabPane tab={name} key={id} />
            ))}
          </Tabs>
          <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
            <div className="px20">
              {!loading['overView/GET_DATA_MEDICAL'] && _.isEmpty(medicals) && (
                <div className="p20">
                  <Empty />
                </div>
              )}
              {loading['overView/GET_DATA_MEDICAL'] ? (
                <>
                  <Skeleton avatar paragraph={{ rows: 4 }} active />
                  <Skeleton avatar paragraph={{ rows: 4 }} active />
                </>
              ) : (
                medicals.map((item, index) => (
                  <div
                    className={styles['content-tab']}
                    key={index}
                    onClick={() => getDetails(item)}
                    aria-hidden="true"
                  >
                    <div className={classnames('d-flex', 'align-items-center', 'justify-content-between', styles['header-content-tab'])}>
                      <AvatarTable
                        className="full-name-bold"
                        fileImage={Helper.getPathAvatarJson(item?.studentMaster?.student?.fileImage)}
                        fullName={item?.studentMaster?.student?.fullName}
                        size={36}
                      />
                      <p className={classnames('mb0', styles.date)}>{Helper.getDate(item?.creationTime, variables.DATE_FORMAT.TIME_DATE_MONTH)}</p>
                    </div>
                    <p className={classnames('mt10', 'mb0', 'font-size-14')}>{item?.diseaseName || ''}</p>
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
