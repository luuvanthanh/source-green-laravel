import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Checkbox } from 'antd';
import { isEmpty, get, head } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';
import { variables } from '@/utils';
import { useParams, history } from 'umi';
import Loading from '@/components/CommonComponent/Loading';

import Heading from '@/components/CommonComponent/Heading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
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
    branches,
    menuLeftCriteria,
    years,
    loading: { effects },
    user,
    defaultBranch
  } = useSelector(({ menu, loading, englishSettingScriptReviewAdd, user }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    branches: englishSettingScriptReviewAdd?.branches,
    dataType: englishSettingScriptReviewAdd.dataType,
    years: englishSettingScriptReviewAdd.years,
    error: englishSettingScriptReviewAdd.error,
    user: user.user,
    defaultBranch: user.defaultBranch,
  }));

  const [type, setType] = useState('');
  const [dataClass, setDataClass] = useState([]);
  const [dataSubjec, setDataSubjec] = useState(undefined);
  const [dataComment, setDataComment] = useState(undefined);

  const [details, setDetails] = useState(undefined);

  const [loadingComment, setLoadingComment] = useState(true);
  const [loadingSubject, setLoadingSubject] = useState(false);

  const [isCheckDataSbuject, setIsCheckDataSbuject] = useState(false);
  const [isCheckDataComment, setIsCheckDataComment] = useState(false);

  const onFinish = (values) => {

    dispatch({
      type: params.id ? 'englishSettingScriptReviewAdd/UPDATE' : 'englishSettingScriptReviewAdd/ADD',
      payload: {
        type: values?.type,
        schoolYearId: values?.schoolYearId,
        nameAssessmentPeriodId: values?.nameAssessmentPeriodId,
        isCheckSampleComment: values?.isCheckSampleComment || false,
        isCheckSubject: values?.isCheckSubject || false,
        branchId: !params?.id && defaultBranch?.id ? [values?.branchId] : values?.branchId,
        classId: !params?.id && user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER ? [values?.classId] : values?.classId,
        subject: dataSubjec?.map(i => ({
          subjectId: params?.id ? i?.subjectId : i?.id,
          id: params?.id ? i?.id : undefined,
          isCheck: i?.isCheck || false,
          subjectSection: i?.subjectSection?.map(k => ({
            subjectSectionId: params?.id ? k?.subjectSectionId : k?.id,
            id: params?.id ? k?.id : undefined,
            isCheck: k?.isCheck || false,
            detail: k?.subjectSectionDetail?.map(z => ({
              subjectSectionDetailId: params?.id ? z?.subjectSectionDetailId : z?.id,
              id: params?.id ? z?.id : undefined,
              isCheck: z?.isCheck || false,
            }))
          }))
        })),
        comment: dataComment?.map(i => ({
          sampleCommentId: params?.id ? i?.sampleCommentId : i?.id,
          isCheck: i?.isCheck || false,
          id: params?.id ? i?.id : undefined,
          commentDetail: i?.sampleCommentDetail?.map(k => ({
            sampleCommentDetailId: params?.id ? k?.sampleCommentDetailId : k?.id,
            isCheck: k?.isCheck || false,
            id: params?.id ? k?.id : undefined,
          }))
        })),
        id: params.id
      },
      callback: (response, error) => {
        if (response) {
          if (response) {
            history.push(`/chuong-trinh-hoc/settings/scriptReview`);
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
  };

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
            id: details?.scriptReviewSubject?.find(k => k?.subjectId === item?.id)?.id,
            subjectId: details?.scriptReviewSubject?.find(k => k?.subjectId === item?.id)?.subjectId,
            subjectSection: item?.subjectSection?.map(itemDetail => ({
              ...itemDetail,
              isCheck: details?.scriptReviewSubject?.find(k => k?.subjectId === item?.id)?.scriptReviewSubjectDetail?.find(b => b?.subjectSectionId === itemDetail?.id)?.isCheck,
              id: details?.scriptReviewSubject?.find(k => k?.subjectId === item?.id)?.scriptReviewSubjectDetail?.find(b => b?.subjectSectionId === itemDetail?.id)?.id,
              subjectSectionId: details?.scriptReviewSubject?.find(k => k?.subjectId === item?.id)?.scriptReviewSubjectDetail?.find(b => b?.subjectSectionId === itemDetail?.id)?.subjectSectionId,
              subjectSectionDetail: itemDetail?.subjectSectionDetail?.map(itemDetailItem => ({
                ...itemDetailItem,
                isCheck: details?.scriptReviewSubject?.find(k => k?.subjectId === item?.id)?.scriptReviewSubjectDetail?.find(b => b?.subjectSectionId === itemDetail?.id)?.scriptReviewSubjectDetailChildren.find(e => e?.subjectSectionDetailId === itemDetailItem?.id)?.isCheck,
                id: details?.scriptReviewSubject?.find(k => k?.subjectId === item?.id)?.scriptReviewSubjectDetail?.find(b => b?.subjectSectionId === itemDetail?.id)?.scriptReviewSubjectDetailChildren.find(e => e?.subjectSectionDetailId === itemDetailItem?.id)?.id,
                subjectSectionDetailId: details?.scriptReviewSubject?.find(k => k?.subjectId === item?.id)?.scriptReviewSubjectDetail?.find(b => b?.subjectSectionId === itemDetail?.id)?.scriptReviewSubjectDetailChildren.find(e => e?.subjectSectionDetailId === itemDetailItem?.id)?.subjectSectionDetailId,
              }))
            })),
          })));
        }
        if (isCheckDataComment) {
          setDataComment(dataComment?.map(i => ({
            ...i,
            isComent: details?.isCheckSampleComment,
            isCheck: details?.scriptReviewComment?.find(k => k?.sampleCommentId === i?.id)?.isCheck,
            sampleCommentId: details?.scriptReviewComment?.find(k => k?.sampleCommentId === i?.id)?.sampleCommentId,
            id: details?.scriptReviewComment?.find(k => k?.sampleCommentId === i?.id)?.id,
            sampleCommentDetail: i?.sampleCommentDetail?.map(z => ({
              ...z,
              isCheck: details?.scriptReviewComment?.find(k => k?.sampleCommentId === i?.id)?.scriptReviewCommentDetail?.find(b => b?.sampleCommentDetailId === z?.id)?.isCheck,
              sampleCommentDetailId: details?.scriptReviewComment?.find(k => k?.sampleCommentId === i?.id)?.scriptReviewCommentDetail?.find(b => b?.sampleCommentDetailId === z?.id)?.sampleCommentDetailId,
              id: details?.scriptReviewComment?.find(k => k?.sampleCommentId === i?.id)?.scriptReviewCommentDetail?.find(b => b?.sampleCommentDetailId === z?.id)?.id,
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
        dispatch({
          type: 'englishSettingScriptReviewAdd/GET_CLASSES',
          payload: { branchIds: details?.branch.map((i) => i?.id) },
          callback: (response) => {
            if (response) {
              setDataClass(response);
            }
          },
        });
      }
    }
  }, [details, isCheckDataSbuject, isCheckDataComment]);

  const onChangeUseTable = (e, id, type) => {
    if (type === 'OBJECT') {
      setDataSubjec(dataSubjec?.map(i => ({
        ...i,
        isCheck: i?.isCheck,
        subjectId: i?.subjectId,
        subjectSection: i?.subjectSection?.map(k => ({
          ...k,
          subjectSectionId: k?.subjectSectionId,
          subjectSectionDetail: k?.subjectSectionDetail?.map(z => ({
            ...z,
            id: z?.id,
            subjectSectionDetailId: z?.subjectSectionDetailId,
            isCheck: z?.id === id ? e.target.checked : z?.isCheck,
          })),
        })),
      })));
    }
    else {
      setDataComment(dataComment?.map(i => ({
        ...i,
        sampleCommentId: i?.sampleCommentId,
        sampleCommentDetail: i?.sampleCommentDetail?.map(z => ({
          ...z,
          sampleCommentDetailId: z?.sampleCommentDetailId,
          isCheck: z?.id === id ? e.target.checked : z?.isCheck,
        })),
      })));
    }
  };

  const header = (type) => [
    {
      title: `${type === 'OBJECT' ? "Use skill" : "Use sample comments"}`,
      key: 'student',
      width: 200,
      className: 'min-width-200',
      render: (record) => (
        <div className={classnames(stylesModule['wrapper-checkbox'])}>
          <Checkbox
            checked={record?.isCheck || false}
            className="mr15"
            onChange={(e) => onChangeUseTable(e, record.id, type)}
          />
          <p className={stylesModule.textChild} >{record?.name}</p>
        </div>
      ),
    },
  ];

  const onChangeType = (e) => {
    setType(e);
    if (e === 'QUARTER_REPORT') {
      dispatch({
        type: 'englishSettingScriptReviewAdd/GET_DATA_TYPE',
        payload: e,
      });
    }
  };

  useEffect(() => {
    dispatch({
      type: 'englishSettingScriptReviewAdd/GET_BRANCHES',
      payload: {},
    });
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

  useEffect(() => {
    if (defaultBranch?.id) {
      dispatch({
        type: 'englishSettingScriptReviewAdd/GET_CLASSES',
        payload: { branchIds: defaultBranch?.id },
        callback: (response) => {
          if (response) {
            setDataClass(response);
          }
        },
      });
    }
  }, [defaultBranch]);



  const onChangeBranch = (e) => {
    dispatch({
      type: 'englishSettingScriptReviewAdd/GET_CLASSES',
      payload: { branchIds: e },
      callback: (response) => {
        if (response) {
          setDataClass(response);
        }
      },
    });
    form.setFieldsValue({
      classId: undefined,
    });
  };

  const onChangeUse = (e, type) => {
    if (type === 'OBJECT') {
      setDataSubjec(dataSubjec?.map(i => ({
        ...i,
        isSubject: e,
        isCheck: e !== true ? false : i?.isCheck,
        subjectSection: i?.subjectSection?.map(k => ({
          ...k,
          isCheck: e !== true ? false : k?.isCheck,
          subjectSectionDetail: k?.subjectSectionDetail?.map(z => ({
            ...z,
            isCheck: e !== true ? false : z?.isCheck,
          })),
        })),
      })));
    }
    else {
      setDataComment(dataComment?.map(i => ({
        ...i,
        isComent: e,
        isCheck: e !== true ? false : i?.isCheck,
        sampleCommentDetail: i?.sampleCommentDetail?.map(z => ({
          ...z,
          isCheck: e !== true ? false : z?.isCheck,
        })),
      })));
    }
  };

  const onChangeUseItem = (e, id, type) => {
    if (type === 'OBJECT') {
      setDataSubjec(dataSubjec?.map(i => ({
        ...i,
        isCheck: i?.id === id ? e.target.checked : i?.isCheck,
      })));
    }
    else {
      setDataComment(dataComment?.map(i => ({
        ...i,
        isCheck: i?.id === id ? e.target.checked : i?.isCheck,
      })));
    }
  };

  const onChangeUseItemTable = (e, id) => {
    setDataSubjec(dataSubjec?.map(i => ({
      ...i,
      subjectSection: i?.subjectSection?.map(k => ({
        ...k,
        isCheck: k?.id === id ? e.target.checked : k?.isCheck,
      })),
    })));
  };

  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={params.id ? 'Edit' : 'Create new'} menu={menuLeftCriteria} />
      <Helmet title="Script review" />
      <Pane className="pl20 pr20 pb20">
        <Pane >
          <Loading
            loading={effects[`englishSettingScriptReviewAdd/GET_DATA`]}
          >
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
              data: [
                {},
              ],
              branchId: defaultBranch?.id,
              schoolYearId: user?.schoolYear?.id,
              classId: user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER ? head(user?.objectInfo?.classTeachers)?.classId : undefined,
            }}>
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  General info
                </Heading>
                <Pane className="row">
                  <div className="col-lg-3">
                    <FormItem
                      data={years?.filter(i => i?.id === user?.schoolYear?.id)}
                      name="schoolYearId"
                      type={variables.SELECT}
                      placeholder="Choose school year"
                      label="School year"
                      allowClear={false}
                      rules={[variables.RULES.EMPTY_INPUT_ENGLISH]}
                    />
                  </div>
                  <Pane className="col-lg-3">
                    <FormItem
                      name="type"
                      placeholder="Choose type review"
                      data={typeSelect}
                      type={variables.SELECT}
                      label="Type review"
                      onChange={onChangeType}
                      rules={[variables.RULES.EMPTY_INPUT_ENGLISH]}
                    />
                  </Pane>
                  {
                    type === 'QUARTER_REPORT' && (
                      <Pane className="col-lg-3">
                        <FormItem
                          name="nameAssessmentPeriodId"
                          placeholder="Choose evaluation stage"
                          data={dataType}
                          type={variables.SELECT}
                          label="Evaluation stage"
                          rules={[variables.RULES.EMPTY_INPUT_ENGLISH]}
                        />
                      </Pane>
                    )
                  }
                  <Pane className="col-lg-12">
                    <FormItem
                      name="branchId"
                      data={defaultBranch?.id ? [defaultBranch] : branches}
                      placeholder="Input select"
                      type={variables.SELECT_MUTILPLE}
                      rules={[variables.RULES.EMPTY_ENGLISH]}
                      label="Apply basis"
                      onChange={onChangeBranch}
                    />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name="classId"
                      data={user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER ? dataClass?.filter(i => i?.id === head(user?.objectInfo?.classTeachers)?.classId) : dataClass}
                      placeholder="Input select"
                      type={variables.SELECT_MUTILPLE}
                      rules={[variables.RULES.EMPTY_ENGLISH]}
                      label="Apply class"
                    />
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
                      <FormItem
                        valuePropName="checked"
                        label="Use"
                        name='isCheckSubject'
                        className="checkbox-row-form no-label m0"
                        type={variables.SWITCH}
                        onChange={(e) => onChangeUse(e, 'OBJECT')}
                      />
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="row">
                  <Subject loadingSubject={loadingSubject} dataSubjec={dataSubjec} onChangeUseItemTable={onChangeUseItemTable} header={header} onChangeUseItem={onChangeUseItem} />
                </Pane>
              </Pane>

              <Pane className="card mb20">
                <Pane className="p20">
                  <Heading type="form-title" className="mb15">
                    Comment information
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-4">
                      <FormItem
                        valuePropName="checked"
                        label="Use"
                        name='isCheckSampleComment'
                        className="checkbox-row-form no-label m0"
                        type={variables.SWITCH}
                        onChange={(e) => onChangeUse(e, 'COMMENT')}
                      />
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="row">
                  <Pane className="col-lg-12">
                    <Comment loadingComment={loadingComment} dataComment={dataComment} onChangeUseItem={onChangeUseItem} header={header} />
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="d-flex justify-content-between align-items-center mb20 mt20">
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
                  loading={effects[`EnglishQuarterReport/ADD_SENT`]}
                  permission={"WEB_TIENGANH_KICHBANDANHGIA_UPDATE" || "WEB_TIENGANH_KICHBANDANHGIA_CREATE"}
                >
                  Save
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