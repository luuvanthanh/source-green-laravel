import { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

import { isEmpty, get, } from 'lodash';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import stylesModule from './styles.module.scss';


const Index = memo(() => {

    const dispatch = useDispatch();

    const [formRef] = Form.useForm();

    const [
        { details },
        effects
    ] = useSelector(({ hrmDayNotication, loading, user, menu }) => [
        hrmDayNotication,
        loading,
        user,
        menu,
    ]);

    const onFinish = (values) => {
        dispatch({
            type: 'hrmDayNotication/ADD',
            payload: {
                workHour: {
                    date: values?.workHour_date,
                    hour: values?.workHour_hour,
                    type: "WORK_HOUR"
                },
                businessCard: {
                    date: values?.businessCard_date,
                    hour: values?.businessCard_hour,
                    type: "BUSINESS_CARD"
                },
                birthday: {
                    date: values?.birthday_date,
                    type: "BIRTHDAY"
                }
            },
            callback: (response, error) => {
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
    };


    useEffect(() => {
        dispatch({
            type: 'hrmDayNotication/GET_DETAILS',
            payload: {},
        });
    }, []);

    useEffect(() => {
        if (!isEmpty(details)) {
            formRef.setFieldsValue({
                workHour_date: details.find(i => i?.type === "WORK_HOUR")?.date,
                workHour_hour: details.find(i => i?.type === "WORK_HOUR")?.hour,
                businessCard_date: details.find(i => i?.type === "BUSINESS_CARD")?.date,
                businessCard_hour: details.find(i => i?.type === "BUSINESS_CARD")?.hour,
                birthday_date: details.find(i => i?.type === "BIRTHDAY")?.date,
            });
        }
    }, [details]);

    return (
        <div style={{ padding: 20 }}>
            <Form layout="vertical" form={formRef} onFinish={onFinish}>
                <Helmet title="Cấu hình ngày thông báo" />
                <div className="row">
                    <div className="col-lg-6 offset-lg-3">
                        <Heading type="form-title" className="pb20">
                            Cấu hình ngày thông báo
                        </Heading>
                        <Loading loading={effects['hrmDayNotication/GET_DETAILS']} >
                            <div className="card p20">
                                <Pane className="row border-bottom">
                                    <Pane className="col-lg-6 d-flex align-items-center">
                                        <h3 className={stylesModule['wrapper-title']}>Cho phép sửa đăng ký làm thêm trước:</h3>
                                    </Pane>
                                    <Pane className="col-lg-3">
                                        <FormItem
                                            className="checkbox-row-form no-label"
                                            name="workHour_date"
                                            label="Ngày"
                                            type={variables.INPUT_COUNT_FORM}
                                        />
                                    </Pane>
                                    <Pane className="col-lg-3">
                                        <FormItem
                                            className="checkbox-row-form no-label"
                                            label="Giờ"
                                            name="workHour_hour"
                                            type={variables.INPUT_COUNT_FORM}
                                        />
                                    </Pane>
                                </Pane>
                                <Pane className="row border-bottom">
                                    <Pane className="col-lg-6 d-flex align-items-center">
                                        <h3 className={stylesModule['wrapper-title']}>Cho phép sửa đăng ký đi công tác/ra ngoài/làm tại nhà trước:</h3>
                                    </Pane>
                                    <Pane className="col-lg-3">
                                        <FormItem
                                            className="checkbox-row-form no-label"
                                            name="businessCard_date"
                                            label="Ngày"
                                            type={variables.INPUT_COUNT_FORM}
                                        />
                                    </Pane>
                                    <Pane className="col-lg-3">
                                        <FormItem
                                            className="checkbox-row-form no-label"
                                            label="Giờ"
                                            name="businessCard_hour"
                                            type={variables.INPUT_COUNT_FORM}
                                        />
                                    </Pane>
                                </Pane>
                                <Pane className="row">
                                    <Pane className="col-lg-6 d-flex align-items-center">
                                        <h3 className={stylesModule['wrapper-title']}>Thông báo sinh nhật trước:</h3>
                                    </Pane>
                                    <Pane className="col-lg-3">
                                        <FormItem
                                            className="checkbox-row-form no-label"
                                            name="birthday_date"
                                            label="Ngày"
                                            type={variables.INPUT_COUNT_FORM}
                                        />
                                    </Pane>
                                </Pane>

                            </div>
                        </Loading>
                        <Pane className={stylesModule['wrapper-btn']} >
                            <Button color="success" size="large" htmlType="submit" loading={effects['hrmDayNotication/ADD']}>
                                Lưu
                            </Button>
                        </Pane>
                    </div>
                </div>
            </Form>
        </div>
    );
});

Index.propTypes = {
};

Index.defaultProps = {
};

export default Index;
