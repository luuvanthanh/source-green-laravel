import { memo, useRef, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { useSelector } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import Heading from '@/components/CommonComponent/Heading';
import { Helper } from '@/utils';
import { variables } from '@/utils/variables';
import Button from '@/components/CommonComponent/Button';
import styles from '@/assets/styles/Common/common.scss';
import stylesModule from '../../styles.module.scss';

const General = memo(() => {
    const formRef = useRef();
    const mounted = useRef(false);
    const {
        details,
    } = useSelector(({ loading, crmSaleParentsPotentialAdd }) => ({
        loading,
        admission: crmSaleParentsPotentialAdd.admission,
        details: crmSaleParentsPotentialAdd.details,
    }));
    const [modal, setModal] = useState(false);
    const [dataDetails, setDataDetails] = useState(undefined);
    const showModal = (id) => {
        setModal(true);
        setDataDetails(details?.customerLead?.studentInfo?.find(i => i?.id === id));
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
                render: (record) => <Text size="normal">{record?.full_name}</Text>,
            },
            {
                title: 'Ngày sinh',
                key: 'statusParent',
                width: 120,
                className: 'min-width-100',
                render: (record) => Helper.getDate(record?.birth_date, variables.DATE_FORMAT.DATE),
            },
            {
                title: 'Tuổi hiện tại',
                key: 'name',
                width: 120,
                className: 'min-width-100',
                render: (record) => <Text size="normal">{record?.age_month}</Text>,
            },
            {
                title: 'Thời gian đăng ký',
                key: 'name',
                width: 150,
                className: 'min-width-100',
                render: (record) => Helper.getDate(record?.admissionRegister[0]?.date_register, variables.DATE_FORMAT.DATE),
            },
            {
                title: 'Tác vụ',
                key: 'action',
                width: 100,
                className: 'max-width-100',
                fixed: 'right',
                render: (record) => (
                    <div className={styles['list-button']}>
                        <Button
                            color="success"
                            onClick={() => showModal(record?.id)}
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
                                <div className={stylesModule['button-modal']}  key="back">
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
                                                {dataDetails?.full_name}
                                            </Text>
                                        </div>
                                        <div className="col-lg-4 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Ngày sinh</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {Helper.getDate(dataDetails?.birth_date, variables.DATE_FORMAT.DATE)}
                                            </Text>
                                        </div>
                                        <div className="col-lg-4 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Tuổi hiện tại</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {dataDetails?.age_month} (tháng tuổi)
                                            </Text>
                                        </div>

                                        {
                                            dataDetails?.admissionRegister[0]?.parentInfo?.map((item) =>
                                                <>
                                                    <div className="col-lg-4 border-bottom">
                                                        <div className="ant-col">
                                                            <label className={stylesModule['form-title']}>Họ và tên {item?.sex === 'MALE' ? 'Cha' : 'Mẹ'}</label>
                                                        </div>
                                                        <Text size="normal" className={stylesModule['form-description']}>
                                                            {item.full_name}
                                                        </Text>
                                                    </div>
                                                    <div className="col-lg-4 border-bottom" >
                                                        <div className="ant-col">
                                                            <label className={stylesModule['form-title']}>Số điện thoại</label>
                                                        </div>
                                                        <Text size="normal" className={stylesModule['form-description']}>
                                                            {item.phone}
                                                        </Text>
                                                    </div>
                                                    <div className="col-lg-4 border-bottom" >
                                                        <div className="ant-col">
                                                            <label className={stylesModule['form-title']}>Email</label>
                                                        </div>
                                                        <Text size="normal" className={stylesModule['form-description']}>
                                                            {item.email}
                                                        </Text>
                                                    </div>

                                                </>
                                            )
                                        }

                                        <div className="col-lg-12 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Thời gian đăng ký nhập học</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {Helper.getDate(dataDetails?.admissionRegister[0]?.date_register, variables.DATE_FORMAT.DATE)}
                                            </Text>
                                        </div>
                                        <div className="col-lg-12 border-bottom" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Mong muốn của phụ huynh</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {dataDetails?.admissionRegister[0]?.parent_wish}
                                            </Text>
                                        </div>
                                        <div className="col-lg-12" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Lưu ý trẻ</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {dataDetails?.admissionRegister[0]?.children_note}
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
            {
                details?.customerLead?.studentInfo?.length > 0 ?

                    <div className="card p20">
                        <Heading type="form-title" style={{ marginBottom: 20 }}>
                            Danh sách đăng ký
                        </Heading>
                        <div className={stylesModule['wrapper-table']}>
                            <Table
                                columns={header()}
                                dataSource={details?.customerLead?.studentInfo}
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
                    :
                    <div className="card ">
                        <div className={stylesModule['wrapper-admission']}>
                            <h3 className={stylesModule.title}>Danh sách đăng ký</h3>
                            <p className={stylesModule.description}>Chưa có thông tin đăng ký nhập học</p>
                        </div>
                    </div>
            }
        </>
    );
});

export default General;
