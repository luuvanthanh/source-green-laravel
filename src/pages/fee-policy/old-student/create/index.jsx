import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Spin, Tabs } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import _ from 'lodash';
import moment from 'moment';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import ScrollContainer from 'react-indiana-drag-scroll';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import stylesModule from '../styles.module.scss';

import TypeFees from './typeFees';

const { TabPane } = Tabs;
const Index = memo(() => {
  const params = useParams();
  const {
    loading,
    menuLeftFeePolicy,
    yearsSchool,
    students,
    fees,
  } = useSelector(({ loading, menu, schoolYear, oldStudentAdd, fees }) => ({
    loading: loading.effects,
    menuLeftFeePolicy: menu.menuLeftFeePolicy,
    yearsSchool: schoolYear.data,
    students: oldStudentAdd.students,
    fees: fees.data,
  }));
  const dispatch = useDispatch();
  const history = useHistory();
  const isCopy = !!(history?.location?.query?.type === 'ban-sao');
  const formRef = useRef();

  const [tab, setTab] = useState('tuition');
  const [tuition, setTuition] = useState([]);

  const [YearsDetail, setYearsDetail] = useState([]);

  const [idYear, setIdYear] = useState();
  const [idRes, setIdRes] = useState();

  const [errorTable, setErrorTable] = useState({
    tuition: false,
  });
  const [details, setDetails] = useState({
    schoolYearId: '',
    startDate: '',
    endDate: '',
    dayAdmission: '',
    code: '',
    branchName: '',
    classType: '',
    className: '',
    classTypeId: '',
  });

  const getStudents = () => {
    dispatch({
      type: 'oldStudentAdd/GET_STUDENTS',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: 1000,
      },
    });
  };


  useEffect(() => {
    dispatch({
      type: 'schoolYear/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    if (params.id) {
      dispatch({
        type: 'oldStudentAdd/GET_DETAILS',
        payload: {
          ...params,
          include: Helper.convertIncludes(['student.classStudent.class']),
        },
        callback: (res) => {
          if (res) {
            setIdYear(res?.schoolYearId);
            setYearsDetail(res?.expectedToCollectMoney);
            getStudents(res?.student?.code);
            setTuition(res?.tuition);
            setDetails((prev) => ({
              ...prev,
              startDate: res?.schoolYear?.startDate ? Helper.getDate(res?.schoolYear?.startDate, variables.DATE_FORMAT.DATE_VI) : '',
              endDate: res?.schoolYear?.endDate ? Helper.getDate(res?.schoolYear?.endDate, variables.DATE_FORMAT.DATE_VI) : '',
              schoolYearId: res?.schoolYearId || '',
              dayAdmission: res?.dayAdmission ? Helper.getDate(res?.dayAdmission, variables.DATE_FORMAT.DATE_VI) : '',
              code: res?.student?.code || '',
              branchName: res?.student?.classStudent?.class?.branch?.name || '',
              classType: res?.student?.classStudent?.class?.classType?.name || '',
              className: res?.student?.classStudent?.class?.name || '',
              classTypeId: res?.student?.classStudent?.class?.classType?.id || '',
            }));
            formRef.current.setFieldsValue({
              ...res,
              studentId: res?.studentId || undefined,
              schoolYearId: res?.schoolYearId || undefined,
              dayAdmission: res?.dayAdmission ? moment(res?.dayAdmission, variables.DATE_FORMAT.DATE_AFTER) : undefined,
            });
          }
        },
      });
    } else {
      getStudents();
    }
  }, []);

  const checkProperties = (object) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in object) {
      if (object[key] === "" || object[key] === null)
        return true;
    }
    return false;
  };

  const checkValidate = (data, name) => {
    const pass = !_.isEmpty(data) ? data.find(item => !!checkProperties(item)) : true;
    setErrorTable((prev) => ({
      ...prev,
      [name]: !!pass,
    }));
    return pass;
  };

  const getMoney = (details) => {
    if (_.isEmpty(tuition)) {
      return;
    }
    const newTuition = [...tuition].filter(obj => obj?.paymentFormId && obj?.feeId).map(item => ({
      id: item.id,
      money: item.money,
      feeId: item.feeId,
      paymentFormId: item.paymentFormId
    }));
    dispatch({
      type: 'newStudentAdd/GET_MONEY_FEE_POLICIES',
      payload: {
        details: JSON.stringify(newTuition),
        classTypeId: details?.classTypeId,
        schoolYearId: details?.schoolYearId,
        dayAdmission: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: moment(details?.dayAdmission, variables.DATE_FORMAT.DATE_VI),
          }),
          format: variables.DATE_FORMAT.DATE_AFTER,
          isUTC: false,
        }),
        student: 'old'
      },
      callback: (res) => {
        if (!_.isEmpty(res)) {
          setTuition(res);
        }
      },
    });
  };

  const changeYear = (value) => {
    setTuition(undefined);
    setIdYear(value);
    formRef.current.setFieldsValue({
      dayAdmission: undefined,
    });
    if (!value) {
      setDetails((prev) => ({
        ...prev,
        startDate: '',
        endDate: '',
        schoolYearId: '',
        dayAdmission: '',
      }));
      return;
    }

    const response = yearsSchool.find(item => item.id === value);
    if (response?.id) {
      const newDetails = {
        ...details,
        startDate: response.startDate ? Helper.getDate(response.startDate, variables.DATE_FORMAT.DATE_VI) : '',
        endDate: response.endDate ? Helper.getDate(response.endDate, variables.DATE_FORMAT.DATE_VI) : '',
        schoolYearId: value,
        dayAdmission: '',
      };
      setDetails(newDetails);
      if (newDetails?.classTypeId && newDetails?.dayAdmission) {
        getMoney(newDetails);
      }
    }
  };

  const changeStudent = (value) => {
    setTuition(undefined);
    if (!value) {
      setDetails((prev) => ({
        ...prev,
        code: '',
        branchName: '',
        grade: '',
        className: '',
        classTypeId: '',
      }));
      return;
    }

    const student = students.find(item => item.id === value);
    if (student?.id) {
      const newDetails = {
        ...details,
        code: student?.code || '',
        branchName: student?.class?.branch?.name || '',
        classType: student?.class?.classType?.name || '',
        className: student?.class?.name || '',
        classTypeId: student?.class?.classType?.id || '',
      };
      setDetails(newDetails);
      if (newDetails?.schoolYearId && newDetails?.dayAdmission && newDetails?.classTypeId) {
        getMoney(newDetails);
      }
    }
  };



  const onFinishFailed = ({ errorFields }) => {
    if (errorFields) {
      checkValidate(tuition, 'tuition');
    }
  };

  const onSearch = _.debounce((val) => {
    getStudents(val);
  }, 300);

  const chgangeDayAdmission = (value) => {
    const newDetails = {
      ...details,
      dayAdmission: value ? Helper.getDate(value, variables.DATE_FORMAT.DATE_VI) : ''
    };
    setDetails(newDetails);
    if (newDetails?.classTypeId && newDetails?.schoolYearId && value) {
      getMoney(newDetails);
    }
  };

  const changeTab = (key) => {
    setTab(key);
  };

  const dataYear = yearsSchool?.filter((p) => (idYear === p.id ? (p) : ""));
  const dataIdRes = idRes?.map(i => ({
    ...i,
    detailYear: dataYear[0]?.changeParameter?.changeParameterDetail,
  }));

  const data = YearsDetail?.length > 0 && dataYear?.length > 0 ?
    YearsDetail?.map((p) =>
    (
      {
        date: p?.date,
        fees: fees.map(id => ({
          money: dataIdRes?.map((a, index) => {

            for (let i = 0; i <= a?.detailData?.length; i++) {
              if (a.feeId === id?.id && a?.detailData[i]?.month === p?.date?.slice(0, 7)) {
                return a?.detailData[i]?.fee[0]?.money || 0;
              }
            };
            for (let i = 0; i <= p?.fees?.length; i++) {
              if (a?.feeId === id?.id && a?.detailYear[i]?.date === p?.date) {
               return p?.fees[index]?.money[index] || 0;
              }
            };

            return 0;
          })
        })),
        fee: fees.map(id => ({
          money: idRes?.map((a) => {
            for (let i = 0; i <= a?.detailData?.length; i++) {
              if (a.feeId === id.id && a?.detailData[i]?.month === p?.date?.slice(0, 7)) {
                return {
                  money: a?.detailData[i]?.fee[0]?.money || 0,
                  feeId: a?.detailData[i]?.fee[0]?.fee_id || null,
                  fee_name: a?.detailData[i]?.fee[0]?.fee_name || null,
                };
              }
            }
          })
        })),
      }))
      
    :
    dataYear[0]?.changeParameter?.changeParameterDetail?.map((p) =>
    (
      {
        date: p?.date,
        fees: fees.map(id => ({
          money: idRes?.map((a) => {
            for (let i = 0; i <= a?.detailData?.length; i++) {
              if (a.feeId === id.id && a?.detailData[i]?.month === p?.date?.slice(0, 7)) {
                return a?.detailData[i]?.fee[0]?.money || 0;
              }
            }
            return 0;
          })
        })),
        fee: fees.map(id => ({
          money: idRes?.map((a) => {
            for (let i = 0; i <= a?.detailData?.length; i++) {
              if (a.feeId === id.id && a?.detailData[i]?.month === p?.date?.slice(0, 7)) {
                return {
                  money: a?.detailData[i]?.fee[0]?.money || 0,
                  feeId: a?.detailData[i]?.fee[0]?.fee_id || null,
                  fee_name: a?.detailData[i]?.fee[0]?.fee_name || null,
                };
              }
            }
          })
        })),
      }));





  useEffect(() => {
    dispatch({
      type: 'fees/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    dispatch({
      type: 'paymentMethod/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
  }, []);

  useEffect(() => {
    if (params?.id) {
      dispatch({
        type: 'fees/GET_DATA',
        payload: {
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.SIZEMAX,
        },
      });
      dispatch({
        type: 'paymentMethod/GET_DATA',
        payload: {
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.SIZEMAX,
        },
      });
    }
  }, [params?.id]);

  const total = (index) => {
    var table = document.getElementById("table"), sumVal = 0;
    for (let i = 1; i < fees?.length; i++) {
        const a = table?.rows[index]?.cells[i]?.innerHTML;
        const b = a?.replace(/,/g, "");
        sumVal = sumVal + parseFloat(b);
    }
    return sumVal?.toLocaleString();
};


const row = (index) => {
    var table = document.getElementById("table"), sumVal = 0;
    for (let i = 1; i < data?.length + 1; i++) {
        const a = table?.rows[i]?.cells[index]?.innerHTML;
        const b = a?.replace(/,/g, "");
        sumVal = sumVal + parseFloat(b);
    }
    return sumVal?.toLocaleString();
};

  const hanDleChangeText = (childData) => {
    setIdRes(childData);
  };

  const tabs = () => [
    {
      id: 'tuition',
      name: 'CÁC KHOẢN HỌC PHÍ',
      component: (
        <TypeFees
          tuition={tuition}
          setTuition={setTuition}
          error={errorTable?.tuition}
          checkValidate={checkValidate}
          details={details}
          hanDleChangeText={hanDleChangeText}
        />
      ),
    },
    {
      id: 'food',
      name: 'DỰ KIẾN PHẢI THU',
      component: (
        <>
          <ScrollContainer hideScrollbars={false}>
            <table className={stylesModule['table-container']} id="table" >
              <thead>
                <tr>
                  <th scope="col" className={stylesModule['table-top']}>Tháng</th>
                  {fees.map(i => <th scope="col" className={stylesModule['table-top']}>{i.name}</th>)}
                  <th scope="col" className={stylesModule['table-top']} >Ngoài giờ(đ) </th>
                  <th scope="col" className={stylesModule['table-top']}>Giảm trừ(đ)</th>
                  <th scope="col" className={stylesModule['table-top']} style={{ background: '#eef0f4' }}>Tổng tiền(đ)</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((i, index) =>
                  <tr>
                    <td className={stylesModule['table-content']}>{Helper.getDate(i?.date, variables.DATE_FORMAT.DATE_MONTH)}</td>
                    {i?.fees?.map(item => <td className={stylesModule['table-content']}> {(item?.money?.filter((str) => { return str != '0' })).length > 0
                      ? Helper?.getPrice(item?.money?.filter((str) => { return str != '0' }), 0, true) : '0'}</td>)}
                    <td className={stylesModule['table-content']}>-</td>
                    <td className={stylesModule['table-content']}>-</td>
                    <td className={stylesModule['table-content']}> {total(index + 1)}</td>
                  </tr>
                )}
                <tr>
                  <td className={stylesModule['table-footer']} />
                  {fees?.map((i, index) =>
                    <td className={stylesModule['table-footer']}>{row(index + 1)}</td>
                  )}
                  <td className={stylesModule['table-footer']} />
                  <td className={stylesModule['table-footer']} />
                  <td className={stylesModule['table-footer']} style={{ background: '#fff1eb' }} >{total(data?.length + 1)}</td>
                </tr>
              </tbody>
            </table>
          </ScrollContainer>
        </>
      ),
    },
  ];

  const onFinish = (values) => {
    const errorTuition = checkValidate(tuition, 'tuition');
    if (errorTuition) {
      return;
    }
    const payload = {
      schoolYearId: values?.schoolYearId || undefined,
      studentId: values?.studentId || undefined,
      expectedToCollectMoney: data || undefined,
      tuition,
      id: (params?.id && !isCopy) ? params?.id : undefined,
      dayAdmission: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: moment(details?.dayAdmission, variables.DATE_FORMAT.DATE_VI),
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    };
    dispatch({
      type: (params?.id && !isCopy) ? 'oldStudentAdd/UPDATE' : 'oldStudentAdd/ADD',
      payload,
      callback: (res) => {
        if (res) {
          history.goBack();
        }
      },
    });
  };

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title={(params?.id && !isCopy) ? 'Chi tiết' : 'Thêm mới'} />
      <Breadcrumbs className="pb30 pt0" last={`${(params?.id && !isCopy) ? 'Chi tiết' : 'Thêm mới'}`} menu={menuLeftFeePolicy} />
      <Pane className="row justify-content-center">
        <Pane className="col-lg-12">
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{ type: 'newStudent' }}
          >
            <Pane className="card">
              <Pane className="p20">
                <Heading type="form-title" className="mb20">
                  Thông tin chung
                </Heading>
              </Pane>
              <Pane className="p20 border-top">
                <div className="row">
                  <div className="col-lg-3">
                    <FormItem
                      label="Năm học"
                      name="schoolYearId"
                      data={yearsSchool.map(item => ({ ...item, name: `${item?.yearFrom} - ${item?.yearTo}` }))}
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY]}
                      onChange={changeYear}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label htmlFor="" className="mb5 font-size-13" >Thời gian hiệu lực</label>
                    <p className="mb0 font-size-13 mt10 font-weight-bold"> {details?.startDate ? `${details?.startDate} - ${details?.endDate}` : ''}</p>
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="Ngày nhập học"
                      name="dayAdmission"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                      allowClear={false}
                      onChange={chgangeDayAdmission}
                      disabledDate={(current) => details?.startDate && current < moment(details?.startDate, variables.DATE_FORMAT.DATE_VI).startOf('day')
                        || details?.endDate && current >= moment(details.endDate, variables.DATE_FORMAT.DATE_VI).endOf('day')
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3">
                    <FormItem
                      label="Tên học sinh"
                      name="studentId"
                      data={loading['oldStudentAdd/GET_STUDENTS'] ? [] : students.map(item => ({ ...item, name: item?.fullName || '-' }))}
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY]}
                      onChange={changeStudent}
                      onSearch={onSearch}
                      notFoundContent={loading['oldStudentAdd/GET_STUDENTS'] ? <Spin size="small" /> : null}
                      filterOption
                    />
                  </div>
                  <div className="col-lg-9">
                    <div className="row">
                      <div className="col-lg-3">
                        <label htmlFor="" className="mb5 font-size-13" >Mã học sinh</label>
                        <p className="mb0 font-size-13 mt10 font-weight-bold">{details?.code || ''}</p>
                      </div>
                      <div className="col-lg-3">
                        <label htmlFor="" className="mb5 font-size-13" >Cơ sở</label>
                        <p className="mb0 font-size-13 mt10 font-weight-bold">{details?.branchName || ''}</p>
                      </div>
                      <div className="col-lg-3">
                        <label htmlFor="" className={`mb5 font-size-13 ${details?.code && !details?.classTypeId ? 'text-danger' : ''}`} >Khối lớp</label>
                        <p className="mb0 font-size-13 mt10 font-weight-bold">{details?.classType || ''}</p>
                      </div>
                      <div className="col-lg-3">
                        <label htmlFor="" className="mb5 font-size-13" >Lớp</label>
                        <p className="mb0 font-size-13 mt10 font-weight-bold">{details?.className || ''}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Pane>
            </Pane>
            <Pane className="card pb20">
              <Heading type="form-title" className="heading-tab p20">
                Các khoản học phí <span className="text-danger">*</span>
              </Heading>
              <Tabs onChange={changeTab} activeKey={tab} className="test-12 p20">
                {tabs().map(({ id, name, component }) => (
                  <TabPane
                    tab={<span className={errorTable[id] ? 'text-danger' : ''}>{name}</span>}
                    key={id}
                  >
                    {component}
                  </TabPane>
                ))}
              </Tabs>
            </Pane>
            <Pane className="p20 d-flex justify-content-between align-items-center">
              <Button
                className="ml-auto px25"
                color="success"
                htmlType="submit"
                size="large"
                loading={loading['oldStudentAdd/ADD'] || loading['oldStudentAdd/UPDATE']}
                disabled={!details?.classTypeId || !details?.schoolYearId}
              >
                Lưu
              </Button>
            </Pane>
          </Form>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;