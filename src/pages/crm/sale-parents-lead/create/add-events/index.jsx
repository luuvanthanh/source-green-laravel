import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { connect, withRouter } from 'umi';

import { head, isEmpty, get } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { variables } from '@/utils';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import PropTypes from 'prop-types';

const mapStateToProps = ({ loading, crmSaleLeadAdd }) => ({
  loading,
  details: crmSaleLeadAdd.details,
  error: crmSaleLeadAdd.error,
  branches: crmSaleLeadAdd.branches,
  classes: crmSaleLeadAdd.classes,
  city: crmSaleLeadAdd.city,
  district: crmSaleLeadAdd.district,
});
const General = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();

  const loadingSubmit =
    effects[`crmSaleLeadAdd/ADD_EVENTS`] || effects[`crmSaleLeadAdd/UPDATE_EVENTS`];
  const loading = effects[`crmSaleLeadAdd/GET_EVENTS`];
  const mounted = useRef(false);

  useEffect(() => {
    if (params.detailId) {
      dispatch({
        type: 'crmSaleLeadAdd/GET_EVENTS',
        payload: params,
      });
    }
  }, [params.detailId]);

  const onFinish = (values) => {
    dispatch({
      type: params.detailId ? 'crmSaleLeadAdd/UPDATE_EVENTS' : 'crmSaleLeadAdd/ADD_EVENTS',
      payload: params.detailId
        ? { ...details, ...values, customer_lead_id: params.id }
        : { ...values, customer_lead_id: params.id },
      callback: (response, error) => {
        // if (response) {
        //   history.goBack();
        // }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: get(item, 'source.pointer'),
                  errors: [get(item, 'detail')],
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
    formRef.current.setFieldsValue({
      ...details,
      ...head(details.positionLevel),
      date: details.date && moment(details.date),
      time: details.time && moment(details.time),
    });
  }, [details]);

  return (
    <>
      <Helmet title="Thêm cuộc gọi" />
      <Pane className="col-lg-6 offset-lg-3">
        <Form layout="vertical" ref={formRef} onFinish={onFinish}>
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <div className="card">
              <div style={{ padding: 20 }} className="pb-0 border-bottom">
                <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                  <Heading type="form-title">Thông tin thêm mới</Heading>
                </div>
                <div className="row">
                  <Pane className="col-lg-6">
                    <FormItem name="date" label="Ngày diễn ra" type={variables.DATE_PICKER} />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="GIỜ"
                      name="time"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.TIME_PICKER}
                    />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem name="name" label="Tên sự  kiện" type={variables.INPUT} />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem name="location" label="Địa điêm diễn ra" type={variables.INPUT} />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      name="status"
                      data={[
                        { id: 'COMING_EVENTS', name: 'Sắp diễn ra' },
                        { id: 'PAST_EVENTS', name: 'đã diễn ra' },
                      ]}
                      label="Trạng thái"
                      type={variables.SELECT}
                    />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name="result"
                      label="Kết quả sự kiện"
                      rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                      type={variables.TEXTAREA}
                    />
                  </Pane>
                </div>
              </div>
              <Pane className="p20 d-flex justify-content-between align-items-center ">
                <p className="btn-delete" role="presentation">
                  Hủy
                </p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit}
                >
                  Lưu
                </Button>
              </Pane>
            </div>
          </Loading>
        </Form>
      </Pane>
    </>
  );
});

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
};
export default withRouter(connect(mapStateToProps)(General));
