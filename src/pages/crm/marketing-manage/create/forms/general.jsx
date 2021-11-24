import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';

const marginProps = { style: { marginBottom: 12 } };
const genders = [
  { id: 'APPLY', name: 'Áp dụng' },
  { id: 'NOT_APPLY', name: 'Chưa áp dụng' },
];
const mapStateToProps = ({ loading, crmMarketingManageAdd }) => ({
  loading,
  details: crmMarketingManageAdd.details,
  error: crmMarketingManageAdd.error,
});
const General = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const mounted = useRef(false);
  const loadingSubmit =
    effects[`crmMarketingManageAdd/ADD`] || effects[`crmMarketingManageAdd/UPDATE`];
  const loading = effects[`crmMarketingManageAdd/GET_DETAILS`];
  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'crmMarketingManageAdd/GET_DISTRICTS',
        payload: {},
      });
    }
  }, [params.id]);

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'crmMarketingManageAdd/UPDATE' : 'crmMarketingManageAdd/ADD',
      payload: params.id ? { ...details, ...values } : { ...values },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
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
    if (params.id) {
      dispatch({
        type: 'crmMarketingManageAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        ...details,
        ...head(details.positionLevel),
        start_date: details.start_date && moment(details.start_date),
        end_date: details.end_date && moment(details.end_date),
      });
    }
  }, [details]);

  return (
    <Form layout="vertical" ref={formRef} onFinish={onFinish}>
      <Pane className="card">
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Thông tin cơ bản
            </Heading>

            <Pane className="row" {...marginProps}>
              <Pane className="col-lg-3">
                <FormItem
                  name="start_date"
                  label="Thời gian bắt đầu"
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
              <Pane className="col-lg-3">
                <FormItem
                  name="end_date"
                  label="Thời gian kết thúc"
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
              <Pane className="col-lg-3">
                <FormItem
                  options={['id', 'name']}
                  name="status"
                  data={genders}
                  placeholder="Chọn"
                  type={variables.SELECT}
                  label="Trạng thái"
                  rules={[variables.RULES.EMPTY_INPUT]}
                />
              </Pane>
              <Pane className="col-lg-12">
                <FormItem
                  name="name"
                  label="Tên chương trình"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY_INPUT]}
                />
              </Pane>
              {params.id ? (
                <Pane className="col-lg-12">
                  <FormItem
                    value={details.link_web_form}
                    label="Link Web Form"
                    type={variables.INPUT}
                  />
                </Pane>
              ) : (
                ''
              )}
              <Pane className="col-lg-12">
                <FormItem name="content" label="Nội dung" type={variables.TEXTAREA} />
              </Pane>
              <Pane className="col-lg-12">
                <FormItem name="note" label="ghi chú" type={variables.TEXTAREA} />
              </Pane>
            </Pane>
          </Pane>

          <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
            <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
              Lưu
            </Button>
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
