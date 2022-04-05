import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
// import Quill from '@/components/CommonComponent/Quill';
import {  connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import validator from 'validator';
import { variables } from '@/utils/variables';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import FormItem from '@/components/CommonComponent/FormItem';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';
import { Helper } from '@/utils';
import stylesModule from '../../../styles.module.scss';

const marginProps = { style: { marginBottom: 12 } };

const mapStateToProps = ({ loading, crmMarketingManageAdd }) => ({
    loading,
    detailsAddPost: crmMarketingManageAdd.detailsAddPost,
    error: crmMarketingManageAdd.error,
    user: crmMarketingManageAdd.user,
});
const General = memo(
    ({ dispatch, loading: { effects }, match: { params }, detailsAddPost,user,  error, location: { pathname } }) => {
        const formRef = useRef();
        const [files, setFiles] = useState([]);
        const mounted = useRef(false);
        const [getToken, setGetToket] = useState({});

        const [pageCurrent, setPageCurrent] = useState({});
        const mountedSet = (action, value) => mounted?.current && action(value);
        const loadingSubmit =
            effects[`crmMarketingManageAdd/ADD_POSTS`] || effects[`crmMarketingManageAdd/UPDATE_POSTS`];
        const loading = effects[`crmMarketingManageAdd/GET_DETAILS_POSTS`];


        const convertPathname = (pathname) => {
            if (pathname) {
                const listItemPath = pathname.split('/');
                return listItemPath
                    .map((item) => (validator.isUUID(item) || Number.parseInt(item, 10) ? ':id' : item))
                    .join('/');
            }
            return '';
        };

        useEffect(() => {
            if (convertPathname(pathname) === '/crm/tiep-thi/quan-ly-chien-dich-marketing/chi-tiet/:id/chi-tiet-bai-viet') {
                dispatch({
                    type: 'crmMarketingManageAdd/GET_DETAILS_POSTS',
                    payload: params,
                    callback: (response) => {
                        if (response) {
                            // mountedSet(setContent, response.parsePayload.content);
                        }
                    },
                });
            }
        }, []);

        /**
         * Function submit form modal
         * @param {object} values values of form
         */
        const onFinish = (values) => {
            dispatch({
                type: params.detailId
                    ? 'crmMarketingManageAdd/UPDATE_POSTS'
                    : 'crmMarketingManageAdd/ADD_POSTS',
                payload: params.detailId
                    ? {
                        ...detailsAddPost,
                        ...values,
                        marketing_program_id: params.id,
                        file_image: JSON.stringify(files),
                    }
                    : {
                        ...values,
                        file_image: JSON.stringify(files),
                        marketing_program_id: params.id,
                    },
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
        const cancel = () => {
            const user = JSON?.parse(sessionStorage?.getItem('user'));
            return Helper.confirmAction({
                callback: () => {
                    dispatch({
                        type: 'crmMarketingManageAdd/REMOVE_FACEBOOK',
                        payload: {
                            id: detailsAddPost?.id,
                            page_id: user[0].id,
                            page_access_token: user[0]?.access_token,
                        },
                        callback: (response) => {
                            if (response) {
                                history.goBack();
                            }
                        },
                    });
                },
            });
        };

        useEffect(() => {
            if (params.id) {
                formRef.current.setFieldsValue({
                    ...detailsAddPost,
                    ...head(detailsAddPost.positionLevel),
                    birth_date: detailsAddPost.birth_date && moment(detailsAddPost.birth_date),
                });
                if (Helper.isJSON(detailsAddPost?.file_image)) {
                    mountedSet(setFiles, JSON.parse(detailsAddPost?.file_image));
                }
            }
        }, [detailsAddPost]);

        const uploadFiles = (file) => {
            mountedSet(setFiles, (prev) => [...prev, file]);
        };

        const responseFacebook = (response) => {
            dispatch({
                type: 'crmMarketingManageAdd/GET_USER',
                payload: response,
            });
        };

        useEffect(() => {
            if (user?.userID) {
              dispatch({
                type: 'crmFBDevV1/GET_TOKEN',
                payload: {
                  user_access_token: user?.accessToken,
                },
                callback: (response) => {
                  if (response) {
                    setGetToket(response);
                  }
                },
              });
            }
          }, [user?.userID]);
          useEffect(() => {
            if (getToken?.user_access_token) {
              dispatch({
                type: 'crmFBDevV1/GET_PAGES',
                payload: {
                  user_access_token: getToken?.user_access_token,
                  user_id: user?.userID,
                },
                callback: (response) => {
                  if (response) {
                    const firstPage = head(response.data);
                    setPageCurrent(firstPage);
                    sessionStorage.setItem('user', JSON.stringify(response.data));
                  }
                },
              });
            }
          }, [getToken?.user_access_token]);

          const addFB = (values) => {
            dispatch({
              type: 'crmMarketingManageAdd/ADD_FACEBOOK',
              payload: {
                article_id: values,
                page_id: pageCurrent?.id,
                page_access_token: pageCurrent?.access_token,
              },
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


        // console.log("detailsAddPost", detailsAddPost)
        return (
            <>
                <Form layout="vertical" ref={formRef} onFinish={onFinish}>
                    <Pane >
                        <Pane className="card">
                            <Loading loading={loading} isError={error.isError} params={{ error }}>
                                <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
                                    {
                                        detailsAddPost?.id ?
                                            <div className='d-flex justify-content-between'>
                                                <Heading type="form-title" style={{ marginBottom: 20 }}>
                                                    Chi tiết bài viết
                                                </Heading>
                                                <div className='d-flex align-items-center'>
                                                    <p className='mr10'>Đăng lên: </p>
                                                    {isEmpty(user?.userID) && (
                                                        <div>
                                                            <FacebookLogin
                                                                appId={APP_ID_FB}
                                                                autoLoad={false}
                                                                fields="name,email,picture,birthday"
                                                                scope="public_profile,pages_show_list,pages_manage_metadata, pages_manage_posts, pages_read_engagement, pages_read_user_content, pages_manage_engagement, pages_messaging"
                                                                callback={responseFacebook}
                                                                render={(renderProps) => (
                                                                    <Button
                                                                        onClick={renderProps.onClick}
                                                                        type="button"
                                                                        size="small"
                                                                        color="primary"
                                                                    >
                                                                        Login FB
                                                                    </Button>
                                                                )}
                                                            />
                                                        </div>
                                                    )}
                                                    {
                                                        !isEmpty(user?.userID) && (
                                                            <Button
                                                                color="primary"
                                                                icon="facebook"
                                                                size="small"
                                                                className={stylesModule['button-fb']}
                                                                onClick={() => addFB(params.id)}
                                                            >
                                                                Fanpage
                                                            </Button>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <Heading type="form-title" style={{ marginBottom: 20 }}>
                                                Thông tin thêm mới
                                            </Heading>
                                    }
                                    <Pane className="row" {...marginProps}>
                                        <Pane className="col-lg-12">
                                            <FormItem
                                                name="name"
                                                label="Tên bài viết"
                                                type={variables.INPUT}
                                                rules={[variables.RULES.EMPTY_INPUT]}
                                            />
                                        </Pane>
                                        <Pane className="col-lg-12 mb15">
                                            <FormItem
                                                name="content"
                                                label="Nội dung"
                                                placeholder="Nhập"
                                                type={variables.TEXTAREA}
                                                rules={[variables.RULES.EMPTY_INPUT]}
                                            />
                                        </Pane>
                                        <Pane className="col-lg-12">
                                            <Form.Item name="file_image" label="Ảnh đại diện">
                                                <MultipleImageUpload
                                                    files={files}
                                                    callback={(files) => uploadFiles(files)}
                                                    removeFiles={(files) => mountedSet(setFiles, files)}
                                                />
                                            </Form.Item>
                                        </Pane>
                                    </Pane>
                                </Pane>

                                <Pane className="p20 d-flex justify-content-between align-items-center ">
                                    {detailsAddPost?.id ? (
                                        <p
                                            className="btn-delete"
                                            role="presentation"
                                            loading={loadingSubmit}
                                            onClick={() => cancel()}
                                        >
                                            Xóa
                                        </p>
                                    ) : (
                                        <p
                                            className="btn-delete"
                                            role="presentation"
                                            loading={loadingSubmit}
                                            onClick={() => history.goBack()}
                                        >
                                            Hủy
                                        </p>
                                    )}
                                    <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
                                        Lưu
                                    </Button>
                                </Pane>
                            </Loading>
                        </Pane>
                    </Pane>
                </Form>
            </>
        );
    },
);

General.propTypes = {
    dispatch: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    detailsAddPost: PropTypes.objectOf(PropTypes.any),
    loading: PropTypes.objectOf(PropTypes.any),
    error: PropTypes.objectOf(PropTypes.any),
    branches: PropTypes.arrayOf(PropTypes.any),
    classes: PropTypes.arrayOf(PropTypes.any),
    city: PropTypes.arrayOf(PropTypes.any),
    district: PropTypes.arrayOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    detailsPost: PropTypes.objectOf(PropTypes.any),
    user:  PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
    match: {},
    detailsAddPost: {},
    dispatch: () => { },
    loading: {},
    error: {},
    branches: [],
    classes: [],
    city: [],
    district: [],
    location: {},
    detailsPost: {},
    user: {},
};

export default withRouter(connect(mapStateToProps)(General));