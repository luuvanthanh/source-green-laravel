import { memo, useRef, useEffect, useState } from 'react';
import { Form, notification } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
// import Quill from '@/components/CommonComponent/Quill';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import validator from 'validator';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatarVideo';
import { Helper } from '@/utils';
import Gallery from 'react-photo-gallery';
import arrayMove from 'array-move';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
// import { photos } from "./photos";
import Photo from './Photo';
import stylesModule from '../../../styles.module.scss';

const marginProps = { style: { marginBottom: 12 } };

const mapStateToProps = ({ loading, crmMarketingManageAdd }) => ({
  loading,
  detailsAddPost: crmMarketingManageAdd.detailsAddPost,
  error: crmMarketingManageAdd.error,
  user: crmMarketingManageAdd.user,
});
const General = memo(
  ({
    dispatch,
    loading: { effects },
    match: { params },
    detailsAddPost,
    location: { pathname },
  }) => {
    const formRef = useRef();
    const [photos, setPhoto] = useState([]);
    const mounted = useRef(false);
    const [check, setCheck] = useState(false);
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
      setCheck(false);
      if (
        convertPathname(pathname) ===
        '/crm/tiep-thi/quan-ly-chien-dich-marketing/chi-tiet/:id/chi-tiet-bai-viet'
      ) {
        setCheck(true);
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
    }, [pathname]);

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = (values) => {
      const user = JSON?.parse(localStorage.getItem('pageCurrent'));
      const dataPhoto = photos?.map((i) => i?.src);
      dispatch({
        type: check ? 'crmMarketingManageAdd/UPDATE_POSTS' : 'crmMarketingManageAdd/ADD_POSTS',
        payload: check
          ? {
              id: params.id,
              name: values?.name,
              content: values?.content,
              marketing_program_id: detailsAddPost?.marketing_program_id,
              file_image: JSON.stringify(dataPhoto),
              data_page: isEmpty(user)
                ? []
                : user?.map((i) => ({
                    page_id: i?.id,
                    page_access_token: i.access_token,
                  })),
            }
          : {
              ...values,
              file_image: JSON.stringify(dataPhoto),
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
      const user = JSON?.parse(localStorage.getItem('pageCurrent'));
      if (detailsAddPost?.postFacebookInfo?.length > 0) {
        if (isEmpty(user)) {
          notification.error({
            message: 'THÔNG BÁO',
            description: 'Bài viết đã được đăng lên fanpage vui lòng login facebook trước khi xóa',
          });
        } else {
          const details = user?.map((i) => ({
            page_id: i?.id,
            page_access_token: i.access_token,
          }));
          return Helper.confirmAction({
            callback: () => {
              dispatch({
                type: 'crmMarketingManageAdd/REMOVE_FACEBOOK',
                payload: {
                  id: detailsAddPost?.id,
                  data_page: details,
                },
                callback: (response) => {
                  if (response) {
                    history.goBack();
                  }
                },
              });
            },
          });
        }
      } else {
        Helper.confirmAction({
          callback: () => {
            dispatch({
              type: 'crmMarketingManageAdd/REMOVE_FACEBOOK',
              payload: {
                id: detailsAddPost?.id,
                data_page: [],
              },
              callback: (response) => {
                if (response) {
                  history.goBack();
                }
              },
            });
          },
        });
      }
    };

    useEffect(() => {
      if (check) {
        JSON?.parse(detailsAddPost?.file_image);
        mountedSet(
          setPhoto,
          JSON?.parse(detailsAddPost?.file_image)?.map((i) => ({
            src: i,
          })),
        );
        formRef.current.setFieldsValue({
          ...detailsAddPost,
          ...head(detailsAddPost.positionLevel),
          birth_date: detailsAddPost.birth_date && moment(detailsAddPost.birth_date),
        });
      }
    }, [detailsAddPost]);

    const uploadFiles = (file) => {
      mountedSet(setPhoto, (prev) => [
        { src: `${API_UPLOAD}${file}`, width: 100, height: 100 },
        ...prev,
      ]);
    };

    const hanDleDelete = (e) => {
      mountedSet(
        setPhoto,
        photos?.filter((i) => i?.src !== e?.src),
      );
    };

    const SortablePhoto = SortableElement((item) => (
      <Photo {...item} hanDleDelete={hanDleDelete} />
    ));

    const SortableGallery = SortableContainer(({ photos }) => (
      <Gallery photos={photos} renderImage={(props) => <SortablePhoto {...props} />} />
    ));

    const onSortEnd = ({ oldIndex, newIndex }) => {
      setPhoto(arrayMove(photos, oldIndex, newIndex));
    };

    return (
      <>
        <Form layout="vertical" ref={formRef} onFinish={onFinish}>
          <Pane>
            <Pane className="card">
              <Loading loading={loading}>
                <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
                  {detailsAddPost?.id ? (
                    <div className="d-flex justify-content-between">
                      <Heading type="form-title" style={{ marginBottom: 20 }}>
                        Chi tiết bài viết
                      </Heading>
                    </div>
                  ) : (
                    <Heading type="form-title" style={{ marginBottom: 20 }}>
                      Thông tin thêm mới
                    </Heading>
                  )}
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
                      <Form.Item name="file_image" label="Ảnh/Video">
                        <MultipleImageUpload callback={(files) => uploadFiles(files)} />
                      </Form.Item>
                    </Pane>
                    <Pane className={classnames('col-lg-12', stylesModule['wrapper-img'])}>
                      <SortableGallery photos={photos} onSortEnd={onSortEnd} axis={'xy'} />
                    </Pane>
                  </Pane>
                </Pane>

                <Pane className="p20 d-flex justify-content-between align-items-center ">
                  {check ? (
                    <Button
                      className={stylesModule?.cancel}
                      role="presentation"
                      loading={effects['crmMarketingManageAdd/REMOVE_FACEBOOK']}
                      onClick={() => cancel()}
                    >
                      Xóa
                    </Button>
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
  user: PropTypes.objectOf(PropTypes.any),
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
  location: {},
  detailsPost: {},
  user: {},
};

export default withRouter(connect(mapStateToProps)(General));
