import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal} from 'antd';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import styles from '@/assets/styles/Common/common.scss';
import Pane from '@/components/CommonComponent/Pane';
import Text from '@/components/CommonComponent/Text';
import { variables, Helper } from '@/utils';
import { isEmpty, get,head } from 'lodash';
import moment from 'moment';
import Heading from '@/components/CommonComponent/Heading';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Button from '@/components/CommonComponent/Button';
import stylesModule from '../../styles.module.scss';

const genders = [
    { id: 'LEAD_NEW', name: 'Lead mới' },
    { id: 'POTENTIAL', name: 'Có tiềm năng' },
    { id: 'NOT_POTENTIAL', name: 'Không tiềm năng' },
  ];

const General = memo(() => {
    const formRef = useRef();
    const dispatch = useDispatch();
    const params = useParams();
    const mounted = useRef(false);
    const {
        history,
        loading: { effects },
        details,
    } = useSelector(({ loading, crmSaleLeadAdd }) => ({
        loading,
        history: crmSaleLeadAdd.history,
        details: crmSaleLeadAdd.details,
        data: crmSaleLeadAdd.data,
        error: crmSaleLeadAdd.error,
    }));
    const loading = effects[`crmSaleLeadAdd/HISTORY`] || effects[`crmSaleLeadAdd/GET_EVENTS`];

    const [historyDetails, setHistoryDetails] = useState({});

    const [modal, setModal] = useState(false);
    const [objects, setObjects] = useState({ id: null });
    const loadingSubmit =
        effects[`crmSaleLeadAdd/ADD_EVENTS`] || effects[`crmSaleLeadAdd/UPDATE_EVENTS`];
    const mountedSet = (action, value) => {
        if (mounted.current) {
            action(value);
        }
    };


    useEffect(() => {
        if (params.id) {
          dispatch({
            type: 'crmSaleLeadAdd/GET_DETAILS',
            payload: params,
          });
        }
      }, [params.id]);


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
            type: 'crmSaleLeadAdd/HISTORY',
            payload: {
                customer_lead_id: params.id,
            },
        });
        const dataSession = JSON.parse(sessionStorage.getItem('check'));
        if (dataSession?.modal) {
            setModal(dataSession?.modal);
            setObjects({ id: dataSession?.id });
            if (objects) {
                dispatch({
                    type: 'crmSaleLeadAdd/GET_EVENTS',
                    payload: dataSession?.id,
                    callback: () => {
                    },
                });
                dispatch({
                    type: 'crmSaleLeadAdd/EVENTS',
                    payload: {
                        customer_lead_id: params.id,
                    },
                });
            }
        }
        sessionStorage.removeItem('check');
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
                    type: 'crmSaleLeadAdd/REMOVE_HISTORY',
                    payload: {
                        id,
                    },
                    callback: () => {
                        dispatch({
                            type: 'crmSaleLeadAdd/HISTORY',
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
        setHistoryDetails({});
        setModal(true);
    };

    const detailModal = (record) => {
        setModal(true);
        mountedSet(setObjects, { id: record });
        if (objects) {
            dispatch({
                type: 'crmSaleLeadAdd/GET_HISTORY',
                payload: record,
                callback: (res) => {
                    if(res){
                        setHistoryDetails(res?.parsePayload);
                    }
                },
            });
            dispatch({
                type: 'crmSaleLeadAdd/HISTORY',
                payload: {
                    customer_lead_id: params.id,
                },
            });
        }
    };
    
    const onFormNumber = () => {
        if(historyDetails?.quantity_care) {
            return  historyDetails?.quantity_care;
        } 
        if(history?.length > 0) {
                return head(history)?.quantity_care + 1;
        }
        return 1 ;
    };

    const onFormTrue = () => (
        <>
           <div className="col-lg-6">
                <div className="ant-col ant-form-item-label">
                  <label className="ant-form-item-required">Tên phụ huynh</label>
                </div>
                <Text size="normal" className={stylesModule['general-detail']}>
                  {details?.full_name}
                </Text>
              </div>
              <div className="col-lg-6">
                <div className="ant-col ant-form-item-label">
                  <label className="ant-form-item-required">SĐT</label>
                </div>
                <Text size="normal" className={stylesModule['general-detail']}>
                  {details?.phone}
                </Text>
              </div>
              <div className="col-lg-6">
                <div className="ant-col ant-form-item-label">
                  <label className="ant-form-item-required">Số lần chăm sóc</label>
                </div>
                <Text size="normal" className={stylesModule['general-detail']}>
                 {onFormNumber()}
                </Text>
              </div>
              <Pane className="col-lg-6">
                <FormItem
                    label="Tình trạng chăm sóc"
                    name="status"
                    data={genders}
                    rules={[variables.RULES.EMPTY]}
                    type={variables.SELECT}
                />
            </Pane>
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
                    name="hours"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.TIME_PICKER}
                />
            </Pane>
            <Pane className="col-lg-12">
                <FormItem
                    name="content_call"
                    label="Nội dung cuộc gọi"
                    type={variables.TEXTAREA}
                />
            </Pane>
            <Pane className="col-lg-12">
                <FormItem
                    name="result_call"
                    label="Kết quả cuộc gọi"
                    type={variables.TEXTAREA}
                />
            </Pane>
            <Pane className="col-lg-12">
                <FormItem
                    name="history_interactive"
                    label="Lịch sử tương tác bằng mạng xã hội"
                    type={variables.TEXTAREA}
                />
            </Pane>
            <Pane className="col-lg-12">
                <FormItem
                    name="offline"
                    label="Các hoạt động offline"
                    type={variables.TEXTAREA}
                />
            </Pane>
        </>);

    const header = () => {
        const columns = [
            {
                title: 'Thời gian',
                key: 'date',
                className: 'min-width-150',
                width: 200,
                render: (record) => (
                    <Text size="normal">
                        {record.date}, {record.hours} 
                    </Text>
                ),
            },
            {
                title: 'Tên phụ huynh',
                key: 'name',
                width: 250,
                className: 'min-width-250',
                render: (record) => record?.customerLead?.full_name,
            },
            {
                title: 'SĐT',
                key: 'phone',
                width: 150,
                className: 'min-width-150',
                render: (record) => record?.customerLead?.phone,
            },
            {
                title: 'Số lần chăm sóc',
                key: 'quantity_care',
                width: 150,
                className: 'min-width-150',
                render: (record) => get(record, 'quantity_care'),
            },
            {
                title: 'Tình trạng chăm sóc',
                key: 'status',
                width: 170,
                className: 'min-width-170',
                render: (record) => <>
                 {record?.status === 'LEAD_NEW' ? 'Lead mới' : ""}
                  {record?.status === 'POTENTIAL' ? 'Tiềm năng' : ""}
                  {record?.status === 'NOT_POTENTIAL' ? 'Không tiềm năng' : ""}
                </>,
            },
             {
                title: 'Nội dung cuộc gọi',
                key: 'content_call',
                width: 170,
                className: 'min-width-170',
                render: (record) => get(record, 'content_call'),
            },
            {
                title: 'Kết quả cuộc gọi',
                key: 'result_call',
                width: 150,
                className: 'min-width-150',
                render: (record) => get(record, 'result_call'),
            },
            {
                title: 'Lịch sử tương tác bằng MXH',
                key: 'history_interactive',
                width: 250,
                className: 'min-width-250',
                render: (record) => get(record, 'history_interactive'),
            },
            {
                title: 'Các hoạt động offline',
                key: 'offline',
                width: 200,
                className: 'min-width-200',
                render: (record) => get(record, 'offline'),
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
                ...historyDetails,
                ...head(historyDetails.positionLevel),
                date: historyDetails.date && moment(historyDetails.date),
                created_at: historyDetails.created_at && moment(historyDetails.created_at),
                hours: historyDetails?.hours && moment(historyDetails?.hours, variables.DATE_FORMAT.HOUR),
            });
        }
    }, [historyDetails]);

    const handleOk = () => {
        formRef.current.validateFields().then((values) => {
            dispatch({
                type: objects.id ? 'crmSaleLeadAdd/UPDATE_HISTORY' : 'crmSaleLeadAdd/ADD_HISTORY',
                payload: objects.id
                    ? { ...historyDetails, ...values, customer_lead_id: params.id }
                    : { ...values, customer_lead_id: params.id },
                callback: (response, error) => {
                    if (response) {
                        setHistoryDetails({});
                        setModal(false);
                        dispatch({
                            type: 'crmSaleLeadAdd/HISTORY',
                            payload: {
                                customer_lead_id: params.id,
                            },
                        });
                        formRef.current.setFieldsValue({
                            date: undefined,
                            hours: undefined,
                            name: undefined,
                            status: undefined,
                            content_call: undefined,
                            result_call: undefined,
                            history_interactive: undefined,
                            offline: undefined,
                        });
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
                              Lịch sử chăm sóc
                            </Heading>
                            <>
                                <Button
                                    color="success"
                                    icon="plus"
                                    onClick={() => showModal()}
                                >
                                   Thêm mới
                                </Button>
                                <Modal
                                    title={objects.id ? "Chi tiết sử chăm sóc" : "Thêm lịch sử chăm sóc"}
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
                                                          onFormTrue()
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
                                        dataSource={history}
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
