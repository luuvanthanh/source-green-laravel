import { memo, useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import Text from '@/components/CommonComponent/Text';
import { variables, Helper } from '@/utils';
import { head } from 'lodash';
import Table from '@/components/CommonComponent/Table';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import stylesModule from './styles.module.scss';

const General = memo(() => {
  const dispatch = useDispatch();
  const params = useParams();
  const {
    data,
    loading: { effects },
    menuData,
    dataDetails
  } = useSelector(({ loading, classesList, menu }) => ({
    loading,
    data: classesList.data,
    dataDetails: classesList.dataDetails,
    menuData: menu.menuLeftObjectProfiles,
  }));

  const [isModalVisible, setIsModalVisible] = useState(false);

  const loading = effects[`classesList/GET_DETAILS`];

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'classesList/GET_DATA',
        payload: params,
      });
    }
  }, [params.id]);

  const onModal = (record) => {
    setIsModalVisible(true);
    dispatch({
      type: 'classesList/GET_DATA_DETAILS',
      payload: { classId: record.class?.id, schoolYearId: record.schoolYear?.id },
    });
  };

  const header = () => {
    const columns = [
      {
        title: 'Năm học',
        key: 'index',
        width: 80,
        render: (record) => <>{record?.schoolYear?.yearFrom} - {record?.schoolYear?.yearTo}</>,
      },
      {
        title: 'Tên lớp',
        key: 'name',
        width: 80,
        render: (record) => record?.class?.name,
      },
      {
        title: 'Số lượng học sinh',
        key: 'totalOfJoinedStudents',
        width: 80,
        render: (record) => record?.totalOfJoinedStudents,
      },
      {
        key: 'btn',
        width: 80,
        render: (record) => <div onClick={() => onModal(record)} role="presentation" className={stylesModule['wrapper-btn']}> Xem danh sách học sinh</div>,
      },
    ];
    return columns;
  };

  const headerDetail = () => {
    const columns = [
      {
        title: 'STT',
        key: 'index',
        className: 'min-width-100',
        width: 100,
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Tên học sinh',
        key: 'fullName',
        width: 250,
        className: 'min-width-250',
        render: (record) => record?.fullName,
      },
      {
        title: 'Ngày sinh',
        key: 'dayOfBirth',
        width: 250,
        className: 'min-width-250',
        render: (record) => <>{Helper.getDate(record.dayOfBirth, variables.DATE_FORMAT.DATE)}</>
      },
    ];
    return columns;
  };

  const handleOk = () => {

  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Breadcrumbs last="Danh sách lớp" menu={menuData} />
      <div className={styles['content-form']}>
        <div className={classnames(styles['content-children'], 'mt10')}>
          {
            data?.length > 0 && (
              <Text color="dark" size="large-medium">
                Danh sách năm học lớp {head(data)?.class?.name}
              </Text>
            )
          }
          <Table
            columns={header()}
            dataSource={data}
            pagination={false}
            className="table-normal pt20 pb20"
            loading={loading}
            params={{
              header: header(),
              type: 'table',
            }}
            bordered
            rowKey={(record) => record.id}
            scroll={{ x: '100%' }}
          />
        </div>
      </div>
      <Modal
        title={`Năm học ${dataDetails?.schoolYear?.yearFrom} - ${dataDetails?.schoolYear?.yearTo}`}
        centered
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
        footer={[
        ]}
      >
        <>
          <div>{dataDetails?.students?.length} Học sinh</div>
          <Table
            columns={headerDetail()}
            dataSource={dataDetails?.students}
            pagination={false}
            className="table-normal pt20 pb20"
            loading={loading}
            params={{
              header: headerDetail(),
              type: 'table',
            }}
            bordered
            rowKey={(record) => record.id}
            scroll={{ x: '100%' }}
          />
        </>
      </Modal>
    </>
  );
});

export default General;
