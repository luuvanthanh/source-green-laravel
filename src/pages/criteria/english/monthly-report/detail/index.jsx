import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import { head } from 'lodash';
import classnames from 'classnames';
import Loading from '@/components/CommonComponent/Loading';

import ImgDetail from '@/components/CommonComponent/imageDetail';

import Heading from '@/components/CommonComponent/Heading';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Table from '@/components/CommonComponent/Table';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
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
    menuLeftCriteria,
    dataEvaluetionCriteria,
  } = useSelector(({ EnglishMonthlyReportAdd, menu, loading, EnglishMonthlyReportAddAdd, user }) => ({
    dataAssess: EnglishMonthlyReportAdd.dataAssess,
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    details: EnglishMonthlyReportAddAdd.details,
    dataType: EnglishMonthlyReportAdd.dataType,
    dataEvaluetionCriteria: EnglishMonthlyReportAddAdd.dataEvaluetionCriteria,
    user: user.user,
    error: EnglishMonthlyReportAddAdd.error,
  }));
  const [dataDetails, setDataDetails] = useState(undefined);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'EnglishMonthlyReportAddAdd/GET_DATA_DETAIL',
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
      type: 'EnglishMonthlyReportAdd/GET_DATA_TYPE',
      payload: {},
    });
    dispatch({
      type: 'EnglishMonthlyReportAddAdd/GET_DATA_EVALUATION_CRITERRIA',
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

  return (
    <div className={stylesModule['wraper-container-quarterReport']}>
      <Breadcrumbs last={params.id ? 'Edit' : 'Create new'} menu={menuLeftCriteria} />
      <Helmet title="Subject" />
      <Pane className="pl20 pr20 pb20">
        <Pane>
          <Form layout="vertical" form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            <Loading
              loading={effects['EnglishMonthlyReportAddAdd/GET_DATA_DETAIL']}
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
                    <FormDetail name={dataDetails?.schoolYear?.yearFrom} label="School year" type="text" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={dataDetails?.student?.branch?.name} label="Center" type="text" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={dataDetails?.student?.classes?.name} label="Class" type="text" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={dataDetails?.scriptReview?.nameAssessmentPeriod?.name} label="Assessment periodr" type="text" />
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
                        <Pane className="row p20">
                          <Pane className="col-lg-12">
                            <FormDetail name={i?.content} label={i?.scriptReviewComment?.sampleComment?.name} type="text" />
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
              </Pane>
            </Loading>
          </Form>
        </Pane>
      </Pane >
    </div >
  );
});

export default Index;