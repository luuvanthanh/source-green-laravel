import { memo, useRef, useEffect } from 'react';
import { Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import { head, isEmpty, get } from 'lodash';
import { connect, history, withRouter } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Select from '@/components/CommonComponent/Select';
import ImageUpload from '@/components/CommonComponent/ImageUpload';

import { variables } from '@/utils/variables';

const { Item: FormItem } = Form;

const genders = [
  { id: 0, name: 'Nam' },
  { id: 1, name: 'Nữ' },
];

const mapStateToProps = ({ loading, OPchildrenAdd }) => ({
  loading,
  details: OPchildrenAdd.details,
  error: OPchildrenAdd.error,
});
const Other = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const loading = effects[`OPchildrenAdd/GET_DETAILS`] || effects[`OPchildrenAdd/GET_EMPLOYEES`];
  const loadingSubmit = effects[`OPchildrenAdd/ADD`] || effects[`OPchildrenAdd/UPDATE`];
  const mounted = useRef(false);
  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };

  const onFinish = (values) => {
    dispatch({
      type: 'OPchildrenAdd/UPDATE',
      payload: {
        ...details,
        student: {
          ...details.student,
          ...values,
        },
        id: params.id,
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
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'OPchildrenAdd/GET_DETAILS',
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
        <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>
            Khác
          </Heading>
          <Pane className="row">
            <Pane className="col">
              <FormItem name="note" label="Lưu ý về trẻ">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col">
              <FormItem name="parentWish" label="Mong muốn của phụ huynh">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col">
              <FormItem name="source" label="Nguồn">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col">
              <FormItem name="comments" label="Đóng góp của phụ huynh">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
          </Pane>
        </Pane>

        <Pane style={{ padding: 20 }}>
          <Button
            color="success"
            style={{ marginLeft: 'auto' }}
            size="large"
            loading={loadingSubmit}
            htmlType="submit"
          >
            Lưu
          </Button>
        </Pane>
      </Pane>
    </Form>
  );
});

export default withRouter(connect(mapStateToProps)(Other));
