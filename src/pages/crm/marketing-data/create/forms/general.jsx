import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { head, isEmpty } from 'lodash';
import moment from 'moment';

import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';
import { Helper, variables } from '@/utils';
import Text from '@/components/CommonComponent/Text';
import { useDispatch } from 'dva';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import stylesModule from '../../styles.module.scss';

const marginProps = { style: { marginBottom: 12 } };
const mapStateToProps = ({ loading, crmMarketingDataAdd }) => ({
  loading,
  details: crmMarketingDataAdd.details,
  error: crmMarketingDataAdd.error,
  branches: crmMarketingDataAdd.branches,
  classes: crmMarketingDataAdd.classes,
});
const General = memo(({ loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const mounted = useRef(false);
  const loading = effects[`crmMarketingDataAdd/GET_DETAILS`];
  const dispatch = useDispatch();
  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        ...details,
        ...head(details.searchSource),
        search_source: head(details.searchSource)?.name,
        created_at: details.created_at && moment(details.created_at),
        updated_at: details.updated_at && moment(details.updated_at),
      });
    }
  }, [details]);
  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'crmMarketingDataAdd/GET_DETAILS',
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
              Thông tin chung
            </Heading>

            <div className="row" {...marginProps}>
              <div className="col-lg-4">
                <div className="ant-col ant-form-item-label">
                  <label className="ant-form-item-required">Nguồn</label>
                </div>
                <Text size="normal" className={stylesModule['general-detail']}>
                  {details?.searchSource?.name}
                </Text>
              </div>
              <div className="col-lg-4">
                <div className="ant-col ant-form-item-label">
                  <label className="ant-form-item-required">Người tạo</label>
                </div>
                <Text size="normal" className={stylesModule['general-detail']}>
                  {details?.user_create_info?.userName}
                </Text>
              </div>
              <div className="col-lg-4">
                <div className="ant-col ant-form-item-label">
                  <label className="ant-form-item-required">Ngày khởi tạo</label>
                </div>
                <Text size="normal" className={stylesModule['general-detail']}>
                  {Helper.getDate(details.created_at, variables.DATE_FORMAT.DATE)}
                </Text>
              </div>
              <div className="col-lg-4">
                <div className="ant-col ant-form-item-label">
                  <label className="ant-form-item-required">Ngày cập nhật</label>
                </div>
                <Text size="normal" className={stylesModule['general-detail']}>
                  {Helper.getDate(details.updated_at, variables.DATE_FORMAT.DATE)}
                </Text>
              </div>
              <div className="col-lg-4">
                <div className="ant-col ant-form-item-label">
                  <label className="ant-form-item-required">Ghi chú</label>
                </div>
                <Text size="normal" className={stylesModule['general-detail']}>
                  {details.note}
                </Text>
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
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
  branches: [],
  classes: [],
};

export default withRouter(connect(mapStateToProps)(General));
