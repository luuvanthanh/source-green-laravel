import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Radio, Checkbox, Input, notification } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history, useLocation } from 'umi';
import { isEmpty, get, head } from 'lodash';
import classnames from 'classnames';
import ImgDetail from '@/components/CommonComponent/imageDetail';

import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Table from '@/components/CommonComponent/Table';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
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
    menuLeftEnglish,
    dataEvaluetionCriteria,
    user,
  } = useSelector(({ EnglishQuarterReport, menu, loading, EnglishQuarterReportAdd, user }) => ({
    dataAssess: EnglishQuarterReport.dataAssess,
    loading,
    menuLeftEnglish: menu.menuLeftEnglish,
    details: EnglishQuarterReportAdd.details,
    dataType: EnglishQuarterReport.dataType,
    dataEvaluetionCriteria: EnglishQuarterReportAdd.dataEvaluetionCriteria,
    user: user.user,
    error: EnglishQuarterReportAdd.error,
  }));

  const [dataStudent, setDataStudent] = useState(undefined);

  const [checkFinish, setCheckFinish] = useState(false);

  const [dataDetails, setDataDetails] = useState(undefined);

  const { query } = useLocation();


  const loadingSubmit = effects[`EnglishQuarterReportAdd/ADD`];

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
    }));
    const checkEmpty = data?.filter(i => !i?.checkEmpty);

    if (checkEmpty?.length === 0) {
      dispatch({
        type: 'EnglishQuarterReportAdd/ADD',
        payload: {
          id: params.id,
          studentId: params?.id,
          scriptReviewId: dataDetails?.id,
          schoolYearId: user.schoolYear?.id,
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
        type: 'EnglishQuarterReportAdd/GET_DATA_STUDENTS',
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
      type: 'EnglishQuarterReport/GET_DATA_TYPE',
      payload: {},
    });
    dispatch({
      type: 'EnglishQuarterReportAdd/GET_DATA_SCRIPT_REVIEW',
      payload: {
        id: query?.scriptReviewId,
      },
      callback: (response) => {
        if (response) {
          setDataDetails(response.parsePayload);
        }
      },
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

  const onCheckBox = (e, record) => {
    setDataDetails(
      {
        ...dataDetails,
        scriptReviewSubject: dataDetails?.scriptReviewSubject?.map(i => ({
          ...i,
          scriptReviewSubjectDetail: i?.scriptReviewSubjectDetail?.map(item => ({
            ...item,
            scriptReviewSubjectDetailChildren: item?.scriptReviewSubjectDetailChildren?.map(itemChildDetail => ({
              ...itemChildDetail,
              radioId: record?.id === itemChildDetail?.id ? e.target.value : itemChildDetail?.radioId,
            }))
          }))
        }))
      }
    );
  };

  const header = () => [
    {
      title: 'Content',
      key: 'student',
      className: 'min-width-200',
      render: (record) => <div className={!record?.radioId && checkFinish ? "text-danger" : "text-dark"}>{record?.subjectSectionDetail?.name}</div>,
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
                value={record?.radioId}
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

  const onChangeUseTable = (e, record) => {
    setDataDetails(
      {
        ...dataDetails,
        scriptReviewComment: dataDetails?.scriptReviewComment?.map(i => ({
          ...i,
          scriptReviewCommentDetail: i?.scriptReviewCommentDetail?.map(item => ({
            ...item,
            checkBox: record?.id === item?.id ? e.target.checked : item?.checkBox,
          }))
        }))
      }
    );
  };

  const onChangeInput = (value, record) => {
    setDataDetails(
      {
        ...dataDetails,
        scriptReviewComment: dataDetails?.scriptReviewComment?.map(i => ({
          ...i,
          scriptReviewCommentDetail: i?.scriptReviewCommentDetail?.map(item => ({
            ...item,
            value: record?.id === i?.id ? value.target.value : item?.value,
          }))
        }))
      }
    );
  };

  const headerComment = () => [
    {
      title: 'Use',
      key: 'Use',
      className: 'min-width-200',
      render: (record) => (
        <div className={classnames(stylesModule['wrapper-checkbox'])}>
          <Checkbox
            className="mr15"
            onChange={(e) => onChangeUseTable(e, record)}
          />
          <p className={stylesModule.textChild} >{record?.sampleCommentDetail?.name}</p>
        </div>
      ),
    },
  ];

  const detailSchoolYear = `${dataDetails?.schoolYear?.yearFrom} - ${dataDetails?.schoolYear?.yearTo}`;
  return (
    <div className={stylesModule['wraper-container-quarterReport']}>
      <Breadcrumbs last={dataStudent?.fullName} menu={menuLeftEnglish} />
      <Helmet title="Quarter report" />
      <Pane className="pl20 pr20 pb20">
        <Pane>
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            <Loading
              loading={effects['EnglishQuarterReportAdd/GET_DATA_SCRIPT_REVIEW']}
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
                      fileImage={dataStudent?.fileImage}
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
                    <FormDetail name={dataDetails?.nameAssessmentPeriod?.name} label="Assessment period" type="text" />
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
                      dataDetails?.isCheckSubject && (
                        dataDetails?.scriptReviewSubject?.map(item => (
                          item?.isCheck && (
                            <>
                              <Pane className="col-lg-12 pt20 border-top">
                                <h3 className={stylesModule['item-text-header']}>{item?.subject?.name}</h3>
                              </Pane>
                              <Pane className="col-lg-12 pb20">
                                {
                                  item?.scriptReviewSubjectDetail?.map(itemDetail => (
                                    itemDetail?.isCheck && (
                                      <div className={stylesModule['wrapper-table-item']}>
                                        <h3 className={stylesModule['text-item-table']}>{itemDetail?.subjectSection?.name}</h3>
                                        <Table
                                          columns={header()}
                                          dataSource={itemDetail?.scriptReviewSubjectDetailChildren?.filter(k => k?.isCheck)}
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
                  dataDetails?.isCheckSampleComment &&
                  dataDetails?.scriptReviewComment?.map(i => (
                    i?.isCheck && (
                      <Pane className="card mb20">
                        <Pane className="p20">
                          <Heading type="form-title">
                            {i?.sampleComment?.name}
                          </Heading>
                        </Pane>
                        <Pane className="row pl20 pb20 pr20">
                          <Pane className="col-lg-12">
                            <div className={stylesModule['wrapper-table-item']}>
                              <Table
                                columns={headerComment()}
                                dataSource={i?.scriptReviewCommentDetail?.filter(k => k?.isCheck)}
                                pagination={false}
                                rowKey={(record) => record.id}
                                scroll={{ x: '100%' }}
                                description="No data"
                                isEmpty
                              />
                            </div>
                          </Pane>
                          <Pane className="col-lg-12">
                            <FormItem label="Content">
                              <TextArea rows={2} placeholder="Nhập" onChange={(e) => onChangeInput(e, i)} />
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
                  Cancel
                </p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit}
                  permission="WEB_TIENGANH_DANHGIADINHKY_CHUADANHGIA_CREATE"
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