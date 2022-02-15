import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
import styles from '@/assets/styles/Common/common.scss';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import Text from '@/components/CommonComponent/Text';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
import { DeleteOutlined } from '@ant-design/icons';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from './styles.module.scss';

const Index = memo(() => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const mounted = useRef(false);
    const [deleteRows, setDeleteRows] = useState([]);

    const {
        loading,
        details,
    } = useSelector(({ loading, crmDeclaration }) => ({
        loading,
        details: crmDeclaration.details,
        error: crmDeclaration.error,
    }));


    const onFinish = (values) => {
        const items = values.data.map((item) => ({
            ...item,
        }));
        const payload = {
            create_rows: items.filter((item) => !item.id),
            update_rows: items.filter((item) => item.id),
            delete_rows: deleteRows,
        };
        dispatch({
            type: 'crmDeclaration/ADD',
            payload,
            callback: (response, error) => {
                if (response) {
                    dispatch({
                        type: 'crmDeclaration/GET_DATA',
                        payload: {},
                        callback: (response) => {
                            if (response) {
                                form.setFieldsValue({
                                    data: response.parsePayload,
                                });
                            }
                        },
                    });
                }
                if (error) {
                    if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
                        error.data.errors.forEach((item) => {
                            form.current.setFields([
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
            type: 'crmDeclaration/GET_DATA',
            payload: {},
            callback: (response) => {
                if (response) {
                    form.setFieldsValue({
                        data: response.parsePayload,
                    });
                }
            },
        });
    }, []);

    useEffect(() => {
        mounted.current = true;
        return mounted.current;
    }, []);

    return (
        <>
            <Helmet title="Cấu hình khai báo y tế" />
            <Pane className="pl20 pr20 mt20">
                <Pane
                    className={classnames(
                        'd-flex justify-content-between align-items-center mb20',
                        styles['heading-container'],
                    )}
                >
                    <Text color="dark">Cấu hình khai báo y tế</Text>
                </Pane>
                <Pane className="col-lg-6 offset-lg-3">
                    <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
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
                                <Text color="dark">Thông tin cấu hình khai báo y tế</Text>
                            </Pane>
                            <Pane className="row">
                                <Form.List name="data">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, index) => {
                                                let file = {};
                                                const { data } = form.getFieldsValue();
                                                const itemData = data?.find((item, indexWater) => indexWater === index);
                                                file = details.find((item) => item.id === itemData?.id);
                                                return (
                                                    <>
                                                        <Pane className="offset-lg-12 col-lg-12 border-top pt15" key={field.key}>
                                                            <Pane className={stylesModule['wrapper-content']}>
                                                                <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                                                    Thông tin {index + 1}
                                                                </Heading>
                                                                <Pane className="d-flex">
                                                                    <Pane className={stylesModule.btn}>
                                                                        <FormItem
                                                                            valuePropName="checked"
                                                                            label="Sử dụng"
                                                                            name={[field.name, 'use']}
                                                                            fieldKey={[field.fieldKey, 'use']}
                                                                            type={variables.SWITCH}
                                                                        />
                                                                    </Pane>
                                                                    {fields.length > 0 && (
                                                                        <DeleteOutlined
                                                                            className={stylesModule.delete}
                                                                            onClick={(e) => {
                                                                                setDeleteRows((prev) => [...prev, file.id]);
                                                                                remove(index);
                                                                                e.stopPropagation();
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Pane>
                                                            </Pane>
                                                            <Pane className="card">
                                                                <Pane >
                                                                    <Pane className="row">
                                                                        <Pane className="col-lg-12">
                                                                            <FormItem
                                                                                label="Tên thông tin"
                                                                                name={[field.name, 'name']}
                                                                                fieldKey={[field.fieldKey, 'name']}
                                                                                type={variables.INPUT}
                                                                                rules={[variables.RULES.EMPTY]}
                                                                            />
                                                                        </Pane>
                                                                        <Pane className="col-lg-12">
                                                                            <FormItem
                                                                                className="checkbox-row checkbox-small"
                                                                                label="Hiển thị câu trả lời Có/ Không"
                                                                                name={[field.name, 'use_yes_or_no']}
                                                                                fieldKey={[field.fieldKey, 'use_yes_or_no']}
                                                                                type={variables.CHECKBOX_FORM}
                                                                                valuePropName="checked"
                                                                            />
                                                                        </Pane>
                                                                        <Pane className="col-lg-12">
                                                                            <FormItem
                                                                                className="checkbox-row checkbox-small"
                                                                                label="Hiển thị text box mô tả khác"
                                                                                name={[field.name, 'use_input']}
                                                                                fieldKey={[field.fieldKey, 'use_input']}
                                                                                type={variables.CHECKBOX_FORM}
                                                                                valuePropName="checked"
                                                                            />
                                                                        </Pane>
                                                                    </Pane>
                                                                </Pane>
                                                            </Pane>
                                                        </Pane>
                                                    </>
                                                );
                                            })}
                                            <Pane className="pl20 pb20" >
                                                <Button
                                                    color="success"
                                                    ghost
                                                    icon="plus"
                                                    onClick={() => {
                                                        add();
                                                    }}
                                                >
                                                    Thêm thông tin
                                                </Button>
                                            </Pane>
                                        </>
                                    )}
                                </Form.List>

                            </Pane>
                        </Pane>
                        <Pane className="d-flex justify-content-between align-items-center mb20">
                            <Button
                                className="ml-auto px25"
                                color="success"
                                htmlType="submit"
                                size="large"
                                loading={loading['crmDeclaration/ADD'] || loading['crmDeclaration/GET_DATA']}
                            >
                                Lưu
                            </Button>
                        </Pane>
                    </Form>
                </Pane>
            </Pane>
        </>
    );
});

export default Index;
