import { memo, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Collapse, InputNumber, Radio, Upload } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import { variables } from '@/utils';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
import Text from '@/components/CommonComponent/Text';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
// import variablesModules from '../variables';
import stylesModule from '../styles.module.scss';

const { Group: RadioGroup } = Radio;
const infomationTypes = {
    BUTTON: 'BUTTON',
    0: 'FORM',
    LINK: 'LINK',
    FILE: 'FILE',
};

const { Panel } = Collapse;
// const { Item: FormItemAntd } = Form;
const Index = memo(() => {
    const [form] = Form.useForm();
    // const dispatch = useDispatch();
    // const params = useParams();
    const mounted = useRef(false);
    // const { error } = useSelector(({ menu, loading, crmChatbotDefaultScenario }) => ({
    //     loading,
    //     menuLeftChildDevelop: menu.menuLeftChildDevelop,
    //     error: crmChatbotDefaultScenario.error,
    // }));
    const [formType, setFormType] = useState({
        0: infomationTypes.FORM,
    });

    const switchType = useCallback((key, value) => {
        setFormType((prevValue) => ({
            ...prevValue,
            [key]: value,
        }));
    });

    useEffect(() => {
        mounted.current = true;
        return mounted.current;
    }, []);

    const typeRadioGroup = useMemo(
        () => (key) => (
            <Pane className="row">
                <Pane className="col">
                    <Form.Item name={[key, 'type']}>
                        <RadioGroup onChange={({ target: { value } }) => switchType(key, value)}>
                            <Radio value={infomationTypes.BUTTON}>Thêm button</Radio>
                            <Radio value={infomationTypes.FORM}>Tạo form</Radio>
                            <Radio value={infomationTypes.LINK}>Chèn link</Radio>
                            <Radio value={infomationTypes.FILE}>Chèn file đính kèm</Radio>
                        </RadioGroup>
                    </Form.Item>
                </Pane>
            </Pane>
        ),
        [switchType],
    );

    return (
        <div className={stylesModule['wraper-container']}>
            <Helmet title="Kịch bản mặc định" />
            <Pane className="pl20 pr20 pt20">
                <Text color="dark" className="pb20">Kịch bản mặc định</Text>
                <Pane >
                    <Form layout="vertical" form={form} initialValues={{
                        data: [
                            {},
                        ],
                    }}>
                        <Form.List name="data">
                            {(fields, { add }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <>
                                            <Pane className="card p20" key={field.key}>
                                                <Heading type="form-block-title" className="mb15">
                                                    Thông tin nội dung {index + 1}
                                                </Heading>
                                                <Pane className="row">
                                                    <Pane className="col-lg-12">
                                                        <FormItem
                                                            label="Nội dung tin nhắn"
                                                            name={[field.name, 'nameCriteria']}
                                                            fieldKey={[field.fieldKey, 'nameCriteria']}
                                                            type={variables.TEXTAREA}
                                                        />
                                                    </Pane>
                                                    <Pane className="col-lg-6 pb15">
                                                        <div className={styles['form-item']}>
                                                            <Pane className="row">
                                                                <Pane className="col-lg-12">
                                                                    <label htmlFor="userId" className={stylesModule['wrapper-lable']}>Thời gian hiển thị tin nhắn</label>
                                                                </Pane>
                                                                <Pane className="col-lg-2">
                                                                    <InputNumber
                                                                        min="0"
                                                                        max="60"
                                                                        step="1"
                                                                        placeholder="Nhập"
                                                                        style={{ width: '100%' }}
                                                                    />
                                                                </Pane>
                                                            </Pane>
                                                        </div>
                                                    </Pane>
                                                    <Pane className="col-lg-12">
                                                        <Heading type="form-block-title" className="pt20 border-top">
                                                            Thông tin thêm
                                                        </Heading>
                                                    </Pane>
                                                    <Pane className="col-lg-12">
                                                        <Form.List name="data">
                                                            {(fields, { add, remove }) => (
                                                                <>
                                                                    {fields.map((field, index) => {
                                                                        const detailForm = (key) => {
                                                                            switch (formType[key]) {
                                                                                case infomationTypes.BUTTON:
                                                                                    return (
                                                                                        <Pane className="col-lg-12 p0">
                                                                                            <Pane className="row">
                                                                                                <Pane className="col-lg-3">
                                                                                                    <FormItem
                                                                                                        className={stylesModule.item}
                                                                                                        fieldKey={[field.fieldKey, 'content']}
                                                                                                        name={[field.name, 'content']}
                                                                                                        type={variables.INPUT}
                                                                                                        label="Tiêu đề button"
                                                                                                    />
                                                                                                </Pane>
                                                                                                <Pane className="col-lg-12">
                                                                                                    <FormItem
                                                                                                        className={stylesModule.item}
                                                                                                        fieldKey={[field.fieldKey, 'content']}
                                                                                                        name={[field.name, 'content']}
                                                                                                        type={variables.INPUT}
                                                                                                        label="Nội dung hiển thị sau hành động"
                                                                                                    />
                                                                                                </Pane>
                                                                                                <Pane className="col-lg-12">
                                                                                                    <>
                                                                                                        <h3 className={stylesModule['wrapper-link-title']}>Đính kèm file</h3>
                                                                                                        <div className='d-flex'>
                                                                                                            <Upload>
                                                                                                                <Button color="white" icon="upload1" className={stylesModule['wrapper-btn-add']}>
                                                                                                                    Tải lên
                                                                                                                </Button>
                                                                                                            </Upload>
                                                                                                            <span className={stylesModule['wrapper-title-add']}>
                                                                                                                Hỗ trợ định dạng: .pdf, .doc, .docx, .jpeg, .jpg, .png , .mp4 . Dung lượng không được quá 10mb
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </>
                                                                                                </Pane>
                                                                                            </Pane>
                                                                                        </Pane>
                                                                                    );
                                                                                case infomationTypes.FORM:
                                                                                    return (
                                                                                        <Pane className="col-lg-12 p0">
                                                                                            <h4 className={stylesModule['wrapper-title']}>Nội dung form</h4>
                                                                                            <div className={stylesModule['wrapper-table']}>
                                                                                                <div className={stylesModule['card-heading']}>
                                                                                                    <div className={stylesModule.col}>
                                                                                                        <p className={stylesModule.norm}>Tên trường thông tin</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <Form.List label="Nội dung form" name={[field.name, 'childEvaluateDetailChildrent']} fieldKey={[field.fieldKey, 'childEvaluateDetailChildrent']}>
                                                                                                    {(fieldss, { add, remove }) => (
                                                                                                        <Pane>
                                                                                                            {fieldss.map((fieldItem, index) => (
                                                                                                                <>
                                                                                                                    <Pane
                                                                                                                        key={index}
                                                                                                                        className="d-flex"
                                                                                                                    >
                                                                                                                        <div className={stylesModule['card-item']}>
                                                                                                                            <div className={classnames(stylesModule.col)}>
                                                                                                                                <FormItem
                                                                                                                                    className={stylesModule.item}
                                                                                                                                    fieldKey={[fieldItem.fieldKey, 'content']}
                                                                                                                                    name={[fieldItem.name, 'content']}
                                                                                                                                    type={variables.INPUT}
                                                                                                                                />
                                                                                                                            </div>
                                                                                                                            <div className={classnames(stylesModule.col)}>
                                                                                                                                {fields.length > 0 && (
                                                                                                                                    <div className={styles['list-button']}>
                                                                                                                                        <button
                                                                                                                                            className={styles['button-circle']}
                                                                                                                                            onClick={() => {
                                                                                                                                                remove(index);
                                                                                                                                            }}
                                                                                                                                            type="button"
                                                                                                                                        >
                                                                                                                                            <span className="icon-remove" />
                                                                                                                                        </button>
                                                                                                                                    </div>
                                                                                                                                )}
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </Pane>
                                                                                                                </>
                                                                                                            ))}
                                                                                                            <Pane className="mt10 ml10 mb10 d-flex align-items-center color-success pointer " >
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
                                                                                    );
                                                                                case infomationTypes.LINK:
                                                                                    return (
                                                                                        <Pane className="col-lg-12 p0">
                                                                                            <FormItem
                                                                                                className={stylesModule.item}
                                                                                                fieldKey={[field.fieldKey, 'content']}
                                                                                                name={[field.name, 'content']}
                                                                                                type={variables.INPUT}
                                                                                                label="Link"
                                                                                            />
                                                                                        </Pane>
                                                                                    );
                                                                                case infomationTypes.FILE:
                                                                                    return (
                                                                                        <Pane className="col-lg-12 p0">
                                                                                            <>
                                                                                                <h3 className={stylesModule['wrapper-link-title']}>Đính kèm file</h3>
                                                                                                <div className='d-flex'>
                                                                                                    <Upload>
                                                                                                        <Button color="white" icon="upload1" className={stylesModule['wrapper-btn-add']}>
                                                                                                            Tải lên
                                                                                                        </Button>
                                                                                                    </Upload>
                                                                                                    <span className={stylesModule['wrapper-title-add']}>
                                                                                                        Hỗ trợ định dạng: .pdf, .doc, .docx, .jpeg, .jpg, .png , .mp4 . Dung lượng không được quá 10mb
                                                                                                    </span>
                                                                                                </div>
                                                                                            </>
                                                                                        </Pane>
                                                                                    );
                                                                                default:
                                                                                    return null;
                                                                            }
                                                                        };
                                                                        return (
                                                                            <>
                                                                                <Pane className="offset-lg-12 col-lg-12 border-bottom p0 " key={field.key}>
                                                                                    <Pane className={stylesModule['wraper-title']}>
                                                                                        <h3 className={stylesModule.name}>
                                                                                            Thông tin {index + 1}
                                                                                        </h3>
                                                                                        {fields.length > 0 && (
                                                                                            <div className={styles['list-button']}>
                                                                                                <button
                                                                                                    className={styles['button-circle']}
                                                                                                    style={{ display: 'flex', position: 'absolute', top: 12, right: 35, color: 'white' }}
                                                                                                    onClick={() => {
                                                                                                        remove(index);
                                                                                                    }}
                                                                                                    type="button"
                                                                                                >
                                                                                                    <span className="icon-remove" style={{ color: 'white' }} />
                                                                                                </button>
                                                                                            </div>
                                                                                        )}
                                                                                    </Pane>
                                                                                    <Collapse defaultActiveKey={[index + 1]} ghost expandIconPosition='right'>
                                                                                        <Panel key={index + 1} >
                                                                                            <Pane className="card">
                                                                                                <Pane className="row">
                                                                                                    <Pane className="col-lg-12">
                                                                                                        {typeRadioGroup(field.fieldKey)}
                                                                                                        {detailForm(field.fieldKey)}
                                                                                                    </Pane>
                                                                                                </Pane>
                                                                                            </Pane>
                                                                                        </Panel>
                                                                                    </Collapse>
                                                                                </Pane>
                                                                            </>);
                                                                    })}
                                                                    <Pane className="p0 pt20" >
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
                                            </Pane>
                                        </>
                                    ))}
                                    <Pane className="d-flex justify-content-between mb20" >
                                        <div>

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
                                        </div>
                                        <div className='d-flex'>
                                            <Button color="primary" icon="export" >
                                                Xem trước
                                            </Button>
                                            <Button color="primary" icon="export" className="ml-2 mr-2">
                                                Lưu tạm
                                            </Button>
                                            <Button
                                                className="ml-auto px25 ml-2"
                                                color="success"
                                                htmlType="submit"
                                            >
                                                Lưu và Áp dụng
                                            </Button>
                                        </div>
                                    </Pane>
                                </>
                            )}
                        </Form.List>
                    </Form>
                </Pane>
            </Pane>
        </div>
    );
});

export default Index;