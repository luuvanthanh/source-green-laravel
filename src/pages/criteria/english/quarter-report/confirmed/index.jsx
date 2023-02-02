import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Radio, Input } from 'antd';
import { useParams, history } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { isEmpty, get, head } from 'lodash';
import classnames from 'classnames';
import Loading from '@/components/CommonComponent/Loading';

import ImgDetail from '@/components/CommonComponent/imageDetail';

import Heading from '@/components/CommonComponent/Heading';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Table from '@/components/CommonComponent/Table';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import { variables, Helper } from '@/utils';
import Button from '@/components/CommonComponent/Button';

import stylesModule from '../styles.module.scss';


const marginProps = { style: { paddingTop: 12, paddingBottom: 20 } };
const { Item: FormItem } = Form;
const { TextArea } = Input;

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    dataAssess,
    loading: { effects },
    details,
    menuLeftCriteria,
    dataEvaluetionCriteria,
    user,
  } = useSelector(({ EnglishQuarterReport, menu, loading, EnglishQuarterReportAdd, user }) => ({
    dataAssess: EnglishQuarterReport.dataAssess,
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    details: EnglishQuarterReportAdd.details,
    dataType: EnglishQuarterReport.dataType,
    dataEvaluetionCriteria: EnglishQuarterReportAdd.dataEvaluetionCriteria,
    user: user.user,
    error: EnglishQuarterReportAdd.error,
  }));

  const [dataDetails, setDataDetails] = useState(undefined);

  const onFinish = () => {
    dispatch({
      type: 'EnglishQuarterReportAdd/UPDATE_CONFIRMED',
      payload: {
        id: params.id,
        studentId: dataDetails?.student?.id,
        scriptReviewId: dataDetails?.scriptReview?.id,
        schoolYearId: user.schoolYear?.id,
        status: "NOT_YET_CONFIRM",
        detail: dataDetails?.quarterReportDetail?.map(i => ({
          id: i?.id,
          isSubject: i?.isSubject ? true : undefined,
          isComment: i?.isComment ? true : undefined,
          scriptReviewSubjectId: i?.isSubject ? i?.scriptReviewSubjectId : undefined,
          detailSubject: i?.isSubject ? i?.quarterReportDetailSubject?.map(item => ({
            id: item?.id,
            scriptReviewSubjectDetailId: item?.scriptReviewSubjectDetailId,
            detailSubjectChildren: item?.quarterReportDetailSubjectChildren?.map(itemDetail => ({
              id: itemDetail?.id,
              scriptReviewSubjectDetailChildrenId: itemDetail?.scriptReviewSubjectDetailChildrenId,
              evaluationCriteriaId: itemDetail?.evaluationCriteriaId,
            }))
          })) : undefined,
          scriptReviewCommentId: i?.isComment ? i?.scriptReviewCommentId : undefined,
          content: i?.isComment ? i?.content : undefined,
        })),
        teacherId: user?.objectInfo?.id,
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
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'EnglishQuarterReportAdd/GET_DATA_DETAIL',
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
      type: 'EnglishQuarterReport/GET_DATA_TYPE',
      payload: {},
    });
    dispatch({
      type: 'EnglishQuarterReportAdd/GET_DATA_EVALUATION_CRITERRIA',
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

  const addDelete = () => {
    const payload = {
      id: params.id,
    };
    const text = "Do you want to refuse?";
    Helper.confirmDeleteEnglish({
      callback: () => {
        dispatch({
          type: 'EnglishQuarterReport/DELETE_CONFIRM',
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
      },
    }, text);
  };


  const addSent = () => {
    dispatch({
      type: 'EnglishQuarterReportAdd/UPDATE_CONFIRMED',
      payload: {
        id: params.id,
        studentId: dataDetails?.student?.id,
        scriptReviewId: dataDetails?.scriptReview?.id,
        schoolYearId: user.schoolYear?.id,
        status: "CONFIRMED",
        detail: dataDetails?.quarterReportDetail?.map(i => ({
          id: i?.id,
          isSubject: i?.isSubject ? true : undefined,
          isComment: i?.isComment ? true : undefined,
          scriptReviewSubjectId: i?.isSubject ? i?.scriptReviewSubjectId : undefined,
          detailSubject: i?.isSubject ? i?.quarterReportDetailSubject?.map(item => ({
            id: item?.id,
            scriptReviewSubjectDetailId: item?.scriptReviewSubjectDetailId,
            detailSubjectChildren: item?.quarterReportDetailSubjectChildren?.map(itemDetail => ({
              id: itemDetail?.id,
              scriptReviewSubjectDetailChildrenId: itemDetail?.scriptReviewSubjectDetailChildrenId,
              evaluationCriteriaId: itemDetail?.evaluationCriteriaId,
            }))
          })) : undefined,
          scriptReviewCommentId: i?.isComment ? i?.scriptReviewCommentId : undefined,
          content: i?.isComment ? i?.content : undefined,
        })),
        teacherManagementId: user?.objectInfo?.id ? user?.objectInfo?.id : undefined,
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
  };

  const onCheckBox = (e, record) => {
    setDataDetails(
      {
        ...dataDetails,
        quarterReportDetail: dataDetails?.quarterReportDetail?.map(i => ({
          ...i,
          quarterReportDetailSubject: i?.isSubject ? i?.quarterReportDetailSubject?.map(item => ({
            ...item,
            quarterReportDetailSubjectChildren: item?.quarterReportDetailSubjectChildren?.map(itemChildDetail => ({
              ...itemChildDetail,
              evaluationCriteriaId: record?.id === itemChildDetail?.id ? e.target.value : itemChildDetail?.evaluationCriteriaId,
            }))
          })) : undefined,
        }))
      }
    );
  };

  const onChangeInput = (value, record) => {
    setDataDetails(
      {
        ...dataDetails,
        quarterReportDetail: dataDetails?.quarterReportDetail?.map(i => ({
          ...i,
          content: i?.isComment && record?.id === i?.id ? value.target.value : i?.content,
        }))
      }
    );
  };

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
              <Radio.Group
                onChange={(e) => onCheckBox(e, record, 'avtActive')}
                value={record?.evaluationCriteriaId}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <Radio value={i?.id} />
              </Radio.Group>
            </>
          ),
        }
      )))
      : []),
  ];

  const detailSchoolYear = `${dataDetails?.schoolYear?.yearFrom} - ${dataDetails?.schoolYear?.yearTo}`;
  const detailTearch = `${dataDetails?.teacher?.fullName} lúc ${Helper.getDate(dataDetails?.creationTime, variables.DATE_FORMAT.DATE_TIME)}`;
  return (
    <div className={stylesModule['wraper-container-quarterReport']}>
      <Breadcrumbs last={params.id ? 'Edit' : 'Create new'} menu={menuLeftCriteria} />
      <Helmet title="Quarter report" />
      <Pane className="pl20 pr20 pb20">
        <Pane>
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            <Loading
              loading={effects['EnglishQuarterReportAdd/GET_DATA_DETAIL']}
              params={{
                type: 'container',
              }}
            >
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  {dataAssess?.nameAssessmentPeriod?.name}
                </Heading>
                <div className="row" {...marginProps} style={{ paddingLeft: 20, paddingRight: 20 }} >
                  <div className={stylesModule['quarterReport-header-img']}>
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
                    <FormDetail name={dataDetails?.scriptReview?.nameAssessmentPeriod?.name} label="Assessment period" type="text" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={detailTearch} label="Teacher report" type="text" />
                  </Pane>
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
                      dataDetails?.quarterReportDetail.find(i => i?.isSubject) && (
                        dataDetails?.quarterReportDetail.filter(i => i?.isSubject)?.map(item => (
                          (
                            <>
                              <Pane className="col-lg-12 pt20 border-top">
                                <h3 className={stylesModule['item-text-header']}>{item?.scriptReviewSubject?.subject?.name}</h3>
                              </Pane>
                              <Pane className="col-lg-12 pb20">
                                {
                                  item?.quarterReportDetailSubject?.map(itemDetail => (
                                    (
                                      <div className={stylesModule['wrapper-table-item']}>
                                        <h3 className={stylesModule['text-item-table']}>{itemDetail?.scriptReviewSubjectDetail?.subjectSection?.name}</h3>
                                        <Table
                                          columns={header()}
                                          dataSource={itemDetail?.quarterReportDetailSubjectChildren}
                                          pagination={false}
                                          rowKey={(record) => record.id}
                                          scroll={{ x: '100%' }}
                                          description="No data"
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
                  dataDetails?.quarterReportDetail.find(i => i?.isComment) &&
                  dataDetails?.quarterReportDetail.filter(i => i?.isComment)?.map(i => (
                    (
                      <Pane className="card mb20">
                        <Pane className="p20">
                          <Heading type="form-title">
                            {i?.scriptReviewComment?.sampleComment?.name}
                          </Heading>
                        </Pane>
                        <Pane className="row pl20 pb20 pr20">
                          <Pane className="col-lg-12">
                            <FormItem label="Content">
                              <TextArea rows={4} placeholder="Nhập" defaultValue={i?.content} onChange={(e) => onChangeInput(e, i)} />
                            </FormItem>
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
                <div className='d-flex'>
                  <Button
                    className="ml-auto px25"
                    color="danger"
                    onClick={() => addDelete()}
                    size="large"
                    loading={effects['EnglishQuarterReport/DELETE_CONFIRM']}
                    permission="WEB_TIENGANH_DUYETDANHGIADINHKY_DELETE"
                  >
                    Refuse
                  </Button>
                  <Button
                    className="ml-auto px25 ml10"
                    color="success"
                    htmlType="submit"
                    size="large"
                    loading={effects['EnglishQuarterReportAdd/UPDATE_CONFIRMED']}
                    permission="WEB_TIENGANH_DUYETDANHGIADINHKY_UPDATE"
                  >
                    Save
                  </Button>
                  <Button
                    className="ml10 px25"
                    color="primary"
                    onClick={() => addSent()}
                    size="large"
                    loading={effects['EnglishQuarterReportAdd/UPDATE_CONFIRMED']}
                    permission="WEB_TIENGANH_DUYETDANHGIADINHKY_UPDATE"
                  >
                    Accept
                  </Button>
                </div>
              </Pane>
            </Loading>
          </Form>
        </Pane>
      </Pane >
    </div >
  );
});

export default Index;