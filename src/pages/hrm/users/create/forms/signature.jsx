import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
import { history, useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import CustomListUpload from '@/components/CommonComponent/CustomListUploadV1';
import { Helper } from '@/utils';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';
import stylesModule from '../../styles.module.scss';


const General = memo(() => {
    const formRef = useRef();
    const {
        error,
        details,
        loading: { effects }
    } = useSelector(({ loading, HRMusersAdd }) => ({
        loading,
        details: HRMusersAdd.details,
        error: HRMusersAdd.error,
    }));
    const dispatch = useDispatch();
    const params = useParams();
    const mounted = useRef(false);
    const [files, setFiles] = Helper.isJSON(details?.fileImage)
        ? useState(JSON.parse(details?.fileImage))
        : useState([]);

    const mountedSet = (setFunction, value) =>
        !!mounted?.current && setFunction && setFunction(value);
    const loadingSubmit =
        effects[`HRMusersAdd/ADD`] ||
        effects[`HRMusersAdd/STORAGE`] ||
        effects[`HRMusersAdd/UPDATE`] ||
        effects[`HRMusersAdd/UPDATE_STATUS`];
    const loading =
        effects[`HRMusersAdd/GET_DETAILS`];

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    useEffect(() => {
        if (params.id) {
            dispatch({
                type: 'HRMusersAdd/GET_DETAILS',
                payload: params,
            });
        }
    }, []);

    const onFinish = (values) => {
        dispatch({
            type: params.id ? 'HRMusersAdd/UPDATE' : 'HRMusersAdd/ADD',
            payload: params.id
                ? { ...details, ...values, id: params.id, signature: JSON.stringify(files) }
                : { ...values, signature: JSON.stringify(files), status: 'WORKING' },
            callback: (response, error) => {
                if (response && !params?.id) {
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
        if (!isEmpty(details) && params.id) {
            if (Helper.isJSON(details?.signature)) {
                mountedSet(setFiles, JSON.parse(details?.signature));
            }
        }
    }, [details]);

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
            <div className="card">
                <Loading loading={loading} isError={error.isError}>
                    <div style={{ padding: 20 }} className="pb-0 border-bottom">
                        <Heading type="form-title" style={{ marginBottom: 20 }}>
                            Chữ ký
                        </Heading>
                        <div className="row">
                            <div className="col-lg-2">
                                <div className="ant-col ant-form-item-label">
                                    <label className="ant-form-item-required">
                                        <span>Hình ảnh chữ ký</span>
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
                            <div className="col-lg-4  d-flex align-items-center">
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
        </Form>
    );
});

export default General;
