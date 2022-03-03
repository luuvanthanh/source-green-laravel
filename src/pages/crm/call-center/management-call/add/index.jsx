import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'umi';
import { Form, Modal } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get } from 'lodash';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Loading from '@/components/CommonComponent/Loading';
import Table from '@/components/CommonComponent/Table';
import { useDispatch, useSelector } from 'dva';
import Heading from '@/components/CommonComponent/Heading';
import Parents from '../parents';

function Index() {
  const [formRef] = Form.useForm();
  const dispatch = useDispatch();
  const { params } = useRouteMatch();
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [
    { error },
    loading,
    { menuLeftCRM },
  ] = useSelector(({ loading: { effects }, seasonalContractsAdd, menu }) => [
    seasonalContractsAdd,
    effects,
    menu,
  ]);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'seasonalContractsAdd/GET_DETAILS',
        payload: {
          id: params.id,
        },
      });
    }
  }, []);

  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'code',
        className: 'min-width-80',
        width: 80,
        render: (record) => get(record, 'code'),
      },
      {
        title: 'Họ và tên',
        key: 'name',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'name'),
      },
      {
        title: 'SĐT 1',
        key: 'callOne',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'callOne'),
      },
      {
        title: 'SĐT 2',
        key: 'callTwo',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'callTwo'),
      },
      {
        title: 'Phân loại PH',
        key: 'parents',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'parents'),
      },
      {
        title: 'Tình trạng PH Lead',
        key: 'leadStatus',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'leadStatus'),
      },
      {
        title: 'Tình trạng TN',
        key: 'potentialStatus',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'potentialStatus'),
      },
      {
        title: 'Lần đã gọi',
        key: 'number_calls',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'number_calls'),
      },
    ];
    return columns;
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {};

  const onFinish = () => {};

  return (
    <>
      <Breadcrumbs last="Tạo mới" menu={menuLeftCRM} />
      <Form className={styles['layout-form']} layout="vertical" form={formRef} onFinish={onFinish}>
        <div className={styles['content-form']}>
          <Loading
            isError={error.isError}
            params={{ error, type: 'container', goBack: '/quan-ly-nhan-su/hop-dong-thoi-vu' }}
          >
            <div className={classnames(styles['content-children'], 'mt0')}>
              <Heading type="form-title" className="mb15">
                Thông tin chung
              </Heading>
              <div className="row">
                <div className="col-lg-4">
                  <FormItem label="Ngày dự kiến gọi" name="dateCall" type={variables.DATE_PICKER} />
                </div>
                <div className="col-lg-4">
                  <FormItem label="Người gọi" name="userCall" type={variables.INPUT} disabled />
                </div>
                <div className="col-lg-4">
                  <FormItem label="Lần gọi" name="typeOfContractId" type={variables.SELECT} />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <FormItem label="Nội dung cuộc gọi" name="contentCall" type={variables.INPUT} />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <FormItem label="Nhắc trước" name="remind" type={variables.SELECT} />
                </div>
              </div>
            </div>

            <div className={classnames(styles['content-children'], 'mt15')}>
              <div className="d-flex justify-content-between align-items-center mb15">
                <Heading type="form-title">Phụ huynh</Heading>
                <Button color="success" icon="plus" className="ml-2" onClick={showModal}>
                  Thêm phụ huynh
                </Button>
                <Modal
                  title="Chọn phụ huynh"
                  className={styles['wrapper-modal-management-call']}
                  centered
                  visible={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  width={1300}
                  footer={[
                    <p
                      key="back"
                      role="presentation"
                      onClick={handleCancel}
                      className={styles['button-cancel-management-call']}
                    >
                      Hủy
                    </p>,
                    <Button htmlType="submit" color="success" type="primary" onClick={handleOk}>
                      Áp dụng
                    </Button>,
                  ]}
                >
                  <Parents />
                </Modal>
              </div>
              <Table
                columns={header()}
                // dataSource={data}
                pagination={false}
                className={classnames('mb15', styles['statistical-table'])}
                isEmpty
                params={{
                  header: header(),
                  type: 'table',
                }}
                bordered
                rowKey={(record) => record.id}
                scroll={{ x: '100%' }}
              />
            </div>

            <div className={classnames('d-flex', 'justify-content-between', 'mt-4')}>
              <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                Hủy
              </p>
              <Button
                color="success"
                htmlType="submit"
                loading={
                  loading['seasonalContractsAdd/ADD'] || loading['seasonalContractsAdd/UPDATE']
                }
              >
                Lưu
              </Button>
            </div>
          </Loading>
        </div>
      </Form>
    </>
  );
}

export default Index;
