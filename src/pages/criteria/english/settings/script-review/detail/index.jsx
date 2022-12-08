import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Checkbox, Switch } from 'antd';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';
import { useParams, history } from 'umi';
import Loading from '@/components/CommonComponent/Loading';

import Heading from '@/components/CommonComponent/Heading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormDetail from '@/components/CommonComponent/FormDetail';
import stylesModule from '../styles.module.scss';

import Comment from './comment';
import Subject from './subject';

const typeSelect = [
  { id: 'QUARTER_REPORT', name: 'Quarter report' },
  { id: 'MONTHLY_COMMENT', name: 'Monthly comment' },
];

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    dataType,
    menuLeftCriteria,
    years,
    loading: { effects },
  } = useSelector(({ menu, loading, englishSettingScriptReviewAdd }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    dataType: englishSettingScriptReviewAdd.dataType,
    years: englishSettingScriptReviewAdd.years,
    error: englishSettingScriptReviewAdd.error,
  }));

  const [type, setType] = useState('');
  const [dataSubjec, setDataSubjec] = useState(undefined);
  const [dataComment, setDataComment] = useState(undefined);

  const [details, setDetails] = useState(undefined);

  const [loadingComment, setLoadingComment] = useState(true);
  const [loadingSubject, setLoadingSubject] = useState(false);

  const [isCheckDataSbuject, setIsCheckDataSbuject] = useState(false);
  const [isCheckDataComment, setIsCheckDataComment] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'englishSettingScriptReviewAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            setDetails(response.parsePayload);
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
      if (details?.id) {
        form.setFieldsValue({
          ...details,
          branchId: details?.branch.map((i) => i?.id),
          classId: details?.classes?.map((i) => i?.id),
        });
        if (isCheckDataSbuject) {
          setDataSubjec(dataSubjec?.map(item => ({
            ...item,
            isSubject: details?.isCheckSubject,
            isCheck: details?.scriptReviewSubject?.find(k => k?.subjectId === item?.id)?.isCheck,
            subjectSection: item?.subjectSection?.map(itemDetail => ({
              ...itemDetail,
              isCheck: details?.scriptReviewSubject?.find(k => k?.subjectId === item?.id)?.scriptReviewSubjectDetail?.find(b => b?.subjectSectionId === itemDetail?.id)?.isCheck,
              subjectSectionDetail: itemDetail?.subjectSectionDetail?.map(itemDetailItem => ({
                ...itemDetailItem,
                isCheck: details?.scriptReviewSubject?.find(k => k?.subjectId === item?.id)?.scriptReviewSubjectDetail?.find(b => b?.subjectSectionId === itemDetail?.id)?.scriptReviewSubjectDetailChildren.find(e => e?.subjectSectionDetailId === itemDetailItem?.id)?.isCheck,
              }))
            })),
          })));
        }
        if (isCheckDataComment) {
          setDataComment(dataComment?.map(i => ({
            ...i,
            isComent: details?.isCheckSampleComment,
            isCheck: details?.scriptReviewComment?.find(k => k?.sampleCommentId === i?.id)?.isCheck,
            sampleCommentDetail: i?.sampleCommentDetail?.map(z => ({
              ...z,
              isCheck: details?.scriptReviewComment?.find(k => k?.sampleCommentId === i?.id)?.scriptReviewCommentDetail?.find(b => b?.sampleCommentDetailId === z?.id)?.isCheck,
            })),
          })));
        }

        if (details?.type === 'QUARTER_REPORT') {
          setType(details?.type);
          dispatch({
            type: 'englishSettingScriptReviewAdd/GET_DATA_TYPE',
            payload: details?.type,
          });
        }
      }
    }
  }, [details, isCheckDataSbuject, isCheckDataComment]);

  const header = () => [
    {
      title: 'Trẻ',
      key: 'student',
      width: 200,
      className: 'min-width-200',
      render: (record) => (
        <div className={classnames(stylesModule['wrapper-checkbox'])}>

          <div className={classnames(stylesModule['wrapper-checkbox'])}>
            <Checkbox
              checked={record?.isCheck || false}
              className="mr15"
            />
            <p className={stylesModule.textChild} >{record?.name}</p>
          </div>
        </div>
      ),
    },
  ];


  useEffect(() => {
    dispatch({
      type: 'englishSettingScriptReviewAdd/GET_YEARS',
      payload: {},
    });
    dispatch({
      type: 'englishSettingScriptReviewAdd/GET_DATA_SUBJECT',
      payload: {},
      callback: (response) => {
        if (response?.parsePayload) {
          setIsCheckDataSbuject(true);
          setDataSubjec(response?.parsePayload);
          setLoadingComment(false);
        }
      },
    });
    dispatch({
      type: 'englishSettingScriptReviewAdd/GET_DATA_COMMENT',
      payload: {},
      callback: (response) => {
        if (response.parsePayload) {
          setIsCheckDataComment(true);
          setDataComment(response?.parsePayload);
          setLoadingSubject(false);
        }
      },
    });
  }, []);


  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={params.id ? 'Edit' : 'Create new'} menu={menuLeftCriteria} />
      <Helmet title="General info" />
      <Pane className="pl20 pr20 pb20">
        <Pane >
          <Loading
            loading={effects[`englishSettingScriptReviewAdd/GET_DATA`]}
          >
            <Form layout="vertical" form={form} initialValues={{
              data: [
                {},
              ],
            }}>
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  General info
                </Heading>
                <Pane className="row">
                  <div className="col-lg-3">
                    <FormDetail name={details?.schoolYearId} label="School year" data={years} type="select" />
                  </div>
                  <Pane className="col-lg-3">
                    <FormDetail name={details?.type} label="Type review" data={typeSelect} type="select" />
                  </Pane>
                  {
                    type === 'QUARTER_REPORT' && (
                      <Pane className="col-lg-3">
                        <FormDetail name={details?.nameAssessmentPeriodId} label="Evaluation stage" data={dataType} type="select" />
                      </Pane>
                    )
                  }
                  <Pane className="col-lg-12">
                    <FormDetail name={details?.branch} label="Apply basis" type="selectTags" />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormDetail name={details?.classes} label="Apply class" type="selectTags" />
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="card mb20">
                <Pane className="pl20 pr20 pt20">
                  <Heading type="form-title" className="mb15">
                    Subject
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-4 pb20">
                      <div className={classnames(stylesModule['wrapper-checkbox'])}>
                        <Switch
                          checked={details?.isCheckSubject}
                          className="mr15"
                        />
                        <p className={stylesModule.textChild} >Use</p>
                      </div>
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="row">
                  <Subject details={details} loadingSubject={loadingSubject} dataSubjec={dataSubjec} header={header} />
                </Pane>
              </Pane>

              <Pane className="card mb20">
                <Pane className="p20">
                  <Heading type="form-title" className="mb15">
                    Comment information
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-4">
                      <div className={classnames(stylesModule['wrapper-checkbox'])}>
                        <Switch
                          checked={details?.isCheckSampleComment}
                          className="mr15"
                        />
                        <p className={stylesModule.textChild} >Use</p>
                      </div>
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="row">
                  <Pane className="col-lg-12">
                    <Comment loadingComment={loadingComment} dataComment={dataComment} header={header} />
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="d-flex justify-content-between align-items-center mb20 mt20">
                <p
                  className="btn-delete"
                  role="presentation"

                  onClick={() => history.goBack()}
                >
                  Close
                </p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  size="large"
                  onClick={() => {
                    history.push(`/chuong-trinh-hoc/settings/scriptReview/${details?.id}/edit`);
                  }}
                >
                  Edit
                </Button>
              </Pane>
            </Form>
          </Loading>
        </Pane>
      </Pane>
    </div>
  );
});

export default Index;