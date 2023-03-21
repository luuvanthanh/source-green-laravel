import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history, useLocation } from 'umi';
import { isEmpty, get } from 'lodash';

import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import FormDetail from '@/components/CommonComponent/FormDetail';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import { Helper } from '@/utils';
import Rate from '../component/rate';
import DetailStudent from '../component/detail-student';
import Bmi from '../component/bmi';
import Subject from '../component/subject';
import Comment from '../component/comment';

import stylesModule from '../styles.module.scss';


const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    dataDetailItem,
    dataTemplates,
    menuLeftPhysicalItem,
    dataEvaluetionCriteria,
    user,
  } = useSelector(({ EnglishMonthlyReport, menu, loading, physicalPeriodicMeasurementConfirmed, user }) => ({
    dataDetailItem: physicalPeriodicMeasurementConfirmed.dataDetailItem,
    dataAssess: EnglishMonthlyReport.dataAssess,
    loading,
    menuLeftPhysicalItem: menu.menuLeftPhysicalItem,
    dataType: EnglishMonthlyReport.dataType,
    dataTemplates: physicalPeriodicMeasurementConfirmed.dataTemplates,
    dataEvaluetionCriteria: physicalPeriodicMeasurementConfirmed.dataEvaluetionCriteria,
    user: user.user,
    error: physicalPeriodicMeasurementConfirmed.error,
  }));

  const [checkFinish, setCheckFinish] = useState(false);

  const { query } = useLocation();

  const loadingSubmit = effects[`physicalPeriodicMeasurementConfirmed/UPDATE`];
  const onFinish = () => {
    setCheckFinish(true);

    dispatch({
      type: 'physicalPeriodicMeasurementConfirmed/UPDATE',
      payload: {
        id: params?.id,
        studentId: dataDetailItem?.student?.id,
        schoolYearId: user.schoolYear?.id,
        classId: dataDetailItem?.information?.class?.id,
        assessmentPeriodId: dataDetailItem?.information?.assessmentPeriod?.id,
        templates: dataTemplates?.map(item => ({
          type: item?.type,
          templates: item?.physicalCriteraiTemplates?.map(itemTemplates => ({
            content: itemTemplates?.contentInput,
            template: {
              id: itemTemplates?.id,
              name: itemTemplates?.name,
              isChecked: itemTemplates?.isChecked,
              content: {
                type: itemTemplates?.content?.type,
                items: itemTemplates?.content?.items?.map(itemTemplatesContent => ({
                  item: itemTemplatesContent?.name,
                  isChecked: itemTemplatesContent?.isChecked || false,
                })) || [],
              }
            }
          }))
        })),
        rates: dataDetailItem?.rates?.map(i => ({
          physicalStudyProgramId: i?.physicalStudyProgram?.id,
          rate: i?.rate,
          isLevelOut: i?.isLevelOut,
        }))
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
    dispatch({
      type: 'physicalPeriodicMeasurementConfirmed/GET_DATA_DETAIL',
      payload: {
        id: params?.id,
      },
      callback: (response) => {
        if (response) {
          form.setFieldsValue({
            data: response.parsePayload.childEvaluateDetail,
          });
        }
      },
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const addApprove = () => {
    dispatch({
      type: 'physicalPeriodicMeasurementConfirmed/UPDATE_CONFIRMATION',
      payload: {
        id: params?.id,
        studentId: dataDetailItem?.student?.id,
        schoolYearId: user.schoolYear?.id,
        classId: dataDetailItem?.information?.class?.id,
        assessmentPeriodId: dataDetailItem?.information?.assessmentPeriod?.id,
        templates: dataTemplates?.map(item => ({
          type: item?.type,
          templates: item?.physicalCriteraiTemplates?.map(itemTemplates => ({
            content: itemTemplates?.contentInput,
            template: {
              id: itemTemplates?.id,
              name: itemTemplates?.name,
              isChecked: itemTemplates?.isChecked,
              content: {
                type: itemTemplates?.content?.type,
                items: itemTemplates?.content?.items?.map(itemTemplatesContent => ({
                  item: itemTemplatesContent?.name,
                  isChecked: itemTemplatesContent?.isChecked || false,
                })) || [],
              }
            }
          }))
        })),
        rates: dataDetailItem?.rates?.map(i => ({
          physicalStudyProgramId: i?.physicalStudyProgram?.id,
          rate: i?.rate,
          isLevelOut: i?.isLevelOut,
        }))
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

  const addDelete = () => {
    const text = "Bạn có chắc muốn từ chối bài đo lường này không?";
    Helper.confirmDelete({
      callback: () => {
        dispatch({
          type: 'physicalPeriodicMeasurementConfirmed/DELETE',
          payload: { id: params?.id },
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
      },
    }, text);
  };

  return (
    <div className={stylesModule['wraper-container-monthlyComment']}>
      <Breadcrumbs last={dataDetailItem?.information?.student?.fullName} menu={menuLeftPhysicalItem} />
      <Helmet title=" Đo lường định kỳ" />
      <Pane className="pl20 pr20 pb20">
        <Pane>
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            <Loading
              loading={effects['physicalPeriodicMeasurementConfirmed/GET_DATA_SCRIPT_REVIEW']}
              params={{
                type: 'container',
              }}
            >
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Đo lường {query?.name}
                </Heading>
                <DetailStudent dataDetails={dataDetailItem} type="confirmed" />
                <Pane className="col-lg-12 border-top pt20 p0">
                  <FormDetail label="Tỉ lệ tham gia môn học" type="label" />
                  <Rate rates={dataDetailItem?.rates} />
                </Pane>
                <Pane className="col-lg-12 border-top pt20 p0">
                  <FormDetail label="Biẻu đồ BMI" type="label" />
                  <Bmi dataDetailItem={dataDetailItem} />
                </Pane>
              </Pane>
              <Pane>
                <Pane className="card mb20">
                  <Pane className="p20">
                    <Heading type="form-title">
                      Môn đánh giá
                    </Heading>
                  </Pane>
                  {
                    !isEmpty(dataTemplates?.find(i => i?.type === 'CRITERIA')) &&
                    dataTemplates?.find(i => i?.type === 'CRITERIA')?.physicalCriteraiTemplates?.map((item, index) => ((
                      <Pane className="row  pl20 pb20 pr20" key={index}>
                        <Subject
                          item={item}
                          checkFinish={checkFinish}
                          dataEvaluetionCriteria={dataEvaluetionCriteria}
                        />
                      </Pane>
                    )
                    ))
                  }
                </Pane>

                <Pane className="card mb20">
                  <Pane className="p20">
                    <Heading type="form-title">
                      Nhận xét
                    </Heading>
                  </Pane>
                  {
                    !isEmpty(dataTemplates?.find(i => i?.type === 'FEEDBACK')) &&
                    dataTemplates?.find(i => i?.type === 'FEEDBACK')?.physicalCriteraiTemplates?.map((itemParent, index) => ((
                      <Pane className="pl20 pb20 pr20" key={index}>
                        <Comment
                          itemParent={itemParent}
                        />
                      </Pane>
                    )
                    ))
                  }
                </Pane>
              </Pane>
              <Pane className="d-flex justify-content-between align-items-center mb20">
                <p
                  className="btn-delete"
                  role="presentation"

                  onClick={() => history.goBack()}
                >
                  Hủy
                </p>
                <div className='d-flex'>
                  <Button
                    className="ml-auto px25 mr10"
                    color="danger"
                    onClick={() => addDelete()}
                    size="large"
                    loading={effects['physicalPeriodicMeasurementConfirmed/DELETE']}
                    permission="WEB_THECHAT_DOLUONGDINHKY_CHUADUYET_EDIT"
                  >
                    Từ chối
                  </Button>
                  <Button
                    className="ml-auto px25"
                    color="success"
                    htmlType="submit"
                    size="large"
                    loading={loadingSubmit}
                    permission="WEB_THECHAT_DOLUONGDINHKY_CHUADUYET_EDIT"
                  >
                    Lưu
                  </Button>
                  <Button
                    className="ml10 px25"
                    color="primary"
                    onClick={() => addApprove()}
                    size="large"
                    permission="WEB_THECHAT_DOLUONGDINHKY_CHUADUYET_APPROVE"
                    loading={effects['physicalPeriodicMeasurementConfirmed/UPDATE_CONFIRMATION']}
                  >
                    Duyệt
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
