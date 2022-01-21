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
import moment from 'moment';
import { isEmpty, } from 'lodash';


const Index = memo(() => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [details, setDetails] = useState({});

    const [
        { error },
        loading,
        { menuLeftAllocation },
        year,
        detailsTime,
    ] = useSelector(({ loading: { effects }, registerOvertimeAdd, menu }) => [
        registerOvertimeAdd,
        effects,
        menu,
        registerOvertimeAdd.year,
        registerOvertimeAdd.detailsTime,
    ]);


    useEffect(() => {
        dispatch({
            type: 'registerOvertimeAdd/GET_TIME',
        });
        dispatch({
            type: 'registerOvertimeAdd/GET_YEAR',
            payload: {},
        });
    }, []);

    useEffect(() => {
        if (!isEmpty(details)) {
            form.setFieldsValue({
                FromTimeWeekday: details?.FromTimeWeekday && moment(details?.FromTimeWeekday, variables.DATE_FORMAT.HOUR),
                ToTimeWeekday: details?.ToTimeWeekday && moment(details?.ToTimeWeekday, variables.DATE_FORMAT.HOUR),
                FromTimeWeekend: details?.FromTimeWeekend && moment(details?.FromTimeWeekend, variables.DATE_FORMAT.HOUR),
                ToTimeWeekend: details?.ToTimeWeekend && moment(details?.ToTimeWeekend, variables.DATE_FORMAT.HOUR),
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
        const student = detailsTime?.filter(item => item.timetableSettingId === value);
        const newDetails = {
            ...details,
            FromTimeWeekday: (student[0]?.fromTimeWeekday && moment(student[0]?.fromTimeWeekday, variables.DATE_FORMAT.HOUR).add(7, 'hours').format("HH:mm")) || '',
            ToTimeWeekday: (student[0]?.toTimeWeekday && moment(student[0]?.toTimeWeekday, variables.DATE_FORMAT.HOUR).add(7, 'hours').format("HH:mm")) || '',
            FromTimeWeekend: (student[0]?.fromTimeWeekend && moment(student[0]?.fromTimeWeekend, variables.DATE_FORMAT.HOUR).add(7, 'hours').format("HH:mm")) || '',
            ToTimeWeekend: (student[0]?.toTimeWeekend && moment(student[0]?.toTimeWeekend, variables.DATE_FORMAT.HOUR).add(7, 'hours').format("HH:mm")) || '',
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
            FromTimeWeekday: values.FromTimeWeekday && moment(values.FromTimeWeekday, variables.DATE_FORMAT.HOUR),
            ToTimeWeekday: values.ToTimeWeekday && moment(values.ToTimeWeekday, variables.DATE_FORMAT.HOUR),
            FromTimeWeekend: values.FromTimeWeekend && moment(values.FromTimeWeekend, variables.DATE_FORMAT.HOUR),
            ToTimeWeekend: values.ToTimeWeekend && moment(values.ToTimeWeekend, variables.DATE_FORMAT.HOUR),
            IsRegistrationConfig: false,
            id: details?.id
        };
        dispatch({
            type: details.id ? 'registerOvertimeAdd/UPDATE_TIME' : 'registerOvertimeAdd/ADD_TIME',
            payload,
            callback: (response) => {
                if (response) {
                    dispatch({
                        type: 'registerOvertimeAdd/GET_TIME',
                    });
                }
            },
        });
    };

    return (
        <>
            <Helmet title="Thời gian đăng ký" />


            <div className={classnames(styles['content-form'], styles['content-form-children'])}>
                <Form className={styles['layout-form']} layout="vertical" form={form} onFinish={onFinish}>
                    <div className="row">
                        <Text color="dark" className="mb10 d-flex justify-content-center w-100">
                            Cấu hình thời gian đăng ký học ngoài giờ
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
                                                    Trong tuần (thứ 2 đến thứ 6)
                                                </Text>
                                            </div>
                                            <div className="col-lg-6">
                                                <FormItem

                                                    label="Bắt đầu"
                                                    name="FromTimeWeekday"
                                                    rules={[variables.RULES.EMPTY]}
                                                    type={variables.TIME_PICKER}
                                                />
                                            </div>
                                            <div className="col-lg-6">
                                                <FormItem
                                                    label="Kết thúc"

                                                    name="ToTimeWeekday"
                                                    rules={[variables.RULES.EMPTY]}
                                                    type={variables.TIME_PICKER}
                                                />
                                            </div>
                                        </div>

                                        <div className="row border-bottom mt20">
                                            <div className="col-lg-12 mb10">
                                                <Text color="success" size="large-medium">
                                                    Cuối tuần (Thứ 7)
                                                </Text>
                                            </div>
                                            <div className="col-lg-6">
                                                <FormItem

                                                    label="Bắt đầu"
                                                    name="FromTimeWeekend"
                                                    rules={[variables.RULES.EMPTY]}
                                                    type={variables.TIME_PICKER}
                                                    prefix="ngày"
                                                />
                                            </div>
                                            <div className="col-lg-6">
                                                <FormItem
                                                    label="Kết thúc"

                                                    name="ToTimeWeekend"
                                                    rules={[variables.RULES.EMPTY]}
                                                    type={variables.TIME_PICKER}
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
