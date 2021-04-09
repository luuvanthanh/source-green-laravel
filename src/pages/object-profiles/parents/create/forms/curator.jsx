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

const mapStateToProps = ({ loading, OPParentsAdd }) => ({
  loading,
  details: OPParentsAdd.details,
  error: OPParentsAdd.error,
});
const Curator = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();

  const loadingSubmit = effects[`OPParentsAdd/ADD`] || effects[`OPParentsAdd/UPDATE`];
  const loading = effects[`OPParentsAdd/GET_DETAILS`];

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'OPParentsAdd/UPDATE' : 'OPParentsAdd/ADD',
      payload: params.id ? { ...details, ...values, id: params.id } : values,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
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
        type: 'OPParentsAdd/GET_DETAILS',
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
      <Loading loading={loading} isError={error.isError} params={{ error }}>
        <Pane className="card">
          <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Theo dõi
            </Heading>

            <Pane className="row">
              <Pane className="col-lg-4">
                <FormItem
                  data={[]}
                  name="curator"
                  label="Nhân viên theo dõi"
                  type={variables.SELECT}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem data={[]} name="source" label="Nguồn khách hàng" type={variables.SELECT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem name="code" label="Nguồn khách hàng" type={variables.INPUT} />
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
        </Pane>
      </Loading>
    </Form>
  );
});

export default withRouter(connect(mapStateToProps)(Curator));
