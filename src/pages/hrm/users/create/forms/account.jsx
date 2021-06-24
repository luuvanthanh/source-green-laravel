import { memo, useRef, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { connect, withRouter } from 'umi';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { head, isEmpty, get } from 'lodash';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import HelperModules from '../../../utils/Helper';
import variablesModules from '../../../utils/variables';

const mapStateToProps = ({ loading, HRMusersAdd }) => ({
  loading,
  details: HRMusersAdd.detailsAccount,
  error: HRMusersAdd.error,
  roles: HRMusersAdd.roles,
});
const Index = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, roles }) => {
    const formRef = useRef();
    const formRefModal = useRef();

    const loadingSubmit = effects[`HRMusersAdd/ADD_ACCOUNT`];
    const loading = effects[`HRMusersAdd/GET_DETAILS_ACCOUNT`] || effects[`HRMusersAdd/GET_ROLES`];

    const [visible, setVisible] = useState(false);

    const handleCancel = () => {
      setVisible(false);
      formRefModal.current.resetFields();
    };

    const showModal = () => {
      setVisible(true);
    };

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = (values) => {
      dispatch({
        type: 'HRMusersAdd/ADD_ACCOUNT',
        payload: {
          employeeId: params.id,
          account: {
            userName: values.userName,
            password: values.password,
            email: values.email,
            roles: values.roles,
          },
        },
        callback: (response, error) => {
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

    const register = () => {
      dispatch({
        type: 'HRMusersAdd/FACE_REGISTRATION',
        payload: { id: params.id },
        callback: (response, error) => {
          if (response) {
            dispatch({
              type: 'HRMusersAdd/GET_DETAILS_ACCOUNT',
              payload: params,
            });
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

    const changePassword = () => {
      formRefModal.current.validateFields().then((values) => {
        dispatch({
          type: 'HRMusersAdd/CHANGE_PASSWORD',
          payload: { ...values, id: details.appUserId },
          callback: (response, error) => {
            if (response) {
              handleCancel();
            }
            if (error) {
              if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
                error?.validationErrors.forEach((item) => {
                  formRefModal.current.setFields([
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
      });
    };

    useEffect(() => {
      if (params.id) {
        dispatch({
          type: 'HRMusersAdd/GET_DETAILS_ACCOUNT',
          payload: params,
        });
        dispatch({
          type: 'HRMusersAdd/GET_ROLES',
          payload: params,
        });
      }
    }, [params.id]);

    useEffect(() => {
      if (!isEmpty(details) && params.id) {
        formRef.current.setFieldsValue({
          ...details,
          ...details.user,
          roles: details?.user?.roles?.map((item) => item?.id),
        });
      }
    }, [details]);

    return (
      <>
        <Modal
          centered
          footer={[
            <div className={classnames('d-flex', 'justify-content-end')} key="action">
              <Button
                color="white"
                icon="cross"
                loading={loadingSubmit}
                onClick={handleCancel}
                size="medium"
              >
                HỦY
              </Button>
              <Button
                color="green"
                icon="save"
                loading={loadingSubmit}
                onClick={changePassword}
                size="medium"
              >
                LƯU
              </Button>
            </div>,
          ]}
          title="Đổi mật khẩu"
          visible={visible}
          onCancel={handleCancel}
        >
          <Form layout="vertical" ref={formRefModal}>
            <div className="row">
              <div className="col-lg-12">
                <FormItem
                  label="Mật khẩu mới"
                  name="newPassword"
                  rules={[variables.RULES.EMPTY]}
                  type={variables.INPUT_PASSWORD}
                />
              </div>
            </div>
          </Form>
        </Modal>
        <Form layout="vertical" ref={formRef} onFinish={onFinish}>
          <Pane className="card">
            <Loading loading={loading} isError={error.isError} params={{ error }}>
              <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  Tài khoản
                </Heading>

                <Pane className="row">
                  <Pane className="col-lg-4">
                    <FormItem
                      name="userName"
                      label="Tên tài khoản"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY_INPUT]}
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
                      name="password"
                      label="Mật khẩu"
                      type={variables.INPUT_PASSWORD}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                </Pane>
                <hr />
                <Pane className="row">
                  <Pane className="col-lg-6">
                    <FormItem
                      data={roles}
                      name="roles"
                      label="Vai trò"
                      type={variables.SELECT_MUTILPLE}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <Form.Item label="Đăng nhập bằng hình ảnh">
                      {HelperModules.tagStatusAccount(details?.faceImageStatus)}
                    </Form.Item>
                  </Pane>
                  {!isEmpty(details) && (
                    <Pane className="col-lg-3">
                      <Form.Item label=" ">
                        <Button color="success" ghost onClick={register}>
                          {details?.faceImageStatus === variablesModules.STATUS.NO_IMAGE ||
                          details?.faceImageStatus === variablesModules.STATUS.HANDLING_IMAGE_FAILED
                            ? 'Đăng ký'
                            : 'Đăng ký lại'}
                        </Button>
                      </Form.Item>
                    </Pane>
                  )}
                </Pane>
              </Pane>

              <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
                {!isEmpty(details) && (
                  <Button
                    color="success"
                    size="large"
                    htmlType="button"
                    className="mr-3"
                    loading={loadingSubmit}
                    onClick={showModal}
                  >
                    Đổi mật khẩu
                  </Button>
                )}
                <Button
                  color="success"
                  size="large"
                  htmlType="submit"
                  style={{ marginLeft: 'auto' }}
                  loading={loadingSubmit}
                  disabled={get(details, 'userName')}
                >
                  Lưu
                </Button>
              </Pane>
            </Loading>
          </Pane>
        </Form>
      </>
    );
  },
);

Index.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  roles: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
  roles: [],
};

export default withRouter(connect(mapStateToProps)(Index));
