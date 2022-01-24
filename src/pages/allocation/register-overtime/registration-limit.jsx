import React, { memo, useEffect, useState } from 'react';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import Text from '@/components/CommonComponent/Text';
import { variables } from '@/utils';
import { Form, Spin } from 'antd';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'dva';
import { isEmpty } from 'lodash';


const dataTime = (n) => {
    const allTime = [];
    for (let i = 1; i < n + 1; i += 1) {
        allTime.push({ name: `${i} ngày` });
    }

    return allTime.map((i, id) => ({ id, ...i }));
};

const dataHour = (n) => {
    const allHour = [];
    for (let i = 1; i < n + 1; i += 1) {
        allHour.push({ name: `${i} giờ` });
    }

    return allHour.map((i, id) => ({ id, ...i }));
};

const Index = memo(() => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [details, setDetails] = useState({});

    const [
        { error },
        loading,
        { menuLeftAllocation },
        year,
        detailsLimit,
    ] = useSelector(({ loading: { effects }, registerOvertimeAdd, menu }) => [
        registerOvertimeAdd,
        effects,
        menu,
        registerOvertimeAdd.year,
        registerOvertimeAdd.detailsLimit,
    ]);



    useEffect(() => {
        dispatch({
            type: 'registerOvertimeAdd/GET_DETAILS',
        });
        dispatch({
            type: 'registerOvertimeAdd/GET_YEAR',
            payload: {},
        });
    }, []);

    useEffect(() => {
        if (!isEmpty(details)) {
            form.setFieldsValue({
                RegisterBeforeDays: details.RegisterBeforeDays,
                RegisterBeforeHours: details.RegisterBeforeHours,
                CancelBeforeDays: details.CancelBeforeDays,
                CancelBeforeHours: details.CancelBeforeHours,
            });
        }
    }, [details]);

    const changeStudent = (value) => {
        if (!value) {
            setDetails((prev) => ({
                ...prev,
                code: '',
                branchName: '',
                grade: '',
                className: '',
                classTypeId: '',
            }));
            return;
        }
        const student = detailsLimit?.filter(item => item.timetableSettingId === value);
        const newDetails = {
            ...details,
            RegisterBeforeDays: student[0] ? student[0]?.registerBeforeDays : '',
            RegisterBeforeHours: student[0] ? student[0]?.registerBeforeHours : '',
            CancelBeforeDays: student[0] ? student[0]?.cancelBeforeDays : '',
            CancelBeforeHours: student[0] ? student[0]?.cancelBeforeHours : '',
            id: student[0]?.id || '',
        };
        setDetails(newDetails);

        // if (newDetails?.schoolYearId && newDetails?.dayAdmission && newDetails?.classTypeId) {
        //     getMoney(newDetails);
        // }
    };
    const getStudents = (keyWord = '') => {
        dispatch({
            type: 'registerOvertimeAdd/GET_YEAR',
            payload: {
                keyWord: keyWord || undefined,
                page: variables.PAGINATION.PAGE,
                limit: variables.PAGINATION.PAGE_SIZE,
            },
        });
    };

    const onSearch = _.debounce((val) => {
        getStudents(val);
    }, 300);

    const onFinish = (values) => {
        const payload = {
            TimetableSettingId: values.year,
            RegisterBeforeDays: values.RegisterBeforeDays,
            RegisterBeforeHours: values.RegisterBeforeHours,
            CancelBeforeDays: values.CancelBeforeDays,
            CancelBeforeHours: values.CancelBeforeHours,
            IsRegistrationConfig: true,
            id: details?.id
        };
        dispatch({
            type: details.id ? 'registerOvertimeAdd/UPDATE_LIMIT' : 'registerOvertimeAdd/ADD_LIMIT',
            payload,
            callback: (response) => {
                if (response) {
                    dispatch({
                        type: 'registerOvertimeAdd/GET_DETAILS',
                    });
                }
            },
        });
    };

    return (
        <>
            <Helmet title="Giới hạn đăng ký" />


            <div className={classnames(styles['content-form'], styles['content-form-children'])}>
                <Form className={styles['layout-form']} layout="vertical" form={form} onFinish={onFinish}>
                    <div className="row">
                        <Text color="dark" className="mb10 d-flex justify-content-center w-100">
                            Giới hạn thời gian đăng ký/huỷ đăng ký học ngoài giờ
                        </Text>
                        <div className="col-lg-6 offset-lg-3">
                            <div className={styles['content-form']}>
                                <Loading
                                    loading={loading['registerOvertimeAdd/GET_DETAILS']}
                                    isError={error.isError}
                                    params={{
                                        error,
                                        type: 'container',

                                    }}
                                >
                                    <div className={classnames(styles['content-children'], 'mt0')}>
                                        <div className="row border-bottom">
                                            <div className="col-lg-12">
                                                <FormItem
                                                    label="Năm áp dụng"
                                                    name="year"
                                                    data={loading['registerOvertimeAdd/GET_DETAILS'] ? [] : year.map(item => ({ ...item, name: item?.fromYear || '-' }))}
                                                    type={variables.SELECT}
                                                    rules={[variables.RULES.EMPTY]}
                                                    onChange={changeStudent}
                                                    onSearch={onSearch}
                                                    notFoundContent={loading['registerOvertimeAdd/GET_DETAILS'] ? <Spin size="small" /> : null}
                                                    filterOption
                                                />
                                            </div>
                                        </div>

                                        <div className="row border-bottom mt20">
                                            <div className="col-lg-12 mb10">
                                                <Text color="success" size="large-medium">
                                                    Giới hạn thời gian đăng ký
                                                </Text>
                                            </div>
                                            <div className="col-lg-6">
                                                <FormItem
                                                    data={dataTime(30)}
                                                    label="Đăng ký trước"
                                                    name="RegisterBeforeDays"
                                                    type={variables.SELECT}
                                                    rules={[variables.RULES.EMPTY]}
                                                />
                                            </div>
                                            <div className="col-lg-6 mt30">
                                                <FormItem
                                                    data={dataHour(24)}
                                                    name="RegisterBeforeHours"
                                                    type={variables.SELECT}
                                                    rules={[variables.RULES.EMPTY]}
                                                />
                                            </div>
                                        </div>

                                        <div className="row border-bottom mt20">
                                            <div className="col-lg-12 mb10">
                                                <Text color="success" size="large-medium">
                                                    Giới hạn hủy đăng ký
                                                </Text>
                                            </div>
                                            <div className="col-lg-6">
                                                <FormItem
                                                    data={dataTime(30)}
                                                    label="Huỷ trước"
                                                    name="CancelBeforeDays"
                                                    type={variables.SELECT}
                                                    rules={[variables.RULES.EMPTY]}
                                                    prefix="ngày"
                                                />
                                            </div>
                                            <div className="col-lg-6 mt30">
                                                <FormItem
                                                    data={dataHour(24)}
                                                    name="CancelBeforeHours"
                                                    type={variables.SELECT}
                                                    rules={[variables.RULES.EMPTY]}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-12 mt20 mb10 d-flex justify-content-end align-items-center">

                                                <Button
                                                    className="ml-auto px25"
                                                    color="success"
                                                    htmlType="submit"
                                                    size="large"
                                                    loading={
                                                        loading['registerOvertimeAdd/ADD_LIMIT'] ||
                                                        loading['registerOvertimeAdd/UPDATE'] ||
                                                        loading['registerOvertimeAdd/GET_DETAILS']
                                                    }
                                                >
                                                    Lưu
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Loading>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </>
    );
});

export default Index;
