import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Collapse } from 'antd';
import { isEmpty, get } from 'lodash';
import styles from '@/assets/styles/Common/common.scss';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import variablesModules from '../utils/variables';
import stylesModule from '../styles.module.scss';

const { Panel } = Collapse;

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    menuLeftCriteria,
  } = useSelector(({ menu, loading, englishSettingProgramAdd }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    skill: englishSettingProgramAdd.skill,
    error: englishSettingProgramAdd.error,
  }));

  const loadingSubmit = effects[`englishSettingProgramAdd/UPDATE`] || effects[`englishSettingProgramAdd/ADD`];

  const onFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id ? 'englishSettingProgramAdd/UPDATE' : 'englishSettingProgramAdd/ADD',
        payload: {
          id: params.id,
          name: values?.name,
          code: values?.code,
          colorText: values?.colorText,
          units: values?.units?.map((i, index) => ({
            index: index + 1,
            name: i?.name,
            lessions: i?.lessions?.map(k => ({
              name: k?.name,
              activities: k?.activities,
              week: k?.week,
              classPeriod: k?.classPeriod
            }))
          }))
        },
        callback: (response, error) => {
          if (response) {
            history.goBack();
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
    if (params.id) {
      dispatch({
        type: 'englishSettingProgramAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              name: response?.name,
              code: response?.code,
              colorText: response?.colorText,
              units: response?.units?.map(i => ({
                name: i?.name,
                ...i,
                lessions: i?.lessions?.map(k => ({
                  nameDetail: k?.name,
                  ...k,
                }))
              }))
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
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={params.id ? 'Edit' : 'Create new'} menu={menuLeftCriteria} />
      <Helmet title="Program" />
      <Pane className="pl20 pr20 pb20">
        <Pane >
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
            units: [
              {},
            ],
          }}>
            <Loading
              loading={effects['englishSettingProgramAdd/GET_DATA']}
            >
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Program
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-3">
                    <FormItem
                      name="code"
                      placeholder=" "
                      type={variables.INPUT}
                      label="ID program"
                      disabled
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormItem
                      name="name"
                      placeholder="Input text"
                      type={variables.INPUT}
                      label="Program name"
                      rules={[variables.RULES.EMPTY_INPUT_ENGLISH]}
                    />
                  </Pane>
                  <Pane className="col-lg-3" >
                    <FormItem
                      name="colorText"
                      placeholder="Select text"
                      type={variables.SELECT}
                      className="select-color"
                      data={variablesModules.DATA_COLOR}
                      label="Color"
                      rules={[variables.RULES.EMPTY_INPUT_ENGLISH]}
                    />
                  </Pane>
                </Pane>
              </Pane>
              <Form.List name="units">
                {(fields, { remove, add }) => (
                  <>
                    <Pane className="p20 pb0">
                      <Pane className="row">
                        {fields.map((field, index) => (
                          <>
                            <Pane className="offset-lg-12 col-lg-12 mb20 p15 card" key={field.key}>
                              <Heading type="form-title" >
                                Unit {index + 1}
                              </Heading>
                              {fields.length > 1 && (
                                <div className={styles['list-button']}>
                                  <button
                                    className={styles['button-circle']}
                                    style={{ display: 'flex', position: 'absolute', top: 15, right: 50 }}
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
                                    <>
                                      <Pane className="row p0">
                                        <Pane className="col-lg-6">
                                          <FormItem
                                            label="Unit name"
                                            name={[field.name, 'name']}
                                            placeholder="Input text"
                                            fieldKey={[field.fieldKey, 'name']}
                                            type={variables.INPUT}
                                            rules={[variables.RULES.EMPTY_INPUT_ENGLISH]}
                                          />
                                        </Pane>
                                        <Pane className="col-lg-12">
                                          <div className={stylesModule['wrapper-table']}>
                                            <div className={stylesModule['card-heading']}>
                                              <div className={stylesModule.col}>
                                                <p className={stylesModule.norm}>Lesson name</p>
                                              </div>
                                              <div className={stylesModule.col}>
                                                <p className={stylesModule.norm}>Activities</p>
                                              </div>
                                              <div className={stylesModule.cols}>
                                                <p className={stylesModule.norm}>Week</p>
                                              </div>
                                              <div className={stylesModule.cols}>
                                                <p className={stylesModule.norm}>Class period</p>
                                              </div>
                                              <div className={stylesModule.cols}>
                                                <p className={stylesModule.norm} />
                                              </div>
                                            </div>
                                            <Form.List label="Hình thức tiếp cận" name={[field.name, 'lessions']} fieldKey={[field.fieldKey, 'lessions']}>
                                              {(fieldsDetail, { remove, add }) => (
                                                <>
                                                  {fieldsDetail.map((fieldItem, indexItem) => (
                                                    <>
                                                      <Pane
                                                        key={indexItem}
                                                        className="d-flex"
                                                      >
                                                        <div className={stylesModule['card-item']}>
                                                          <div className={classnames(stylesModule.col)}>
                                                            <FormItem
                                                              className={stylesModule.item}
                                                              fieldKey={[fieldItem.fieldKey, 'name']}
                                                              name={[fieldItem.name, 'name']}
                                                              placeholder="Input text"
                                                              type={variables.INPUT}
                                                            />
                                                          </div>
                                                          <div className={classnames(stylesModule.col)}>
                                                            <FormItem
                                                              className={stylesModule.item}
                                                              fieldKey={[fieldItem.fieldKey, 'activities']}
                                                              name={[fieldItem.name, 'activities']}
                                                              placeholder="Input text"
                                                              type={variables.INPUT}
                                                            />
                                                          </div>
                                                          <div className={classnames(stylesModule.cols)}>
                                                            <FormItem
                                                              className={stylesModule.item}
                                                              fieldKey={[fieldItem.fieldKey, 'week']}
                                                              name={[fieldItem.name, 'week']}
                                                              placeholder="Input text"
                                                              type={variables.INPUT_COUNT}
                                                            />
                                                          </div>
                                                          <div className={classnames(stylesModule.cols)}>
                                                            <FormItem
                                                              className={stylesModule.item}
                                                              fieldKey={[fieldItem.fieldKey, 'classPeriod']}
                                                              name={[fieldItem.name, 'classPeriod']}
                                                              placeholder="Input text"
                                                              type={variables.INPUT_COUNT}
                                                            />
                                                          </div>
                                                          <div className={classnames(stylesModule.cols)}>
                                                            {fieldsDetail.length > 1 && (
                                                              <div className={styles['list-button']}>
                                                                <button
                                                                  className={styles['button-circle']}
                                                                  onClick={() => {
                                                                    remove(indexItem);
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

                                                  )
                                                  )}
                                                  <Pane className="mt10 ml10 mb10 d-flex align-items-center color-success pointer " >
                                                    <span
                                                      onClick={() => add()}
                                                      role="presentation"
                                                      className={stylesModule.add}
                                                    >
                                                      <span className="icon-plus-circle mr5" />
                                                      Add
                                                    </span>
                                                  </Pane>
                                                </>
                                              )}
                                            </Form.List>
                                          </div>
                                        </Pane>
                                      </Pane>
                                    </>
                                  </Pane>
                                </Panel>
                              </Collapse>
                            </Pane>
                          </>
                        )
                        )}
                      </Pane>
                    </Pane>
                    <Pane className="d-flex justify-content-between align-items-center mb20">
                      <div className='d-flex  align-items-center'>
                        <Button
                          color="success"
                          ghost
                          icon="plus"
                          onClick={() => {
                            add();
                          }}
                        >
                          Add Unit
                        </Button>
                        <p
                          className="btn-delete ml20"
                          role="presentation"

                          onClick={() => history.goBack()}
                        >
                          Cancel
                        </p>
                      </div>
                      <Button
                        className="ml-auto px25"
                        color="success"
                        htmlType="submit"
                        size="large"
                        loading={loadingSubmit}
                        permission={"WEB_TIENGANH_QUANLYBAIGIANG_UPDATE" || "WEB_TIENGANH_QUANLYBAIGIANG_CREATE"}
                      >
                        Save
                      </Button>
                    </Pane>
                  </>
                )}
              </Form.List>
            </Loading>
          </Form>
        </Pane>
      </Pane>
    </div>
  );
});

export default Index;