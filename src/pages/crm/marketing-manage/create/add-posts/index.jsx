import { memo, useRef, useEffect, useState } from 'react';
import { Breadcrumb, Form, Input } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
// import Quill from '@/components/CommonComponent/Quill';
import { Link, connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';
import { Helper } from '@/utils';
import stylesModule from '../../styles.module.scss';

const marginProps = { style: { marginBottom: 12 } };

const mapStateToProps = ({ loading, crmMarketingManageAdd }) => ({
  loading,
  detailsAddPost: crmMarketingManageAdd.detailsAddPost,
  error: crmMarketingManageAdd.error,
});
const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, detailsAddPost, error }) => {
    const formRef = useRef();
    const [content, setContent] = useState('');
    // const user = JSON.parse(localStorage.getItem('user'));
    const [files, setFiles] = useState([]);
    const mounted = useRef(false);
    const mountedSet = (action, value) => mounted?.current && action(value);
    const loadingSubmit =
      effects[`crmMarketingManageAdd/ADD_POSTS`] || effects[`crmMarketingManageAdd/UPDATE_POSTS`];
    const loading = effects[`crmMarketingManageAdd/GET_DETAILS_POSTS`];
    useEffect(() => {
      if (params.detailId) {
        dispatch({
          type: 'crmMarketingManageAdd/GET_DETAILS_POSTS',
          payload: params,
          callback: (response) => {
            if (response) {
              mountedSet(setContent, response.parsePayload.content);
            }
          },
        });
      }
    }, [params.detailId]);

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
              content,
              marketing_program_id: params.id,
              file_image: JSON.stringify(files),
            }
          : {
              ...values,
              content,
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
        const user = JSON.parse(localStorage.getItem('user'));
        return Helper.confirmAction({
          callback: () => {
            dispatch({
              type: 'crmMarketingManageAdd/REMOVE_FACEBOOK',
              payload: {
                 id : detailsAddPost.id,
                 page_access_token: user?.accessToken,
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
      if (params.detailId) {
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
    const onChangeEditor = (value) => {
      mountedSet(setContent, value);
    };
    return (
      <>
        <Pane style={{ margin: 20 }}>
          <Breadcrumb separator=">" className={stylesModule['wrapper-breadcrumb']}>
            <Breadcrumb.Item>
              <Link to="/crm/tiep-thi/quan-ly-chuong-trinh" className={stylesModule.details}>
                Quản lý chương trình
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link
                to={`/crm/tiep-thi/quan-ly-chuong-trinh/${params.id}/chi-tiet?type=posts`}
                className={stylesModule.details}
              >
                Chi tiết
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item className={stylesModule.detailsEnd}>
              {params.detailId ? `${detailsAddPost?.name}` : 'Thêm bài viết'}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Pane>
        <Form layout="vertical" ref={formRef} onFinish={onFinish}>
          <Pane className="col-lg-6 offset-lg-3">
            <Pane className="card">
              <Loading loading={loading} isError={error.isError} params={{ error }}>
                <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
                  <Heading type="form-title" style={{ marginBottom: 20 }}>
                    Thông tin thêm mới
                  </Heading>
                  <Pane className="row" {...marginProps}>
                    <Pane className="col-lg-12">
                      <FormItem
                        name="name"
                        label="Tên bài viết"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                      />
                    </Pane>
                    {/* <Pane className="col-lg-12">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span>Nội dung</span>
                        </label>
                      </Pane>
                      <Quill onChange={onChangeEditor} value={content} />
                    </Pane> */}
                    <Pane className="col-lg-12 mb15">
                      <Pane className="ant-col ant-form-item-label">
                        <label>
                          <span>Nội dung</span>
                        </label>
                      </Pane>
                      <Input.TextArea
                        value={content}
                        autoSize={{ minRows: 15, maxRows: 15 }}
                        placeholder="Nhập"
                        onChange={(e) => onChangeEditor(e.target.value)}
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
                {params.detailId ? (
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
                        >git 
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
  detailsPost: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  detailsAddPost: {},
  dispatch: () => {},
  loading: {},
  error: {},
  branches: [],
  classes: [],
  city: [],
  district: [],
  detailsPost: {},
};

export default withRouter(connect(mapStateToProps)(General));
