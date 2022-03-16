import { memo, useRef, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { useSelector } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import { Helper } from '@/utils';
import { variables } from '@/utils/variables';
import Button from '@/components/CommonComponent/Button';
import Heading from '@/components/CommonComponent/Heading';
import styles from '@/assets/styles/Common/common.scss';
import stylesModule from '../../styles.module.scss';


const General = memo(() => {
    const formRef = useRef();
    const mounted = useRef(false);
    const {
        details,
    } = useSelector(({ loading, crmSaleParentsPotentialAdd }) => ({
        loading,
        details: crmSaleParentsPotentialAdd.details,
    }));
    const [modal, setModal] = useState(false);
    const [dataDetails, setDataDetails] = useState(undefined);

    const showModal = (id) => {
        setModal(true);
        setDataDetails(details?.customerLead?.studentInfo?.find(i => i?.id === id));
    };

    const formCriteria = (item) => {
        const a = _.groupBy(item?.testInputDetailChildren, 'childEvaluateDetail.id');
        const entries = Object.entries(a);
        return (
            <>
                {
                    entries?.map((i, index) =>
                        <div key={index}>
                            <Pane className="col-lg-12 pt20 pb20">
                                <h3 className={stylesModule['container-title-criteria']}>
                                    Tiêu chí : {i?.[1]?.[0]?.childEvaluateDetail?.name_criteria}
                                </h3>
                                <h3 className={stylesModule['container-title']}>Hình thức tiếp cận</h3>
                            </Pane>
                            {
                                i?.[1]?.map((k, item) =>
                                    <Pane className="col-lg-12" key={item}>
                                        <Pane className={stylesModule['wrapper-title']}>
                                            <div className={stylesModule.icon} />
                                            <h3 className={stylesModule.title}>{k?.childEvaluateDetailChildren?.content}</h3>
                                        </Pane>
                                    </Pane>
                                )
                            }
                        </div>
                    )
                }
            </>
        );
    };

    const formLevel = (item) => {
        if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '0') {
            return (
                <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#D0E6FF' }}>
                    <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                    <h3 className={stylesModule.tilteLogo}>Cấp độ 0-6 Tháng</h3>
                </Pane>
            );
        }
        if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '1') {
            return (
                <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#D1D0FF' }}>
                    <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                    <h3 className={stylesModule.tilteLogo}>Cấp độ 6-9 Tháng</h3>
                </Pane>
            );
        }
        if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '2') {
            return (
                <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#FFD6B9' }}>
                    <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                    <h3 className={stylesModule.tilteLogo}>Cấp độ 9-12 Tháng</h3>
                </Pane>
            );
        }
        if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '3') {
            return (
                <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#E2FFD0' }}>
                    <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                    <h3 className={stylesModule.tilteLogo}>Cấp độ 12-18 Tháng</h3>
                </Pane>
            );
        }
        if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '4') {
            return (
                <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#D0FCFF' }}>
                    <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                    <h3 className={stylesModule.tilteLogo}>Cấp độ 18-24 Tháng</h3>
                </Pane>
            );
        }
        if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '5') {
            return (
                <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#F0D0FF' }}>
                    <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                    <h3 className={stylesModule.tilteLogo}>Cấp độ 24-30 Tháng</h3>
                </Pane>
            );
        }
        if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '6') {
            return (
                <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#FFE5B7' }}>
                    <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                    <h3 className={stylesModule.tilteLogo}>Cấp độ 30-36 Tháng</h3>
                </Pane>
            );
        }
        if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '7') {
            return (
                <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#C3FFD8' }}>
                    <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                    <h3 className={stylesModule.tilteLogo}>Cấp độ 36-50 Tháng</h3>
                </Pane>
            );
        }
        if (item?.testInputDetailChildren[0]?.childEvaluate?.age === '8') {
            return (
                <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#FFC4C4' }}>
                    <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                    <h3 className={stylesModule.tilteLogo}>Cấp độ 50-60 Tháng</h3>
                </Pane>
            );
        }
        return "";
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
                title: 'Ngày phỏng vấn',
                key: 'statusParent',
                width: 150,
                className: 'min-width-150',
                render: (record) =>  Helper.getDate(record?.admissionRegister[0]?.testInput?.date_interview, variables.DATE_FORMAT.DATE),
            },
            {
                title: 'Giờ phỏng vấn',
                key: 'name',
                width: 150,
                className: 'min-width-150',
                render: (record) => <Text size="normal">{record?.admissionRegister[0]?.testInput?.time_interview}</Text>,
            },
            {
                title: 'Giáo viên phỏng vấn',
                key: 'name',
                width: 170,
                className: 'min-width-170',
                render: (record) => <Text size="normal">{record?.admissionRegister[0]?.testInput?.employee?.full_name}</Text>,
            },
            {
                title: 'Tình trạng',
                key: 'name',
                className: 'min-width-100',
                width: 100,
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
                            title="Thông tin test đầu vào"
                            className={stylesModule['wrapper-modal']}
                            visible={modal}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            width={960}
                            centered
                            footer={[
                                <div className={stylesModule['button-modal']} key="back">
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
                                        <div className="col-lg-4" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Giáo viên phòng vấn trẻ</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {dataDetails?.admissionRegister[0]?.testInput?.employee?.full_name}
                                            </Text>
                                        </div>
                                        <div className="col-lg-4" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Ngày phỏng vấn</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {Helper.getDate(dataDetails?.admissionRegister[0]?.testInput?.date_interview, variables.DATE_FORMAT.DATE)}
                                            </Text>
                                        </div>
                                        <div className="col-lg-4" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Giờ phỏng vấn</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {dataDetails?.admissionRegister[0]?.testInput?.time_interview}
                                            </Text>
                                        </div>

                                        {
                                            dataDetails?.admissionRegister[0]?.testInput?.testInputDetail.length > 0 ?
                                                <Pane className={stylesModule['wrapper-testInput']}>
                                                    <Pane className={stylesModule['wrapper-card-main']}>
                                                        {
                                                            dataDetails?.admissionRegister[0]?.testInput?.testInputDetail?.map((item, index) =>
                                                                <Pane className="row border-top" key={index}>
                                                                    <Pane className={stylesModule['wrapper-container']}>
                                                                        <Pane className="col-lg-12" >
                                                                            <Pane className={stylesModule['wrapper-contentTop']}>
                                                                                <img src="/images/mh.svg" alt="group" className={stylesModule.img} />
                                                                                <Pane className="pl15">
                                                                                    <h3 className={stylesModule.title}>
                                                                                        {item?.categorySkill?.name}
                                                                                    </h3>
                                                                                </Pane>
                                                                                {formLevel(item)}
                                                                            </Pane>
                                                                        </Pane>
                                                                        {formCriteria(item)}

                                                                    </Pane>
                                                                </Pane>
                                                            )
                                                        }
                                                    </Pane>
                                                </Pane>
                                                :
                                                ""
                                        }
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
                details?.customerLead?.studentInfo.filter(i => i?.admissionRegister[0]?.testInput?.id).length > 0 ?
                    <div className="card p20">
                        <Heading type="form-title" style={{ marginBottom: 20 }}>
                            Danh sách test đầu vào
                        </Heading>
                        <div className={stylesModule['wrapper-table']}>
                            <Table
                                columns={header()}
                                dataSource={details?.customerLead?.studentInfo.filter(i => i?.admissionRegister[0]?.testInput?.id)}
                                pagination={false}
                                className="table-normal"
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
                            <h3 className={stylesModule.title}>Danh sách test đầu vào</h3>
                            <p className={stylesModule.description}>Chưa có thông tin đăng ký test đầu vào cho trẻ</p>
                        </div>
                    </div>
            }
        </>
    );
});

export default General;
