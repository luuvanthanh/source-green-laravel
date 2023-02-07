import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history, useLocation } from 'umi';
import { head, isEmpty, get } from 'lodash';
import classnames from 'classnames';
import Loading from '@/components/CommonComponent/Loading';

import ImgDetail from '@/components/CommonComponent/imageDetail';

import Heading from '@/components/CommonComponent/Heading';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import { variables, Helper } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import variablesModules from '../utils/variables';
import stylesModule from '../styles.module.scss';


const marginProps = { style: { paddingTop: 12, paddingBottom: 20 } };

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    dataAssess,
    loading: { effects },
    details,
    menuLeftEnglish,
    dataEvaluetionCriteria,
    user,
  } = useSelector(({ EnglishMonthlyReport, menu, loading, EnglishMonthlyReportAdd, user }) => ({
    dataAssess: EnglishMonthlyReport.dataAssess,
    loading,
    menuLeftEnglish: menu.menuLeftEnglish,
    details: EnglishMonthlyReportAdd.details,
    dataType: EnglishMonthlyReport.dataType,
    dataEvaluetionCriteria: EnglishMonthlyReportAdd.dataEvaluetionCriteria,
    user: user.user,
    error: EnglishMonthlyReportAdd.error,
  }));
  const [dataDetails, setDataDetails] = useState(undefined);
  const { query } = useLocation();

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'EnglishMonthlyReportAdd/GET_DATA_DETAIL',
        payload: {
          id: params?.id,
        },
        callback: (response) => {
          if (response) {
            setDataDetails(response.parsePayload);
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    dispatch({
      type: 'EnglishMonthlyReport/GET_DATA_TYPE',
      payload: {},
    });
    dispatch({
      type: 'EnglishMonthlyReportAdd/GET_DATA_EVALUATION_CRITERRIA',
      payload: {},
    });
  }, []);

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

  const header = () => [
    {
      title: 'Content',
      key: 'student',
      className: 'min-width-200',
      render: (record) => record?.scriptReviewSubjectDetailChildren?.subjectSectionDetail?.name,
    },
    ...(dataEvaluetionCriteria?.length > 0 ?
      (dataEvaluetionCriteria?.map(i => (
        {
          title: `${i?.name}`,
          key: 'img',
          align: 'center',
          width: 200,
          className: classnames('min-width-200', 'max-width-200'),
          render: (record) => (
            <>
              {
                record?.evaluationCriteriaId === i?.id && (
                  <img alt="" src="/images/vector.png" />
                )
              }
            </>
          ),
        }
      )))
      : []),
  ];

  const addSent = () => {
    const payload = {
      studentId: [dataDetails?.studentId],
      schoolYearId: dataDetails?.schoolYearId,
      month: dataDetails?.month,
      newStatus: variablesModules.STATUS.SENT,
      oldStatus: "CONFIRMED",
      teacherSentId: query?.type === "done" ? user?.objectInfo?.id : undefined,
    };
    dispatch({
      type: 'EnglishMonthlyReport/ADD_SENT',
      payload: { ...payload },
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
      }
    });
  };
  const detailTearch = `${dataDetails?.teacher?.fullName ? dataDetails?.teacher?.fullName : ""}  ${dataDetails?.creationTime ? Helper.getDate(dataDetails?.creationTime, variables.DATE_FORMAT.DATE_TIME) : ""}`;
  const detailTearchManagement = `${dataDetails?.teacherManagement?.fullName ? dataDetails?.teacherManagement?.fullName : ""}  ${dataDetails?.confirmationTime ? Helper.getDate(dataDetails?.confirmationTime, variables.DATE_FORMAT.DATE_TIME) : ""}`;
  const detailTearchManagementSend = `${dataDetails?.teacherSent?.fullName ? dataDetails?.teacherSent?.fullName : ""}  ${dataDetails?.lastModificationTime ? Helper.getDate(dataDetails?.lastModificationTime, variables.DATE_FORMAT.DATE_TIME) : ""}`;

  const formStatus = () => {
    if (query?.type === "done-review") {
      return (
        <Pane className="col-lg-3">
          <FormDetail name={detailTearch} label="Teacher report" type="text" />
        </Pane>
      );
    }
    if (query?.type === "done-confirmed" || query?.type === "done") {
      return (
        <>
          <Pane className="col-lg-3">
            <FormDetail name={detailTearch} label="Teacher report" type="text" />
          </Pane>
          <Pane className="col-lg-3">
            <FormDetail name={detailTearchManagement} label="Approved by" type="text" />
          </Pane>
        </>
      );
    }
    if (query?.type === "send") {
      return (
        <>
          <Pane className="col-lg-3">
            <FormDetail name={detailTearch} label="Teacher report" type="text" />
          </Pane>
          <Pane className="col-lg-3">
            <FormDetail name={detailTearchManagement} label="Approved by" type="text" />
          </Pane>
          <Pane className="col-lg-3">
            <FormDetail name={detailTearchManagementSend} label="Sender" type="text" />
          </Pane>
        </>
      );
    }
    return "";
  };

  const detailSchoolYear = `${dataDetails?.schoolYear?.yearFrom} - ${dataDetails?.schoolYear?.yearTo}`;
  return (
    <div className={stylesModule['wraper-container-monthlyComment']}>
      <Breadcrumbs last="Detail" menu={menuLeftEnglish} />
      <Helmet title="Monthly report" />
      <Pane className="pl20 pr20 pb20">
        <Pane>
          <Form layout="vertical" form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            <Loading
              loading={effects['EnglishMonthlyReportAdd/GET_DATA_DETAIL']}
              params={{
                type: 'container',
              }}
            >
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  {dataAssess?.nameAssessmentPeriod?.name}
                </Heading>
                <div className="row" {...marginProps} style={{ paddingLeft: 20, paddingRight: 20 }} >
                  <div className={stylesModule['monthlyComment-header-img']}>
                    <ImgDetail
                      fileImage={dataDetails?.student?.fileImage}
                    />
                    <div className='d-block ml20'>
                      <h3 className={stylesModule['general-fullName']}>
                        {dataDetails?.student?.fullName}
                      </h3>
                      <p className={stylesModule['general-age']}>{dataDetails?.student?.age} tháng tuổi</p>
                    </div>
                  </div>
                </div>
                <Pane className="row">
                  <Pane className="col-lg-3">
                    <FormDetail name={detailSchoolYear} label="School year" type="text" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={dataDetails?.student?.branch?.name} label="Center" type="text" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={dataDetails?.student?.classes?.name} label="Class" type="text" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={Helper.getDate(dataDetails?.month, variables.DATE_FORMAT.MONTH_FULL_ENGLISH)} label="Monthly comment" type="text" />
                  </Pane>
                  {formStatus()}
                </Pane>
              </Pane>
              <Pane>
                <Pane className="card mb20">
                  <Pane className="p20">
                    <Heading type="form-title">
                      Subject
                    </Heading>
                  </Pane>
                  <Pane className="row  pl20 pb20 pr20">
                    {
                      dataDetails?.monthlyCommentDetail?.find(i => i?.isSubject) && (
                        dataDetails?.monthlyCommentDetail?.filter(i => i?.isSubject)?.map(item => (
                          (
                            <>
                              <Pane className="col-lg-12 pt20 border-top">
                                <h3 className={stylesModule['item-text-header']}>{item?.scriptReviewSubject?.subject?.name}</h3>
                              </Pane>
                              <Pane className="col-lg-12 pb20">
                                {
                                  item?.monthlyCommentDetailSubject?.map(itemDetail => (
                                    (
                                      <div className={stylesModule['wrapper-table-item']}>
                                        <h3 className={stylesModule['text-item-table']}>{itemDetail?.scriptReviewSubjectDetail?.subjectSection?.name}</h3>
                                        <Table
                                          columns={header()}
                                          dataSource={itemDetail?.monthlyCommentDetailSubjectChildren}
                                          pagination={false}
                                          rowKey={(record) => record.id}
                                          scroll={{ x: '100%' }}
                                          isEmpty
                                        />
                                      </div>
                                    )
                                  ))
                                }
                              </Pane>
                            </>
                          )
                        ))
                      )
                    }
                  </Pane>
                </Pane>

                {
                  dataDetails?.monthlyCommentDetail.find(i => i?.isComment) &&
                  dataDetails?.monthlyCommentDetail.filter(i => i?.isComment)?.map(i => (
                    (
                      <Pane className="card mb20">
                        <Pane className="row p20">
                          <Pane className="col-lg-12">
                            <FormDetail name={i?.content} label={i?.scriptReviewComment?.sampleComment?.name} type="TextArea" />
                          </Pane>
                        </Pane>
                      </Pane>
                    )
                  ))
                }

              </Pane>
              <Pane className="d-flex justify-content-between align-items-center mb20">
                <p
                  className="btn-delete"
                  role="presentation"

                  onClick={() => history.goBack()}
                >
                  Close
                </p>
                {
                  query?.type === 'done' && (
                    <Button
                      className="ml10 px25"
                      color="success"
                      onClick={() => addSent()}
                      size="large"
                      loading={effects['EnglishMonthlyReport/ADD_SENT_ALL']}
                    // permission="WEB_TIENGANH_DANHGIATHANG_CHUAGUI_APPROVE"
                    >
                      Send
                    </Button>)
                }
              </Pane>
            </Loading>
          </Form>
        </Pane>
      </Pane >
    </div >
  );
});

export default Index;