import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, notification } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history, useLocation } from 'umi';
import { isEmpty, get, head } from 'lodash';
import ImgDetail from '@/components/CommonComponent/imageDetail';

import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import FormDetail from '@/components/CommonComponent/FormDetail';
import { variables, Helper } from '@/utils';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import Subject from './subject';
import Comment from './comment';

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
    dataDetails,
    menuLeftCriteria,
    dataEvaluetionCriteria,
    user,
  } = useSelector(({ EnglishMonthlyReport, menu, loading, EnglishMonthlyReportAdd, user }) => ({
    dataAssess: EnglishMonthlyReport.dataAssess,
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    details: EnglishMonthlyReportAdd.details,
    dataType: EnglishMonthlyReport.dataType,
    dataDetails: EnglishMonthlyReportAdd.dataDetails,
    dataEvaluetionCriteria: EnglishMonthlyReportAdd.dataEvaluetionCriteria,
    user: user.user,
    error: EnglishMonthlyReportAdd.error,
  }));

  const [dataStudent, setDataStudent] = useState(undefined);

  const [checkFinish, setCheckFinish] = useState(false);

  const { query } = useLocation();

  const loadingSubmit = effects[`EnglishMonthlyReportAdd/ADD`];

  const dataCommentValue = (i) => {
    if (isEmpty(i?.scriptReviewCommentDetail?.filter(i => i?.checkBox)) && isEmpty(head(i?.scriptReviewCommentDetail)?.value)) {
      return "";
    }
    if (!isEmpty(i?.scriptReviewCommentDetail?.filter(i => i?.checkBox)) && !isEmpty(head(i?.scriptReviewCommentDetail)?.value)) {
      return `${i?.scriptReviewCommentDetail?.filter(a => a?.checkBox)?.map(k => k?.sampleCommentDetail?.name)?.join('\n')}\n${head(i?.scriptReviewCommentDetail)?.value}`;
    }
    if (!isEmpty(i?.scriptReviewCommentDetail?.filter(i => i?.checkBox)) && isEmpty(head(i?.scriptReviewCommentDetail)?.value)) {
      return i?.scriptReviewCommentDetail?.filter(a => a?.checkBox)?.map(k => k?.sampleCommentDetail?.name)?.join('\n');
    }
    if (isEmpty(i?.scriptReviewCommentDetail?.filter(i => i?.checkBox)) && !isEmpty(head(i?.scriptReviewCommentDetail)?.value)) {
      return head(i?.scriptReviewCommentDetail)?.value;
    }
    return "";
  };
  const onFinish = () => {

    // convert mảng object
    setCheckFinish(true);
    const data = dataDetails?.scriptReviewSubject?.filter(i => i?.isCheck)
      ?.map(item => ({ ...item, scriptReviewSubjectDetail: item?.scriptReviewSubjectDetail?.filter(k => k?.isCheck) }))
      ?.map(items => ({
        ...items,
        checkEmpty: items?.scriptReviewSubjectDetail
          ?.map(i => ({ ...i, checkEmpty: i?.scriptReviewSubjectDetailChildren?.filter(k => k?.radioId)?.length === i?.scriptReviewSubjectDetailChildren?.filter(i => i?.isCheck)?.length, }))?.filter(k => k?.checkEmpty)?.length === items?.scriptReviewSubjectDetail?.length,
        scriptReviewSubjectDetail: items?.scriptReviewSubjectDetail
          ?.map(i => ({ ...i, scriptReviewSubjectDetailChildren: i?.scriptReviewSubjectDetailChildren?.filter(i => i?.isCheck) }))
      }));

    // convert mảng conment
    const dataComment = dataDetails?.scriptReviewComment?.filter(i => i?.isCheck)
      ?.map(item => ({ ...item, scriptReviewCommentDetail: item?.scriptReviewCommentDetail?.filter(i => i?.isCheck) }))
      ?.map(item => ({ ...item, scriptReviewCommentDetail: item?.scriptReviewCommentDetail?.map(i => i) }));

    // convert payload dataSubjec 
    const dataSubjec = data?.map(i => ({
      isSubject: dataDetails?.isCheckSubject,
      scriptReviewSubjectId: i?.id,
      detailSubject: i?.scriptReviewSubjectDetail?.map(item => ({
        scriptReviewSubjectDetailId: item?.id,
        detailSubjectChildren: item?.scriptReviewSubjectDetailChildren?.map(itemDetail => ({
          scriptReviewSubjectDetailChildrenId: itemDetail?.id,
          evaluationCriteriaId: itemDetail?.radioId
        }))
      }))
    })).filter(i => i?.isSubject);
    const checkEmpty = data?.filter(i => !i?.checkEmpty);

    if (checkEmpty?.length === 0) {
      dispatch({
        type: 'EnglishMonthlyReportAdd/ADD',
        payload: {
          id: params.id,
          studentId: params?.id,
          month: Helper.getDate(query?.month, variables.DATE_FORMAT.DATE_AFTER),
          schoolYearId: user.schoolYear?.id,
          scriptReviewId: dataDetails?.id,
          teacherId: user?.objectInfo?.id,
          status: "REVIEWED",
          detail: dataSubjec.concat(dataComment?.map(i => ({
            isComment: dataDetails?.isCheckSampleComment,
            scriptReviewCommentId: i?.id,
            content: dataCommentValue(i),
          }))),
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
    } else {
      notification.error({
        message: 'Error',
        description: 'You need to choose full information.',
      });
    }
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'EnglishMonthlyReportAdd/GET_DATA_STUDENTS',
        payload: params?.id,
        callback: (response) => {
          if (response) {
            setDataStudent(response?.student);
            form.setFieldsValue({
              data: response.parsePayload.childEvaluateDetail,
            });
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
      type: 'EnglishMonthlyReportAdd/GET_DATA_SCRIPT_REVIEW',
      payload: {
        month: query?.month,
        type: 'MONTHLY_COMMENT'
      },
      callback: (response) => {
        if (response) {
          dispatch({
            type: 'EnglishMonthlyReportAdd/GET_SET_DATA_DETAIL',
            payload: head(response.parsePayload),
          });
        }
      },
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

  const detailSchoolYear = `${dataDetails?.schoolYear?.yearFrom} - ${dataDetails?.schoolYear?.yearTo}`;
  return (
    <div className={stylesModule['wraper-container-monthlyComment']}>
      <Breadcrumbs last={dataStudent?.fullName} menu={menuLeftCriteria} />
      <Helmet title="Monthly report" />
      <Pane className="pl20 pr20 pb20">
        <Pane>
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            <Loading
              loading={effects['EnglishMonthlyReportAdd/GET_DATA_SCRIPT_REVIEW']}
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
                      fileImage={details?.student?.fileImage}
                    />
                    <div className='d-block ml20'>
                      <h3 className={stylesModule['general-fullName']}>
                        {dataStudent?.fullName}
                      </h3>
                      <p className={stylesModule['general-age']}>{dataStudent?.age} tháng tuổi</p>
                    </div>
                  </div>
                </div>
                <Pane className="row">
                  <Pane className="col-lg-3">
                    <FormDetail name={detailSchoolYear} label="School year" type="text" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={dataStudent?.branch?.name} label="Center" type="text" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={dataStudent?.class?.name} label="Class" type="text" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={Helper.getDate(query?.month, variables.DATE_FORMAT.MONTH_FULL_ENGLISH)} label="Monthly comment" type="text" />
                  </Pane>
                </Pane>
              </Pane>
              <Pane>
                {
                  dataDetails?.isCheckSubject && (
                    <Pane className="card mb20">
                      <Pane className="p20">
                        <Heading type="form-title">
                          Subject
                        </Heading>
                      </Pane>
                      <Pane className="row  pl20 pb20 pr20">
                        {
                          dataDetails?.isCheckSubject && (
                            dataDetails?.scriptReviewSubject?.map(item => (
                              item?.isCheck && (
                                <Subject
                                  item={item}
                                  checkFinish={checkFinish}
                                  dataEvaluetionCriteria={dataEvaluetionCriteria}
                                />
                              )
                            ))
                          )
                        }
                      </Pane>
                    </Pane>
                  )
                }

                {
                  dataDetails?.isCheckSampleComment &&
                  dataDetails?.scriptReviewComment?.map(itemParent => (
                    itemParent?.isCheck && (
                      <Comment
                        itemParent={itemParent}
                      />
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
                  Cancel
                </p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit}
                  permission="WEB_TIENGANH_DANHGIATHANG_CHUADANHGIA_CREATE"
                >
                  Save
                </Button>
              </Pane>
            </Loading>
          </Form>
        </Pane>
      </Pane >
    </div >
  );
});

export default Index;
