import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Checkbox, Switch } from 'antd';
import { head, isEmpty, last } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';
import { variables } from '@/utils';
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
  } = useSelector(({ menu, loading, configurationReviewsAdd }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    dataType: configurationReviewsAdd.dataType,
    years: configurationReviewsAdd.years,
    error: configurationReviewsAdd.error,
  }));

  const [type, setType] = useState('');
  const [dataSubject, setDataSubject] = useState(undefined);
  const [dataComment, setDataComment] = useState(undefined);

  const [details, setDetails] = useState(undefined);

  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingSubject, setLoadingSubject] = useState(false);

  const [isCheckDataSubject, setIsCheckDataSubject] = useState(false);
  const [isCheckDataComment, setIsCheckDataComment] = useState(false);

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
        }

        if (details?.type === 'LESSION_FEEDBACK') {
          setType(details?.type);
        }

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
          />
          <p className={stylesModule.textChild} >{record?.item}</p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'configurationReviewsAdd/GET_BRANCHES',
      payload: {},
    });
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

  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={params.id ? 'Chi tiết' : 'Tạo mới'} menu={menuLeftCriteria} />
      <Helmet title="Cấu hình đánh giá" />
      <Pane className="pl20 pr20 pb20">
        <Pane >
          <Loading
            loading={effects[`configurationReviewsAdd/GET_DATA`]}
          >
            <Form layout="vertical" form={form} initialValues={{
              data: [
                {},
              ]
            }}>
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Thông tin chung
                </Heading>
                <Pane className="row">
                  <div className="col-lg-3">
                    <FormDetail name={details?.schoolYear?.id} label="Năm học" data={years} type="select" />
                  </div>
                  <Pane className="col-lg-3">
                    <FormDetail name={details?.type} label="Loại đánh giá" data={typeSelect} type="select" />
                  </Pane>
                  {
                    type === 'PERIODIC_MEASUREMENT' && (
                      <Pane className="col-lg-3">
                        <FormDetail name={details?.assessmentPeriod?.id} label="Kỳ đánh giá" data={convertDataType(dataType)} type="select" />
                      </Pane>
                    )
                  }
                  <Pane className="col-lg-12">
                    <FormDetail
                      name={[...new Map(details?.classes?.map(i => i?.class?.branch)?.map(item => [item.id, item])).values()]}
                      label="Cở sở áp dụng"
                      type="selectTagsV2"
                    />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormDetail
                      name={details?.classes?.map(i => i?.class)}
                      label="Lớp áp dụng"
                      type="selectTagsV2"
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
                          <Switch
                            checked={last(details?.templates)?.isEnable || false}
                            className="mr15"
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
                      <Switch
                        checked={head(details?.templates)?.isEnable || false}
                        className="mr15"
                      />
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="row">
                  <Pane className="col-lg-12">
                    <Comment
                      loadingComment={loadingComment}
                      dataComment={dataComment || []}
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
                  size="large"
                  onClick={() => {
                    history.push(`/chuong-trinh-hoc/the-chat/cau-hinh-danh-gia/${params?.id}/edit`);
                  }}
                >
                  Sửa
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