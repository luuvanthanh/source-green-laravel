import { memo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { isEmpty, get, head } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import FormDetail from '@/components/CommonComponent/FormDetail';

import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';

const Index = memo(() => {
  const [form] = Form.useForm();
  const [
    effects
  ] = useSelector(({ hrmRecruitmentThankConfiguration, loading, user, menu }) => [
    hrmRecruitmentThankConfiguration,
    loading,
    user,
    menu,
  ]);
  const dispatch = useDispatch();
  const [checkEdit, setCheckEdit] = useState(false);
  const [detail, setDetail] = useState(undefined);

  const onFinish = (value) => {
    setDetail({});
    dispatch({
      type: 'hrmRecruitmentThankConfiguration/ADD',
      payload: {
        content: value?.content
      },
      callback: (response, error) => {
        if (response) {
          setCheckEdit(false);
          dispatch({
            type: 'hrmRecruitmentThankConfiguration/GET_DETAILS',
            payload: {},
            callback: (response) => {
              if (response) {
                setDetail(head(response?.parsePayload));
                form.setFieldsValue({
                  content: head(response?.parsePayload)?.content,
                });
              }
            },
          });
        }
        if (error) {
          if (!isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              form.setFields([
                {
                  name: get(item, 'member').toLowerCase(),
                  errors: [get(item, 'message')],
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
      type: 'hrmRecruitmentThankConfiguration/GET_DETAILS',
      payload: {},
      callback: (response) => {
        if (response) {
          setDetail(head(response?.parsePayload));
          form.setFieldsValue({
            content: head(response?.parsePayload)?.content,
          });
        }
      },
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Helmet title="Cấu hình lời cảm ơn" />
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <Heading type="form-title" className="pb20">
              Cấu hình lời cảm ơn
            </Heading>
            <Loading loading={effects['hrmRecruitmentThankConfiguration/GET_DETAILS']} >
              <div className="card p20">
                <Pane className="row">
                  <Pane className="col-lg-12">
                    {
                      checkEdit ?
                        <FormItem
                          label="Nội dung"
                          name="content"
                          type={variables.TEXTAREA}
                        />
                        :
                        <FormDetail name={detail?.content} label="Nội dung" type={variables.TYPE.TEXTAREA} />
                    }
                  </Pane>
                </Pane>
              </div>
            </Loading>
            {
              checkEdit ?
                <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                  <>
                    <p className="btn-delete" role="presentation" onClick={() => setCheckEdit(false)}>
                      Hủy
                    </p>
                    <Button color="success" size="large" htmlType="submit" loading={effects['hrmRecruitmentThankConfiguration/ADD']}>
                      Lưu
                    </Button>
                  </>
                </Pane>
                :
                <Pane className="pt20 pb20 d-flex justify-content-end align-items-center border-top">
                  <Button color="success" onClick={() => setCheckEdit(true)}>
                    Sửa
                  </Button>
                </Pane>
            }
          </div>
        </div>
      </Form>
    </div>
  );
});

Index.propTypes = {
};

Index.defaultProps = {
};

export default Index;
