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
        detailsTime,
    ] = useSelector(({ loading: { effects }, registerOvertimeAdd, menu }) => [
        registerOvertimeAdd,
        effects,
        menu,
        registerOvertimeAdd.year,
        registerOvertimeAdd.detailsTime,
    ]);

    console.log("detailsTime", detailsTime);

    useEffect(() => {
        dispatch({
            type: 'registerOvertimeAdd/GET_TIME',
            payload: {},
        });
        dispatch({
            type: 'registerOvertimeAdd/GET_YEAR',
            payload: {},
        });
    }, []);

    useEffect(() => {
        const strFromTimeWeekday = `${detailsTime?.fromTimeWeekday?.hours}:${detailsTime?.fromTimeWeekday?.minutes}`;
        const strToTimeWeekday = `${detailsTime?.toTimeWeekday?.hours}:${detailsTime?.toTimeWeekday?.minutes}`;
        const strFromTimeWeekend = `${detailsTime?.fromTimeWeekend?.hours}:${detailsTime?.fromTimeWeekend?.minutes}`;
        const strToTimeWeekend = `${detailsTime?.toTimeWeekend?.hours}:${detailsTime?.toTimeWeekend?.minutes}`;
        form.setFieldsValue({
            FromTimeWeekday: detailsTime?.fromTimeWeekday && moment(strFromTimeWeekday, variables.DATE_FORMAT.HOUR).add(7, 'hours').format("HH:mm"),
            ToTimeWeekday: detailsTime?.toTimeWeekday && moment(strToTimeWeekday, variables.DATE_FORMAT.HOUR).add(7, 'hours').format("HH:mm"),
            FromTimeWeekend: detailsTime?.fromTimeWeekend && moment(strFromTimeWeekend, variables.DATE_FORMAT.HOUR).add(7, 'hours').format("HH:mm"),
            ToTimeWeekend: detailsTime?.toTimeWeekend && moment(strToTimeWeekend, variables.DATE_FORMAT.HOUR).add(7, 'hours').format("HH:mm"),
        });
    }, []);
console.log("form",form)
    //     console.log("123",hourStr);
    // console.log("sss", detailsTime.fromTimeWeekday && moment(hourStr, variables.DATE_FORMAT.HOUR).add(7, 'hours').format("HH:mm"),);

    const onFinish = (values) => {
        const payload = {
            id: params?.id,
            year: 2030,
            FromTimeWeekday: values.FromTimeWeekday && moment(values.FromTimeWeekday, variables.DATE_FORMAT.HOUR),
            ToTimeWeekday: values.ToTimeWeekday && moment(values.ToTimeWeekday, variables.DATE_FORMAT.HOUR),
            FromTimeWeekend: values.FromTimeWeekend && moment(values.FromTimeWeekend, variables.DATE_FORMAT.HOUR),
            ToTimeWeekend: values.ToTimeWeekend && moment(values.ToTimeWeekend, variables.DATE_FORMAT.HOUR),
            IsRegistrationConfig: false,
        };
        console.log("va", payload)
        dispatch({
            type: 'registerOvertimeAdd/ADD_TIME',
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
