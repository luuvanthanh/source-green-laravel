import { memo, useEffect, useRef, useState } from 'react';
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
    menuLeftCriteria,
  } = useSelector(({ menu, loading, englishSettingSubjectAdd }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    details: englishSettingSubjectAdd.details,
    skill: englishSettingSubjectAdd.skill,
    error: englishSettingSubjectAdd.error,
  }));

  const [removeId, setRemoveId] = useState([]);
  const [removeDetail, setRemoveDetail] = useState([]);

  const loadingSubmit = effects[`englishSettingSubjectAdd/UPDATE`] || effects[`englishSettingSubjectAdd/ADD`];

  const onFinish = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: params.id ? 'englishSettingSubjectAdd/UPDATE' : 'englishSettingSubjectAdd/ADD',
        payload: {
          id: params.id,
          name: values?.name,
          section: {
            createRows: values?.subjectSection?.filter((i) => !i?.id).map(item => ({
              name: item.name,
              id: item.id,
              detail: {
                createDetail: item?.subjectSectionDetail?.filter((i) => !i?.id).map(itemDetail => ({
                  name: itemDetail.nameDetail,
                })),
                updateDetail: item?.subjectSectionDetail?.filter((item) => item.id).map(itemDetail => ({
                  name: itemDetail.nameDetail,
                })),
                deleteDetail: removeDetail?.filter((itemDetail) => itemDetail.id === item?.id && ([
                  itemDetail.idDelete,
                ])),
              }
            })),
            updateRows: values?.subjectSection?.filter((i) => i?.id).map(item => ({
              name: item.name,
              id: item.id,
              detail: {
                createDetail: item?.subjectSectionDetail?.filter((i) => !i?.id).map(itemDetail => ({
                  name: itemDetail.nameDetail,
                  id: itemDetail.id,
                })),
                updateDetail: item?.subjectSectionDetail?.filter((item) => item.id).map(itemDetail => ({
                  name: itemDetail.nameDetail,
                  id: itemDetail.id,
                })),
                deleteDetail: removeDetail?.filter((itemDetail) => itemDetail?.id === item?.id)?.map(itemDelete => (
                  itemDelete.idDelete
                )),
              }
            })),
            deleteRows: removeId,
          }
        },
        callback: (response, error) => {
          if (response) {
            if (response) {
              history.push(`/chuong-trinh-hoc/settings/subject`);
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
      type: 'englishSettingSubjectAdd/GET_SKILL',
      payload: {},
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'englishSettingSubjectAdd/GET_DATA',
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
        name: details?.name,
        code: details?.code,
        subjectSection: details?.subjectSection?.map(i => ({
          name: i?.name,
          ...i,
          subjectSectionDetail: i?.subjectSectionDetail?.map(k => ({
            nameDetail: k?.name,
            ...k,
          }))
        }))
      });
    }
  }, [details]);

  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={params.id ? 'Edit' : 'Create new'} menu={menuLeftCriteria} />
      <Helmet title="Subject" />
      <Pane className="pl20 pr20 pb20">
        <Pane >
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            <Loading
              loading={effects['englishSettingSubjectAdd/GET_DATA']}
            >
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Subject info
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-6">
                    <FormItem
                      name="code"
                      placeholder=" "
                      type={variables.INPUT}
                      label="ID"
                      disabled
                    />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      name="name"
                      placeholder="Chọn"
                      type={variables.INPUT}
                      label="Subject name"
                      rules={[variables.RULES.EMPTY_INPUT]}
                    />
                  </Pane>
                </Pane>
              </Pane>
              <Form.List name="subjectSection">
                {(fields, { remove, add }) => (
                  <>
                    <Pane className="p20 pb0">
                      <Pane className="row">
                        {fields.map((field, index) => {
                          const itemData = details?.subjectSection?.find((item, indexWater) => indexWater === index);
                          return (
                            <>
                              <Pane className="offset-lg-12 col-lg-12 mb20 p15 card" key={field.key}>
                                <Heading type="form-title" >
                                  Section {index + 1}
                                </Heading>
                                {fields.length > 1 && (
                                  <div className={styles['list-button']}>
                                    <button
                                      className={styles['button-circle']}
                                      style={{ display: 'flex', position: 'absolute', top: 15, right: 50 }}
                                      onClick={() => {
                                        remove(index);
                                        setRemoveId([...removeId, itemData.id]);
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
                                              label="Section name"
                                              name={[field.name, 'name']}
                                              fieldKey={[field.fieldKey, 'name']}
                                              type={variables.INPUT}
                                              rules={[variables.RULES.EMPTY]}
                                            />
                                          </Pane>
                                          <Pane className="col-lg-12">
                                            <div className={stylesModule['wrapper-table']}>
                                              <div className={stylesModule['card-heading']}>
                                                <div className={stylesModule.col}>
                                                  <p className={stylesModule.norm}>Content</p>
                                                </div>
                                                <div className={stylesModule.cols}>
                                                  <p className={stylesModule.norm} />
                                                </div>
                                              </div>
                                              <Form.List label="Hình thức tiếp cận" name={[field.name, 'subjectSectionDetail']} fieldKey={[field.fieldKey, 'subjectSectionDetail']}>
                                                {(fieldsDetail, { remove, add }) => (
                                                  <>
                                                    {fieldsDetail.map((fieldItem, indexItem) => {
                                                      const itemDataDetail = details?.subjectSection?.length > 0 && details?.subjectSection[index]?.subjectSectionDetail?.find((item, indexWater) => indexWater === indexItem);
                                                      return (
                                                        <>
                                                          <Pane
                                                            key={indexItem}
                                                            className="d-flex"
                                                          >
                                                            <div className={stylesModule['card-item']}>
                                                              <div className={classnames(stylesModule.col)}>
                                                                <FormItem
                                                                  className={stylesModule.item}
                                                                  fieldKey={[fieldItem.fieldKey, 'nameDetail']}
                                                                  name={[fieldItem.name, 'nameDetail']}
                                                                  type={variables.TEXTAREA}
                                                                  rules={[variables.RULES.EMPTY_INPUT]}
                                                                />
                                                              </div>
                                                              <div className={classnames(stylesModule.cols)}>
                                                                {fieldsDetail.length > 1 && (
                                                                  <div className={styles['list-button']}>
                                                                    <button
                                                                      className={styles['button-circle']}
                                                                      onClick={() => {
                                                                        remove(indexItem);
                                                                        setRemoveDetail([{ id: itemData?.id, idDelete: itemDataDetail.id }, ...removeDetail]);
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

                                                      );
                                                    })}
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
                          );
                        })}
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
                          Add Section
                        </Button>
                        <p
                          className="btn-delete ml20"
                          role="presentation"

                          onClick={() => history.push(`/chuong-trinh-hoc/settings/subject`)}
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
                      >
                        Lưu
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