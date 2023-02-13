import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history, useLocation } from 'umi';
import { isEmpty, get } from 'lodash';
import classnames from 'classnames';
import Loading from '@/components/CommonComponent/Loading';

import ImgDetail from '@/components/CommonComponent/imageDetail';

import Heading from '@/components/CommonComponent/Heading';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import { variables, Helper } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import variablesModules from '../utils/variables';
import DetailStudent from '../component/detail-student';
import Rate from '../component/rate';
import stylesModule from '../styles.module.scss';


const marginProps = { style: { paddingTop: 12, paddingBottom: 20 } };

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    dataDetailItem,
    menuLeftCriteria,
    user,
  } = useSelector(({ EnglishMonthlyReport, menu, loading, physicalPeriodicMeasurementAdd, user }) => ({
    dataAssess: EnglishMonthlyReport.dataAssess,
    loading,
    dataDetailItem: physicalPeriodicMeasurementAdd.dataDetailItem,
    menuLeftCriteria: menu.menuLeftCriteria,
    dataType: EnglishMonthlyReport.dataType,
    user: user.user,
    error: physicalPeriodicMeasurementAdd.error,
  }));

  const { query } = useLocation();

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'physicalPeriodicMeasurementAdd/GET_DATA_DETAIL',
        payload: {
          id: params?.id,
        },
      });
    }
  }, [params.id]);

  // useEffect(() => {
  //   dispatch({
  //     type: 'EnglishMonthlyReport/GET_DATA_TYPE',
  //     payload: {},
  //   });
  //   dispatch({
  //     type: 'physicalPeriodicMeasurementAdd/GET_DATA_EVALUATION_CRITERRIA',
  //     payload: {},
  //   });
  // }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  // useEffect(() => {
  //   if (params.id) {
  //     form.setFieldsValue({
  //       ...dataDetailItem,
  //       ...head(dataDetailItem.positionLevel),
  //     });
  //   }
  // }, [dataDetailItem]);

  const header = (item) => [
    ...(item?.template?.content?.items?.length > 0 ?
      (item?.template?.content?.items?.map(itemDetailTable => (
        {
          title: `${itemDetailTable?.item}`,
          key: 'img',
          align: 'center',
          width: 200,
          className: classnames('min-width-200', 'max-width-200'),
          render: () => (
            <>
              {
                itemDetailTable.isChecked &&
                <img alt="" src="/images/vector.png" />
              }
            </>
          ),
        }
      )))
      : []),
  ];

  const addSent = () => {
    const payload = {
      studentId: [dataDetailItem?.studentId],
      schoolYearId: dataDetailItem?.schoolYearId,
      month: dataDetailItem?.month,
      scriptReviewId: dataDetailItem?.scriptReviewId,
      newStatus: variablesModules.STATUS.SENT,
      oldStatus: "CONFIRMED",
      teacherSentId: query?.type === "done" ? user?.objectInfo?.id : undefined,
    };
    dispatch({
      type: 'EnglishMonthlyReport/ADD_SENT',
      payload: { ...payload },
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
      }
    });
  };
  const detailTearch = `${dataDetailItem?.teacher?.fullName ? dataDetailItem?.teacher?.fullName : ""}  ${dataDetailItem?.creationTime ? Helper.getDate(dataDetailItem?.creationTime, variables.DATE_FORMAT.DATE_TIME) : ""}`;
  const detailTearchManagement = `${dataDetailItem?.teacherManagement?.fullName ? dataDetailItem?.teacherManagement?.fullName : ""}  ${dataDetailItem?.confirmationTime ? Helper.getDate(dataDetailItem?.confirmationTime, variables.DATE_FORMAT.DATE_TIME) : ""}`;
  const detailTearchManagementSend = `${dataDetailItem?.teacherSent?.fullName ? dataDetailItem?.teacherSent?.fullName : ""}  ${dataDetailItem?.lastModificationTime ? Helper.getDate(dataDetailItem?.lastModificationTime, variables.DATE_FORMAT.DATE_TIME) : ""}`;

  const formStatus = () => {
    if (query?.type === "done-review") {
      return (
        <Pane className="col-lg-3">
          <FormDetail name={detailTearch} label="Giáo viên đo lường" type="text" />
        </Pane>
      );
    }
    if (query?.type === "done-confirmed" || query?.type === "done") {
      return (
        <>
          <Pane className="col-lg-3">
            <FormDetail name={detailTearch} label="Giáo viên đo lường" type="text" />
          </Pane>
          <Pane className="col-lg-3">
            <FormDetail name={detailTearchManagement} label="Approved by" type="text" />
          </Pane>
        </>
      );
    }
    if (query?.type === "send") {
      return (
        <>
          <Pane className="col-lg-3">
            <FormDetail name={detailTearch} label="Giáo viên đo lường" type="text" />
          </Pane>
          <Pane className="col-lg-3">
            <FormDetail name={detailTearchManagement} label="Approved by" type="text" />
          </Pane>
          <Pane className="col-lg-3">
            <FormDetail name={detailTearchManagementSend} label="Sender" type="text" />
          </Pane>
        </>
      );
    }
    return "";
  };
  console.log("dataDetailItem", dataDetailItem)
  const detailSchoolYear = `${dataDetailItem?.schoolYear?.yearFrom} - ${dataDetailItem?.schoolYear?.yearTo}`;
  return (
    <div className={stylesModule['wraper-container-monthlyComment']}>
      <Breadcrumbs last={`Nhận xét ${dataDetailItem?.student?.fullName}`} menu={menuLeftCriteria} />
      <Helmet title="Đo lường định kỳ" />
      <Pane className="pl20 pr20 pb20">
        <Pane>
          <Form layout="vertical" form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            <Loading
              loading={effects['physicalPeriodicMeasurementAdd/GET_DATA_DETAIL']}
              params={{
                type: 'container',
              }}
            >
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Đo lường {dataDetailItem?.assessmentPeriod?.name}
                </Heading>
                <DetailStudent dataDetails={dataDetailItem} />
                <Pane className="col-lg-12 border-top pt20 pl0 pr0">
                  <FormDetail label="Tỉ lệ tham gia môn học" type="label" />
                  <Rate rates={dataDetailItem?.rates} />
                </Pane>
              </Pane>
              <Pane>
                {
                  !isEmpty(dataDetailItem?.templates?.find(i => i?.type === 'CRITERIA')) &&
                  <Pane className="card mb20">
                    <Pane className="p20">
                      <Heading type="form-title">
                        Môn đánh giá
                      </Heading>
                    </Pane>
                    <Pane className="row  pl20 pb20 pr20">
                      {
                        !isEmpty(dataDetailItem?.templates?.find(i => i?.type === 'CRITERIA')) && (
                          dataDetailItem?.templates?.find(i => i?.type === 'CRITERIA')?.templates?.map(item => (
                            (
                              <>
                                <Pane className="col-lg-12 pt20 border-top">
                                  <h3 className={stylesModule['item-text-header']}>{item?.template?.name}</h3>
                                </Pane>
                                <Pane className="col-lg-12 pb20">
                                  {
                                    item?.template?.content?.type === "CRITERIA" ?
                                      <Table
                                        columns={header(item)}
                                        dataSource={item?.template?.content?.items ? [{ checkId: item?.content?.checkId }] : undefined}
                                        pagination={false}
                                        rowKey={(record) => record.id}
                                        scroll={{ x: '100%' }}
                                        isEmpty
                                      /> :
                                      <FormDetail name={item?.content} type="table" />
                                  }
                                </Pane>
                              </>
                            )
                          ))
                        )
                      }
                    </Pane>
                  </Pane>
                }
                <Pane className="card mb20 p20">
                  <Pane className="mb20">
                    <Heading type="form-title">
                      Nhận xét
                    </Heading>
                  </Pane>
                  {
                    !isEmpty(dataDetailItem?.templates?.find(i => i?.type === 'FEEDBACK')) &&
                    dataDetailItem?.templates?.find(i => i?.type === 'FEEDBACK')?.templates?.map(i => (
                      (

                        <Pane className="row">
                          <Pane className="col-lg-12">
                            <FormDetail name={i?.content} label={i?.template?.name} type="TextArea" />
                          </Pane>
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
                  Close
                </p>
                {
                  query?.type === 'done' && (
                    <Button
                      className="ml10 px25"
                      color="success"
                      onClick={() => addSent()}
                      size="large"
                      loading={effects['EnglishMonthlyReport/ADD_SENT_ALL']}
                    // permission="WEB_TIENGANH_DANHGIATHANG_CHUAGUI_APPROVE"
                    >
                      Send
                    </Button>)
                }
              </Pane>
            </Loading>
          </Form>
        </Pane>
      </Pane >
    </div >
  );
});

export default Index;