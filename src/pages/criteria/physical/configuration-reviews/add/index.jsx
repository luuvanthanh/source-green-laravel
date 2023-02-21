import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Checkbox, Tag } from 'antd';
import { isEmpty, get, head, last } from 'lodash';
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
import FormDetail from '@/components/CommonComponent/FormDetail';
import PropTypes from 'prop-types';
import stylesModule from '../styles.module.scss';
import Comment from './comment';
import Subject from './subject';

const typeSelect = [
  { id: 'LESSION_FEEDBACK', name: 'Nhận xét tiết học' },
  { id: 'PERIODIC_MEASUREMENT', name: 'Đo lường định kỳ' },
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
    user,
    defaultBranch
  } = useSelector(({ menu, loading, configurationReviewsAdd, user }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    dataType: configurationReviewsAdd.dataType,
    years: configurationReviewsAdd.years,
    error: configurationReviewsAdd.error,
    user: user.user,
    defaultBranch: user.defaultBranch,
  }));

  const [type, setType] = useState('');
  const [idDataType, setIdDataType] = useState('');
  const [branches, setBranches] = useState([]);
  const [dataClass, setDataClass] = useState([]);
  const [dataClassTemp, setDataClassTemp] = useState([]);
  const [dataSubject, setDataSubject] = useState(undefined);
  const [dataComment, setDataComment] = useState(undefined);

  const [details, setDetails] = useState(undefined);

  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingSubject, setLoadingSubject] = useState(false);

  const [isCheckDataSubject, setIsCheckDataSubject] = useState(false);
  const [isCheckDataComment, setIsCheckDataComment] = useState(false);

  const onFinish = (values) => {
    const payload = {
      id: params.id,
      schoolYearId: user?.schoolYear?.id,
      assessmentPeriodId: values?.assessmentPeriodId,
      templates: [
        {
          type: "FEEDBACK",
          isEnable: values?.isCheckSampleComment || false,
          physicalCriteraiTemplates: dataComment?.filter(i => !!i?.isChecked)?.map(j => ({
            id: j?.id,
            name: j?.name,
            content: {
              type: j?.content?.type,
              items: j?.content?.items?.filter(k => !!k?.isChecked)?.map(h => h?.item)
            }
          }))
        },
        {
          type: "CRITERIA",
          isEnable: values?.isCheckSubjectComment || false,
          physicalCriteraiTemplates: dataSubject?.filter(i => !!i?.isChecked)?.map(j => ({
            id: j?.id,
            name: j?.name,
            content: {
              type: j?.content?.type,
              items: j?.content?.items?.filter(k => !!k?.isChecked)?.map(h => h?.item)
            }
          }))
        }
      ],
      type: values?.type,
      classIds: values?.classIds
    };
    dispatch({
      type: params.id ? 'configurationReviewsAdd/UPDATE' : 'configurationReviewsAdd/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          if (response) {
            history.push(`/chuong-trinh-hoc/the-chat/cau-hinh-danh-gia`);
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
        type: 'configurationReviewsAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            setDetails(response);
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
      if (details) {
        if (details?.type === 'PERIODIC_MEASUREMENT') {
          setType(details?.type);
          dispatch({
            type: 'configurationReviewsAdd/GET_DATA_TYPE',
            payload: details?.type,
          });
          dispatch({
            type: 'configurationReviewsAdd/GET_DETAIL_DATA_TYPE',
            payload: { id: details?.assessmentPeriod?.id },
            callback: (response) => {
              if (response) {
                setBranches(response?.parsePayload?.branch);
                setDataClass(response?.parsePayload?.classes);
              }
            },
          });
        }
        if (details?.type === 'LESSION_FEEDBACK') {
          setType(details?.type);
          dispatch({
            type: 'configurationReviewsAdd/GET_BRANCHES',
            payload: {},
            callback: (response) => {
              if (response) {
                setBranches(response?.parsePayload);
              }
            },
          });
          dispatch({
            type: 'configurationReviewsAdd/GET_CLASSES',
            payload: { branchIds: Array.from(new Set(details?.classes?.map((i) => i?.class?.branch?.id))) },
            callback: (response) => {
              if (response) {
                setDataClass(response);
              }
            },
          });
        }
        form.setFieldsValue({
          assessmentPeriodId: details?.assessmentPeriod?.id,
          type: details?.type,
          branchIds: Array.from(new Set(details?.classes?.map((i) => i?.class?.branch?.id))),
          classIds: details?.classes?.map((i) => i?.class?.id),
          schoolYearId: details?.schoolYear?.id,
          isCheckSampleComment: head(details?.templates)?.isEnable,
          isCheckSubjectComment: last(details?.templates)?.isEnable
        });

        if (head(details?.templates)?.type === 'FEEDBACK' && head(details?.templates)?.isEnable) {
          setDataComment(head(details?.templates)?.physicalCriteraiTemplates?.map(i => ({
            ...i,
            isComment: true,
            isChecked: i?.isChecked,
            content: {
              ...i?.content,
              items: i?.content?.items?.map((k, index) => ({
                ...k,
                id: `${i?.id}${index}`
              })),
            }
          })));
        }

        if (last(details?.templates)?.type === 'CRITERIA' && last(details?.templates)?.isEnable) {
          setDataSubject(last(details?.templates)?.physicalCriteraiTemplates?.map(i => ({
            ...i,
            isSubject: true,
            isChecked: i?.isChecked,
            content: {
              ...i?.content,
              items: i?.content?.items?.map((k, index) => ({
                ...k,
                id: `${i?.id}${index}`
              })),
            }
          })));
        }
      }
    }
  }, [details, isCheckDataSubject, isCheckDataComment]);

  const convertDataType = (dataType) => {
    let result = [];
    if (isEmpty(dataType)) {
      return result;
    }
    result = dataType?.filter(i => i?.use)?.map(j => ({
      id: j?.id,
      name: j?.nameAssessmentPeriod?.name
    }));
    return result;

  };
  const onChangeUseTable = (e, id, type) => {
    if (type === 'SUBJECT') {
      setDataSubject(dataSubject?.map(i => ({
        ...i,
        content: {
          ...i?.content,
          items: i?.content?.items?.map(j => ({
            ...j,
            isChecked: j?.id === id ? e.target.checked : j?.isChecked,
          })),
        }
      })));
    }
    else {
      setDataComment(dataComment?.map(i => ({
        ...i,
        content: {
          ...i?.content,
          items: i?.content?.items?.map(j => ({
            ...j,
            isChecked: j?.id === id ? e.target.checked : j?.isChecked,
          })),
        }
      })));
    }
  };

  const header = (type) => [
    {
      title: `${type === 'SUBJECT' ? "Sử dụng tiêu chí" : "Sử dụng"}`,
      key: 'student',
      width: 200,
      className: 'min-width-200',
      render: (record) => (
        <div className={classnames(stylesModule['wrapper-checkbox'])}>
          <Checkbox
            checked={record?.isChecked || false}
            className="mr15"
            onChange={(e) => onChangeUseTable(e, record.id, type)}
          />
          <p className={stylesModule.textChild} >{record?.item}</p>
        </div>
      ),
    },
  ];

  const onChangeType = (e) => {
    setType(e);
    setIdDataType('');
    setDataClass([]);
    if (e === 'PERIODIC_MEASUREMENT') {
      setBranches([]);
      dispatch({
        type: 'configurationReviewsAdd/GET_DATA_TYPE',
        payload: {
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.SIZEMAX,
        },
      });
    }
    if (e === 'LESSION_FEEDBACK') {
      dispatch({
        type: 'configurationReviewsAdd/GET_BRANCHES',
        payload: {},
        callback: (response) => {
          if (response) {
            setBranches(response?.parsePayload);
          }
        },
      });
    }
    form.setFieldsValue({
      branchIds: [],
      classIds: [],
      assessmentPeriodId: undefined
    });
  };

  const onChangeDatatype = (e) => {
    setIdDataType(e);
    dispatch({
      type: 'configurationReviewsAdd/GET_DETAIL_DATA_TYPE',
      payload: { id: e },
      callback: (response) => {
        if (response) {
          setBranches(response?.parsePayload?.branch);
          setDataClassTemp(response?.parsePayload?.classes);
        }
      },
    });
    form.setFieldsValue({
      branchIds: [],
      classIds: [],
    });
  };

  useEffect(() => {
    dispatch({
      type: 'configurationReviewsAdd/GET_YEARS',
      payload: {},
    });
    dispatch({
      type: 'configurationReviewsAdd/GET_DATA_SUBJECT',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
      callback: (response) => {
        if (response) {
          setIsCheckDataSubject(true);
          setDataSubject(response?.items);
          setLoadingSubject(false);
        }
      },
    });
    dispatch({
      type: 'configurationReviewsAdd/GET_DATA_COMMENT',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
      callback: (response) => {
        if (response) {
          setIsCheckDataComment(true);
          setDataComment(response?.items);
          setLoadingComment(false);
        }
      },
    });
  }, []);

  useEffect(() => {
    if (defaultBranch?.id) {
      dispatch({
        type: 'configurationReviewsAdd/GET_CLASSES',
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
    if (!idDataType) {
      dispatch({
        type: 'configurationReviewsAdd/GET_CLASSES',
        payload: { branchIds: e },
        callback: (response) => {
          if (response) {
            setDataClass(response);
          }
        },
      });
    } else {
      setDataClass(dataClassTemp?.filter(i => form.getFieldValue('branchIds')?.includes(i?.branchId)));
    }
    form.setFieldsValue({
      classIds: dataClass?.filter(i => form.getFieldValue('classIds')?.includes(i?.id))?.filter(j => form.getFieldValue('branchIds')?.includes(j?.branchId))?.map(k => k?.id),
    });
  };

  const onChangeUse = (e, type) => {
    if (type === 'SUBJECT') {
      setDataSubject(dataSubject?.map(i => ({
        ...i,
        isSubject: e,
        isChecked: e !== true ? false : i?.isChecked,
        content: {
          ...i?.content,
          items: i?.content?.items?.map((k, index) => typeof (k) === 'string' ? ({
            item: k,
            isChecked: e !== true ? false : k?.isChecked,
            id: `${i?.id}${index}`
          }) : k
          ),
        }
      })));
    }
    else {
      setDataComment(dataComment?.map(i => ({
        ...i,
        isComment: e,
        isChecked: e !== true ? false : i?.isChecked,
        content: {
          ...i?.content,
          items: i?.content?.items?.map((k, index) => typeof (k) === 'string' ? ({
            item: k,
            isChecked: e !== true ? false : k?.isChecked,
            id: `${i?.id}${index}`
          }) : k
          ),
        }
      })));
    }
  };

  const onChangeUseItem = (e, id, type) => {
    if (type === 'SUBJECT') {
      setDataSubject(dataSubject?.map(i => ({
        ...i,
        isChecked: i?.id === id ? e.target.checked : i?.isChecked,
      })));
    }
    else {
      setDataComment(dataComment?.map(i => ({
        ...i,
        isChecked: i?.id === id ? e.target.checked : i?.isChecked,
      })));
    }
  };

  const tagRenderBranch = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={value === '8c4265dd-21c7-412b-b003-9a2a493d897a' ? '#27a600' : '#0072d6'}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}
      >
        {label}
      </Tag>
    );
  };

  const tagRenderClass = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={head(dataClass?.filter(i => i?.id === value))?.branchId === '8c4265dd-21c7-412b-b003-9a2a493d897a' ? '#27a600' : '#0072d6'}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={params.id ? 'Chỉnh sửa' : 'Tạo mới'} menu={menuLeftCriteria} />
      <Helmet title="Cấu hình đánh giá" />
      <Pane className="pl20 pr20 pb20">
        <Pane >
          <Loading
            loading={effects[`configurationReviewsAdd/GET_DATA`]}
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
                  Thông tin chung
                </Heading>
                <Pane className="row">
                  <div className="col-lg-3">
                    <FormDetail name={user?.schoolYear?.id} label="Năm học" data={years} type="select" />
                  </div>
                  <Pane className="col-lg-3">
                    <FormItem
                      name="type"
                      placeholder="Chọn loại đánh giá"
                      data={typeSelect}
                      type={variables.SELECT}
                      label="Loại đánh giá"
                      onChange={onChangeType}
                      rules={[variables.RULES.EMPTY_INPUT]}
                    />
                  </Pane>
                  {
                    type === 'PERIODIC_MEASUREMENT' && (
                      <Pane className="col-lg-3">
                        <FormItem
                          name="assessmentPeriodId"
                          placeholder="Chọn kỳ đánh giá"
                          data={convertDataType(dataType)}
                          type={variables.SELECT}
                          label="Kỳ đánh giá"
                          rules={[variables.RULES.EMPTY_INPUT]}
                          onChange={onChangeDatatype}
                        />
                      </Pane>
                    )
                  }
                  <Pane className="col-lg-12">
                    <FormItem
                      name="branchIds"
                      data={defaultBranch?.id ? [defaultBranch] : branches}
                      type={variables.SELECT_MUTILPLE}
                      rules={[variables.RULES.EMPTY]}
                      label="Cơ sở áp dụng"
                      onChange={onChangeBranch}
                      tagRender={tagRenderBranch}
                    />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name="classIds"
                      data={user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER ? dataClass?.filter(i => i?.id === head(user?.objectInfo?.classTeachers)?.classId) : dataClass}
                      type={variables.SELECT_MUTILPLE}
                      rules={[variables.RULES.EMPTY]}
                      label="Lớp áp dụng"
                      tagRender={tagRenderClass}
                    />
                  </Pane>
                </Pane>
              </Pane>
              {
                type !== 'LESSION_FEEDBACK' && (
                  <Pane className="card mb20">
                    <Pane className="pl20 pr20 pt20">
                      <Heading type="form-title" className="mb15">
                        Môn đánh giá
                      </Heading>
                      <Pane className="row">
                        <Pane className="col-lg-4 pb20">
                          <FormItem
                            valuePropName="checked"
                            label="Sử dụng"
                            name='isCheckSubjectComment'
                            className="checkbox-row-form no-label m0"
                            type={variables.SWITCH}
                            onChange={(e) => onChangeUse(e, 'SUBJECT')}
                          />
                        </Pane>
                      </Pane>
                    </Pane>
                    <Pane className="row">
                      <Pane className="col-lg-12">
                        <Subject
                          loadingSubject={loadingSubject}
                          dataSubject={dataSubject || []}
                          header={header}
                          onChangeUseItem={onChangeUseItem}
                        />
                      </Pane>
                    </Pane>
                  </Pane>
                )
              }

              <Pane className="card mb20">
                <Pane className="p20">
                  <Heading type="form-title" className="mb15">
                    Nhận xét mẫu
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-4">
                      <FormItem
                        valuePropName="checked"
                        label="Sử dụng"
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
                    <Comment
                      loadingComment={loadingComment}
                      dataComment={dataComment || []}
                      onChangeUseItem={onChangeUseItem}
                      header={header}
                    />
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="d-flex justify-content-between align-items-center mb20 mt20">
                <p
                  className="btn-delete"
                  role="presentation"

                  onClick={() => history.goBack()}
                >
                  Hủy
                </p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={effects['configurationReviewsAdd/ADD'] || effects['configurationReviewsAdd/UPDATE']}
                >
                  Lưu
                </Button>
              </Pane>
            </Form>
          </Loading>
        </Pane>
      </Pane>
    </div>
  );
});

Index.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  closable: PropTypes.bool,
  onClose: PropTypes.func
};

Index.defaultProps = {
  label: '',
  value: '',
  closable: false,
  onClose: null
};

export default Index;