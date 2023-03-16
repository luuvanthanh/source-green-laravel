import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { head, isEmpty } from 'lodash';
import moment from 'moment';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { variables, Helper } from '@/utils';
import FormDetail from '@/components/CommonComponent/FormDetail';

import FormItem from '@/components/CommonComponent/FormItem';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';
import variablesModules from '../../../utils/variables';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];

const marginProps = { style: { marginBottom: 12 } };
const styleListStudent = {
  style:
  {
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 400,
    lineHeight: '22px',
    color: '#3b5cad',
  }
};

const mapStateToProps = ({ loading, OPParentsAdd }) => ({
  loading,
  details: OPParentsAdd.details,
  error: OPParentsAdd.error,
});
const General = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const [files, setFiles] = useState([]);
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);
  const loadingSubmit =
    effects[`OPParentsAdd/ADD`] ||
    effects[`OPParentsAdd/UPDATE`];

  const loadingUpdateStatus =
    effects[`OPParentsAdd/UPDATE_STATUS`];

  const loading = effects[`OPParentsAdd/GET_DETAILS`];

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'OPParentsAdd/UPDATE' : 'OPParentsAdd/ADD',
      payload: params.id
        ? { ...details, ...values, id: params.id, fileImage: JSON.stringify(files) }
        : { ...values, fileImage: JSON.stringify(files) },
      callback: (response, error) => {
        if (response) {
          history.push(
            `/ho-so-doi-tuong/phu-huynh`,
          );
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const updateStatus = () => {
    dispatch({
      type: 'OPParentsAdd/UPDATE_STATUS',
      payload: {
        status:
          details?.status === variablesModules.STATUS.STORE
            ? variablesModules.STATUS.REGIST
            : variablesModules.STATUS.STORE,
        id: params.id,
      },
      callback: (response) => {
        if (response) {
          history.push(
            `/ho-so-doi-tuong/phu-huynh`,
          );
          dispatch({
            type: 'OPParentsAdd/GET_DETAILS',
            payload: params,
          });
        }
      },
    });
  };

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        ...details,
        dayOfBirth: moment(details.dayOfBirth),
      });
      if (Helper.isJSON(details?.fileImage)) {
        setFiles(JSON.parse(details?.fileImage));
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

  return (
    <Form layout="vertical" ref={formRef} initialValues={{}} onFinish={onFinish}>
      <Loading loading={loading} isError={error.isError} params={{ error }}>
        <Pane className="card">
          <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Thông tin cơ bản
            </Heading>
            <Pane className="row">
              <Pane className="col">
                <Form.Item name="avatar" label="Hình ảnh phụ huynh">
                  <MultipleImageUpload
                    files={files}
                    callback={(files) => uploadFiles(files)}
                    removeFiles={(files) => mountedSet(setFiles, files)}
                  />
                </Form.Item>
              </Pane>
            </Pane>
            <Pane className="row border-bottom" {...marginProps}>
              <Pane className="col-lg-4">
                <FormItem
                  name="fullName"
                  label="Tên khách hàng"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="dayOfBirth"
                  label="Ngày sinh"
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                  disabledDate={(current) => current > moment()}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  data={genders}
                  name="sex"
                  label="Giới tính"
                  type={variables.SELECT}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="email"
                  label="Email"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY, variables.RULES.EMAIL]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="phone"
                  label="Số điện thoại"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="anotherPhone"
                  label="Số điện thoại khác"
                  type={variables.INPUT}
                  rules={[variables.RULES.PHONE]}
                />
              </Pane>
            </Pane>
            <Pane className="row border-bottom" {...marginProps}>
              <Pane className="col-lg-3">
                {
                  isEmpty(details?.students) ?
                    <div className='pt10 pb10'>
                      <FormDetail label="Phụ huynh chưa có học sinh" type="label" />
                    </div>
                    :
                    <>
                      <FormDetail label="Danh sách học sinh" type="label" />
                      <ul>
                        {details?.students?.map(i => (
                          <li {...styleListStudent} role="presentation" onClick={() => history?.push(`/ho-so-doi-tuong/hoc-sinh/${i?.id}/chinh-sua`)}>{i?.fullName}</li>
                        ))}
                      </ul>
                    </>
                }
              </Pane>
            </Pane>
            <Pane className="row border-bottom" {...marginProps}>
              <Pane className="col-lg-12">
                <FormItem name="address" label="Địa chỉ" type={variables.INPUT} />
              </Pane>
            </Pane>

            <Pane className="row">
              <Pane className="col-lg-4">
                <FormItem name="jobTile" label="Nghề nghiệp" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="faceBook" label="Địa chỉ facebook" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="zalo" label="Địa chỉ zalo" type={variables.INPUT} />
              </Pane>

              <Pane className="col-lg-4">
                <FormItem name="instagram" label="Địa chỉ Instagram" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="referent" label="Khách hàng liên quan" type={variables.INPUT} />
              </Pane>


              <Pane className="col-lg-12">
                <FormItem name="remark" label="Ghi chú" type={variables.INPUT} />
              </Pane>

              <Pane className="col-lg-12">
                <FormItem name="hobby" label="Tính cách, sở thích" type={variables.INPUT} />
              </Pane>

              <Pane className="col-lg-4">
                <FormItem name="bank" label="Ngân hàng" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="bankNumber" label="Số tài khoản" type={variables.INPUT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="ownerBank" label="Người hưởng thụ" type={variables.INPUT} />
              </Pane>

            </Pane>
          </Pane>

          <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
            {params.id && (
              <Button
                color="success"
                size="large"
                htmlType="button"
                className="mr-3"
                onClick={updateStatus}
                loading={loadingUpdateStatus}
              >
                {details?.status === variablesModules.STATUS.STORE ? 'Khôi phục' : 'Lưu trữ hồ sơ'}
              </Button>
            )}
            <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
              Lưu
            </Button>
          </Pane>
        </Pane>
      </Loading>
    </Form>
  );
});

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
};

export default withRouter(connect(mapStateToProps)(General));
