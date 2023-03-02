import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history, useLocation } from 'umi';
import { isEmpty, get } from 'lodash';
import classnames from 'classnames';
import Loading from '@/components/CommonComponent/Loading';

import Heading from '@/components/CommonComponent/Heading';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import DetailStudent from '../component/detail-student';
import Rate from '../component/rate';
import Bmi from '../component/bmi';
import stylesModule from '../styles.module.scss';


const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    dataDetailItem,
    menuLeftCriteria,
  } = useSelector(({ EnglishMonthlyReport, menu, loading, physicalPeriodicMeasurementAdd }) => ({
    dataAssess: EnglishMonthlyReport.dataAssess,
    loading,
    dataDetailItem: physicalPeriodicMeasurementAdd.dataDetailItem,
    menuLeftCriteria: menu.menuLeftCriteria,
    dataType: EnglishMonthlyReport.dataType,
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

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

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

  const addSend = () => {
    dispatch({
      type: 'physicalPeriodicMeasurement/SEND',
      payload: [params?.id],
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
                <DetailStudent dataDetails={dataDetailItem} type={query?.type} />
                <Pane className="col-lg-12 border-top pt20 pl0 pr0">
                  <FormDetail label="Tỉ lệ tham gia môn học" type="label" />
                  <Rate rates={dataDetailItem?.rates} />
                </Pane>
                {
                  query?.type !== 'done-review' && (
                    <Pane className="col-lg-12 border-top pt20 p0">
                      <FormDetail label="Biẻu đồ BMI" type="label" />
                      <Bmi dataDetailItem={dataDetailItem} />
                    </Pane>
                  )
                }
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
                    {
                      !isEmpty(dataDetailItem?.templates?.find(i => i?.type === 'CRITERIA')) && (
                        dataDetailItem?.templates?.find(i => i?.type === 'CRITERIA')?.templates?.map((item, index) => (
                          (
                            <Pane className="row  pl20 pb20 pr20" key={index}>
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
                                      rowKey={() => index}
                                      scroll={{ x: '100%' }}
                                      isEmpty
                                    /> :
                                    <FormDetail name={item?.content} type="table" />
                                }
                              </Pane>
                            </Pane>
                          )
                        ))
                      )
                    }
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
                    dataDetailItem?.templates?.find(i => i?.type === 'FEEDBACK')?.templates?.map((i, index) => (
                      <Pane className="row" key={index}>
                        <Pane className="col-lg-12">
                          <FormDetail name={i?.content} label={i?.template?.name} type="TextArea" />
                        </Pane>
                      </Pane>
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
                  Đóng
                </p>
                {
                  query?.type === 'not-send' && (
                    <Button
                      className="ml10 px25"
                      color="success"
                      onClick={() => addSend()}
                      size="large"
                      loading={effects['physicalPeriodicMeasurementAdd/SEND']}
                    // permission="WEB_TIENGANH_DANHGIATHANG_CHUAGUI_APPROVE"
                    >
                      Gửi
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