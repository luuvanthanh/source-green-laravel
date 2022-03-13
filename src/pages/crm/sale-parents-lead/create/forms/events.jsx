import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal, Input } from 'antd';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import styles from '@/assets/styles/Common/common.scss';
import moment from 'moment';
import Pane from '@/components/CommonComponent/Pane';
import Text from '@/components/CommonComponent/Text';
import { variables, Helper } from '@/utils';
import { head, isEmpty, get } from 'lodash';
import Heading from '@/components/CommonComponent/Heading';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Button from '@/components/CommonComponent/Button';
import HelperModules from '../../utils/Helper';
import stylesModule from '../../styles.module.scss';

const General = memo(() => {
    const formRef = useRef();
    const dispatch = useDispatch();
    const params = useParams();
    const mounted = useRef(false);
    const {
        events,
        loading: { effects },
        categoryEvents,
        eventDetails,
    } = useSelector(({ loading, crmSaleLeadAdd }) => ({
        loading,
        events: crmSaleLeadAdd.events,
        details: crmSaleLeadAdd.details,
        data: crmSaleLeadAdd.data,
        categoryEvents: crmSaleLeadAdd.categoryEvents,
        error: crmSaleLeadAdd.error,
        eventDetails: crmSaleLeadAdd.eventDetails,
    }));
    const loading = effects[`crmSaleLeadAdd/EVENTS`] || effects[`crmSaleLeadAdd/GET_EVENTS`];


    const today = new Date();
    const c = new Date(today.toLocaleDateString());
    const dateHistory = new Date(eventDetails.date);
    const timeHistory = `${eventDetails.time}`;
    const date = `${today.getDate() < 10 ? `${`0${today.getDate()}`}` : today.getDate()}-0${today.getMonth() + 1}-${today.getFullYear()}`;
    const time = `${today.getHours() < 10 ? `${`0${today.getHours()}:${today.getMinutes()}`}` : `${today.getHours()}:${today.getMinutes()}`}`;
    const miliToday = c.getTime();
    const miliDateHistory = dateHistory.getTime();
    const dateYear = `${Helper.getDate(eventDetails.date, variables.DATE_FORMAT.DATE)}`;

    const [description, setDescription] = useState('');
    const [result, setResult] = useState('');


    const [modal, setModal] = useState(false);
    const [objects, setObjects] = useState({ id: null });
    const loadingSubmit =
        effects[`crmSaleLeadAdd/ADD_EVENTS`] || effects[`crmSaleLeadAdd/UPDATE_EVENTS`];
    const mountedSet = (action, value) => {
        if (mounted.current) {
            action(value);
        }
    };


    const onChangeDescription = (value) => {
        mountedSet(setDescription, value);
    };

    const onChangeResult = (value) => {
        mountedSet(setResult, value);
    };


    useEffect(() => {
        if (params.detailId) {
            dispatch({
                type: 'crmSaleLeadAdd/GET_EVENTS',
                payload: params,
            });
        }
    }, [params.detailId]);

    useEffect(() => {
        dispatch({
            type: 'crmSaleLeadAdd/EVENTS',
            payload: {
                customer_lead_id: params.id,
            },
        });
    }, []);

    useEffect(() => {
        dispatch({
            type: 'crmSaleLeadAdd/GET_CATEGORY_EVENTS',
            payload: {},
        });
    }, []);

    useEffect(() => {
        mounted.current = true;
        return mounted.current;
    }, []);

    const onRemove = (id) => {
        Helper.confirmAction({
            callback: () => {
                dispatch({
                    type: 'crmSaleLeadAdd/REMOVE_EVENTS',
                    payload: {
                        id,
                    },
                    callback: () => {
                        dispatch({
                            type: 'crmSaleLeadAdd/EVENTS',
                            payload: {
                                customer_lead_id: params.id,
                            },
                        });
                    },
                });
            },
        });
    };

    const showModal = () => {
        setModal(true);
    };

    const detailModal = (record) => {
        setModal(true);
        mountedSet(setObjects, { id: record });
        if (objects) {
            dispatch({
                type: 'crmSaleLeadAdd/GET_EVENTS',
                payload: record,
                callback: (response) => {
                    if (response) {
                        mountedSet(setDescription, response.parsePayload.description);
                        mountedSet(setResult, response.parsePayload.result);
                    }
                },
            });
            dispatch({
                type: 'crmSaleLeadAdd/EVENTS',
                payload: {
                    customer_lead_id: params.id,
                },
            });
        }
    };

    // 
    // time < timeHistory && 
    const onStatus = () => {
        if (miliToday < miliDateHistory) {
            if (time > timeHistory && date === dateYear) {
                return (
                    <>
                        {HelperModules.tagStatus("PAST_EVENTS")}
                    </>
                );
            }
            return (
                <>
                    {HelperModules.tagStatus("COMING_EVENTS")}
                </>
            );

        }
        return (
            <>
                {HelperModules.tagStatus("PAST_EVENTS")}
            </>
        );
    };


    const onFormTrue = () => (
        <>
            <Pane className="col-lg-6">
                <FormItem
                    name="date"
                    label="Ngày diễn ra"
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                />
            </Pane>
            <Pane className="col-lg-6">
                <FormItem
                    label="Giờ"
                    name="time"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.TIME_PICKER}
                />
            </Pane>
            <Pane className="col-lg-12">
                <FormItem
                    name="name"
                    label="Tên sự  kiện"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY]}
                />
            </Pane>
            <Pane className="col-lg-6">
                <FormItem
                    options={['id', 'name']}
                    name="category_event_id"
                    data={categoryEvents}
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Loại sự kiện"
                    rules={[variables.RULES.EMPTY]}
                />
            </Pane>
            <Pane className="col-lg-6">
                <FormItem
                    name="location"
                    label="Địa điểm"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY]}
                />
            </Pane>
            <Pane className="col-lg-12">
                <Pane className="ant-col ant-form-item-label">
                    <label>
                        <span>Mô tả</span>
                    </label>
                </Pane>
                <Input.TextArea
                    className="mb15"
                    value={description}
                    autoSize={{ minRows: 5, maxRows: 5 }}
                    placeholder="Nhập"
                    onChange={(e) => onChangeDescription(e.target.value)}
                />
            </Pane>
            {
                objects.id ?
                    <Pane className="col-lg-12">
                        <Pane className="ant-col ant-form-item-label">
                            <label>
                                <span>Kết quả sự kiện</span>
                            </label>
                        </Pane>
                        <Input.TextArea
                            className="mb20"
                            value={result}
                            autoSize={{ minRows: 5, maxRows: 5 }}
                            placeholder="Nhập"
                            disabled
                            onChange={(e) => onChangeResult(e.target.value)}
                        />
                    </Pane>
                    : ""
            }
        </>);

    const onFormfalse = () => (
        <>
            <Pane className="col-lg-6">
                <FormItem
                    name="date"
                    label="Ngày diễn ra"
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                    disabled
                />
            </Pane>
            <Pane className="col-lg-6">
                <FormItem
                    label="Giờ"
                    name="time"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.TIME_PICKER}
                    disabled
                />
            </Pane>
            <Pane className="col-lg-12">
                <FormItem
                    name="name"
                    label="Tên sự  kiện"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY]}
                    disabled
                />
            </Pane>
            <Pane className="col-lg-6">
                <FormItem
                    options={['id', 'name']}
                    name="category_event_id"
                    data={categoryEvents}
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Loại sự kiện"
                    rules={[variables.RULES.EMPTY]}
                    disabled
                />
            </Pane>
            <Pane className="col-lg-6">
                <FormItem
                    name="location"
                    label="Địa điểm"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY]}
                    disabled
                />
            </Pane>
            <Pane className="col-lg-12">
                <Pane className="ant-col ant-form-item-label">
                    <label>
                        <span>Mô tả</span>
                    </label>
                </Pane>
                <Input.TextArea
                    className="mb15"
                    value={description}
                    autoSize={{ minRows: 5, maxRows: 5 }}
                    placeholder="Nhập"
                    disabled
                    onChange={(e) => onChangeDescription(e.target.value)}
                />
            </Pane>
            <Pane className="col-lg-12">
                <Pane className="ant-col ant-form-item-label">
                    <label>
                        <span>Kết quả sự kiện</span>
                    </label>
                </Pane>
                <Input.TextArea
                    className="mb20"
                    value={result}
                    autoSize={{ minRows: 5, maxRows: 5 }}
                    placeholder="Nhập"
                    onChange={(e) => onChangeResult(e.target.value)}
                />
            </Pane>
        </>);

    const onForm = () => {
        if (miliToday < miliDateHistory) {
            if (time < timeHistory && miliToday > miliDateHistory) {
                return (
                    <>
                        {onFormTrue()}
                        {onFormfalse()}
                    </>
                );
            }
            return (
                <>
                    {onFormTrue()}
                </>
            );

        } if (miliToday > miliDateHistory) {
            if (time < timeHistory && date === dateYear) {
                return (
                    <>
                        {onFormTrue()}
                    </>
                );
            }
            return (
                <>
                    {onFormfalse()}
                </>
            );
        }
        return (
            <>
                {onFormfalse()}
            </>
        );
    };
    // 

    const onStatusTable = (a, e) => {
        const today = new Date();
        const c = new Date(today.toLocaleDateString());
        const dateHistory = new Date(a);
        const timeHistory = `${e}`;
        const date = `${today.getDate() < 10 ? `${`0${today.getDate()}`}` : today.getDate()}-0${today.getMonth() + 1}-${today.getFullYear()}`;
        const time = `${today.getHours() < 10 ? `${`0${today.getHours()}:0${today.getMinutes()}`}` : `${today.getHours()}:${today.getMinutes()}`}`;
        const miliToday = c.getTime();
        const miliDateHistory = dateHistory.getTime();
        const dateYear = `${Helper.getDate(a, variables.DATE_FORMAT.DATE)}`;
        if (miliToday < miliDateHistory) {
            if (time > timeHistory && date === dateYear) {
                return (
                    <>
                        {HelperModules.tagStatus("PAST_EVENTS")}
                    </>
                );
            }
            return (
                <>
                    {HelperModules.tagStatus("COMING_EVENTS")}
                </>
            );

        }
        return (
            <>
                {HelperModules.tagStatus("PAST_EVENTS")}
            </>
        );
    };

    const header = () => {
        const columns = [
            {
                title: 'Ngày diễn ra',
                key: 'date',
                className: 'min-width-150',
                width: 200,
                render: (record) => (
                    <Text size="normal">
                        {Helper.getDate(record.date)}, {record.time}
                    </Text>
                ),
            },
            {
                title: 'Tên sự kiện',
                key: 'name',
                width: 150,
                className: 'min-width-150',
                render: (record) => get(record, 'name'),
            },
            {
                title: 'Địa điểm diễn ra',
                key: 'location',
                width: 150,
                className: 'min-width-150',
                render: (record) => get(record, 'location'),
            },
            {
                title: 'Trạng thái',
                key: 'status',
                className: 'min-width-120',
                width: 120,
                render: (record) => onStatusTable(record.date, record.time),
            },
            {
                title: 'Kết quả sự kiện',
                key: 'result',
                width: 150,
                className: 'min-width-150',
                render: (record) => get(record, 'result'),
            },
            {
                key: 'Thao tác',
                width: 100,
                fixed: 'right',
                render: (record) => (
                    <div className={styles['list-button']}>
                        <Button
                            color="primary"
                            icon="edit"
                            onClick={() => detailModal(record.id)}
                        />
                        <Button color="danger" icon="remove" onClick={() => onRemove(record.id)} />
                    </div>
                ),
            },
        ];
        return columns;
    };

    useEffect(() => {
        mounted.current = true;
        return mounted.current;
    }, []);

    useEffect(() => {
        if (objects.id) {
            formRef.current.setFieldsValue({
                ...eventDetails,
                ...head(eventDetails.positionLevel),
                date: eventDetails.date && moment(eventDetails.date),
                created_at: eventDetails.created_at && moment(eventDetails.created_at),
                time: eventDetails.time && moment(eventDetails.time, variables.DATE_FORMAT.HOUR),
            });
        }
    }, [eventDetails]);

    const handleOk = () => {
        formRef.current.validateFields().then((values) => {
            dispatch({
                type: objects.id ? 'crmSaleLeadAdd/UPDATE_EVENTS' : 'crmSaleLeadAdd/ADD_EVENTS',
                payload: objects.id
                    ? { ...eventDetails, ...values, customer_lead_id: params.id, status: "COMING_EVENTS", description, result }
                    : { ...values, customer_lead_id: params.id, description },
                callback: (response, error) => {
                    mountedSet(setDescription, "");
                    if (response) {
                        setModal(false);
                        dispatch({
                            type: 'crmSaleLeadAdd/EVENTS',
                            payload: {
                                customer_lead_id: params.id,
                            },
                        });
                        formRef.current.setFieldsValue({
                            date:  undefined,
                            time:  undefined,
                            name: undefined,
                            category_event_id:  undefined,
                            location:  undefined
                        });
                        mountedSet(setDescription, "");
                    }
                    if (error) {
                        if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
                            error.data.errors.forEach((item) => {
                                formRef.current.setFields([
                                    {
                                        name: get(item, 'source.pointer'),
                                        errors: [get(item, 'detail')],
                                    },
                                ]);
                            });
                        }
                    }
                },
            });
        });
    };

    const handleCancel = () => {
        setModal(false);
        formRef.current.resetFields();
        mountedSet(setDescription, "");
        mountedSet(setObjects, {});
    };

    return (
        <>
            <Form layout="vertical"
                initialValues={{ data: [{}] }}>
                <div className="card">
                    <div style={{ padding: 20 }} className="pb-0 border-bottom">
                        <div className="d-flex justify-content-between">
                            <Heading type="form-title" style={{ marginBottom: 20 }}>
                                Thông tin sự kiện
                            </Heading>
                            <>
                                {/* <Breadcrumb separator=">" className={stylesModule['wrapper-breadcrumb']}>
                                    <Breadcrumb.Item>
                                    <Link to="/crm/sale/ph-lead" className={stylesModule.details}>
                                        Phụ huynh lead
                                    </Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                    <Link
                                        to={`/crm/sale/ph-lead/${params.id}/chi-tiet?type=events`}
                                        className={stylesModule.details}
                                    >
                                        Chi tiết
                                    </Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item className={stylesModule.detailsEnd}>
                                    {params.detailId ? 'Chi tiết sự kiện' : 'Thêm thông tin sự kiện'}
                                    </Breadcrumb.Item>
                                </Breadcrumb> */}

                                <Button
                                    color="success"
                                    icon="plus"
                                    onClick={() => showModal()}
                                >
                                    Thêm sự kiện
                                </Button>
                                <Modal
                                    title={objects.id ? "Chi tiết sự kiện" : "Thêm sự kiện"}
                                    className={stylesModule['wrapper-modal']}
                                    visible={modal}
                                    onOk={handleOk}
                                    onCancel={handleCancel}
                                    width={960}
                                    centered
                                    footer={[
                                        <p
                                            key="back"
                                            role="presentation"
                                            className={stylesModule['button-cancel']}
                                            onClick={() => handleCancel()}
                                        >
                                            Hủy
                                        </p>,
                                        <Button
                                            key="submit"
                                            color="success"
                                            type="primary"
                                            onClick={handleOk}
                                            className={styles['cheack-btn-ok']}
                                            loading={loadingSubmit || loading}
                                        >
                                            Lưu
                                        </Button>,
                                    ]}
                                >


                                    <Pane className="p10">
                                        <Form
                                            layout="vertical"
                                            ref={formRef}
                                            initialValues={{ data: [{}] }}>

                                            <div className="card">
                                                <div style={{ padding: 20 }} className="pb-0 border-bottom">
                                                    <div className="row">
                                                        {
                                                            objects.id ?
                                                                <>
                                                                    <div className="col-lg-6">
                                                                        <div className="ant-col ant-form-item-label">
                                                                            <label className="ant-form-item-required">Thời gian tạo</label>
                                                                        </div>
                                                                        <Text size="normal" className={stylesModule['general-detail']}>
                                                                            {Helper.getDate(eventDetails.created_at, variables.DATE_FORMAT.DATE)}
                                                                        </Text>
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <div className="ant-col ant-form-item-label">
                                                                            <label className="ant-form-item-required">Trạng thái</label>
                                                                        </div>
                                                                        <Text size="normal" className={stylesModule['general-detail']}>
                                                                            <div style={{ width: '50%' }}>
                                                                                {onStatus()}
                                                                            </div>
                                                                        </Text>
                                                                    </div>
                                                                    <> {onForm()} </>
                                                                </>
                                                                : <>{onFormTrue()}</>
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                        </Form>
                                    </Pane>
                                </Modal>
                            </>
                        </div>
                        <div className="row">
                            <Pane className="col-lg-12 pb20">
                                <div className={stylesModule['wrapper-table']}>
                                    <Table
                                        columns={header()}
                                        dataSource={events}
                                        pagination={false}
                                        className="table-normal"
                                        isEmpty
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
                            </Pane>
                        </div>
                    </div>
                </div>
            </Form>
        </>
    );
});

export default General;
