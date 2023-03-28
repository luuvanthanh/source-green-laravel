import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { connect, withRouter, history } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Loading from '@/components/CommonComponent/Loading';
import { Helper } from '@/utils';

const mapStateToProps = ({ loading, OPParentsAdd }) => ({
  loading,
  details: OPParentsAdd.details,
  error: OPParentsAdd.error,
  employees: OPParentsAdd.employees,
});
const Curator = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, employees }) => {
    const formRef = useRef();

    const loading = effects[`OPParentsAdd/GET_DETAILS`] || effects[`OPParentsAdd/GET_EMPLOYEES`];

    useEffect(() => {
      if (params.id) {
        dispatch({
          type: 'OPParentsAdd/GET_DETAILS',
          payload: params,
        });
        dispatch({
          type: 'OPParentsAdd/GET_EMPLOYEES',
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
                <Pane className="col-lg-4">
                  <FormDetail name={details?.employeeId} data={Helper.convertSelectUsers(employees)} label="Nhân viên theo dõi" type="select" />
                </Pane>
                <Pane className="col-lg-4">
                  <FormDetail name={details?.source} label="Nguồn khách hàng" />
                </Pane>
                <Pane className="col-lg-4">
                  <FormDetail name={details?.code} label="Mã khách hàng" />
                </Pane>
              </Pane>
            </Pane>

            <Pane style={{ padding: 20 }}>
              <Button
                color="success"
                size="large"
                style={{ marginLeft: 'auto' }}
                onClick={() => {
                  history.push(`/ho-so-doi-tuong/phu-huynh/${details?.id}/chinh-sua?type=curator`);
                }}
                permission="WEB_HSDT_PHUHUYNH_EDIT"
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
