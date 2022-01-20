import React, { memo, useEffect, useState } from 'react';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Form, Tabs, Spin } from 'antd';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import moment from 'moment';
import { get, head, isEmpty, last } from 'lodash';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

const { TabPane } = Tabs;

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
    const params = useParams();
    const history = useHistory();
    const [tab, setTab] = useState('tuition');
    const [details, setDetails] = useState({
        schoolYearId: '',
        startDate: '',
        endDate: '',
        dayAdmission: '',
        code: '',
        branchName: '',
        classType: '',
        className: '',
        classTypeId: '',
    });

    const [
        { error },
        loading,
        { menuLeftAllocation },
        year,
    ] = useSelector(({ loading: { effects }, registerOvertimeAdd, menu }) => [
        registerOvertimeAdd,
        effects,
        menu,
        registerOvertimeAdd.year,
    ]);

    console.log("year", year);

    useEffect(() => {
        dispatch({
            type: 'registerOvertimeAdd/GET_DETAILS',
            payload: {},
        });
        dispatch({
            type: 'registerOvertimeAdd/GET_YEAR',
            payload: {},
        });
    }, []);

    useEffect(() => {
        if (!isEmpty(details) && get(params, 'id')) {
            form.setFieldsValue({
                year: details.fromYear &&
                    details.toYear && [
                        moment(details.fromYear, variables.DATE_FORMAT.YEAR),
                        moment(details.toYear, variables.DATE_FORMAT.YEAR),
                    ],
                fromTime: details.fromTime && moment(details.fromTime, variables.DATE_FORMAT.HOUR),
                toTime: details.toTime && moment(details.toTime, variables.DATE_FORMAT.HOUR),
                periodDuration: details.periodDuration && details.periodDuration,
                fromDate: details.fromDate && moment(details.fromDate),
                toDate: details.toDate && moment(details.toDate),
            });
        }
    }, [details]);

    useEffect(() => {
        if (!isEmpty(details) && get(params, 'id')) {
            form.setFieldsValue({
                year: details.fromYear &&
                    details.toYear && [
                        moment(details.fromYear, variables.DATE_FORMAT.YEAR),
                        moment(details.toYear, variables.DATE_FORMAT.YEAR),
                    ],
                fromTime: details.fromTime && moment(details.fromTime, variables.DATE_FORMAT.HOUR),
                toTime: details.toTime && moment(details.toTime, variables.DATE_FORMAT.HOUR),
                periodDuration: details.periodDuration && details.periodDuration,
                RegisterBeforeDays: details.RegisterBeforeDays && moment(details.RegisterBeforeDays),
                toDate: details.toDate && moment(details.toDate),
            });
        }
    }, [details]);

    const onFinish = (values) => {
        const payload = {
            id: params?.id,
            year: 2030,
            RegisterBeforeDays: values.RegisterBeforeDays,
            RegisterBeforeHous: values.RegisterBeforeHous,
            CancelBeforeDays: values.CancelBeforeDays,
            CancelBeforeHours: values.CancelBeforeHours,
            IsRegistrationConfig: true,
        };
        console.log("va", payload)
        dispatch({
            type: 'registerOvertimeAdd/ADD_LIMIT',
            payload,
            callback: (response) => {
                // if (response) {
                //     history.goBack();
                // }
            },
        });
    };


    const changeStudent = (value) => {
        console.log("value", value);

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
        const student = year.find(item => item.id === value);
        if (student?.id) {
            const newDetails = {
                ...details,
                code: student?.fromYear || '',
                branchName: student?.class?.branch?.name || '',
                classType: student?.class?.classType?.name || '',
                className: student?.class?.name || '',
                classTypeId: student?.class?.classType?.id || '',
            };
            setDetails(newDetails);
            // if (newDetails?.schoolYearId && newDetails?.dayAdmission && newDetails?.classTypeId) {
            //     getMoney(newDetails);
            // }
        }
        console.log("detail", details);
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
                                                    name="RegisterBeforeHous"
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
                                                <p
                                                    className="btn-delete"
                                                    role="presentation"
                                                    loading={
                                                        loading['registerOvertimeAdd/ADD_LIMIT'] ||
                                                        loading['registerOvertimeAdd/UPDATE'] ||
                                                        loading['registerOvertimeAdd/GET_DETAILS']
                                                    }
                                                    onClick={() => history.goBack()}
                                                >
                                                    Hủy
                                                </p>
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
