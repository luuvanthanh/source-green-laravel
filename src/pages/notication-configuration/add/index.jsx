import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from '../styles.module.scss';


const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    details,
    menuLeftNotification,
  } = useSelector(({ menu, loading, noticationConfigurationAdd }) => ({
    loading,
    menuLeftNotification: menu.menuLeftNotification,
    details: noticationConfigurationAdd.details,
    skill: noticationConfigurationAdd.skill,
    error: noticationConfigurationAdd.error,
  }));

  const loadingSubmit = effects[`noticationConfigurationAdd/UPDATE`] || effects[`noticationConfigurationAdd/ADD`];

  const onFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id ? 'noticationConfigurationAdd/UPDATE' : 'noticationConfigurationAdd/ADD',
        payload: params.id ? {
          id: params.id,
          categorySkillId: values.categorySkillId ? values.categorySkillId : details.categorySkillId,
          age: values.age ? Number(values.age) : Number(details.age),
          use: values.use,
          detail: values.data.map((i) => ({
            nameCriteria: i?.nameCriteria,
            inputAssessment: i?.inputAssessment ? i?.inputAssessment : false,
            periodicAssessment: i?.periodicAssessment ? i?.periodicAssessment : false,
            use: i?.use ? i?.use : false,
            detailChildren: i?.childEvaluateDetailChildren ? i?.childEvaluateDetailChildren?.map((item) => ({
              content: item.content, use: item.use ? item.use : false
            })) : [],
          }))
        }
          :
          {
            categorySkillId: values.categorySkillId ? values.categorySkillId : false,
            age: values.age ? Number(values.age) : false,
            use: values.use ? values.use : false,
            detail: values.data.map((item) => ({
              nameCriteria: item?.nameCriteria,
              inputAssessment: item?.inputAssessment ? item?.inputAssessment : false,
              periodicAssessment: item?.periodicAssessment ? item?.periodicAssessment : false,
              use: item?.use ? item?.use : false,
              detailChildren: item?.childEvaluateDetailChildren ? item?.childEvaluateDetailChildren?.map((item) => ({
                content: item.content, use: item.use ? item.use : false
              })) : [],
            }))
          },
        callback: (response, error) => {
          if (response) {
            if (response) {
              history.goBack();
            }
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
    });
  };

  useEffect(() => {
    dispatch({
      type: 'noticationConfigurationAdd/GET_SKILL',
      payload: {},
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'noticationConfigurationAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              data: response.parsePayload.childEvaluateDetail,
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

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue({
        ...details,
        ...head(details.positionLevel),
      });
    }
  }, [details]);

  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={params.id ? 'Chỉnh sửa ' : 'Tạo mới'} menu={menuLeftNotification} />
      <Helmet title="Cấu hình khai báo y tế" />
      <Pane className="pl20 pr20">
        <Pane >
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            {/* <Loading
              loading={loading}
              isError={error.isError}
              params={{ error, goBack: '/su-phat-trien-cua-tre/cau-hinh-kich-ban-danh-gia' }}
            > */}
            <Pane className="card p20">
              <Pane className="row">
                <Pane className="offset-lg-12 col-lg-12 pt15" >


                  <Heading type="form-title" className="mb15">
                    Tên danh mục
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-12">
                      <FormItem
                        label="Tên tiêu chí"
                        name="ssss"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <h4 className={stylesModule['wrapper-title']}>Quy trình</h4>
                      <div className={stylesModule['wrapper-table']}>
                        <div className={stylesModule['card-heading']}>
                          <div className={stylesModule.col}>
                            <p className={stylesModule.norm}>Đối tượng tạo</p>
                          </div>
                          <div className={stylesModule.col}>
                            <p className={stylesModule.norm}>Đối tượng tạo</p>
                          </div>
                          <div className={stylesModule.cols}>
                            <p className={stylesModule.norm} >Đối tượng nhận</p>
                          </div>
                        </div>
                        <Form.List label="Quy trình" name="ssss" >
                          {(fields, { add }) => (
                            <Pane>
                              {fields.map((fieldItem, index) => (
                                <>
                                  <Pane
                                    key={index}
                                    className="d-flex"
                                  >
                                    <div className={stylesModule['card-item']}>
                                      <div className={classnames(stylesModule.col)}>
                                        <FormItem
                                          className={stylesModule.item}
                                          fieldKey={[fieldItem.fieldKey, 'contentS']}
                                          name={[fieldItem.name, 'content']}
                                          data={genders}
                                          type={variables.SELECT_MUTILPLE}
                                        />
                                      </div>
                                      <div className={classnames(stylesModule.col)}>
                                        <FormItem
                                          className="checkbox-row checkbox-small pb10"
                                          label="ĐG định kỳ"
                                          fieldKey={[fieldItem.fieldKey, 'a']}
                                          name={[fieldItem.name, 'a']}
                                          type={variables.CHECKBOX_FORM}
                                          valuePropName="checked"
                                        />
                                        <FormItem
                                          className={stylesModule.item}
                                          fieldKey={[fieldItem.fieldKey, 'contentS']}
                                          name={[fieldItem.name, 'content']}
                                          type={variables.SELECT}
                                        />
                                      </div>
                                      <div className={classnames(stylesModule.col)}>
                                        <FormItem
                                          className="checkbox-row checkbox-small pb10"
                                          label="ĐG định kỳ"
                                          fieldKey={[fieldItem.fieldKey, 'a']}
                                          name={[fieldItem.name, 'a']}
                                          type={variables.CHECKBOX_FORM}
                                          valuePropName="checked"
                                        />
                                        <FormItem
                                          className="checkbox-row checkbox-small"
                                          label="ĐG định kỳ"
                                          fieldKey={[fieldItem.fieldKey, 'a']}
                                          name={[fieldItem.name, 'a']}
                                          type={variables.CHECKBOX_FORM}
                                          valuePropName="checked"
                                        />
                                      </div>
                                    </div>
                                  </Pane>
                                </>
                              ))}
                              <Pane className="mt10 ml10 mb10 d-flex align-items-center color-success pointer " >
                                <span
                                  onClick={() => add()}
                                  role="presentation"
                                  className={stylesModule.add}
                                >
                                  <span className="icon-plus-circle mr5" />
                                  Thêm
                                </span>
                              </Pane>
                            </Pane>
                          )}
                        </Form.List>
                      </div>
                    </Pane>
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
            <Pane className="d-flex justify-content-between align-items-center mb20">
              <p
                className="btn-delete"
                role="presentation"

                onClick={() => history.goBack()}
              >
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

          </Form>
        </Pane>
      </Pane>
    </div>
  );
});

export default Index;