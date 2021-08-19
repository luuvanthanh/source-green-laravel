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
import { v4 as uuidv4 } from 'uuid';
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
  const [objects, setObjects] = useState({});
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

  const onShowInfo = (record) => {
    setVisible(true);
    setObjects(record);
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
          {record?.children?.map((item, index) => (
            <div
              className={styles['item-avatar']}
              key={index}
              role="presentation"
              onClick={() => onShowInfo({ ...item, ...record })}
            >
              <AvatarTable srcLocal fileImage={item.img} isActive={item.isActive} />
            </div>
          ))}
        </div>
      ),
    },
  ];

  const DATA_SOURCE = [
    {
      class: 'Preschool (Demo)',
      id: uuidv4(),
      children: [
        {
          name: 'Thạch Tuấn Khang',
          img: '/images/medicals/thach-tuan-khang.png',
          id: uuidv4(),
          isActive: true,
        },
        {
          name: 'Nguyển Thị Anh Thư (Test)',
          img: '/images/medicals/nguyen-thi-anh-thu-test.png',
          id: uuidv4(),
          isActive: true,
        },
        {
          name: 'Lâm Thụy Minh Khuê',
          img: '/images/medicals/lam-thi-minh-khue.png',
          id: uuidv4(),
          isActive: true,
        },
        {
          name: 'Nguyễn Khôi Khải Vĩ',
          img: '/images/medicals/nguyen-khoi-khai-vi.png',
          id: uuidv4(),
          isActive: true,
        },
        {
          name: 'Ngô Cát Tú Nghi',
          img: '/images/medicals/ngo-cat-tu-nghi.png',
          id: uuidv4(),
          isActive: true,
        },
        {
          name: 'Tô Phan Minh Thiện',
          img: '/images/medicals/to-phan-minh-thien.png',
          id: uuidv4(),
        },
      ],
    },
    {
      class: 'Preschool 2',
      id: uuidv4(),
      children: [
        {
          name: 'Chen Rui An',
          img: '/images/medicals/chen-rui-an.png',
          id: uuidv4(),
          isActive: true,
        },
        {
          name: 'Mai Tuệ Lâm',
          img: '/images/medicals/mai-tue-lam.png',
          id: uuidv4(),
          isActive: true,
        },
        {
          name: 'Võ Minh Khôi',
          img: '/images/medicals/vo-minh-khoi.png',
          id: uuidv4(),
        },
        {
          name: 'Nguyễn Trần Khả Doanh',
          img: '/images/medicals/nguyen-tran-kha-doanh.png',
          id: uuidv4(),
        },
        {
          name: 'Đặng Ánh Dương',
          img: '/images/medicals/dang-anh-duong.png',
          id: uuidv4(),
          isActive: true,
        },
      ],
    },
    {
      class: 'Nursery 1',
      id: uuidv4(),
      children: [
        {
          name: 'Nguyễn Văn Nhật Minh',
          img: '/images/medicals/nguyen-van-nhat-minh.png',
          id: uuidv4(),
          isActive: true,
        },
        {
          name: 'Phương Bùi Cherie',
          img: '/images/medicals/phuong-bui-cheri.png',
          id: uuidv4(),
        },
        {
          name: 'Mai Ngọc Cát Tường',
          img: '/images/medicals/mai-ngoc-cat-tuong.png',
          id: uuidv4(),
        },
        {
          name: 'Vũ Trần Bảo Quốc',
          img: '/images/medicals/vu-tran-quoc-bao.png',
          id: uuidv4(),
        },
        {
          name: 'Nguyễn Hà Anh',
          img: '/images/medicals/nguyen-ha-anh.png',
          id: uuidv4(),
          isActive: true,
        },
      ],
    },
    {
      class: 'Nursery 2',
      id: uuidv4(),
      children: [
        {
          name: 'Đinh Nguyễn Khả Hân',
          img: '/images/medicals/dinh-nguyen-kha-han.png',
          id: uuidv4(),
          isActive: true,
        },
        {
          name: 'Nguyễn Duy Khang',
          img: '/images/medicals/nguyen-duy-khang.png',
          id: uuidv4(),
        },
        {
          name: 'Trương Đắc Gia Hưng',
          img: '/images/medicals/truong-dac-gia-hung.png',
          id: uuidv4(),
        },
        {
          name: 'Trần Lê Thảo Nguyên',
          img: '/images/medicals/tran-le-thao-nguyen.png',
          id: uuidv4(),
        },
        {
          name: 'Nguyễn Hoàng Minh Đăng',
          img: '/images/medicals/nguyen-hoang-minh-dang.png',
          id: uuidv4(),
          isActive: true,
        },
      ],
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
          <AvatarTable
            srcLocal
            fullName={objects.name}
            fileImage={objects.img}
            description={objects.class}
          />
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
                            src="/images/medicals/image_01.png"
                            fallback="/default-upload.png"
                          />
                        </div>
                      ))}
                    </Image.PreviewGroup>
                  </div>
                </div>
              </Collapse.Panel>
              <Collapse.Panel
                header={<div className={styles['container-header']}>CEELIN</div>}
                key="2"
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
                            src="/images/medicals/image_01.png"
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
            <p className={classnames('mb0', 'font-size-14')}>12</p>
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
              dataSource={DATA_SOURCE}
              pagination={false}
              loading={loading['overView/GET_CLASS_ATTENDANCE_SUMMARY']}
              className="table-attendances"
              childrenColumnName="noColumn"
              params={{
                header: header(),
                type: 'table',
              }}
              isEmpty
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
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
