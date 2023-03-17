import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Collapse } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
import Loading from '@/components/CommonComponent/Loading';
import FormDetail from '@/components/CommonComponent/FormDetail';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
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
  } = useSelector(({ menu, loading, englishSettingProgramAdd }) => ({
    loading,
    menuLeftEnglish: menu.menuLeftEnglish,
    details: englishSettingProgramAdd.details,
    skill: englishSettingProgramAdd.skill,
    error: englishSettingProgramAdd.error,
  }));

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'englishSettingProgramAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              units: response?.units
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
      <Breadcrumbs last={details?.name} menu={menuLeftEnglish} />
      <Helmet title="Program" />
      <Pane className="pl20 pr20 pb20">
        <Pane >
          <Form layout="vertical" form={form} initialValues={{
            data: [
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
                    <FormDetail name={details?.code} label="ID program" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={details?.name} label="Program name" />
                  </Pane>
                  <Pane className="col-lg-3" >
                    <FormDetail name={details?.colorText} label="Color" type="textBG" />
                  </Pane>
                </Pane>
              </Pane>
              <Form.List name="units">
                {(fields) => (
                  <>
                    <Pane className="p20 pb0">
                      <Pane className="row">
                        {fields.map((field, index) => {
                          const itemData = details?.units?.find((item, indexWater) => indexWater === index);
                          return (
                            <>
                              <Pane className="offset-lg-12 col-lg-12 mb20 p15 card" key={field.key}>
                                <Heading type="form-title" >
                                  Unit {index + 1}
                                </Heading>
                                <Collapse defaultActiveKey={[index + 1]} ghost expandIconPosition='right'>
                                  <Panel key={index + 1} >
                                    <Pane className="card">
                                      <>
                                        <Pane className="row p0">
                                          <Pane className="col-lg-6">
                                            <FormDetail name={itemData?.name} label="Unit name" />
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
                                              </div>
                                              <Form.List label="Hình thức tiếp cận" name={[field.name, 'lessions']} fieldKey={[field.fieldKey, 'lessions']}>
                                                {(fieldsDetail) => (
                                                  <>
                                                    {fieldsDetail.map((fieldItem, indexItem) => {
                                                      const itemDataDetail = details?.units?.length > 0 && details?.units[index]?.lessions?.find((item, indexWater) => indexWater === indexItem);
                                                      return (
                                                        <>
                                                          <Pane
                                                            key={indexItem}
                                                            className="d-flex"
                                                          >
                                                            <div className={stylesModule['card-item']}>
                                                              <div className={classnames(stylesModule.col)}>
                                                                <FormDetail name={itemDataDetail?.name} type="table" />
                                                              </div>
                                                              <div className={classnames(stylesModule.col)}>
                                                                <FormDetail name={itemDataDetail?.activities} type="table" />
                                                              </div>
                                                              <div className={classnames(stylesModule.cols)}>
                                                                <FormDetail name={itemDataDetail?.week} type="table" />
                                                              </div>
                                                              <div className={classnames(stylesModule.cols)}>
                                                                <FormDetail name={itemDataDetail?.classPeriod} type="table" />
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
                          Cancel
                        </p>
                      </div>
                      <Button
                        className="ml-auto px25"
                        color="success"
                        size="large"
                        onClick={() => {
                          history.push(`/english/settings/program/${details?.id}/edit`);
                        }}
                        permission="WEB_TIENGANH_QUANLYBAIGIANG_EDIT"
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