import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Collapse } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import FormDetail from '@/components/CommonComponent/FormDetail';

import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
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
    menuLeftEnglish,
  } = useSelector(({ menu, loading, englishSettingSubjectAdd }) => ({
    loading,
    menuLeftEnglish: menu.menuLeftEnglish,
    details: englishSettingSubjectAdd.details,
    skill: englishSettingSubjectAdd.skill,
    error: englishSettingSubjectAdd.error,
  }));

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
      <Breadcrumbs last={details?.name} menu={menuLeftEnglish} />
      <Helmet title="Subject" />
      <Pane className="pl20 pr20 pb20">
        <Pane >
          <Form layout="vertical" form={form} initialValues={{
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
                    <FormDetail name={details?.code} label="ID" />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormDetail name={details?.name} label="Subject name" />
                  </Pane>
                </Pane>
              </Pane>
              <Form.List name="subjectSection">
                {(fields) => (
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
                                <Collapse defaultActiveKey={[index + 1]} ghost expandIconPosition='right'>
                                  <Panel key={index + 1} >
                                    <Pane className="card">
                                      <>
                                        <Pane className="row p0">
                                          <Pane className="col-lg-6">
                                            <FormDetail name={itemData?.name} label="Section name" />
                                          </Pane>
                                          {
                                            itemData?.subjectSectionDetail?.length > 0 && (
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
                                                    {(fieldsDetail) => (
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
                                                                  <div className={classnames(stylesModule.colDetail)}>
                                                                    <FormDetail name={itemDataDetail?.name} type="table" />
                                                                  </div>
                                                                </div>
                                                              </Pane>
                                                            </>

                                                          );
                                                        })}
                                                      </>
                                                    )}
                                                  </Form.List>
                                                </div>
                                              </Pane>
                                            )
                                          }
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
                        <p
                          className="btn-delete ml20"
                          role="presentation"

                          onClick={() => history.goBack()}
                        >
                          Close
                        </p>
                      </div>
                      <Button
                        className="ml-auto px25"
                        color="success"
                        size="large"
                        onClick={() => {
                          history.push(`/english/settings/subject/${details?.id}/edit`);
                        }}
                      >
                        Edit
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