import { memo, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Tabs, Modal, Image, Collapse } from 'antd';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';

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
  const [{ medicals }, loading] = useSelector(({ loading: { effects }, overView }) => [
    overView,
    effects,
  ]);

  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.SIZEMAX,
    status: variables.STATUS.PENDING,
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

  const changeTab = (tab) => {
    setSearch((prev) => ({
      ...prev,
      status: tab,
    }));
  };

  const onShowInfo = () => {
    setVisible(true);
  };

  const headerMedical = () => {
    const columns = [
      {
        title: 'SÁNG',
        key: 'class',
        render: () => 'Trước ăn sáng',
      },
      {
        key: 'parents',
        className: 'min-width-100',
        width: 100,
        render: () => '5 ml',
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
      render: () => 'Preschool 1',
    },
    {
      title: 'Học sinh',
      key: 'student',
      className: 'min-width-150',
      width: 150,
      align: 'center',
      render: (record) => (
        <div className={styles['list-avatar']}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className={styles['item-avatar']} key={item} role="presentation">
              <AvatarTable
                fileImage={Helper.getPathAvatarJson(
                  record?.studentMaster?.farther?.fileImage ||
                    record?.studentMaster?.mother?.fileImage,
                )}
                isActive={item === 4 || item === 2}
              />
            </div>
          ))}
        </div>
      ),
    },
  ];

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
          <AvatarTable fullName="Nguyễn Thị A" description="Preschool 1" />
          {HelperModules.tagStatus('PENDING')}
        </div>
        <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
          <div className={styles['modal-content']}>
            <h3 className={styles.title}>Thông tin chung</h3>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className={styles.label}>Triệu chứng</p>
                <p className={styles.norm}>Ho</p>
              </div>
              <div>
                <p className={styles.label}>Nơi đặt thuốc</p>
                <p className={styles.norm}>Trong balo</p>
              </div>
            </div>
            <hr />
            <h3 className={styles.title}>Thông tin thuốc</h3>
            <Collapse
              defaultActiveKey={['1']}
              className={styles['collapse-container']}
              expandIconPosition="right"
            >
              <Collapse.Panel
                header={<div className={styles['container-header']}>CEELIN</div>}
                key="1"
              >
                <p className={styles.label}>Tên thuốc</p>
                <p className={styles.norm}>PROSPAN</p>
                <hr />
                <p className={styles.label}>Thời gian uống</p>
                <Table
                  columns={headerMedical()}
                  dataSource={[{ id: 1 }]}
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
                <p className={styles.label}>08/08 - 10/08</p>
                <hr />
                <div>
                  <label className={styles.label}>Hình ảnh:</label>
                  <div className="d-flex">
                    <Image.PreviewGroup>
                      {[1, 2, 3].map((item, index) => (
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
              </Collapse.Panel>
            </Collapse>
          </div>
        </Scrollbars>

        <div
          className={classnames(
            styles['modal-footer'],
            'd-flex justify-content-center align-items-center',
          )}
        >
          <Button color="success" size="large" permission="YTE">
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
            <p className={classnames('mb0', 'font-size-14')}>{medicals?.length || 0}</p>
          </div>
          <Tabs onChange={changeTab} activeKey={search?.tab}>
            {variablesModules.MEDICAL.map(({ id, name }) => (
              <TabPane tab={name} key={id} />
            ))}
          </Tabs>
          <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
            <Table
              bordered
              columns={header()}
              dataSource={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]}
              pagination={false}
              loading={loading['overView/GET_CLASS_ATTENDANCE_SUMMARY']}
              className="table-attendances"
              params={{
                header: header(),
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
