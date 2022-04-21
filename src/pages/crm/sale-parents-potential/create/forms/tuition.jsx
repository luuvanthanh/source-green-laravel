import { memo, useRef, useEffect, useState } from 'react';
import { Form, Modal, Table } from 'antd';
import { useSelector } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Text from '@/components/CommonComponent/Text';
import { variables } from '@/utils/variables';
import Button from '@/components/CommonComponent/Button';
import Heading from '@/components/CommonComponent/Heading';
import styles from '@/assets/styles/Common/common.scss';
import { Helper } from '@/utils';
import HelperModules from '../../utils/Helper';
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

    const headerModal = () => {
        const columns = [
            {
                title: 'Loại phí',
                key: 'fee',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record?.fee?.name}</Text>,
            },
            {
                title: 'Hình thức',
                key: 'paymentForm',
                className: 'min-width-250',
                width: 250,
                render: (record) => <Text size="normal">{record?.paymentForm?.name}</Text>,
            },
            {
                title: 'Tiền dự kiến (đ)',
                key: 'money',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record?.expected_money  === 0 ? '0 đ' : Helper.getPrice(record?.expected_money)}</Text>,
            },
            {
                title: 'Tiền giảm (đ)',
                key: 'moneyDown',
                className: 'min-width-150',
                width: 150,
                render: () => <Text size="normal">{Helper.getPrice('0')}</Text>,
            },
            {
                title: 'Tiền đóng (đ)',
                key: 'name',
                className: 'min-width-150',
                width: 150,
                render: (record) => <Text size="normal">{record?.expected_money  === 0 ? '0 đ' : Helper.getPrice(record?.expected_money)}</Text>,
            },
        ];
        return columns;
    };

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
                title: 'Tuổi hiện tại',
                key: 'age_month',
                width: 120,
                className: 'min-width-120',
                render: (record) => <Text size="normal">{record?.age_month}</Text>,
            },
            {
                title: 'Năm học',
                key: 'schoolYear',
                width: 120,
                className: 'min-width-100',
                render: (record) => <Text size="normal">
                    {record?.admissionRegister[0]?.studentByChargeNow?.chargeStudent[0]?.schoolYear?.year_from}
                    -
                    {record?.admissionRegister[0]?.studentByChargeNow?.chargeStudent[0]?.schoolYear?.year_to}
                </Text>,
            },
            {
                title: 'Lớp học dự kiến',
                key: 'classType',
                width: 150,
                className: 'min-width-100',
                render: (record) => <Text size="normal"> {record?.admissionRegister[0]?.studentByChargeNow?.chargeStudent[0]?.classType?.name}</Text>,
            },
            {
                title: 'Số tiền phải đóng',
                key: 'total_money',
                width: 150,
                className: 'min-width-100',
                render: (record) => <Text size="normal"> {record?.admissionRegister[0]?.studentByChargeNow?.chargeStudent[0]?.total_money}</Text>,
            },
            {
                title: 'Tình trạng',
                key: 'status',
                width: 150,
                className: 'min-width-100',
                render: (record) => <Text size="normal"> {HelperModules.statusTuition(record?.admissionRegister[0]?.studentByChargeNow?.chargeStudent[0]?.status)}</Text>,
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
                            title="Thông tin  học phí"
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
                                        <div className="col-lg-3" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Họ và tên học sinh</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {dataDetails?.full_name}
                                            </Text>
                                        </div>
                                        <div className="col-lg-3" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Năm học</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {dataDetails?.admissionRegister[0]?.studentByChargeNow?.chargeStudent[0]?.schoolYear?.year_from}
                                                -
                                                {dataDetails?.admissionRegister[0]?.studentByChargeNow?.chargeStudent[0]?.schoolYear?.year_to}
                                            </Text>
                                        </div>
                                        <div className="col-lg-3" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Ngày sinh</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {Helper.getDate(dataDetails?.birth_date, variables.DATE_FORMAT.DATE)}
                                            </Text>
                                        </div>
                                        <div className="col-lg-3" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Tuổi hiện tại</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {dataDetails?.age_month} (tháng tuổi)
                                            </Text>
                                        </div>
                                        <div className="col-lg-3" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Ngày nhập học</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {Helper.getDate(dataDetails?.admissionRegister[0]?.date_register, variables.DATE_FORMAT.DATE)}
                                            </Text>
                                        </div>
                                        <div className="col-lg-3" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Lớp học dự kiến</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {dataDetails?.admissionRegister[0]?.studentByChargeNow?.chargeStudent[0]?.classType?.name}
                                            </Text>
                                        </div>
                                        <div className="col-lg-2" >
                                            <div className="ant-col">
                                                <label className={stylesModule['form-title']}>Trạng thái</label>
                                            </div>
                                            <Text size="normal" className={stylesModule['form-description']}>
                                                {HelperModules.statusTuition(dataDetails?.admissionRegister[0]?.studentByChargeNow?.chargeStudent[0]?.status)}
                                            </Text>
                                        </div>
                                        <div className="col-lg-12 border-top pt15" >
                                            <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                                Chi tiết loại phí
                                            </Heading>
                                        </div>
                                        <div className="col-lg-12 pb20" >
                                            <div className={stylesModule['wrapper-table']}>
                                                <Table
                                                    columns={headerModal()}
                                                    dataSource={dataDetails?.admissionRegister[0]?.studentByChargeNow?.chargeStudent[0]?.tuition}
                                                    pagination={false}
                                                    className="table-edit"
                                                    isEmpty
                                                    params={{
                                                        header: headerModal(),
                                                        type: 'table',
                                                    }}
                                                    bordered
                                                    rowKey={(record) => record.id}
                                                    scroll={{ x: '100%' }}
                                                    summary={(pageData) => {
                                                        let totalBorrow = 0;
                                                        pageData.forEach(({ expected_money }) => {
                                                          totalBorrow += expected_money;
                                                        });
                                                        return (
                                                          <>
                                                            <Table.Summary.Row>
                                                              <Table.Summary.Cell colSpan={2}>
                                                                <Text size="normal" style={{ fontWeight: 'bold' }}>
                                                                  Tổng tiền
                                                                </Text>
                                                              </Table.Summary.Cell>
                                                              <Table.Summary.Cell>
                                                                <Text size="normal" style={{ fontWeight: 'bold' }}>
                                                                  {totalBorrow === 0 ? '0 đ' : Helper.getPrice(totalBorrow)}
                                                                </Text>
                                                              </Table.Summary.Cell>
                                                              <Table.Summary.Cell>
                                                                <Text size="normal" style={{ fontWeight: 'bold' }}>
                                                                  {Helper.getPrice("0")}
                                                                </Text>
                                                              </Table.Summary.Cell>
                                                              <Table.Summary.Cell>
                                                                <Text size="normal" style={{ fontWeight: 'bold' }}>
                                                                {totalBorrow === 0 ? '0 đ' : Helper.getPrice(totalBorrow)}
                                                                </Text>
                                                              </Table.Summary.Cell>
                                                            </Table.Summary.Row>
                                                          </>
                                                        );
                                                      }}
                                                />
                                            </div>
                                        </div>
                                    </div>


                                </Form>
                            </Pane>
                        </Modal>
                    </div >
                ),
            },
        ];
        return columns;
    };

    return (
        <>
            {
                details?.customerLead?.studentInfo?.filter(i => i?.admissionRegister[0]?.studentByChargeNow?.chargeStudent[0]?.id).length > 0 ?

                    <div className="card p20">

                        <Heading type="form-title" style={{ marginBottom: 20 }}>
                            Thông tin học phí học sinh
                        </Heading>
                        <div className={stylesModule['wrapper-table']}>
                            <Table
                                columns={header()}
                                dataSource={details?.customerLead?.studentInfo?.filter(i => i?.admissionRegister[0]?.studentByChargeNow?.chargeStudent[0]?.id)}
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
                            <h3 className={stylesModule.title}>Thông tin học phí học sinh</h3>
                            <p className={stylesModule.description}>Chưa có thông tin tính phí cho trẻ</p>
                        </div>
                    </div>
            }
        </>
    );
});

export default General;
