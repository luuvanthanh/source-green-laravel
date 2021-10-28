import { memo, useRef, useEffect, useState } from 'react';
import { Breadcrumb, Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
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
  details: crmMarketingManageAdd.details,
  detailsPost: crmMarketingManageAdd.detailsPost,
  error: crmMarketingManageAdd.error,
  branches: crmMarketingManageAdd.branches,
  classes: crmMarketingManageAdd.classes,
  city: crmMarketingManageAdd.city,
  district: crmMarketingManageAdd.district,
});
const General = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const [files, setFiles] = Helper.isJSON(details?.file_image)
    ? useState(JSON.parse(details?.file_image))
    : useState([]);
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);
  const loadingSubmit =
    effects[`crmMarketingManageAdd/ADD_POSTS`] ||
    effects[`crmMarketingManageAdd/UPDATE_POSTS`] ||
    effects[`crmMarketingManageAdd/UPDATE_STATUS_POSTS`];
  const loading = effects[`crmMarketingManageAdd/GET_DETAILS_POSTS`];
  useEffect(() => {
    if (params.detailId) {
      dispatch({
        type: 'crmMarketingManageAdd/GET_DETAILS_POSTS',
        payload: params,
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
            ...details,
            ...values,
            marketing_program_id: params.id,
            file_image: JSON.stringify(files),
          }
        : { ...values, file_image: JSON.stringify(files),  marketing_program_id: params.id, },
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

  useEffect(() => {
    formRef.current.setFieldsValue({
      ...details,
      ...head(details.positionLevel),
      startDate:
        head(details.positionLevel)?.startDate && moment(head(details.positionLevel)?.startDate),
      birth_date: details.birth_date && moment(details.birth_date),
      dateOfIssueIdCard: details.dateOfIssueIdCard && moment(details.dateOfIssueIdCard),
      dateOff: details.dateOff && moment(details.dateOff),
    });
    if (Helper.isJSON(details?.file_image)) {
      mountedSet(setFiles, JSON.parse(details?.file_image));
    }
  }, [details]);

  const uploadFiles = (file) => {
    mountedSet(setFiles, (prev) => [...prev, file]);
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
            {params.detailId ? `${details?.name}` : 'Thêm bài viết'}
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
                  <Pane className="col-lg-12">
                    <FormItem
                      name="content"
                      label="Nội dung"
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
                <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                  Hủy
                </p>
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
});

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  city: PropTypes.arrayOf(PropTypes.any),
  district: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
  branches: [],
  classes: [],
  city: [],
  district: [],
};

export default withRouter(connect(mapStateToProps)(General));
