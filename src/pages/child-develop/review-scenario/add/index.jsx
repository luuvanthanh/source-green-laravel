import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Collapse } from 'antd';
import { head, isEmpty, get } from 'lodash';
import styles from '@/assets/styles/Common/common.scss';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import variablesModules from '../variables';
import stylesModule from '../styles.module.scss';

const { Panel } = Collapse;

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    details,
    skill,
    menuLeftChildDevelop,
  } = useSelector(({ menu, loading, childDevelopReviewScenarioAdd }) => ({
    loading,
    menuLeftChildDevelop: menu.menuLeftChildDevelop,
    details: childDevelopReviewScenarioAdd.details,
    skill: childDevelopReviewScenarioAdd.skill,
    error: childDevelopReviewScenarioAdd.error,
  }));

  const loadingSubmit = effects[`childDevelopReviewScenarioAdd/UPDATE`] || effects[`childDevelopReviewScenarioAdd/ADD`];

  const onFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id ? 'childDevelopReviewScenarioAdd/UPDATE' : 'childDevelopReviewScenarioAdd/ADD',
        payload: params.id ? {
          id: params.id,
          categorySkillId: values.categorySkillId ? values.categorySkillId : details.categorySkillId,
          age: values.age ? Number( values.age) : Number(details.age),
          use:  values.use,
          detail: values.data.map((i) => ({
            nameCriteria: i?.nameCriteria,
            inputAssessment: i?.inputAssessment ? i?.inputAssessment : false ,
            periodicAssessment: i?.periodicAssessment ? i?.periodicAssessment : false,
            use: i?.use ? i?.use : false,
            detailChildren: i?.childEvaluateDetailChildren ? i?.childEvaluateDetailChildren?.map((item) => ({
              content: item.content, use: item.use ? item.use  : false
            })) : [],
          }))
        }
          :
          {
            categorySkillId: values.categorySkillId ? values.categorySkillId : false, 
            age: values.age ? Number (values.age) : false,
            use:  values.use ? values.use  : false,
            detail: values.data.map((item) => ({
              nameCriteria: item?.nameCriteria,
              inputAssessment: item?.inputAssessment ? item?.inputAssessment  : false ,
              periodicAssessment: item?.periodicAssessment ? item?.periodicAssessment: false,
              use: item?.use ? item?.use : false,
              detailChildren: item?.childEvaluateDetailChildren ? item?.childEvaluateDetailChildren : [],
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
      type: 'childDevelopReviewScenarioAdd/GET_SKILL',
      payload: {},
    });
  }, []);

  useEffect(() => {
    if(params.id) {
    dispatch({
      type: 'childDevelopReviewScenarioAdd/GET_DATA',
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
      <Breadcrumbs last={params.id ? 'Chỉnh sửa ' : 'Tạo mới'} menu={menuLeftChildDevelop} />
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
              <Heading type="form-title" className="mb15">
                Thông tin chung
              </Heading>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <FormItem
                    options={['id', 'name']}
                    name="categorySkillId"
                    data={skill}
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Kỹ năng"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    options={['id', 'name']}
                    name="age"
                    data={variablesModules.AGE}
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Độ tuổi"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    valuePropName="checked"
                    label="Sử dụng"
                    name='use'
                    type={variables.SWITCH}
                  />
                </Pane>
              </Pane>
            </Pane>
            <Pane className="card p20">
              <Pane className="row">
                <Form.List name="data">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <>
                          <Pane className="offset-lg-12 col-lg-12 border-bottom pt15" key={field.key}>


                            <Heading type="form-title" className="mb15">
                              Thông tin tiêu chí {index + 1}
                            </Heading>
                            {fields.length > 0 && (
                              <div className={styles['list-button']}>
                                <button
                                  className={styles['button-circle']}
                                  style={{ display: 'flex', position: 'absolute', top: 20, right: 50 }}
                                  onClick={() => {
                                    remove(index);
                                  }}
                                  type="button"
                                >
                                  <span className="icon-remove" />
                                </button>
                              </div>
                            )}
                            <Collapse defaultActiveKey={[index + 1]} ghost expandIconPosition='right'>
                              <Panel key={index + 1} >
                                <Pane className="card">
                                  <Pane >
                                    <>
                                      <Pane className="row">
                                        <Pane className="col-lg-6">
                                          <FormItem
                                            label="Tên tiêu chí"
                                            name={[field.name, 'nameCriteria']}
                                            fieldKey={[field.fieldKey, 'nameCriteria']}
                                            type={variables.INPUT}
                                            rules={[variables.RULES.EMPTY]}
                                          />
                                        </Pane>
                                        <Pane className="col-lg-3">
                                          <Pane className="row">
                                            <Pane className="col-lg-12">
                                              <h3 className={stylesModule['wrapper-checkBox']}>Áp dụng</h3>
                                            </Pane>
                                            <Pane className={classnames('col-lg-6', stylesModule['checkBox-item'],)}>
                                              <FormItem
                                                className="checkbox-row checkbox-small"
                                                label="Test đầu vào"
                                                name={[field.name, 'inputAssessment']}
                                                fieldKey={[field.fieldKey, 'inputAssessment']}
                                                type={variables.CHECKBOX_FORM}
                                                valuePropName="checked"
                                              />
                                            </Pane>
                                            <Pane className={classnames('col-lg-6', stylesModule['checkBox-item'],)}>
                                              <FormItem
                                                className="checkbox-row checkbox-small"
                                                label="ĐG định kỳ"
                                                name={[field.name, 'periodicAssessment']}
                                                fieldKey={[field.fieldKey, 'periodicAssessment']}
                                                type={variables.CHECKBOX_FORM}
                                                valuePropName="checked"
                                              />
                                            </Pane>
                                          </Pane>
                                        </Pane>
                                        <Pane className="col-lg-3">
                                          <FormItem
                                            valuePropName="checked"
                                            label="Sử dụng"
                                            name={[field.name, 'use']}
                                            fieldKey={[field.fieldKey, 'use']}
                                            type={variables.SWITCH}
                                          />
                                        </Pane>
                                        <Pane className="col-lg-12">
                                          <h4 className={stylesModule['wrapper-title']}>Hình thức tiếp cận</h4>
                                          <div className={stylesModule['wrapper-table']}>
                                            <div className={stylesModule['card-heading']}>
                                              <div className={stylesModule.col}>
                                                <p className={stylesModule.norm}>Nội dung</p>
                                              </div>
                                              <div className={stylesModule.col}>
                                                <p className={stylesModule.norm}>Sử dụng</p>
                                              </div>
                                              <div className={stylesModule.cols}>
                                                <p className={stylesModule.norm} />
                                              </div>
                                            </div>
                                            <Form.List label="Hình thức tiếp cận" name={[field.name, 'childEvaluateDetailChildren']} fieldKey={[field.fieldKey, 'childEvaluateDetailChildren']}>
                                              {(fieldss, { add, remove }) => (
                                                <Pane>
                                                  {fieldss.map((fieldItem, index) => (
                                                    <>
                                                      <Pane
                                                        key={index}
                                                        className="d-flex"
                                                      >
                                                        <div className={stylesModule['card-item']}>
                                                          <div className={classnames(stylesModule.col)}>
                                                            <FormItem
                                                              className={stylesModule.item}
                                                              fieldKey={[fieldItem.fieldKey, 'content']}
                                                              name={[fieldItem.name, 'content']}
                                                              type={variables.TEXTAREA}
                                                            />
                                                          </div>
                                                          <div className={classnames(stylesModule.col)}>
                                                            <FormItem
                                                              valuePropName='checked'
                                                              name={[fieldItem.name, 'use']}
                                                              fieldKey={[fieldItem.fieldKey, 'use']}
                                                              type={variables.SWITCH}
                                                            />
                                                          </div>
                                                          <div className={classnames(stylesModule.col)}>
                                                            {fields.length > 0 && (
                                                              <div className={styles['list-button']}>
                                                                <button
                                                                  className={styles['button-circle']}
                                                                  onClick={() => {
                                                                    remove(index);
                                                                  }}
                                                                  type="button"
                                                                >
                                                                  <span className="icon-remove" />
                                                                </button>
                                                              </div>
                                                            )}
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
                                    </>
                                  </Pane>
                                </Pane>
                              </Panel>
                            </Collapse>
                          </Pane>
                        </>
                      ))}
                      <Pane className="pl20 pb20 pt20" >
                        <Button
                          color="success"
                          ghost
                          icon="plus"
                          onClick={() => {
                            add();
                          }}
                        >
                          Thêm tiêu chí
                        </Button>
                      </Pane>
                    </>
                  )}
                </Form.List>
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