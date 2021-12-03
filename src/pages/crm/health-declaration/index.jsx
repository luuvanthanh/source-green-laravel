import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Checkbox } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import Text from '@/components/CommonComponent/Text';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from './styles.module.scss';

const genders = [
    { id: 'RADIO', name: 'Radio button' },
    { id: 'CHECKBOX', name: 'Checkbox' },
];
const Index = memo(() => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const [loading] = useSelector(({ loading: { effects } }) => [effects]);
    const mounted = useRef(false);
    const [checkbox, setCheckbox] = useState(false);
    const [deleteRows, setDeleteRows] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        mounted.current = false;
        return () => {
            mounted.current = false;
        };
    }, []);

    const onFinish = (values) => {
        const items = values.data.map((item) => ({
            ...item,
        }));
        const payload = {
            createRows: items.filter((item) => !item.id),
            updateRows: items.filter((item) => item.id),
            deleteRows,
        };
        dispatch({
            type: 'crmDeclaration/ADD',
            payload,
        });
    };
    useEffect(() => {
        dispatch({
            type: 'crmDeclaration/GET_DATA',
            payload: {},
            callback: (response) => {
                if (response) {
                    setStudents(response.parsePayload);
                    form.current.setFieldsValue({
                        data: response.parsePayload.map((item) => ({
                            ...item,
                        })),
                    });
                }
            },
        });
    }, []);

    const onChange = (e) => {
        setCheckbox(e.target.checked);
    };

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
                    <Form layout="vertical" onFinish={onFinish} form={form}>
                        <Pane className="card p20">
                            <Pane
                                className={classnames(
                                    'd-flex justify-content-between align-items-center mb20',
                                    styles['heading-container'],
                                )}
                            >
                                <Text color="dark">Thông tin cấu hình</Text>
                            </Pane>
                            <Pane className="row">
                                <Form.List name="data">
                                    {(fields, { add }) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <Pane className="offset-lg-12 col-lg-12 border-top pt15" key={field.key}>
                                                    <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                                        Học sinh {index + 1}
                                                    </Heading>
                                                    <Pane className="card">
                                                        <Pane >
                                                            <>
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
                                                                    <Pane className="col-lg-6">
                                                                        <FormItem
                                                                            label="Loại khai báo"
                                                                            name={[field.name, 'type']}
                                                                            fieldKey={[field.fieldKey, 'type']}
                                                                            data={genders}
                                                                            type={variables.SELECT}
                                                                        // rules={[variables.RULES.EMPTY]}
                                                                        />
                                                                    </Pane>
                                                                    <Pane className="col-lg-12">
                                                                        <h4 className={stylesModule['wrapper-title']}>Chi tiết</h4>
                                                                        <div className={stylesModule['wrapper-table']}>
                                                                            <h3 className={stylesModule.title}>Tên checkbox</h3>
                                                                            <Form.List label="Chi tiết" name={[field.name, 'detail']} fieldKey={[field.fieldKey, 'detail']}>
                                                                                {(fields, { add, remove }) => (
                                                                                    <Pane>
                                                                                        {fields.map((field, index) => (
                                                                                            <Pane
                                                                                                key={index}
                                                                                                className="d-flex mt20 border-bottom"
                                                                                            >
                                                                                                <Pane className="col-lg-10">
                                                                                                    <FormItem
                                                                                                        className={stylesModule.item}
                                                                                                        fieldKey={[field.fieldKey, 'name']}
                                                                                                        name={[field.name, 'name']}
                                                                                                        type={variables.INPUT}
                                                                                                    />
                                                                                                </Pane>
                                                                                                <Pane className="col-lg-2">
                                                                                                    {fields.length > 0 && (
                                                                                                        <div className={stylesModule.delete}>
                                                                                                            <span
                                                                                                                className="icon icon-remove"
                                                                                                                role="presentation"
                                                                                                                onClick={() => {
                                                                                                                    const student = students?.find(
                                                                                                                        (item, studentsIndex) => studentsIndex === index,
                                                                                                                    );
                                                                                                                    setDeleteRows((prev) => [...prev, student.id]);
                                                                                                                    remove(index);
                                                                                                                }}
                                                                                                            />
                                                                                                        </div>
                                                                                                    )}
                                                                                                </Pane>
                                                                                            </Pane>
                                                                                        ))}
                                                                                        <Pane className="mt10 ml10 mb10 d-flex align-items-center color-success pointer">
                                                                                            <span
                                                                                                onClick={() => add()}
                                                                                                role="presentation"
                                                                                                className={stylesModule.add}
                                                                                            >
                                                                                                <span className="icon-plus-circle mr5" />
                                                                                                Thêm
                                                                                            </span>
                                                                                        </Pane>
                                                                                    </Pane>
                                                                                )}
                                                                            </Form.List>
                                                                        </div>
                                                                    </Pane>
                                                                    <Pane className="col-lg-12 pt20 pb10">
                                                                        <Checkbox onChange={onChange}>Thêm textbox mô tả</Checkbox>
                                                                    </Pane>
                                                                    {checkbox ?
                                                                        <Pane className="col-lg-12">
                                                                            <FormItem
                                                                                label="Tên textbox"
                                                                                name={[field.name, 'text_box']}
                                                                                fieldKey={[field.fieldKey, 'text_box']}
                                                                                type={variables.INPUT}
                                                                            />
                                                                        </Pane>
                                                                        : ""
                                                                    }
                                                                </Pane>
                                                            </>
                                                        </Pane>
                                                    </Pane>
                                                </Pane>
                                            ))}
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
