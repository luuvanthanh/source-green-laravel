import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Tabs, Table } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import moment from 'moment';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
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

  const [idRes, setIdRes] = useState();
  const [dataTuition, setDataTuition] = useState([]);

  const [checkSearch, setCheckSearch] = useState(false);

  const [checkData, setCheckData] = useState(true);
  const [errorTable, setErrorTable] = useState({
    tuition: false,
  });
  const [data, setData] = useState([]);

  const [details, setDetails] = useState({
    schoolYearId: '',
    startDate: '',
    endDate: '',
    dayAdmission: '',
    code: '',
    branchName: '',
    branchId: "",
    classType: '',
    className: '',
    classTypeId: '',
    expectedToCollectMoney: [],
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
            setCheckData(false);
            setIdRes(res?.expectedToCollectMoney);
            getStudents(res?.student?.code);
            setTuition(res?.tuition);
            setDetails((prev) => ({
              ...prev,
              chargeStudentIdCrm: res?.chargeStudentIdCrm,
              startDate: res?.schoolYear?.startDate ? Helper.getDate(res?.schoolYear?.startDate, variables.DATE_FORMAT.DATE_VI) : '',
              endDate: res?.schoolYear?.endDate ? Helper.getDate(res?.schoolYear?.endDate, variables.DATE_FORMAT.DATE_VI) : '',
              schoolYearId: res?.schoolYearId || '',
              dayAdmission: res?.dayAdmission ? Helper.getDate(res?.dayAdmission, variables.DATE_FORMAT.DATE_VI) : '',
              code: res?.student?.code || '',
              branchName: res?.student?.classStudent?.class?.branch?.name || '',
              classType: res?.student?.classStudent?.class?.classType?.name || '',
              className: res?.student?.classStudent?.class?.name || '',
              classTypeId: res?.student?.classStudent?.class?.classType?.id || '',
              expectedToCollectMoney: res?.expectedToCollectMoney || [],
              branchId: res?.student?.classStudent?.class?.branchId || '',
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

  const hanDleChangeText = (childData, k, data, deleteId) => {
    if (childData?.length > 0 || deleteId) {
      setIdRes(childData);
      setCheckSearch(false);
    }
    setDataTuition(data);
    setCheckData(k);

  };
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

  const changeYear = (value) => {
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
    }
  };

  const changeStudent = (value) => {
    setCheckSearch(true);
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
        branchId: student?.class?.branchId,
        branchName: student?.class?.branch?.name || '',
        classType: student?.class?.classType?.name || '',
        className: student?.class?.name || '',
        classTypeId: student?.class?.classType?.id || '',
      };
      setDetails(newDetails);
    }
  };

  const onFinishFailed = ({ errorFields }) => {
    if (errorFields) {
      checkValidate(tuition, 'tuition');
    }
  };

  const chgangeDayAdmission = (value) => {
    const newDetails = {
      ...details,
      dayAdmission: value ? Helper.getDate(value, variables.DATE_FORMAT.DATE_VI) : ''
    };
    setDetails(newDetails);
    setCheckSearch(true);
  };

  const changeTab = (key) => {
    setTab(key);
  };

  const sumArray = (e) => {
    let sum = 0;
    e?.map((value) => {
      sum += JSON.parse(value?.money);
    });
    return sum;
  };

  const sumArrayMain = (e) => {
    let sum = 0;
    e?.map((value) => {
      sum += value?.total_money_month;
    });
    return sum;
  };

  const sumItem = (e) => {
    const result = _(e)
      .groupBy('fee_id')
      .map((items, fee_id, _money) => ({ fee_id, money: sumArray(items) })).value();
    return result;
  };

  const flattenArr = (arr) => {
    let sum = [];
    _.forEachRight(arr, (value) => {
      sum = sum?.concat(value?.fee);
    });
    return sumItem(sum);
  };

  const datas = idRes?.map(i =>
  ({
    month: i?.month,
    total_money_month: sumArray(i?.fee),
    fee: i?.fee?.map(k =>
    ({
      money: k?.money,
      fee_name: k?.fee_name,
      fee_id: k?.fee_id,
    })
    )
  }));

  useEffect(() => {
    if (datas?.length > 0) {
      setData([...datas]);
    }
  }, [datas?.length, checkData]);

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

  const dataTest = (e) => {
    const data = fees.find(k => k?.id === e?.feeId);
    return data?.name;
  };


  const onChangeBus = (e, record, id) => {
    const dataItem = {
      month: record?.month,
      total_money_month: record?.total_money_month,
      fee: record?.fee?.map(i => ({
        ...i,
        money: i?.fee_id === id ? e : i?.money,
      }))
    };

    const a = data?.map(i => (
      {
        ...i,
        fee: i.month === dataItem?.month ? dataItem?.fee : i?.fee,
        total_money_month: i.month === dataItem?.month ? sumArray(dataItem?.fee) : i?.total_money_month
      }));
    return e > 0 ? setData(a) : "";
  };
  const header = () => {
    const rowData = dataTuition?.map(i => ({
      title: dataTest(i),
      width: 150,
      key: 'money',
      render: (record) => {
        const item = record?.fee?.find(k => k?.
          fee_id === i?.feeId);
        const checkBus = fees.find(k => k?.id === i?.feeId);
        return (
          <>
            {
              item?.fee_id && checkBus?.code === 'BUS' && item?.money > 0 && !item?.check ?
                <FormItem
                  className="mb-0"
                  type={variables.INPUT_NUMBER}
                  rules={[variables.RULES.EMPTY]}
                  value={item?.money}
                  onChange={(e) => onChangeBus(e, record, i?.feeId)}
                />
                :
                <Text size="normal">
                  {Helper.getPrice(item?.money) || 0}
                </Text>
            }
          </>
        );
      }
    }));
    const columns = [
      {
        title: 'Tháng',
        key: 'date',
        className: 'min-width-150',
        width: 200,
        render: (record) => (
          <Text size="normal">
            {Helper.getDate(record.month, variables.DATE_FORMAT.MONTH_YEAR)}
          </Text>
        ),
      },
      {
        title: 'Ngoài giờ (đ)',
        key: 'location',
        width: 150,
        className: 'min-width-150',
        render: () => <> - </>,
      },
      {
        title: 'Giảm trừ (đ)',
        key: 'result',
        width: 150,
        className: 'min-width-150',
        render: () => <> - </>,
      },
      {
        title: 'Tổng tiền (đ)',
        key: 'total',
        width: 150,
        className: 'min-width-150',
        render: (record) =>
          <Text size="normal">
            {Helper.getPrice(record?.total_money_month) || 0}
          </Text>
      },
    ];
    columns.splice(1, 0, ...rowData);
    return columns;
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
          checkSearch={checkSearch}
          hanDleChangeText={hanDleChangeText}
        />
      ),
    },
    {
      id: 'food',
      name: 'DỰ KIẾN PHẢI THU',
      component: (
        <>
          {
            fees?.length > 0 && (
              <div className={stylesModule['wrapper-table']}>
                <Table
                  columns={header()}
                  dataSource={data}
                  pagination={false}
                  className="table-normal"
                  isEmpty
                  loading={loading['oldStudentAdd/GET_MONEY_FEE_POLICIES']}
                  childrenColumnName="children"
                  params={{
                    header: header(),
                    type: 'table',
                  }}
                  bordered
                  rowKey={(record) => record?.id}
                  scroll={{ x: '100%' }}
                  summary={(pageData) => {
                    const total = sumArrayMain(pageData);
                    const moneyDetail = flattenArr(pageData);
                    return (
                      <>
                        <Table.Summary.Row>
                          <Table.Summary.Cell colSpan={1}>
                            <Text size="normal" style={{ fontWeight: 'bold' }}>
                              Tổng tiền
                            </Text>
                          </Table.Summary.Cell>
                          {
                            moneyDetail?.map(i =>
                            (<Table.Summary.Cell>
                              <Text size="normal" style={{ fontWeight: 'bold' }}>
                                {i?.money === 0 ? '0 đ' : Helper.getPrice(i?.money)}
                              </Text>
                            </Table.Summary.Cell>))
                          }
                          <Table.Summary.Cell>
                            <Text size="normal" style={{ fontWeight: 'bold' }}>
                              {Helper.getPrice("0")}
                            </Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Text size="normal" style={{ fontWeight: 'bold' }}>
                              {Helper.getPrice("0")}
                            </Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Text size="normal" style={{ fontWeight: 'bold' }}>
                              {total === 0 ? '0 đ' : Helper.getPrice(total)}
                            </Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </>
                    );
                  }}
                />
              </div>
            )
          }
        </>
      ),
    },
  ];
  const onFinish = (values) => {
    const payload = {
      schoolYearId: values?.schoolYearId || undefined,
      studentId: values?.studentId || undefined,
      expectedToCollectMoney: data || undefined,
      branchId: details?.branchId,
      classTypeId: details?.classTypeId,
      tuition: dataTuition,
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
            <Loading loading={loading['oldStudentAdd/GET_DETAILS']} >
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
                        className="mb-0"
                        label="Tên học sinh"
                        name="studentId"
                        type={variables.SELECT}
                        placeholder="Chọn học sinh"
                        allowClear={false}
                        data={loading['oldStudentAdd/GET_STUDENTS'] ? [] : students.map(item => ({ ...item, name: item?.fullName || '-' }))}
                        rules={[variables.RULES.EMPTY]}
                        onChange={changeStudent}
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
                {
                  !details?.chargeStudentIdCrm && (
                    <Button
                      className="ml-auto px25"
                      color="success"
                      htmlType="submit"
                      size="large"
                      loading={loading['oldStudentAdd/ADD'] || loading['old	StudentAdd/UPDATE']}
                      disabled={!details?.classTypeId || !details?.schoolYearId}
                    >
                      Lưu
                    </Button>
                  )
                }
              </Pane>
            </Loading>
          </Form>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
