import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { get, isEmpty } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import styles from '@/assets/styles/Common/common.scss';
import { DeleteOutlined } from '@ant-design/icons';
import FormItem from '@/components/CommonComponent/FormItem';
import classnames from 'classnames';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { variables, Helper } from '@/utils';
import moment from 'moment';

const Index = memo(() => {
    const [visible, setVisible] = useState(false);
    const [objects, setObjects] = useState({});
    const [form] = Form.useForm();

    const {
        loading: { effects },
        dataSalaryIncreases,
        categories,
        details,
    } = useSelector(({ loading, HRMusersAdd, salaryIncreasesAdd }) => ({
        loading,
        dataSalaryIncreases: HRMusersAdd.dataSalaryIncreases,
        details: HRMusersAdd.details,
        categories: salaryIncreasesAdd.categories,
    }));
    const loadingSubmit =
        effects[`salaryIncreasesAdd/ADD`] || effects[`salaryIncreasesAdd/UPDATE`];
    const loading = effects[`HRMusersAdd/GET_SALARY_INCREASES`];
    const dispatch = useDispatch();
    const params = useParams();
    const mounted = useRef(false);
    const mountedSet = (action, value) => {
        if (mounted.current) {
            action(value);
        }
    };

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const handleOk = () => {
        mountedSet(setVisible, true);
        mountedSet(setObjects, {});
        if (!isEmpty(details)) {
            form.setFieldsValue({
                decisionNumber: undefined,
                decisionDate: undefined,
                reason: undefined,
                timeApply: undefined,
                note: undefined,
            });
        }
    };

    const handleModal = () => {
        mountedSet(setVisible, true);
        mountedSet(setObjects, {});
        form.setFieldsValue({
            decisionNumber: undefined,
            decisionDate: undefined,
            reason: undefined,
            timeApply: undefined,
            note: undefined,
            details: [{}],
        });
    };

    const cancelModal = () => {
        mountedSet(setVisible, false);
    };

    const onEdit = (record) => {
        mountedSet(setVisible, true);
        mountedSet(setObjects, record);
        if (!isEmpty(record)) {
            form.setFieldsValue({
                ...record,
                decisionDate: record.decisionDate && moment(record.decisionDate),
                timeApply: record.timeApply && moment(record.timeApply),
                details: record.parameterValues.map((item) => ({
                    ...item,
                    parameterValueId: item?.pivot?.parameterValueId,
                    value: item?.pivot?.value,
                })),
            });
        }
    };

    /**
     * Function remove items
     * @param {uid} id id of items
     */
    const onRemove = (id) => {
        Helper.confirmAction({
            callback: () => {
                dispatch({
                    type: 'HRMusersAdd/REMOVE_SALARY_INCREASES',
                    payload: {
                        id,
                    },
                    callback: (response) => {
                        if (response) {
                            dispatch({
                                type: 'HRMusersAdd/GET_SALARY_INCREASES',
                                payload: params,
                            });
                        };
                    }
                });
            },
        });
    };

    const save = () => {
        form.validateFields().then((values) => {
            dispatch({
                type: objects.id ? 'salaryIncreasesAdd/UPDATE' : 'salaryIncreasesAdd/ADD',
                payload: {
                    id: objects.id,
                    ...values,
                    employeeId: details?.id,
                    detail: values?.details?.map((item) => ({
                        ...item,
                        date: moment(item.date).format(variables.DATE_FORMAT.DATE_AFTER),
                        endTime: moment(item.endTime).format(variables.DATE_FORMAT.TIME_FULL),
                        startTime: moment(item.startTime).format(variables.DATE_FORMAT.TIME_FULL),
                    })),
                },
                callback: (response, error) => {
                    if (response) {
                        mountedSet(setVisible, false);
                        dispatch({
                            type: 'HRMusersAdd/GET_SALARY_INCREASES',
                            payload: params,
                        });
                    }
                    if (error) {
                        if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
                            error.data.errors.forEach((item) => {
                                form.setFields([
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

    /**
     * Function header table
     */
    const header = () => {
        const columns = [
            {
                title: 'STT',
                key: 'text',
                width: 80,
                className: 'min-width-80',
                align: 'center',
                render: (text, record, index) => index + 1,
            },
            {
                title: 'Thời gian tạo',
                key: 'creationTime',
                dataIndex: 'creationTime',
                className: 'min-width-160',
                render: (value) => Helper.getDate(value, variables.DATE_FORMAT.DATE_TIME),
            },
            {
                title: 'Số QĐ',
                key: 'insurrance_number',
                className: 'min-width-100',
                width: 100,
                render: (record) => get(record, 'decisionNumber'),
            },
            {
                title: 'Ngày QĐ',
                key: 'decisionDate',
                className: 'min-width-120',
                width: 120,
                render: (record) => Helper.getDate(get(record, 'decisionDate'), variables.DATE_FORMAT.DATE),
            },
            {
                title: 'Lý do',
                key: 'reason',
                className: 'min-width-200',
                width: 200,
                render: (record) => get(record, 'reason'),
            },
            {
                title: 'Nhân viên',
                key: 'name',
                className: 'min-width-200',
                render: (record) => (
                    <AvatarTable
                        fileImage={Helper.getPathAvatarJson(get(record, 'employee.fileImage'))}
                        fullName={get(record, 'employee.fullName')}
                    />
                ),
            },
            {
                title: 'Ngày áp dụng',
                key: 'timeApply',
                className: 'min-width-120',
                width: 120,
                render: (record) => Helper.getDate(get(record, 'timeApply'), variables.DATE_FORMAT.DATE),
            },
            {
                title: 'Thao tác',
                key: 'actions',
                width: 130,
                className: 'min-width-130',
                fixed: 'right',
                align: 'center',
                render: (record) => (
                    <ul className="list-unstyled list-inline">
                        <li className="list-inline-item">
                            <Button color="primary" icon="edit" onClick={() => onEdit(record)} />
                        </li>
                        <li className="list-inline-item">
                            <Button
                                color="danger"
                                icon="remove"
                                className="ml-2"
                                onClick={() => onRemove(record.id)}
                            />
                        </li>
                    </ul>
                ),
            },
        ];
        return columns;
    };

    /**
     * Load Items Apointes
     */
    useEffect(() => {
        dispatch({
            type: 'HRMusersAdd/GET_SALARY_INCREASES',
            payload: params,
        });
        dispatch({
            type: 'salaryIncreasesAdd/GET_CATEGORIES',
            payload: {},
        });

    }, []);

    const onChangeParamaterValues = (value, index) => {
        if (form) {
            const { details } = form.getFieldsValue();
            const valueParamter = categories.paramaterValues?.find((item) => item.id === value);
            form.setFieldsValue({
                details: details?.map((item, indexDetail) => {
                    if (indexDetail === index) {
                        return {
                            ...item,
                            value: valueParamter.valueDefault,
                        };
                    }
                    return item;
                }),
            });
        }
    };

    return (
        <>
            <Modal
                visible={visible}
                title="Quyết định tăng lương"
                onOk={handleOk}
                centered
                width={700}
                onCancel={cancelModal}
                footer={
                    <Pane className="d-flex justify-content-end align-items-center">
                        <Button
                            key="cancel"
                            color="white"
                            icon="fe-x"
                            onClick={cancelModal}
                        >
                            Hủy
                        </Button>
                        <Button
                            key="choose"
                            color="success"
                            icon="fe-save"
                            onClick={save}
                            loading={loadingSubmit}
                        >
                            Lưu
                        </Button>
                    </Pane>
                }
            >
                <Form
                    layout="vertical"
                    form={form}
                    initialValues={{
                        details: [{}],
                    }}
                >
                    <div className={styles['content-form']}>
                        <div className={classnames(styles['content-children'])}>
                            <Text color="dark" size="large-medium">
                                THÔNG TIN CHUNG
                            </Text>
                            <div className="row">
                                <div className="col-lg-6">
                                    <FormItem
                                        label="Số quyết định"
                                        name="decisionNumber"
                                        type={variables.INPUT}
                                        rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                                    />
                                </div>
                                <div className="col-lg-6">
                                    <FormItem
                                        label="Ngày quyết định"
                                        name="decisionDate"
                                        disabledDate={Helper.disabledDate}
                                        type={variables.DATE_PICKER}
                                        rules={[variables.RULES.EMPTY]}
                                    />
                                </div>
                                <div className="col-lg-12">
                                    <FormItem
                                        label="Lý do"
                                        name="reason"
                                        type={variables.INPUT}
                                        rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <FormItem
                                        label="Ngày áp dụng"
                                        name="timeApply"
                                        rules={[variables.RULES.EMPTY]}
                                        type={variables.DATE_PICKER}
                                    />
                                </div>
                                <div className="col-lg-6">
                                    <FormItem
                                        label="Ghi chú"
                                        name="note"
                                        type={variables.INPUT}
                                        rules={[variables.RULES.MAX_LENGTH_INPUT]}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <Form.List name="details">
                                        {(fields, { add, remove }) => (
                                            <div>
                                                {fields.map((field, index) => (
                                                    <div
                                                        className={classnames(
                                                            'row',
                                                            styles['form-item'],
                                                            styles['form-item-advance'],
                                                        )}
                                                        key={field.key}
                                                    >
                                                        <div className="col-lg-6">
                                                            <FormItem
                                                                data={categories.paramaterValues}
                                                                label="Tham số giá trị"
                                                                name={[field.name, 'parameterValueId']}
                                                                fieldKey={[field.fieldKey, 'parameterValueId']}
                                                                rules={[variables.RULES.EMPTY]}
                                                                type={variables.SELECT}
                                                                onChange={(event) => onChangeParamaterValues(event, index)}
                                                            />
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <FormItem
                                                                label="Lương"
                                                                name={[field.name, 'value']}
                                                                fieldKey={[field.fieldKey, 'value']}
                                                                rules={[variables.RULES.EMPTY]}
                                                                type={variables.INPUT_NUMBER}
                                                            />
                                                        </div>

                                                        <>
                                                            {fields?.length > 1 ? (
                                                                <DeleteOutlined
                                                                    className={classnames(styles['icon-delete'], 'ml-1')}
                                                                    onClick={() => {
                                                                        remove(field.name);
                                                                    }}
                                                                />
                                                            ) : null}
                                                        </>
                                                    </div>
                                                ))}
                                                <div className="row mb-3">
                                                    <div className="col-lg-3">
                                                        <Button
                                                            color="success"
                                                            icon="plusMain"
                                                            onClick={() => {
                                                                add();
                                                            }}
                                                        >
                                                            Thêm dòng
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Form.List>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>
            <Pane className="card">
                <Pane style={{ padding: 20 }} className="pb-0">
                    <Heading type="form-title">Danh sách tăng lương</Heading>
                </Pane>
                <Pane style={{ padding: 20 }} className="pb-0">
                    <Table
                        columns={header()}
                        dataSource={dataSalaryIncreases}
                        pagination={false}
                        loading={loading}
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
                </Pane>

                <Pane style={{ padding: 20 }}>
                    <Button color="success" ghost icon="plus" onClick={() => handleModal()}>
                        Thêm
                    </Button>
                </Pane>
            </Pane>
        </>
    );
});

export default Index;
