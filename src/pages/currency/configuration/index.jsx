import { memo, useRef, useState, useEffect } from 'react';
import { Form } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useParams } from 'umi';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Text from '@/components/CommonComponent/Text';
import Quill from '@/components/CommonComponent/Quill';
import { Helmet } from 'react-helmet';
import csx from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import stylesModule from './styles.module.scss';

const Students = memo(() => {

    const params = useParams();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const mounted = useRef(false);
    const [fileImage, setFileImage] = useState([null]);

    const mountedSet = (setFunction, value) =>
        !!mounted?.current && setFunction && setFunction(value);
    const {
        loading: { effects },

    } = useSelector(({ loading }) => ({
        loading,

    }));

    const [students, setStudents] = useState([]);
    const loading = effects[`currencyConfiguration/GET_STUDENTS`];
    const loadingSubmit = effects[`currencyConfiguration/ADD_STUDENTS`];

    useEffect(() => {
        mounted.current = true;
        return mounted.current;
    }, []);

    useEffect(() => {
        dispatch({
            type: 'currencyConfiguration/GET_RELATIONSHIPS',
            payload: {},
        });
        dispatch({
            type: 'currencyConfiguration/GET_STUDENTS',
            payload: {
                customer_lead_id: params.id,
            },
            callback: () => {

            },
        });
    }, [params.id]);

    useEffect(() => {
        if (!isEmpty(students)) {
            mountedSet(
                setFileImage,
                students.map((item) => item.file_image || null),
            );
        }
    }, [students]);

    return (
        <>
            <Helmet title="Cấu hình nội dung" />
            <Pane className="p20">
                <div className="d-flex justify-content-between align-items-center mb10">
                    <Text color="dark">Cấu hình nội dung</Text>
                </div>
                <Pane>
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
                        form={form}
                    >
                        <Pane>
                            <Pane>
                                <Pane className="card">
                                    <div className="d-block p20">
                                        <Heading type="form-title" style={{ marginBottom: 20 }}>
                                            Thời gian nộp học phí
                                        </Heading>
                                        <div className={stylesModule['content-top']}>
                                            <h3 className={stylesModule.left}>Trước ngày</h3>
                                            <FormItem
                                                options={['id', 'name']}
                                                name="sex"
                                                placeholder="Chọn"
                                                type={variables.SELECT}
                                            />
                                            <h3 className={stylesModule.right}>Hằng tháng</h3>
                                        </div>
                                    </div>
                                </Pane>
                                <Pane className="card">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <Form.List name="data">
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map((field, index) => (
                                                            <Pane
                                                                key={field.key}
                                                                className={csx('pb-20', 'border-bottom', 'position-relative')}
                                                                style={{ padding: 20 }}
                                                            >
                                                                <Heading type="form-title" style={{ marginBottom: 20 }}>
                                                                    Thông tin thanh toán
                                                                </Heading>
                                                                <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                                                    Hình thức {index + 1}
                                                                </Heading>

                                                                <Pane className="row">
                                                                    <Pane className="col-lg-12">
                                                                        <FormItem
                                                                            label="Tên hình thức"
                                                                            name={[field.name, 'full_name']}
                                                                            fieldKey={[field.fieldKey, 'full_name']}
                                                                            type={variables.INPUT}
                                                                            rules={[
                                                                                variables.RULES.EMPTY_INPUT,
                                                                                variables.RULES.MAX_LENGTH_INPUT,
                                                                            ]}
                                                                        />
                                                                    </Pane>
                                                                    <Pane className="col-lg-12">
                                                                        <div className="ant-col ant-form-item-label">
                                                                            <label>
                                                                                <span>Nội dung</span>
                                                                            </label>
                                                                        </div>
                                                                        <Quill />
                                                                    </Pane>
                                                                </Pane>

                                                                {fields.length > 0 && (
                                                                    <DeleteOutlined
                                                                        className="position-absolute"
                                                                        style={{ top: 20, right: 20 }}
                                                                        onClick={() => {
                                                                            remove(index);
                                                                        }}
                                                                    />
                                                                )}
                                                            </Pane>
                                                        ))}

                                                        <Pane style={{ padding: 20 }} className="border-bottom">
                                                            <Button
                                                                color="success"
                                                                ghost
                                                                icon="plus"
                                                                onClick={() => {
                                                                    add();
                                                                    setStudents([
                                                                        ...students,
                                                                        {
                                                                            id: uuidv4(),
                                                                            birth_date: Helper.getDateTime({
                                                                                value: Helper.setDate({
                                                                                    ...variables.setDateData,
                                                                                }),
                                                                                format: variables.DATE_FORMAT.DATE_AFTER,
                                                                                isUTC: false,
                                                                            }),
                                                                        },
                                                                    ]);
                                                                    mountedSet(setFileImage, [...fileImage, null]);
                                                                }}
                                                            >
                                                                Thêm hình thức
                                                            </Button>
                                                        </Pane>
                                                    </>
                                                )}
                                            </Form.List>
                                        </div>
                                    </div>
                                </Pane>
                                <Pane className="card">
                                    <div className="d-block p20">
                                        <Heading type="form-title" style={{ marginBottom: 20 }}>
                                            Thông tin chào kết thúc
                                        </Heading>
                                        <div >
                                            <div className="ant-col ant-form-item-label">
                                                <label>
                                                    <span>Nội dung</span>
                                                </label>
                                            </div>
                                            <Quill />
                                        </div>
                                    </div>
                                </Pane>
                                <Pane className="d-flex justify-content-between align-items-center mb20">
                                    <Button
                                        className="ml-auto px25"
                                        color="success"
                                        htmlType="submit"
                                        size="large"
                                        loading={loadingSubmit || loading}
                                    >
                                        Lưu
                                    </Button>
                                </Pane>
                            </Pane>
                        </Pane>
                    </Form>
                </Pane>
            </Pane>
        </>
    );
});

export default Students;