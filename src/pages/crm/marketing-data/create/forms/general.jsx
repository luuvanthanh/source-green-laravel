import { memo, useRef, useEffect} from 'react';
import { Form } from 'antd';
import { head, isEmpty} from 'lodash';
import moment from 'moment';
import { connect,  withRouter } from 'umi';
import PropTypes from 'prop-types';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';

const marginProps = { style: { marginBottom: 12 } };

const mapStateToProps = ({ loading, crmMarketingDataAdd }) => ({
  loading,
  details: crmMarketingDataAdd.details,
  error: crmMarketingDataAdd.error,
  branches: crmMarketingDataAdd.branches,
  classes: crmMarketingDataAdd.classes,
  search: crmMarketingDataAdd.search,
});
const General = memo(
  ({
    dispatch,
    loading: { effects },
    match: { params },
    details,
    error,
    search,
  }) => {
    const formRef = useRef();
    const mounted = useRef(false);
    const loading = effects[`crmMarketingDataAdd/GET_DETAILS`];

    useEffect(() => {
      dispatch({
        type: 'crmMarketingDataAdd/GET_SEARCH',
        payload: {},
      });
    }, [params.id]);

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
                Thông tin chung
              </Heading>
              <Pane className="row" {...marginProps}>
                <Pane className="col-lg-4">
                <FormItem
                    options={['id', 'name']}
                    name="search_source_id"
                    data={search}
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Nguồn tiềm kiếm"
                    
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem name="fullName" label="Người tạo" type={variables.INPUT} />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    name="created_at"
                    label="Ngày khởi tạo"
                    type={variables.DATE_PICKER}
                    disabledHours
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    name="updated_at"
                    label="Ngày cập nhật"
                    type={variables.DATE_PICKER}
                  />
                </Pane>
              </Pane>
            </Pane>
          </Loading>
        </Pane>
      </Form>
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  search: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
  classes: [],
  search: [],
};

export default withRouter(connect(mapStateToProps)(General));
