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
import Text from '@/components/CommonComponent/Text';
import { variables, Helper } from '@/utils';

const Index = memo(() => {
  const [
    { menuLeftCriteria },
    loading,
    { error },
  ] = useSelector(({ menu, loading: { effects }, criteriaToolCreate }) => [
    menu,
    effects,
    criteriaToolCreate,
  ]);
  const dispatch = useDispatch();
  const params = useParams();

  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);
  // const mountedSet = (action, value) => mounted?.current && action(value);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'criteriaToolCreate/UPDATE' : 'criteriaToolCreate/ADD',
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
          type: 'criteriaToolCreate/REMOVE',
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
        type: 'criteriaToolCreate/GET_DATA',
        payload: {
          ...params,
        },
        callback: (response) => {
          if (response) {
            formRef.current.setFieldsValue({
              ...response,
              toolLevels: response.toolLevels.map((item) => ({
                ...item,
                evaluates: item.evaluate.map((item) => ({ name: item })),
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
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title="Tạo giáo cụ" />
      <Breadcrumbs className="pb30 pt0" last="Tạo giáo cụ" menu={menuLeftCriteria} />
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
                loading={loading['criteriaToolCreate/GET_DATA']}
                isError={error.isError}
                params={{ error, type: 'container' }}
              >
                <Pane className="border-bottom p20">
                  <Heading type="form-title" className="mb20">
                    Thông tin chung
                  </Heading>
                  <FormItem
                    className="mb0"
                    label="Tên giáo cụ"
                    name="name"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </Pane>
                <Pane className="border-bottom p20">
                  <Heading type="form-title" className="mb10">
                    Cấp độ
                  </Heading>
                  <Form.List name="toolLevels">
                    {(fields, { add, remove }) => (
                      <Pane>
                        {fields.map((field, index) => (
                          <Pane key={index}>
                            <Pane className="d-flex mt10">
                              <Text size="medium" className="fw-bold mr5 font-size-13">
                                {index + 1}.
                              </Text>
                              {fields.length > 1 && (
                                <p
                                  onClick={() => remove(field.name)}
                                  role="presentation"
                                  className="btn-delete font-size-13 fw-normal"
                                >
                                  Xóa
                                </p>
                              )}
                            </Pane>
                            <Text size="normal">Tiêu chí đánh giá</Text>
                            <Form.List
                              fieldKey={[field.fieldKey, 'evaluates']}
                              name={[field.name, 'evaluates']}
                            >
                              {(fieldsContent, { add, remove }) => (
                                <Pane>
                                  {fieldsContent.map((fieldContent, indexContent) => (
                                    <Pane
                                      key={indexContent}
                                      className="mt10 d-flex justify-content-between align-items-center groups-input"
                                    >
                                      <FormItem
                                        className="mb0"
                                        fieldKey={[fieldContent.fieldKey, 'name']}
                                        name={[fieldContent.name, 'name']}
                                        type={variables.INPUT}
                                        rules={[variables.RULES.EMPTY]}
                                      />
                                      {fieldsContent.length > 1 && (
                                        <span
                                          className="icon icon-remove"
                                          role="presentation"
                                          onClick={() => remove(fieldContent.name)}
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
                        ))}
                        <Pane className="mt10 d-flex align-items-center color-success pointer">
                          <span className="icon-plus-circle mr5" />
                          <span
                            onClick={() => add()}
                            role="presentation"
                            className="text-uppercase font-size-13"
                          >
                            Thêm cấp độ
                          </span>
                        </Pane>
                      </Pane>
                    )}
                  </Form.List>
                </Pane>
                <Pane className="border-bottom p20 d-flex align-items-center">
                  <FormItem
                    className="mb0 mr10"
                    name="isFeedback"
                    type={variables.SWITCH}
                    valuePropName="checked"
                  />
                  <Text size="normal">Nhận xét</Text>
                </Pane>
                <Pane className="p20 d-flex justify-content-between align-items-center">
                  {params.id && (
                    <p className="btn-delete" role="presentation" onClick={remove}>
                      Hủy
                    </p>
                  )}
                  <Button
                    className="ml-auto px25"
                    color="success"
                    htmlType="submit"
                    size="large"
                    loading={
                      loading['criteriaToolCreate/ADD'] || loading['criteriaToolCreate/UPDATE']
                    }
                  >
                    Lưu
                  </Button>
                </Pane>
              </Loading>
            </Pane>
          </Form>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
