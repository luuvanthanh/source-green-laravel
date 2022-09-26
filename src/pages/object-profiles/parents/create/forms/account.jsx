import { memo, useRef, useEffect, useState } from 'react';
import { Form, Modal, notification } from 'antd';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { head, isEmpty } from 'lodash';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';

const mapStateToProps = ({ loading, OPParentsAdd }) => ({
  loading,
  details: OPParentsAdd.detailsAccount,
  detailsGeneral: OPParentsAdd.details,
  error: OPParentsAdd.error,
  roles: OPParentsAdd.roles,
});
const Index = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, roles, detailsGeneral }) => {
    const formRef = useRef();
    const formRefModal = useRef();

    const [visible, setVisible] = useState(false);

    const loadingSubmit =
      effects[`OPParentsAdd/ADD_ACCOUNT`] ||
      effects[`OPParentsAdd/UPDATE_ACCOUNT`] ||
      effects[`OPParentsAdd/CHANGE_PASSWORD`];
    const loading =
      effects[`OPParentsAdd/GET_DETAILS_ACCOUNT`] || effects[`OPParentsAdd/GET_ROLES`];

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
      if (!detailsGeneral?.email) {
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Bạn cần bổ sung email ở thông tin cơ bản',
        });
      } else {
        dispatch({
          type: details?.user?.id ? 'OPParentsAdd/UPDATE_ACCOUNT' : 'OPParentsAdd/ADD_ACCOUNT',
          payload: { ...details, ...values, id: params.id, email: detailsGeneral?.email, },
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
      }
    };

    const changePassword = () => {
      formRefModal.current.validateFields().then((values) => {
        dispatch({
          type: 'OPParentsAdd/CHANGE_PASSWORD',
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
          type: 'OPParentsAdd/GET_DETAILS_ACCOUNT',
          payload: params,
        });
        dispatch({
          type: 'OPParentsAdd/GET_ROLES',
          payload: { ...params, filter: 'Parent' },
        });
      }
    }, [params.id]);

    useEffect(() => {
      if (!isEmpty(details) && params.id) {
        formRef.current.setFieldsValue({
          ...details.user,
          roles: details.user?.roles?.map((item) => item.id),
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
                  {!details?.userName && (
                    <Pane className="col-lg-4">
                      <FormItem
                        name="password"
                        label="Mật khẩu"
                        type={variables.INPUT_PASSWORD}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>
                  )}
                </Pane>
                <hr />
                <Pane className="row">
                  <Pane className="col-lg-4">
                    <FormItem
                      data={roles}
                      name="roles"
                      label="Vai trò"
                      type={variables.SELECT_MUTILPLE}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
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
  detailsGeneral: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
  roles: [],
  detailsGeneral: {},
};

export default withRouter(connect(mapStateToProps)(Index));
