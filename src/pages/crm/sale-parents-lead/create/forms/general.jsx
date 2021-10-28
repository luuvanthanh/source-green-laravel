import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { head, isEmpty } from 'lodash';
import moment from 'moment';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';

const marginProps = { style: { marginBottom: 12 } };
const mapStateToProps = ({ loading, crmSaleLeadAdd }) => ({
  loading,
  details: crmSaleLeadAdd.details,
  error: crmSaleLeadAdd.error,
  branches: crmSaleLeadAdd.branches,
  classes: crmSaleLeadAdd.classes,
});
const General = memo(({ loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const mounted = useRef(false);
  const loading = effects[`crmSaleLeadAdd/GET_DETAILS`];

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        ...details,
        ...head(details.positionLevel),
        created_at: details.created_at && moment(details.created_at),
        updated_at: details.updated_at && moment(details.updated_at),
      });
    }
  }, [details]);

  return (
    <Form layout="vertical" ref={formRef}>
      <Pane className="card">
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Thông tin cơ bản
            </Heading>

            <div className="row" {...marginProps}>
              <div className="col-lg-4">
                <FormItem name="source" label="Nguồn" type={variables.INPUT} />
              </div>
              <div className="col-lg-4">
                <FormItem name="full_name" label="Người tạo" type={variables.INPUT} />
              </div>
              <div className="col-lg-4">
                <FormItem name="created_at" label="Ngày khởi tạo" type={variables.DATE_PICKER} />
              </div>
              <div className="col-lg-4">
                <FormItem name="updated_at" label="Ngày cập nhật" type={variables.DATE_PICKER} />
              </div>
              <div className="col-lg-4">
                <FormItem name="name" label="Nhân viên chăm sóc" type={variables.INPUT} />
              </div>
              <div className="col-lg-4">
                <FormItem
                  name="customerStatus"
                  label="Tình trạng khách hàng"
                  type={variables.INPUT}
                />
              </div>
            </div>
          </Pane>
        </Loading>
      </Pane>
    </Form>
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
