import { memo, useRef, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { useSelector } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import styles from '@/assets/styles/Common/common.scss';
import stylesModule from '../../styles.module.scss';


const General = memo(() => {
    const formRef = useRef();
    const mounted = useRef(false);
    const {
        admission,
    } = useSelector(({ loading, crmSaleParentsPotentialAdd }) => ({
        loading,
        admission: crmSaleParentsPotentialAdd.admission,
    }));
    const [modal, setModal] = useState(false);

    const showModal = () => {
        setModal(true);
    };

    const handleOk = () => {
        setModal(false);
    };

    const handleCancel = () => {
        setModal(false);
    };

    useEffect(() => {
        mounted.current = true;
        return mounted.current;
    }, []);

    const header = () => {
        const columns = [
            {
                title: 'Họ và tên học sinh',
                key: 'day',
                className: 'min-width-200',
                width: 200,
                dataIndex: 'full_name',
            },
            {
                title: 'Ngày phỏng vấn',
                key: 'statusParent',
                width: 120,
                className: 'min-width-100',
                dataIndex: 'birth_day',
            },
            {
                title: 'Giờ phỏng vấn',
                key: 'name',
                width: 120,
                className: 'min-width-100',
                dataIndex: 'age',
            },
            {
                title: 'Giáo viên phỏng vấn',
                key: 'name',
                width: 150,
                className: 'min-width-100',
                dataIndex: 'full_name',
            },
            {
                title: 'Tình trạng',
                key: 'name',
                className: 'min-width-150',
                width: 150,
                dataIndex: 'status',
            },
            {
                title: 'Tác vụ',
                key: 'action',
                width: 80,
                className: 'max-width-80',
                fixed: 'right',
                render: () => (
                    <div className={styles['list-button']}>
                        <Button
                            color="success"
                            onClick={() => showModal()}
                        >
                            Chi tiết
                        </Button>
                        <Modal
                            title="Thông tin đăng ký"
                            className={stylesModule['wrapper-modal']}
                            visible={modal}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            width={960}
                            centered
                            footer={[
                                <div className={stylesModule['button-modal']}>
                                    <p
                                        key="back"
                                        role="presentation"
                                        className={stylesModule['button-delete']}
                                        onClick={() => handleCancel()}
                                    >
                                        Đóng
                                    </p>
                                </div>
                            ]}
                        >
                            <Pane className="pl10 pr10">
                                <Form
                                    layout="vertical"
                                    ref={formRef}
                                    initialValues={{ data: [{}] }}
                                    className={stylesModule['wrapper-form']}
                                >



                                    <div className="row ">

                                        <div className="col-lg-4 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Giáo viên phòng vấn trẻ</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                Nguyễn Minh Anh
                                            </Text>
                                        </div>
                                        <div className="col-lg-4 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Ngày phỏng vấn</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                15/12/2020
                                            </Text>
                                        </div>
                                        <div className="col-lg-4 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Giờ phỏng vấn</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                08:00
                                            </Text>
                                        </div>

                                        <div className="col-lg-12" >
                                            <h2 className={stylesModule['form-tes-title']}>
                                                KẾT QUẢ TEST ĐẦU VÀO
                                            </h2>
                                        </div>

                                        <div className="col-lg-12 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Nhận xét và kết luận của giáo viên</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                hoaht@gmail.com
                                            </Text>
                                        </div>
                                        <div className="col-lg-12" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Ý kiến của hiệu trưởng cơ sở</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                31/05/2021
                                            </Text>
                                        </div>
                                    </div>


                                </Form>
                            </Pane>
                        </Modal>
                    </div>
                ),
            },
        ];
        return columns;
    };
    return (
        <>
            <div className="card pl20 pr20">
                <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                    <Text color="dark">Danh sách đăng ký</Text>
                </div>
                <div className={stylesModule['wrapper-table']}>
                    <Table
                        columns={header()}
                        dataSource={admission}
                        pagination={false}
                        className="table-edit"
                        isEmpty
                        params={{
                            header: header(),
                            type: 'table',
                        }}
                        bordered={false}
                        rowKey={(record) => record.id}
                        scroll={{ x: '100%' }}
                    />
                </div>
            </div>
        </>
    );
});

export default General;
