import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import { useSelector } from 'dva';
import { variables } from '@/utils';
import Text from '@/components/CommonComponent/Text';
import classnames from 'classnames';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

const Index = memo(() => {
    const [form] = Form.useForm();

    const mounted = useRef(false);

    const {
        loading,
    } = useSelector(({ loading, crmAlert }) => ({
        loading,
        details: crmAlert.details,
        error: crmAlert.error,
    }));

    useEffect(() => {
        mounted.current = true;
        return mounted.current;
    }, []);

    return (
        <>
            <Helmet title="Cảnh báo" />
            <Pane className="pl20 pr20 mt20">
                <Pane
                    className={classnames(
                        'd-flex justify-content-between align-items-center mb20',
                        styles['heading-container'],
                    )}
                >
                    <Text color="dark">Cảnh báo</Text>
                </Pane>
                <Pane className="col-lg-6 offset-lg-3">
                    <Form layout="vertical" form={form} initialValues={{
                        data: [
                            {},
                        ],
                    }}>
                        <Pane className="card p20">
                            <Pane
                                className={classnames(
                                    'd-flex justify-content-between align-items-center mb20',
                                    styles['heading-container'],
                                )}
                            >
                                <Text color="dark">Thông tin cấu hình cảnh báo</Text>
                            </Pane>
                            <Pane >
                                <Form.List name="data">
                                    {(fields) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <>
                                                    <Pane className="row" key={index}>
                                                        <Pane className="col-lg-12">
                                                            <FormItem
                                                                label="Cài đặt nhắc nhở Lead chưa được liên hệ sau (giờ):"
                                                                name={[field.name, 'name']}
                                                                fieldKey={[field.fieldKey, 'name']}
                                                                type={variables.INPUT}
                                                            />
                                                        </Pane>
                                                        <Pane className="col-lg-12">
                                                            <FormItem
                                                                label="Cài đặt nhắc nhở công việc/ sự kiện sắp đến trước (ngày):"
                                                                name={[field.name, 'time']}
                                                                fieldKey={[field.fieldKey, 'time']}
                                                                type={variables.INPUT}
                                                            />
                                                        </Pane>
                                                    </Pane>
                                                </>
                                            ))}
                                        </>
                                    )}
                                </Form.List>

                            </Pane>
                            <Pane className="d-flex justify-content-between align-items-center">
                                <Button
                                    className="ml-auto px25"
                                    color="success"
                                    htmlType="submit"
                                    size="large"
                                    loading={loading['crmAlert/ADD'] || loading['crmAlert/GET_DATA']}
                                >
                                    Lưu
                                </Button>
                            </Pane>
                        </Pane>
                    </Form>
                </Pane>
            </Pane>
        </>
    );
});

export default Index;
