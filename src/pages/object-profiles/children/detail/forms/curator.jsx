import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { connect, withRouter, history } from 'umi';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormDetail from '@/components/CommonComponent/FormDetail';
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
    const mounted = useRef(false);

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

    return (
      <Form layout="vertical" ref={formRef}>
        <Pane className="card">
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Theo dõi
              </Heading>

              <Pane className="row">
                <Pane className="col-lg-6">
                  <FormDetail name={details?.student?.employeeId} label="Giáo viên lead hiện tại" data={Helper.convertSelectUsers(employees)} type="select" />
                </Pane>
              </Pane>
            </Pane>

            <Pane style={{ padding: 20 }}>
              <Button
                color="success"
                size="large"
                onClick={() => {
                  history.push(`/ho-so-doi-tuong/hoc-sinh/${details?.student?.id}/chinh-sua?type=curator`);
                }}
                style={{ marginLeft: 'auto' }}
                permission="WEB_HSDT_HOCSINH_EDIT"
              >
                Chỉnh sửa
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
  dispatch: () => { },
  loading: {},
  error: {},
  employees: [],
};

export default withRouter(connect(mapStateToProps)(Curator));
