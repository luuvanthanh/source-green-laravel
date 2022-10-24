import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { isEmpty, get, head } from 'lodash';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import CustomListUpload from '@/components/CommonComponent/CustomListUploadV1';
import { Helper } from '@/utils';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';
import stylesModule from './styles.module.scss';


const General = memo(() => {
    const formRef = useRef();
    const {
        error,
        details,
        loading: { effects }
    } = useSelector(({ loading, childDevelopConfigurationLogo }) => ({
        loading,
        details: childDevelopConfigurationLogo.details,
        error: childDevelopConfigurationLogo.error,
    }));
    const dispatch = useDispatch();
    const params = useParams();
    const mounted = useRef(false);
    const [files, setFiles] = Helper.isJSON(head(details)?.fileImage)
        ? useState(JSON.parse(head(details)?.fileImage))
        : useState([]);

    const mountedSet = (setFunction, value) =>
        !!mounted?.current && setFunction && setFunction(value);
    const loadingSubmit =
        effects[`childDevelopConfigurationLogo/ADD`];
    const loading =
        effects[`childDevelopConfigurationLogo/GET_DETAILS`];

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    useEffect(() => {
        dispatch({
            type: 'childDevelopConfigurationLogo/GET_DETAILS',
            payload: params,
        });
    }, []);

    const onFinish = () => {
        dispatch({
            type: 'childDevelopConfigurationLogo/ADD',
            payload: { logo: JSON.stringify(files), id: head(details)?.id ? head(details)?.id : null },
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
        if (!isEmpty(head(details))) {
            if (Helper.isJSON(head(details)?.logo)) {
                mountedSet(setFiles, JSON.parse(head(details)?.logo));
            }
        }
    }, [head(details)]);

    useEffect(() => {
        mounted.current = true;
        return mounted.current;
    }, []);

    const uploadFiles = (file) => {
        mountedSet(setFiles, (prev) => [...prev, file]);
    };

    const onRemoFile = () => {
        setFiles([]);
    };


    return (
        <Form layout="vertical" ref={formRef} initialValues={{}} onFinish={onFinish}>
            <div className="row">
                <div className="col-lg-6 offset-lg-3">
                    <Heading type="form-title" style={{ padding: 20, paddingLeft: 0 }}>
                        Cấu hình chèn logo
                    </Heading>
                    <div className="card">
                        <Loading loading={loading} isError={error.isError}>
                            <div style={{ padding: 20 }} className="pb-0 border-bottom">
                                <div className={stylesModule['wrapper-modal']}>
                                    <div className={stylesModule.img}>
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">
                                                <span>Hình ảnh logo</span>
                                            </label>
                                        </div>
                                        {files?.length <= 0 && (
                                            <MultipleImageUpload
                                                files={files}
                                                callback={(files) => uploadFiles(files)}
                                            />
                                        )}
                                        {files?.length > 0 && <CustomListUpload data={files}
                                            callback={(files) => uploadFiles(files)}
                                            remove={(item) => onRemoFile(item)} />}
                                    </div>
                                    <div className="pl10 d-flex align-items-center">
                                        <p className={stylesModule['text-uploadImg']}>Áp dụng đối với định dạng jpg, png, jpeg
                                            Dung lượng tối đa không quá 20mb</p>
                                    </div>
                                </div>

                            </div>
                            <div className={stylesModule['wrapper-btn']}>
                                <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
                                    Lưu
                                </Button>
                            </div>
                        </Loading>
                    </div>
                </div>
            </div>
        </Form>
    );
});

export default General;
