import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { head, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { connect, withRouter } from 'umi';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils/variables';
import Loading from '@/components/CommonComponent/Loading';
import { Helper } from '@/utils';

const mapStateToProps = ({ loading, OPchildrenAdd }) => ({
  loading,
  details: OPchildrenAdd.details,
  error: OPchildrenAdd.error,
  employees: OPchildrenAdd.employees,
});
const Curator = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, employees }) => {
    const formRef = useRef();
    const loading = effects[`OPchildrenAdd/GET_DETAILS`] || effects[`OPchildrenAdd/GET_EMPLOYEES`];
    const loadingSubmit = effects[`OPchildrenAdd/ADD`] || effects[`OPchildrenAdd/UPDATE`];
    const mounted = useRef(false);
    // const mountedSet = (action, value) => {
    //   if (mounted.current) {
    //     action(value);
    //   }
    // };

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = (values) => {
      dispatch({
        type: 'OPchildrenAdd/UPDATE',
        payload: {
          ...details,
          id: params.id,
          student: {
            ...details.student,
            ...values,
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

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    useEffect(() => {
      if (params.id) {
        dispatch({
          type: 'OPchildrenAdd/GET_DETAILS',
          payload: params,
        });
        dispatch({
          type: 'OPchildrenAdd/GET_EMPLOYEES',
          payload: params,
        });
      }
    }, [params.id]);

    useEffect(() => {
      if (!isEmpty(details) && params.id) {
        formRef.current.setFieldsValue({
          ...details.student,
        });
      }
    }, [details]);

    return (
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Pane className="card">
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Theo dõi
              </Heading>

              <Pane className="row">
                <Pane className="col-lg-6">
                  <FormItem
                    data={Helper.convertSelectUsers(employees)}
                    name="employeeId"
                    label="Nhân viên theo dõi"
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

Curator.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  employees: PropTypes.arrayOf(PropTypes.any),
};

Curator.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
  employees: [],
};

export default withRouter(connect(mapStateToProps)(Curator));
