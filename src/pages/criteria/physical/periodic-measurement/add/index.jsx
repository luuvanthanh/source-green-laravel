import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, notification } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history, useLocation } from 'umi';
import { isEmpty, get, head } from 'lodash';

import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import FormDetail from '@/components/CommonComponent/FormDetail';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import Rate from '../component/rate';
import Subject from '../component/subject';
import Comment from '../component/comment';
import DetailStudent from '../component/detail-student';

import stylesModule from '../styles.module.scss';


const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    dataDetails,
    dataTemplates,
    menuLeftCriteria,
    dataEvaluetionCriteria,
    user,
  } = useSelector(({ EnglishMonthlyReport, menu, loading, physicalPeriodicMeasurementAdd, user }) => ({
    dataDetails: physicalPeriodicMeasurementAdd.dataDetails,
    dataAssess: EnglishMonthlyReport.dataAssess,
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    dataType: EnglishMonthlyReport.dataType,
    dataTemplates: physicalPeriodicMeasurementAdd.dataTemplates,
    dataEvaluetionCriteria: physicalPeriodicMeasurementAdd.dataEvaluetionCriteria,
    user: user.user,
    error: physicalPeriodicMeasurementAdd.error,
  }));

  const [checkFinish, setCheckFinish] = useState(false);

  const { query } = useLocation();

  const loadingSubmit = effects[`physicalPeriodicMeasurementAdd/ADD`];

  const onFinish = () => {
    setCheckFinish(true);
    const data = dataTemplates?.filter(i => i?.type === "CRITERIA");
    const checkEmpty = head(data)?.physicalCriteraiTemplates?.filter(i => !i?.checkEmpty);
    if (checkEmpty?.length === 0) {
      dispatch({
        type: 'physicalPeriodicMeasurementAdd/ADD',
        payload: {
          studentId: params?.id,
          schoolYearId: user.schoolYear?.id,
          classId: dataDetails?.information?.class?.id,
          assessmentPeriodId: dataDetails?.information?.assessmentPeriod?.id,
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
          rates: dataDetails?.rates?.map(i => ({
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
    } else {
      notification.warning({
        message: 'Thông báo',
        description: 'Bạn cần chọn đầy đủ thông tin của môn đánh giá.',
      });
    }
  };

  useEffect(() => {
    dispatch({
      type: 'physicalPeriodicMeasurementAdd/GET_DATA_STUDENTS',
      payload: {
        studentId: params?.id,
        assessmentPeriodId: query?.assessmentPeriodId,
        classId: query?.classId,
        schoolYearId: query?.schoolYearId
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


  return (
    <div className={stylesModule['wraper-container-monthlyComment']}>
      <Breadcrumbs last={dataDetails?.information?.student?.fullName} menu={menuLeftCriteria} />
      <Helmet title=" Đo lường định kỳ" />
      <Pane className="pl20 pr20 pb20">
        <Pane>
          <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            <Loading
              loading={effects['physicalPeriodicMeasurementAdd/GET_DATA_STUDENTS']}
              params={{
                type: 'container',
              }}
            >
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Đo lường {query?.name}
                </Heading>
                <DetailStudent dataDetails={dataDetails} />
                <Pane className="col-lg-12 border-top pt20 p0">
                  <FormDetail label="Tỉ lệ tham gia môn học" type="label" />
                  <Rate rates={dataDetails?.rates} />
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
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit}
                // permission="WEB_TIENGANH_DANHGIATHANG_CHUADANHGIA_CREATE"
                >
                  Lưu
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
