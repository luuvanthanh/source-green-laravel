import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import { DeleteOutlined } from '@ant-design/icons';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper } from '@/utils';
import stylesModule from './styles.module.scss';


const mapStateToProps = ({ loading, crmSaleLeadAdd }) => ({
    loading,
    details: crmSaleLeadAdd.details,
    error: crmSaleLeadAdd.error,
});
const General = memo(
    ({ dispatch, loading: { effects }, match: { params }, details, error, district, }) => {
        const formRef = useRef();
        const [files, setFiles] = Helper.isJSON(details?.file_image)
            ? useState(JSON.parse(details?.file_image))
            : useState([]);
        const mounted = useRef(false);
        const mountedSet = (setFunction, value) =>
            !!mounted?.current && setFunction && setFunction(value);
        const loadingSubmit =
            effects[`crmSaleLeadAdd/ADD`] ||
            effects[`crmSaleLeadAdd/UPDATE`] ||
            effects[`crmSaleLeadAdd/UPDATE_STATUS`];
        const loading = effects[`crmSaleLeadAdd/GET_DETAILS`];
        useEffect(() => {
            dispatch({
                type: 'crmSaleLeadAdd/GET_CITIES',
                payload: {},
            });
            dispatch({
                type: 'crmSaleLeadAdd/GET_SEARCH',
                payload: {},
            });
            dispatch({
                type: 'crmSaleLeadAdd/GET_BRANCHES',
                payload: {},
            });
            if (params.id) {
                dispatch({
                    type: 'crmSaleLeadAdd/GET_DISTRICTS',
                    payload: {},
                });
            }
        }, [params.id]);



        /**
         * Function submit form modal
         * @param {object} values values of form
         */
        const onFinish = (values) => {
            dispatch({
                type: params.id ? 'crmSaleLeadAdd/UPDATE' : 'crmSaleLeadAdd/ADD',
                payload: params.id
                    ? { ...details, ...values, id: params.id, file_image: JSON.stringify(files) }
                    : { ...values, file_image: JSON.stringify(files), status: 'WORKING' },
                callback: (response, error) => {
                    if (response) {
                        history.goBack();
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
        };

        useEffect(() => {
            mounted.current = true;
            return mounted.current;
        }, []);

        useEffect(() => {
            if (!isEmpty(details) && params.id) {
                formRef.current.setFieldsValue({
                    ...details,
                    ...head(details.positionLevel),
                    startDate:
                        head(details.positionLevel)?.startDate &&
                        moment(head(details.positionLevel)?.startDate),
                    birth_date: details.birth_date && moment(details.birth_date),
                    dateOfIssueIdCard: details.dateOfIssueIdCard && moment(details.dateOfIssueIdCard),
                    dateOff: details.dateOff && moment(details.dateOff),
                });
                if (Helper.isJSON(details?.file_image)) {
                    mountedSet(setFiles, JSON.parse(details?.file_image));
                }
            }
        }, [details]);


        return (
            <div className={stylesModule['wrapper-container']}>
                <div className={stylesModule['wrapper-logo']}>
                    <img className={stylesModule.img} src="/images/webForm.png" alt="bmi" />
                </div>
                <Pane className={classnames(stylesModule['container-main'], "col-lg-6 offset-lg-3")}>
                    <Pane className="card">
                        <Form layout="vertical" ref={formRef} onFinish={onFinish}>
                            <Loading loading={loading} isError={error.isError} params={{ error }}>
                                <Pane className={stylesModule['wrapper-title']}>
                                    <h3 className={stylesModule.title}>
                                        Đăng ký khóa học online cho trẻ
                                    </h3>
                                    <h3 className={stylesModule.description}>Chào Ba Mẹ, Ba Mẹ vui lòng dành ít phút để điền thông tin sau đây, để bộ phận Chuyên Môn của Clover có thể liên hệ và tư vấn cho Ba Mẹ sớm nhất nhé! Trân trọng!</h3>
                                </Pane>
                                <Pane className={stylesModule['wrapper-main']}>
                                    <h3 className={stylesModule.title}>THÔNG TIN CHUNG</h3>
                                    <Pane className={classnames(stylesModule.form, "row")}>
                                        <Pane className="col-lg-6">
                                            <FormItem
                                                name="full_name"
                                                label="Họ và tên Ba/Mẹ"
                                                type={variables.INPUT}
                                                rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                                            />
                                        </Pane>
                                        <Pane className="col-lg-6">
                                            <FormItem
                                                name="phone"
                                                label="Số điện thoại của Ba/Mẹ"
                                                type={variables.INPUT}
                                                rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
                                            />
                                        </Pane>
                                        <Pane className="col-lg-6">
                                            <FormItem
                                                name="email"
                                                label="Email của Ba/Mẹ"
                                                type={variables.INPUT}
                                            />
                                        </Pane>
                                        <Pane className="col-lg-6">
                                            <FormItem
                                                options={['id', 'name']}
                                                name="district_id"
                                                data={district}
                                                placeholder="Chọn"
                                                type={variables.SELECT}
                                                label="Cơ sở Ba/Mẹ quan tâm"
                                            />
                                        </Pane>
                                        <Pane className="col-lg-6">
                                            <FormItem
                                                options={['id', 'name']}
                                                name="district_id"
                                                data={district}
                                                placeholder="Chọn"
                                                type={variables.SELECT}
                                                label="Quận của trẻ đang sống"
                                            />
                                        </Pane>
                                    </Pane>
                                </Pane>
                            </Loading>
                        </Form>
                        <Form
                            layout="vertical"
                            initialValues={{
                                data: [
                                    {
                                        ...params,
                                        birth_date: params.birth_date && moment(params.birth_date),
                                    },
                                ],
                            }}
                            ref={formRef}
                            onFinish={onFinish}
                        >
                            <Pane>
                                <Pane >
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <Pane className={stylesModule['wrapper-students']}>
                                                <Form.List name="data" >
                                                    {(fields, { add, remove }) => (
                                                        <>
                                                            {fields.map((field, index) => (
                                                                <Pane
                                                                    key={field.key}
                                                                    className={stylesModule.main}
                                                                >
                                                                    <Heading type="form-title" className={stylesModule.title}>
                                                                        THÔNG TIN TRẺ
                                                                    </Heading>
                                                                    <div className="d-flex justify-content-between">
                                                                        <Heading type="form-block-title" className={stylesModule.description}>
                                                                            Trẻ {index + 1}
                                                                        </Heading>
                                                                        <DeleteOutlined
                                                                            onClick={() => {
                                                                                remove(index);
                                                                            }}
                                                                            className={stylesModule.delete}
                                                                        />
                                                                    </div>
                                                                    <Pane className="row">
                                                                        <Pane className="col-lg-6">
                                                                            <FormItem
                                                                                label="Họ và tên trẻ 1"
                                                                                name={[field.name, 'full_name']}
                                                                                fieldKey={[field.fieldKey, 'full_name']}
                                                                                type={variables.INPUT}
                                                                            />
                                                                        </Pane>
                                                                        <Pane className="col-lg-6">
                                                                            <FormItem
                                                                                name={[field.name, 'birth_date']}
                                                                                label="Sinh nhật trẻ (ngày/tháng/năm)"
                                                                                fieldKey={[field.fieldKey, 'birth_date']}
                                                                                type={variables.DATE_PICKER}
                                                                            />
                                                                        </Pane>
                                                                    </Pane>

                                                                </Pane>
                                                            ))}
                                                            <Pane className={stylesModule.btn}>
                                                                <Button
                                                                    color="success"
                                                                    ghost
                                                                    icon="plus"
                                                                    onClick={() => {
                                                                        add();
                                                                    }}
                                                                >
                                                                    Thêm trẻ
                                                                </Button>
                                                            </Pane>

                                                        </>
                                                    )}
                                                </Form.List>
                                            </Pane>
                                        </div>
                                    </div>
                                </Pane>
                                <Pane className={stylesModule['wrapper-button']}>
                                    <Button
                                        className={stylesModule.btn}
                                        color="success"
                                        htmlType="submit"
                                        size="large"
                                        loading={loadingSubmit || loading}
                                    >
                                        GỬI ĐĂNG KÝ
                                    </Button>
                                </Pane>
                            </Pane>
                        </Form>
                    </Pane>
                </Pane>
                <div className={stylesModule['wrapper-footer']}> Copyright 2021 © ❤️ Clover Montessori </div>
            </div>
        );
    },
);

General.propTypes = {
    dispatch: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    details: PropTypes.objectOf(PropTypes.any),
    loading: PropTypes.objectOf(PropTypes.any),
    error: PropTypes.objectOf(PropTypes.any),
    district: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
    match: {},
    details: {},
    dispatch: () => { },
    loading: {},
    error: {},
    district: [],
};

export default withRouter(connect(mapStateToProps)(General));
