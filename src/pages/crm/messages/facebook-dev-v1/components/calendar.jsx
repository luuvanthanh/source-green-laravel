import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal, Input } from 'antd';
import { useSelector, useDispatch } from 'dva';
import styles from '@/assets/styles/Common/common.scss';
import Pane from '@/components/CommonComponent/Pane';
import { variables } from '@/utils';
import PropTypes from 'prop-types';
import FormItem from '@/components/CommonComponent/FormItem';
import Button from '@/components/CommonComponent/Button';
import stylesModule from '../styles.module.scss';

const General = memo(({ conversationCurrent }) => {
    const formRef = useRef();
    const dispatch = useDispatch();
    const mounted = useRef(false);
    const {
        loading: { effects },
        categoryEvents,
    } = useSelector(({ loading, crmSaleLeadAdd }) => ({
        loading,
        categoryEvents: crmSaleLeadAdd.categoryEvents,
        error: crmSaleLeadAdd.error,
    }));
    const loading = effects[`crmSaleLeadAdd/EVENTS`] || effects[`crmSaleLeadAdd/GET_EVENTS`];

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
        dispatch({
            type: 'crmSaleLeadAdd/GET_CATEGORY_EVENTS',
            payload: {},
        });
    }, []);

    useEffect(() => {
        mounted.current = true;
        return mounted.current;
    }, []);

    const showModal = () => {
        setModal(true);
    };


    // 
    // time < timeHistory && 


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


    useEffect(() => {
        mounted.current = true;
        return mounted.current;
    }, []);


    const handleOk = () => {
        formRef.current.validateFields().then((values) => {
            dispatch({
                type: 'crmSaleLeadAdd/ADD_EVENTS',
                payload: { ...values, customer_lead_id: conversationCurrent?.userFacebookInfo?.customer_lead_id, description },
                callback: (response) => {
                    mountedSet(setDescription, "");
                    if (response) {
                        setModal(false);
                        formRef.current.setFieldsValue({
                            date: undefined,
                            time: undefined,
                            name: undefined,
                            category_event_id: undefined,
                            location: undefined
                        });
                        mountedSet(setDescription, "");
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
            <Button color="white" icon="calendar-plus" onClick={() => showModal()} />
            <Form layout="vertical"
                initialValues={{ data: [{}] }} >
                <>
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
                                            {onFormTrue()}
                                        </div>
                                    </div>
                                </div>

                            </Form>
                        </Pane>
                    </Modal>
                </>
            </Form>
        </>
    );
});

General.propTypes = {
    conversationCurrent: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
    conversationCurrent: {},
};

export default General;
