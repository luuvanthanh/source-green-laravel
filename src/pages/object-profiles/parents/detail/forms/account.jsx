import { memo, useRef, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { connect, withRouter, history } from 'umi';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FormDetail from '@/components/CommonComponent/FormDetail';

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
  ({ dispatch, loading: { effects }, match: { params }, details, error, roles }) => {
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
        <Form layout="vertical" ref={formRef}>
          <Pane className="card">
            <Loading loading={loading} isError={error.isError} params={{ error }}>
              <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  Tài khoản
                </Heading>

                <Pane className="row">
                  <Pane className="col-lg-4">
                    <FormDetail name={details?.userName} label="Tên khách hàng" type="text" />
                  </Pane>
                </Pane>
                <hr />
                <Pane className="row">
                  <Pane className="col-lg-4">
                    <FormDetail name={details.user?.roles} label="Vai trò" type="selectTags" data={roles} />
                  </Pane>
                </Pane>
              </Pane>

              <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
                <Pane style={{ padding: 20 }}>
                  <Button
                    color="success"
                    size="large"
                    style={{ marginLeft: 'auto' }}
                    onClick={() => {
                      history.push(`/ho-so-doi-tuong/phu-huynh/${params?.id}/chinh-sua?type=account`);
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                </Pane>
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
  dispatch: () => { },
  loading: {},
  error: {},
  roles: [],
};

export default withRouter(connect(mapStateToProps)(Index));
