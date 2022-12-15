import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Checkbox } from 'antd';
import { isEmpty, get } from 'lodash';
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
  } = useSelector(({ menu, loading, englishSettingScriptReviewAdd }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    branches: englishSettingScriptReviewAdd?.branches,
    dataType: englishSettingScriptReviewAdd.dataType,
    years: englishSettingScriptReviewAdd.years,
    error: englishSettingScriptReviewAdd.error,
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
        branchId: values?.branchId,
        classId: values?.classId,
        subject: dataSubjec?.map(i => ({
          id: params?.id ? i?.id : undefined,
          subjectId: i?.id,
          isCheck: i?.isCheck || false,
          subjectSection: i?.subjectSection?.map(k => ({
            id: params?.id ? k?.id : undefined,
            subjectSectionId: k?.id,
            isCheck: k?.isCheck || false,
            detail: k?.subjectSectionDetail?.map(z => ({
              id: params?.id ? z?.id : undefined,
              subjectSectionDetailId: z?.id,
              isCheck: z?.isCheck || false,
            }))
          }))
        })),
        comment: dataComment?.map(i => ({
          id: params?.id ? i?.id : undefined,
          sampleCommentId: i?.id,
          isCheck: i?.isCheck || false,
          commentDetail: i?.sampleCommentDetail?.map(k => ({
            id: params?.id ? k?.id : undefined,
            sampleCommentDetailId: k?.id,
            isCheck: k?.isCheck || false,
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
        dispatch({
          type: 'englishSettingScriptReviewAdd/GET_CLASSES',
          payload: { branchIds: details?.branch.map((i) => i?.id) },
          callback: (response) => {
            if (response) {
              setDataClass(response?.items);
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
        subjectSection: i?.subjectSection?.map(k => ({
          ...k,
          subjectSectionDetail: k?.subjectSectionDetail?.map(z => ({
            ...z,
            id: z?.id,
            isCheck: z?.id === id ? e.target.checked : z?.isCheck,
          })),
        })),
      })));
    }
    else {
      setDataComment(dataComment?.map(i => ({
        ...i,
        sampleCommentDetail: i?.sampleCommentDetail?.map(z => ({
          ...z,
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


  const onChangeBranch = (e) => {
    dispatch({
      type: 'englishSettingScriptReviewAdd/GET_CLASSES',
      payload: { branchIds: e },
      callback: (response) => {
        if (response) {
          setDataClass(response?.items);
        }
      },
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
      <Helmet title="General info" />
      <Pane className="pl20 pr20 pb20">
        <Pane >
          <Loading
            loading={effects[`englishSettingScriptReviewAdd/GET_DATA`]}
          >
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
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
                    <FormItem
                      data={[{ id: null, name: 'Chọn tất cả năm học' }, ...years]}
                      name="schoolYearId"
                      type={variables.SELECT}
                      placeholder="Choose school year"
                      label="School year"
                      allowClear={false}
                      rules={[variables.RULES.EMPTY_INPUT]}
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
                      rules={[variables.RULES.EMPTY_INPUT]}
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
                          rules={[variables.RULES.EMPTY_INPUT]}
                        />
                      </Pane>
                    )
                  }
                  <Pane className="col-lg-12">
                    <FormItem
                      name="branchId"
                      data={branches}
                      type={variables.SELECT_MUTILPLE}
                      rules={[variables.RULES.EMPTY]}
                      label="Apply basis"
                      onChange={onChangeBranch}
                    />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name="classId"
                      data={dataClass}
                      type={variables.SELECT_MUTILPLE}
                      rules={[variables.RULES.EMPTY]}
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