import { memo, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Tabs, Modal, Image, Collapse } from 'antd';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';
import moment from 'moment';
import { isArray, omit, head } from 'lodash';
import PropTypes from 'prop-types';
import ScrollContainer from 'react-indiana-drag-scroll';

import { Helper, variables } from '@/utils';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Table from '@/components/CommonComponent/Table';

import Button from '@/components/CommonComponent/Button';
import styles from '../index.scss';
import variablesModules from '../variables';
import HelperModules from './utils/Helper';

const { TabPane } = Tabs;
const Index = memo(({ classId, branchId }) => {
  const dispatch = useDispatch();
  const [{ medicals, configs }, loading] = useSelector(({ loading: { effects }, overView }) => [
    overView,
    effects,
  ]);

  const [visible, setVisible] = useState(false);
  const [objects, setObjects] = useState({});
  const [type, setType] = useState(variablesModules.STATUS_TIME.BEFORE_BREAKFAST);
  const [search, setSearch] = useState({
    classId,
    branchId,
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.SIZEMAX,
    status: variablesModules.STATUS.RECEIVED,
  });

  const fetchData = () => {
    if (search.status === variablesModules.STATUS.RECEIVED) {
      dispatch({
        type: 'overView/GET_DATA_MEDICAL',
        payload: {
          ...omit(search, 'status'),
          isReceived: false,
          isSent: true,
          from: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: moment(),
              targetValue: '23:59:59',
            }),
            isUTC: false,
          }),
          to: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: moment(),
              targetValue: '23:59:59',
            }),
            isUTC: false,
          }),
        },
      });
    } else {
      dispatch({
        type: 'overView/GET_DATA_MEDICAL_TIME',
        payload: {
          ...omit(search, 'status'),
          from: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: moment(),
              targetValue: '23:59:59',
            }),
            isUTC: false,
          }),
          to: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: moment(),
              targetValue: '23:59:59',
            }),
            isUTC: false,
          }),
        },
      });
    }
  };

  const fetchConfigs = () => {
    dispatch({
      type: 'overView/GET_CONFIGS',
      payload: {},
    });
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  useEffect(() => {
    fetchData();
  }, [search.status, classId]);

  const cancelModal = () => {
    setVisible(false);
  };

  const changeTab = (tab) => {
    setSearch((prev) => ({
      ...prev,
      status: tab,
    }));
  };

  const onShowInfo = (record) => {
    setVisible(true);
    setObjects(record);
  };

  const headerMedical = () => {
    const columns = [
      {
        title: 'SÁNG',
        key: 'medicineTimeType',
        render: (record) => record?.medicineTimeType?.description,
      },
      {
        key: 'note',
        className: 'min-width-100',
        width: 100,
        render: (record) => record.note,
      },
    ];
    return columns;
  };

  const header = () => [
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-80 max-width-80',
      width: 80,
      render: (record) => record?.class?.name,
    },
    {
      title: 'Học sinh',
      key: 'student',
      className: 'min-width-150',
      width: 150,
      align: 'center',
      render: (record) => (
        <div className={styles['list-avatar']}>
          {record?.items?.map((item, index) => (
            <div
              className={styles['item-avatar']}
              key={index}
              role="presentation"
              onClick={() => onShowInfo({ ...item, ...record })}
            >
              <AvatarTable fileImage={Helper.getPathAvatarJson(item?.student?.fileImage)} />
            </div>
          ))}
        </div>
      ),
    },
  ];

  const headerDrink = () => [
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-80 max-width-80',
      width: 80,
      render: (record) => record?.class?.name,
    },
    {
      title: 'Học sinh',
      key: 'student',
      className: 'min-width-150',
      width: 150,
      align: 'center',
      render: (record) => (
        <div className={styles['list-avatar']}>
          {record?.items?.map((item, index) => {
            const status = head(item.status);
            return (
              <div
                className={styles['item-avatar']}
                key={index}
                role="presentation"
                onClick={() => onShowInfo({ ...item, ...record })}
              >
                <AvatarTable
                  isBorder={status?.status === 'NOT_DRINK'}
                  isActive={status?.status === 'DRINK'}
                  fileImage={Helper.getPathAvatarJson(item?.student?.fileImage)}
                />
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  const reminder = () => {
    dispatch({
      type: 'overView/REMINDER',
      payload: {
        id: objects.id,
        type: objects.name ? 'DRUNK' : 'RECEIVE',
        medicineTime: objects.name,
      },
      callback: (response) => {
        if (response) {
          cancelModal();
        }
      },
    });
  };

  const changeType = (record) => {
    setType(record.name);
  };

  const covertByType = (data) =>
    data.map((item) => {
      let object = {};
      item?.items?.forEach((itemOne) => {
        if (itemOne?.items?.find((itemTwo) => itemTwo?.name === type)) {
          object = itemOne?.items?.find((itemTwo) => itemTwo?.name === type) || {};
        }
      });
      return {
        ...item,
        ...object,
      };
    });

  return (
    <>
      <Modal
        centered
        footer={false}
        onCancel={cancelModal}
        title={false}
        visible={visible}
        className={styles['modal-detail-container']}
      >
        <div
          className={classnames(
            styles['modal-header'],
            'd-flex justify-content-between align-items-center',
          )}
        >
          <AvatarTable
            fullName={objects?.student?.fullName}
            fileImage={Helper.getPathAvatarJson(objects?.student?.fileImage)}
            description={objects?.class?.name}
          />
          {search?.status === variablesModules.STATUS.RECEIVED && (
            <>
              {objects.isReceived && HelperModules.tagStatus('RECEIVED')}
              {!objects.isReceived && HelperModules.tagStatus('NOT_RECEIVED')}
            </>
          )}
          {search?.status === variablesModules.STATUS.DRINK && (
            <>
              {head(objects?.status)?.status === 'DRINK' && HelperModules.tagStatusDrink('DRINK')}
              {head(objects?.status)?.status === 'NOT_DRINK' &&
                HelperModules.tagStatusDrink('NOT_DRINK')}
            </>
          )}
        </div>
        <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
          <div className={styles['modal-content']}>
            <h3 className={styles.title}>Thông tin chung</h3>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className={styles.label}>Triệu chứng</p>
                <p className={styles.norm}>{objects?.diseaseName}</p>
              </div>
              <div className="text-right">
                <p className={styles.label}>Nơi đặt thuốc</p>
                <p className={styles.norm}>{objects?.medicineLocation}</p>
              </div>
            </div>
            <hr />
            {search?.status === variablesModules.STATUS.RECEIVED && (
              <>
                <h3 className={styles.title}>Thông tin thuốc</h3>
                <Collapse
                  defaultActiveKey={[0]}
                  className={styles['collapse-container']}
                  expandIconPosition="right"
                >
                  {objects?.medicines?.map(
                    ({ name, fromDate, toDate, files, medicineTimes }, index) => (
                      <Collapse.Panel
                        header={<div className={styles['container-header']}>{name}</div>}
                        key={index}
                      >
                        <p className={styles.label}>Tên thuốc</p>
                        <p className={styles.norm}>{name}</p>
                        <hr />
                        <p className={styles.label}>Thời gian uống</p>
                        <Table
                          columns={headerMedical()}
                          dataSource={medicineTimes}
                          pagination={false}
                          params={{
                            header: headerMedical(),
                            type: 'table',
                          }}
                          rowKey={(record) => record.id}
                          scroll={{ x: '100%' }}
                          className="mb10"
                        />
                        <p className={styles.label}>Ngày uống:</p>
                        <p className={styles.label}>
                          {Helper.getDateRank(fromDate, toDate, variables.DATE_FORMAT.DATE_MONTH)}
                        </p>
                        <hr />
                        {Helper.isJSON(files) && (
                          <div>
                            <label className={styles.label}>Hình ảnh:</label>
                            <div className="d-flex">
                              <Image.PreviewGroup>
                                {isArray(JSON.parse(files)) &&
                                  JSON.parse(files).map((item, index) => (
                                    <div key={index} className={styles['group-image']}>
                                      <Image
                                        key={index}
                                        width={85}
                                        src={`${API_UPLOAD}${item}`}
                                        fallback="/default-upload.png"
                                      />
                                    </div>
                                  ))}
                              </Image.PreviewGroup>
                            </div>
                          </div>
                        )}
                      </Collapse.Panel>
                    ),
                  )}
                </Collapse>
              </>
            )}
            {search.status === variablesModules.STATUS.DRINK && (
              <>
                {objects?.medicines?.map(({ id, files, name, medicineTimes }) => (
                  <div key={id}>
                    <h3 className={styles.title}>
                      UỐNG THUỐC {head(medicineTimes)?.medicineTimeType?.description?.toUpperCase()}
                    </h3>
                    <div className={styles.list}>
                      <div className={styles.item}>
                        <div className={styles['image-container']}>
                          {Helper.isJSON(files) && (
                            <div>
                              <Image.PreviewGroup>
                                {isArray(JSON.parse(files)) &&
                                  JSON.parse(files)?.map((item, index) => (
                                    <div key={index} className={styles['group-image']}>
                                      <Image
                                        key={index}
                                        width={85}
                                        src={`${API_UPLOAD}${item}`}
                                        fallback="/default-upload.png"
                                      />
                                    </div>
                                  ))}
                              </Image.PreviewGroup>
                            </div>
                          )}
                          <div className="pl10">
                            <p className={styles.label}>Tên thuốc</p>
                            <p className={styles.norm}>{name}</p>
                          </div>
                        </div>
                        <div>
                          <p className={styles.label}>Nội dung</p>
                          <p className={styles.norm}>{head(medicineTimes)?.note}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </Scrollbars>

        <div
          className={classnames(
            styles['modal-footer'],
            'd-flex justify-content-center align-items-center',
          )}
        >
          <Button
            color="success"
            size="large"
            permission="YTE"
            onClick={reminder}
            loading={loading['overView/REMINDER']}
          >
            Nhắc nhở
          </Button>
        </div>
      </Modal>
      <div className={classnames(styles['block-category'])}>
        <div className={styles['body-tab']}>
          <div className={styles['header-tab']}>
            <div>
              <img src="/images/home/balloons.svg" alt="notification" className={styles.icon} />
              <span
                className={classnames('font-weight-bold', 'ml10', 'font-size-14', 'text-uppercase')}
              >
                Y tế
              </span>
            </div>
            <p className={classnames('mb0', 'font-size-14')}>12</p>
          </div>
          <Tabs onChange={changeTab} activeKey={search?.status}>
            {variablesModules.MEDICAL.map(({ id, name }) => (
              <TabPane tab={name} key={id} />
            ))}
          </Tabs>
          {search?.status === variablesModules.STATUS.RECEIVED && (
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
              <Table
                bordered
                columns={header()}
                dataSource={medicals}
                pagination={false}
                loading={loading['overView/GET_DATA_MEDICAL']}
                className="table-attendances"
                childrenColumnName="noColumn"
                params={{
                  header: header(),
                  type: 'table',
                }}
                isEmpty
                rowKey={(record) => record?.class?.id || record.id}
                scroll={{ x: '100%' }}
              />
            </Scrollbars>
          )}
          {search?.status === variablesModules.STATUS.DRINK && (
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
              <ScrollContainer>
                <div className={styles['tab-container']}>
                  {configs.map((item) => (
                    <div
                      className={classnames(styles['tab-item'], {
                        [styles.active]: item.name === type,
                      })}
                      key={item.id}
                      role="presentation"
                      onClick={() => changeType(item)}
                    >
                      <span>{item.description}</span>
                    </div>
                  ))}
                </div>
              </ScrollContainer>
              <Table
                bordered
                columns={headerDrink()}
                dataSource={covertByType(medicals) || []}
                pagination={false}
                loading={loading['overView/GET_DATA_MEDICAL_TIME']}
                className="table-attendances"
                childrenColumnName="noColumn"
                params={{
                  header: headerDrink(),
                  type: 'table',
                }}
                isEmpty
                rowKey={(record) => record?.class?.id || record.id}
                scroll={{ x: '100%' }}
              />
            </Scrollbars>
          )}
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
