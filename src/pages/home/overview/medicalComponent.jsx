import { memo, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Tabs, Modal, Avatar, Image, Checkbox, Skeleton } from 'antd';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';
import _ from 'lodash';

import { Helper, variables } from '@/utils';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Table from '@/components/CommonComponent/Table';

import styles from '../index.scss';
import variablesModules from '../variables';

const { TabPane } = Tabs;
const Index = memo(() => {
  const dispatch = useDispatch();
  const [ { medicals, detailsMedical }, loading] = useSelector(({ loading: { effects }, overView }) => [
    overView,
    effects,
  ]);

  const [visible, setVisible ] = useState(false);
  const [search, setSearch] = useState({
    classId: undefined,
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.SIZEMAX,
    status: variables.STATUS.PENDING
  });

  const fetchDataNotes = () => {
    dispatch({
      type: 'overView/GET_DATA_MEDICAL',
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
      type: 'overView/GET_DETAILS_MEDICAL',
      payload: { id }
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
  const header = () => {
    const images = [
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    ];
    return [
      {
        title: 'Thời gian uống',
        key: 'creationTime',
        className: 'min-width-140',
        width: 140,
        render: (record) => {Helper.getDate(record.appliedDate, variables.DATE_FORMAT.TIME_DATE);}
      },
      {
        title: 'Thuốc',
        key: 'image',
        className: 'min-width-300',
        width: 300,
        render: () => (
          <div className="d-flex align-items-center">
            <Image.PreviewGroup>
              {
                images.map((item, index) => (
                  <div className={styles['group-image']} key={index}>
                    <Image
                      width={42}
                      src={item}
                      data-viewmore={`+${images.length - 1}`}
                    />
                  </div>
                ))
              }
            </Image.PreviewGroup>
            <p className="mb0 ml10">Siro Prosan</p>
          </div>
        ),
      },
      {
        title: 'Đơn vị',
        key: 'unit',
        className: 'min-width-120',
        width: 120,
        render: (record) => record?.unit || ''
      },
      {
        title: 'Liều lượng',
        key: 'amount',
        className: 'min-width-120',
        width: 120,
        render: () => ''
      },
      {
        title: 'Ghi chú',
        key: 'note',
        className: 'min-width-300',
        width: 300,
        render: (record) => record?.note || ''
      },
      {
        title: 'Nhận thuốc',
        key: 'getMedicine',
        align: 'center',
        className: 'min-width-120',
        render: () => <Checkbox />,
      },
      {
        title: 'Cho thuốc',
        key: 'giveMedicine',
        align: 'center',
        className: 'min-width-120',
        render: () => <Checkbox />,
      },
      {
        title: 'Ghi chú',
        key: 'noteAll',
        rowSpan: 2,
        className: 'min-width-300',
        width: 300,
        render: (value, row, index) => {
          const obj = {
            children: 'Cho bé uống thuốc đúng giờ',
            props: {
              rowSpan: index === 0 ? 2 : 0
            }
          };
          return obj;
        }
      },
    ];
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
                fileImage={Helper.getPathAvatarJson(detailsMedical?.student?.fileImage)}
                fullName={detailsMedical?.student?.fullName || ''}
                description={`${detailsMedical?.student?.age}tháng tuổi`}
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
                <Avatar
                  src={`${API_UPLOAD}${Helper.getPathAvatarJson(detailsMedical?.studentMaster?.student?.employee?.fileImage)}`}
                  size={50}
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
                {Helper.getDate(detailsMedical?.creationTime, variables.DATE_FORMAT.TIME_DATE_VI)}
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
            dataSource={_.get(detailsMedical, 'medicines', [])}
            // loading={loading}
            pagination={false}
            params={{
              header: header(),
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
              <img src="/images/home/balloons.svg" alt="notification" className={styles.icon} />
              <span className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}>Y tế</span>
            </div>
            <p className={classnames('mb0', 'font-size-14')}>15</p>
          </div>
          <Tabs onChange={changeTab} activeKey={search?.tab}>
            {variablesModules.MEDICAL.map(({ id, name }) => (
              <TabPane tab={name} key={id} />
            ))}
          </Tabs>
          <Scrollbars autoHeight autoHeightMax={window.innerHeight - 335}>
            {!loading['overView/GET_DATA_MEDICAL'] && _.isEmpty(medicals) && (
              <p className="mb0 p20 border text-center font-weight-bold">{variables.NO_DATA}</p>
            )}
            {loading['overView/GET_DATA_MEDICAL'] ? (
              <>
                <Skeleton avatar paragraph={{ rows: 4 }} active />
                <Skeleton avatar paragraph={{ rows: 4 }} active />
                <Skeleton avatar paragraph={{ rows: 4 }} active />
              </>
            ) : (
              medicals.map((item, index) => (
                <div
                  className={styles['content-tab']}
                  key={index}
                  onClick={() => getDetails(item?.id)}
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
                  <p className={classnames('mt10', 'mb0', 'font-size-14')}>{item?.diseaseName || ''}</p>
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
