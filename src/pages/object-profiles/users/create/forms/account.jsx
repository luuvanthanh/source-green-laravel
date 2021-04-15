import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { connect, history, withRouter } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { head, isEmpty, get } from 'lodash';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';

const mapStateToProps = ({ loading, OPusersAdd }) => ({
  loading,
  details: OPusersAdd.detailsAccount,
  error: OPusersAdd.error,
  roles: OPusersAdd.roles,
});
const Index = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, roles }) => {
    const formRef = useRef();

    const loadingSubmit = effects[`OPusersAdd/ADD_ACCOUNT`];
    const loading = effects[`OPusersAdd/GET_DETAILS_ACCOUNT`] || effects[`OPusersAdd/GET_ROLES`];

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = (values) => {
      dispatch({
        type: 'OPusersAdd/ADD_ACCOUNT',
        payload: { ...details, ...values, id: params.id },
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

    useEffect(() => {
      if (params.id) {
        dispatch({
          type: 'OPusersAdd/GET_DETAILS_ACCOUNT',
          payload: params,
        });
        dispatch({
          type: 'OPusersAdd/GET_ROLES',
          payload: params,
        });
      }
    }, [params.id]);

    useEffect(() => {
      if (!isEmpty(details) && params.id) {
        formRef.current.setFieldsValue({
          ...details,
        });
      }
    }, [details]);

    return (
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
                <Pane className="col-lg-4">
                  <FormItem
                    data={roles}
                    name="roleId"
                    label="Vai trò"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </Pane>
              </Pane>
            </Pane>

            <Pane style={{ padding: 20 }}>
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
    );
  },
);

export default withRouter(connect(mapStateToProps)(Index));
