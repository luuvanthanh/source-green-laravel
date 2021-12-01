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
                title: 'Ngày sinh',
                key: 'statusParent',
                width: 120,
                className: 'min-width-100',
                dataIndex: 'birth_day',
            },
            {
                title: 'Tuổi hiện tại',
                key: 'name',
                width: 120,
                className: 'min-width-100',
                dataIndex: 'age',
            },
            {
                title: 'Thời gian đăng ký',
                key: 'name',
                width: 150,
                className: 'min-width-100',
                dataIndex: 'time',
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
                                                <label className={stylesModule['form-title']}>Họ và tên học sinh</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                Nguyễn Minh Anh
                                            </Text>
                                        </div>
                                        <div className="col-lg-4 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Ngày sinh</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                15/12/2020
                                            </Text>
                                        </div>
                                        <div className="col-lg-4 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Tuổi hiện tại</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                20 (tháng tuổi)
                                            </Text>
                                        </div>


                                        <div className="col-lg-4 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Họ và tên cha</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                Nguyễn Văn Phước
                                            </Text>
                                        </div>
                                        <div className="col-lg-4 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Số điện thoại</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                0944567891
                                            </Text>
                                        </div>
                                        <div className="col-lg-4 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Email</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                phuocnv@gmail.com
                                            </Text>
                                        </div>

                                        <div className="col-lg-4 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Họ và tên mẹ</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                Nguyễn Minh Anh
                                            </Text>
                                        </div>
                                        <div className="col-lg-4 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Số điện thoại</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                Huỳnh Thị Hoa
                                            </Text>
                                        </div>
                                        <div className="col-lg-4 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Email</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                0944567891
                                            </Text>
                                        </div>

                                        <div className="col-lg-12 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Họ và tên học sinh</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                hoaht@gmail.com
                                            </Text>
                                        </div>
                                        <div className="col-lg-12 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Thời gian đăng ký nhập học</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                31/05/2021
                                            </Text>
                                        </div>
                                        <div className="col-lg-12 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Mong muốn của phụ huynh</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                Con tôi hay biếng ăn, chỉ cần giúp bé ăn uống phát triển thể chất đầy đủ
                                            </Text>
                                        </div>
                                        <div className="col-lg-12" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Lưu ý trẻ</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                Bé thích ăn kẹo
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
            <div className="card ">
                <div className={stylesModule['wrapper-admission']}>
                    <h3 className={stylesModule.title}>Danh sách đăng ký</h3>
                    <p className={stylesModule.description}>Chưa có thông tin đăng ký nhập học</p>
                </div>
            </div>
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
