import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Pane from '@/components/CommonComponent/Pane';
import FormDetail from '@/components/CommonComponent/FormDetail';

import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const {
    loading: { effects },
    dataSubject,
  } = useSelector(({ loading, englishSettingSchedule }) => ({
    loading,
    dataSubject: englishSettingSchedule.dataSubject,
    error: englishSettingSchedule.error,
  }));

  const loadingSubmit = effects[`englishSettingSchedule/ADD`];
  const [checkEdit, setCheckEdit] = useState(false);
  const [details, setDetails] = useState(undefined);



  const onFinish = (value) => {
    dispatch({
      type: 'englishSettingSchedule/ADD',
      payload: value,
      callback: (response, error) => {
        if (response) {
          setCheckEdit(false);
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              form.current.setFields([
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
    dispatch({
      type: 'englishSettingSchedule/GET_DATA',
      payload: {},
      callback: (response) => {
        if (response) {
          form.setFieldsValue({
            value: response,
          });
          setDetails(response);
        }
      },
    });
    dispatch({
      type: 'englishSettingSchedule/GET_DATA_SUBJECT',
      payload: {
        MaxResultCount: 1000,
      },
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <div >
      <Helmet title="Subject" />
      <Pane className="p20">
        <Pane className="col-lg-6 offset-lg-3">
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            <Loading
              loading={effects['englishSettingSchedule/GET_DATA']}
            >
              <Heading type="form-title" className="mb15">
                Schedule
              </Heading>
              <Pane className="card p20">
                <Pane className="row">
                  <Pane className="col-lg-12">
                    {
                      checkEdit ?
                        <FormItem
                          name="value"
                          placeholder="Select input"
                          data={dataSubject}
                          type={variables.SELECT}
                          label="Subject apply"
                          rules={[variables.RULES.EMPTY_INPUT_ENGLISH]}
                        /> :
                        <FormDetail name={!isEmpty(details) ? details : ""} label="Subject apply" type="select" data={dataSubject} />
                    }
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="d-flex justify-content-between align-items-center mb20 mt20">
                {
                  checkEdit ?
                    <>
                      <p
                        className="btn-delete"
                        role="presentation"

                        onClick={() => setCheckEdit(false)}
                      >
                        Cancel
                      </p>
                      <Button
                        className="ml-auto px25"
                        color="success"
                        htmlType="submit"
                        size="large"
                        loading={loadingSubmit}
                      >
                        Save
                      </Button>
                    </>
                    :
                    <Button
                      className="ml-auto px25"
                      color="success"
                      size="large"
                      htmlType="edit"
                      onClick={() => setCheckEdit(true)}
                    >
                      Edit
                    </Button>
                }
              </Pane>
            </Loading>
          </Form>
        </Pane>
      </Pane>
    </div>
  );
});

export default Index;