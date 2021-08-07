import { memo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import { head, isEmpty } from 'lodash';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import { variables, Helper } from '@/utils';

const Index = memo(() => {
  const [
    { menuLeftCriteria },
    loading,
    { error },
  ] = useSelector(({ menu, loading: { effects }, sensitivePeriodCreate }) => [
    menu,
    effects,
    sensitivePeriodCreate,
  ]);
  const dispatch = useDispatch();
  const params = useParams();

  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);
  // const mountedSet = (setFunction, value) =>
  //   !!mounted?.current && setFunction && setFunction(value);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'sensitivePeriodCreate/UPDATE' : 'sensitivePeriodCreate/ADD',
      payload: {
        ...values,
        ...params,
        isFeedback: !!values.isFeedback,
        toolLevels: values.toolLevels.map((item, index) => ({
          ...item,
          level: index + 1,
          evaluates: item.evaluates.map((item) => item.name),
        })),
      },
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

  const remove = () => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'sensitivePeriodCreate/REMOVE',
          payload: {
            ...params,
          },
          callback: (response) => {
            if (response) {
              history.goBack();
            }
          },
        });
      },
    });
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'sensitivePeriodCreate/GET_DATA',
        payload: {
          ...params,
        },
        callback: (response) => {
          if (response) {
            formRef.current.setFieldsValue({
              ...response,
              toolLevels: response.toolLevels.map((item) => ({
                ...item,
                evaluates: item.evaluates.map((item) => ({ ...item, name: item.evaluate })),
              })),
            });
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <Pane style={{ paddingTop: 20 }}>
      <Helmet title="Tạo giáo cụ" />
      <Breadcrumbs className="pb30 pt0" last="Tạo giáo cụ" menu={menuLeftCriteria} />
      <Pane style={{ padding: 20, paddingBottom: 0, paddingTop: 0 }}>
        <Pane className="row justify-content-center">
          <Pane className="col-lg-6">
            <Form
              layout="vertical"
              ref={formRef}
              onFinish={onFinish}
              initialValues={{
                toolLevels: [{ evaluates: [{}] }],
              }}
            >
              <Pane className="my20 mb0 card">
                <Loading
                  loading={loading['sensitivePeriodCreate/GET_DATA']}
                  isError={error.isError}
                  params={{
                    error,
                    type: 'container',
                    goBack: '/chuong-trinh-hoc/cau-hinh/thoi-ky-nhay-cam',
                  }}
                >
                  <Pane className="border-bottom p20">
                    <Heading type="form-title" className="mb20">
                      Thông tin chung
                    </Heading>
                    <FormItem
                      label="Mã"
                      name="code"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                    <FormItem
                      label="Tên thời kỳ nhạy cảm"
                      name="name"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.INPUT}
                    />
                    <FormItem
                      label="Ghi chú"
                      name="description"
                      rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                      type={variables.TEXTAREA}
                    />
                  </Pane>
                  <Pane className="border-bottom p20">
                    <Heading type="form-title" className="mb10">
                      Tiêu chí đánh giá của giáo viên
                    </Heading>
                    <Form.List name="toolLevels">
                      {(fields, { add, remove }) => (
                        <Pane>
                          {fields.map((field, index) => (
                            <Pane
                              key={index}
                              className="mt10 d-flex justify-content-between align-items-end groups-input"
                            >
                              <FormItem
                                label={`Tiêu chí ${index + 1}`}
                                className="mb0"
                                fieldKey={[field.fieldKey, 'name']}
                                name={[field.name, 'name']}
                                type={variables.INPUT}
                                rules={[variables.RULES.EMPTY]}
                              />
                              {fields.length > 1 && (
                                <span
                                  className="icon icon-remove"
                                  role="presentation"
                                  onClick={() => remove(field.name)}
                                />
                              )}
                            </Pane>
                          ))}
                          <Pane className="mt10 d-flex align-items-center color-success pointer">
                            <span className="icon-plus-circle mr5" />
                            <span
                              onClick={() => add()}
                              role="presentation"
                              className="text-uppercase font-size-13"
                            >
                              Thêm tiêu chí
                            </span>
                          </Pane>
                        </Pane>
                      )}
                    </Form.List>
                  </Pane>
                </Loading>
              </Pane>
              <Pane className="d-flex justify-content-between align-items-center mb20">
                {params.id && (
                  <p className="btn-delete" role="presentation" onClick={remove}>
                    Xóa
                  </p>
                )}
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={
                    loading['sensitivePeriodCreate/ADD'] || loading['sensitivePeriodCreate/UPDATE']
                  }
                >
                  Lưu
                </Button>
              </Pane>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
