import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Tabs, Table } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import _, { isEmpty } from 'lodash';
import moment from 'moment';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';

import Loading from '@/components/CommonComponent/Loading';
import TypeFees from './typeFees';
import stylesModule from '../styles.module.scss';

const { TabPane } = Tabs;
const radios = [
  {
    value: 'newStudent',
    label: 'Học sinh mới',
  },
  {
    value: 'oldStudent',
    label: 'Học sinh có sẵn',
  },
];

const Index = memo(() => {
  const params = useParams();
  const {
    loading,
    menuLeftCRM,
    yearsSchool,
    classes,
    students,
    branches,
    fees,
    detailsData,
  } = useSelector(({ loading, menu, CRMnewStudentAdd }) => ({
    loading: loading.effects,
    menuLeftCRM: menu.menuLeftCRM,
    detailsData: CRMnewStudentAdd.details,
    yearsSchool: CRMnewStudentAdd.yearsSchool,
    classes: CRMnewStudentAdd.classes,
    students: CRMnewStudentAdd.students,
    branches: CRMnewStudentAdd.branches,
    fees: CRMnewStudentAdd.fees,
  }));
  const [tab, setTab] = useState('tuition');
  const [details, setDetails] = useState({
    school_year_id: undefined,
    day_admission: undefined,
    class_type_id: undefined,
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const formRef = useRef();
  const type = formRef?.current?.getFieldValue('type');

  const [tuition, setTuition] = useState([]);
  const [idRes, setIdRes] = useState();
  const [dataTuition, setDataTuition] = useState([]);
  const [checkSearch, setCheckSearch] = useState(false);
  const [data, setData] = useState([]);

  const [checkData, setCheckData] = useState(true);

  const [errorTable, setErrorTable] = useState({
    tuition: false,
  });
  const [disableday_admission, setDisableday_admission] = useState({
    start_date: null,
    end_date: null,
  });

  useEffect(() => {
    dispatch({
      type: 'CRMnewStudentAdd/GET_FEES',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    dispatch({
      type: 'CRMnewStudentAdd/GET_YEARS',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    dispatch({
      type: 'CRMnewStudentAdd/GET_STUDENTS',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    dispatch({
      type: 'CRMnewStudentAdd/GET_BRANCHES',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
  }, []);

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


  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'CRMnewStudentAdd/GET_CLASS',
        payload: {
          branchId: detailsData?.branch?.branch_id_hrm,
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.SIZEMAX,
        },
      });
      dispatch({
        type: 'CRMnewStudentAdd/GET_DETAILS',
        payload: {
          ...params,
        },
        callback: (res) => {
          if (res?.id) {
            setCheckData(false);
            setTuition(res?.tuition);
            setIdRes(res?.expected_to_collect_money);
            const pather = res?.admissionRegister?.parentInfo?.find((i) => i.sex === 'MALE');
            const mother = res?.admissionRegister?.parentInfo?.find((i) => i.sex === 'FEMALE');
            const range_date = Helper.getDateRank(
              res?.schoolYear?.start_date,
              res?.schoolYear?.end_date,
              variables.DATE_FORMAT.DATE_VI,
            );
            setDetails((prev) => ({
              ...prev,
              startDate: res?.schoolYear?.startDate
                ? Helper.getDate(res?.schoolYear?.startDate, variables.DATE_FORMAT.DATE_VI)
                : '',
              endDate: res?.schoolYear?.endDate
                ? Helper.getDate(res?.schoolYear?.endDate, variables.DATE_FORMAT.DATE_VI)
                : '',
              school_year_id: res?.school_year_id || '',
              day_admission: res?.day_admission
                ? Helper.getDate(res?.day_admission, variables.DATE_FORMAT.DATE_VI)
                : '',
              code: res?.student?.code || '',
              branch_id: res?.student?.classStudent?.class?.branch?.name || '',
              classType: res?.student?.classStudent?.class?.classType?.name || '',
              className: res?.student?.classStudent?.class?.name || '',
              class_type_id: res?.class_type_id || '',
              student_info_id: res?.student_info_id,
              expectedToCollectMoney: res?.expectedToCollectMoney || [],
            }));
            formRef.current.setFieldsValue({
              ...res,
              range_date,
              age: res?.studentInfo?.age_month || res?.age,
              name_student: res?.studentInfo?.full_name ? `${res?.studentInfo?.full_name} (${res?.studentInfo?.customerLead?.full_name})` : res?.name_student,
              date_of_birth: moment(
                res?.studentInfo?.birth_date || res?.date_of_birth,
                variables.DATE_FORMAT.YEAR_MONTH_DAY,
              ),
              day_admission: moment(res.day_admission, variables.DATE_FORMAT.YEAR_MONTH_DAY),
              father_name: pather?.full_name || res?.father_name,
              father_phone: pather?.phone || res?.father_phone,
              mother_name: mother?.full_name || res?.mother_name,
              mother_phone: mother?.phone || res?.mother_phone,
              branch_id: res?.branch_id,
              branch: res?.branch?.name,
              type: 'newStudent',
            });
          }
        },
      });
    }
  }, [params.id]);


  const checkProperties = (object) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in object) {
      if (object[key] === '' || object[key] === null) return true;
    }
    return false;
  };

  const checkValidate = (data, name) => {
    const pass = !_.isEmpty(data) ? data.find((item) => !!checkProperties(item)) : true;
    setErrorTable((prev) => ({
      ...prev,
      [name]: !!pass,
    }));
    return pass;
  };

  const onFinish = (values) => {
    const errorTuition = checkValidate(idRes, 'tuition');
    if (errorTuition) {
      return;
    }
    const response = students.find((item) => item.id === values?.name_student);
    const payload = {
      ...values,
      date_of_birth: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: moment(values.date_of_birth, variables.DATE_FORMAT.DATE_AFTER),
        }),
        format: variables.DATE_FORMAT.DATE_TIME_UTC,
        isUTC: false,
      }),
      day_admission: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: values.day_admission,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      tuition: dataTuition?.map((i) => ({
        fee_id: i?.feeId,
        payment_form_id: i?.paymentFormId,
        money: i?.money,
      })),
      branch_id: details?.branch_id?.id ? details?.branch_id?.id : values?.branch_id,
      expected_to_collect_money: data || undefined,
      id: params?.id || undefined,
    };
    dispatch({
      type: params?.id ? 'CRMnewStudentAdd/UPDATE' : 'CRMnewStudentAdd/ADD',
      payload: params?.id && !details?.student_info_id ?
        { ...payload } :
        { ...payload, student_info_id: response?.student_info_id },
      callback: (res) => {
        if (res) {
          history.goBack();
        }
      },
    });
  };

  const onFinishFailed = ({ errorFields }) => {
    if (errorFields) {
      checkValidate(tuition, 'tuition');
    }
  };

  const loadTableFees = (value, name) => {
    setCheckSearch(true);
    if (name === 'day_admission') {
      const newDetails = {
        ...details,
        day_admission: value ? Helper.getDate(value, variables.DATE_FORMAT.DATE_VI) : '',
      };
      setDetails(newDetails);
    }
    if (name === 'class_type_id') {
      const newDetails = {
        ...details,
        class_type_id: value || '',
      };
      setDetails(newDetails);
    }
    const { setFieldsValue } = formRef?.current;
    if (name === 'school_year_id') {
      setIdRes([]);
      const response = yearsSchool.find((item) => item.id === value);
      if (response?.id) {
        const newDetails = {
          ...details,
          school_year_id: value,
        };
        setDetails(newDetails);
      }
      const schoolYear = yearsSchool.find((item) => item.id === value);
      setDisableday_admission((prev) => ({
        ...prev,
        start_date: schoolYear.start_date || null,
        end_date: schoolYear.end_date || null,
      }));
      const range_date = Helper.getDateRank(
        schoolYear?.start_date,
        schoolYear?.end_date,
        variables.DATE_FORMAT.DATE_VI,
      );
      setFieldsValue({ range_date });
    }
  };
  useEffect(() => {
    if (details.branch_id?.id) {
      dispatch({
        type: 'CRMnewStudentAdd/GET_CLASS',
        payload: {
          branchId: details?.branch_id?.branch_id_hrm,
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.SIZEMAX,
        },
      });
    }
  }, [details.branch_id?.id]);

  const onchangeBranches = (e) => {
    dispatch({
      type: 'CRMnewStudentAdd/GET_CLASS',
      payload: {
        branchId: e,
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
  };

  const getClassByAge = (age = 0) => {
    dispatch({
      type: 'CRMnewStudentAdd/GET_CLASS_BY_AGE',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE,
        age,
      },
      callback: (res) => {
        if (!_.isEmpty(res)) {
          formRef.current.setFieldsValue({
            class_type_id: res[0].id,
          });
          loadTableFees();
        }
      },
    });
  };

  const changeDate_of_birth = (date) => {
    if (!date) {
      return;
    }
    const age = moment().diff(date, 'months');
    getClassByAge(age);
    formRef.current.setFieldsValue({
      age,
    });
  };

  const s = (e) => {
    formRef.current.resetFields();
    setTuition([]);
    const { value } = e.target;
    formRef.current.setFieldsValue({
      type: value,
    });
    if (value === 'oldStudent') {
      dispatch({
        type: 'CRMnewStudentAdd/GET_DATA',
        payload: {
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.SIZEMAX,
          orderBy: 'CreationTime',
          sortedBy: 'desc',
        },
      });
    }
  };

  const selectStudent = (value) => {
    if (value && isEmpty(students)) {
      return;
    }
    const response = students.find((item) => item.id === value);
    const pather = response?.parentInfo?.find((i) => i?.sex === 'MALE');
    const mother = response?.parentInfo?.find((i) => i?.sex === 'FEMALE');
    if (response?.id) {
      const range_date = Helper.getDateRank(
        response?.schoolYear?.start_date,
        response?.schoolYear?.end_date,
        variables.DATE_FORMAT.DATE_VI,
      );
      setDetails((prev) => ({
        ...prev,
        day_admission: response.date_register
          ? Helper.getDate(response.date_register, variables.DATE_FORMAT.DATE_VI)
          : '',
        branch_id: response?.branch || '',
      }));
      formRef.current.setFieldsValue({
        ...response,
        range_date,
        id: response.id,
        age: response.studentInfo?.age_month,
        father_name: pather?.full_name,
        father_phone: pather?.phone,
        mother_name: mother?.full_name,
        mother_phone: mother?.phone,
        date_of_birth: moment(
          response.studentInfo.birth_date,
          variables.DATE_FORMAT.YEAR_MONTH_DAY,
        ),
        day_admission: moment(response.date_register, variables.DATE_FORMAT.YEAR_MONTH_DAY),
        branch_id: response?.branch?.branch_id_hrm,
        branch: response?.branch?.name,
        type,
      });
    }
    if (response.studentInfo.age_month) {
      getClassByAge(response?.studentInfo.age_month);
    }
  };

  const changeTab = (key) => {
    setTab(key);
  };

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
        money: i?.fee_id_crm === id ? e : i?.money,
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
    const rowData = dataTuition?.map((i) => ({
      title: dataTest(i),
      width: 150,
      key: 'money',
      render: (record) => {
        const item = record?.fee?.find(k => k?.fee_id === i?.fee_id_crm);
        const checkBus = fees.find(k => k?.id === i?.feeId);
        return (
          <>{
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
          }</>
        );
      },
    }));
    const columns = [
      {
        title: 'Tháng',
        key: 'date',
        className: 'min-width-150',
        width: 200,
        render: (record) => (
          <Text size="normal">{Helper.getDate(record.month, variables.DATE_FORMAT.DATE_MONTH)}</Text>
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
        render: (record) => <Text size="normal">{Helper.getPrice(record?.total_money_month) || 0}</Text>,
      },
    ];
    columns.splice(1, 0, ...rowData);
    return columns;
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
      fee_id_crm: k?.fee_id_crm,
    })
    )
  }));

  useEffect(() => {
    if (datas?.length > 0) {
      setData([...datas]);
    }
  }, [datas?.length, checkData]);


  const hanDleChangeText = (childData, k, data, deleteId) => {
    if (childData?.length > 0 || deleteId) {
      setCheckSearch(false);
      setIdRes(childData);
    }
    setDataTuition(data);
    setCheckData(k);
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
          {fees?.length > 0 && (
            <div className={stylesModule['wrapper-table']}>
              <Table
                columns={header()}
                dataSource={data}
                pagination={false}
                className="table-normal"
                isEmpty
                loading={loading['CRMnewStudentAdd/GET_MONEY_FEE']}
                childrenColumnName="children"
                params={{
                  header: header(),
                  type: 'table',
                }}
                bordered
                rowKey={(record) => record?.month}
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
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <Helmet title={params?.id ? 'Chi tiết' : 'Thêm mới'} />
      <Breadcrumbs last={`${params?.id ? 'Chi tiết' : 'Thêm mới'}`} menu={menuLeftCRM} />
      <Pane style={{ padding: 20, paddingBottom: 0, paddingTop: 0 }}>
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
                <Loading
                  loading={loading['CRMnewStudentAdd/GET_DETAILS']}
                  params={{ type: 'container' }}
                >
                  <Pane className="p20">
                    <Heading type="form-title" className={!params?.id ? 'mb20' : ''}>
                      Thông tin học sinh
                    </Heading>
                    {!params?.id && (
                      <FormItem
                        className="row-radio-auto mb0"
                        type={variables.RADIO}
                        data={radios}
                        rules={[variables.RULES.EMPTY]}
                        name="type"
                        onChange={s}
                      />
                    )}
                  </Pane>
                  <Pane className="p20 border-top">
                    <div className="row">
                      <div className="col-lg-3">
                        {details?.student_info_id && params?.id ? (
                          <FormItem
                            className="input-noborder"
                            label="Họ tên học sinh"
                            name="name_student"
                            type={variables.INPUT}
                            placeholder="Họ và tên"
                          />
                        ) : (
                          <>
                            {' '}
                            {type === 'newStudent' ? (
                              <FormItem
                                label="Tên học sinh"
                                name="name_student"
                                rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                                type={variables.INPUT}
                              />
                            ) : (
                              <FormItem
                                className="mb-0"
                                label="Tên học sinh"
                                name="name_student"
                                type={variables.SELECT}
                                placeholder="Chọn học sinh"
                                allowClear={false}
                                data={students.map((item) => ({
                                  ...item,
                                  name: `${item?.studentInfo?.full_name} (${item?.studentInfo?.customerLead?.full_name})` || '-',
                                }))}
                                rules={[variables.RULES.EMPTY]}
                                onChange={selectStudent}
                              />
                            )}{' '}
                          </>
                        )}
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          className="mb-0"
                          label="Năm học"
                          name="school_year_id"
                          type={variables.SELECT}
                          placeholder="Chọn năm"
                          allowClear={false}
                          data={yearsSchool.map((item) => ({
                            ...item,
                            name: `${item?.year_from} - ${item?.year_to}`,
                          }))}
                          rules={[variables.RULES.EMPTY]}
                          onChange={(e) => loadTableFees(e, 'school_year_id')}
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          className={
                            type === 'oldStudent' || details?.student_info_id
                              ? 'input-noborder'
                              : ''
                          }
                          label="Ngày sinh"
                          name="date_of_birth"
                          type={variables.DATE_PICKER}
                          rules={[variables.RULES.EMPTY]}
                          onChange={changeDate_of_birth}
                          allowClear={false}
                          disabledDate={(current) => current > moment().add(-1, 'day')}
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          className="input-noborder"
                          label="Tuổi (tháng)"
                          name="age"
                          rules={[variables.RULES.EMPTY]}
                          type={variables.INPUT}
                          placeholder="Tháng tuổi"
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          className="input-noborder"
                          label="Thời gian hiệu lực"
                          name="range_date"
                          rules={[variables.RULES.EMPTY]}
                          type={variables.INPUT}
                          placeholder="Từ ngày - Đến ngày"
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          className={
                            type === 'oldStudent' || details?.student_info_id
                              ? 'input-noborder'
                              : ''
                          }
                          label="Ngày nhập học"
                          name="day_admission"
                          type={variables.DATE_PICKER}
                          rules={[variables.RULES.EMPTY]}
                          allowClear={false}
                          onChange={(e) => loadTableFees(e, 'day_admission')}
                          disabledDate={(current) =>
                            (disableday_admission?.start_date &&
                              current < moment(disableday_admission?.start_date).startOf('day')) ||
                            (disableday_admission?.end_date &&
                              current >= moment(disableday_admission.end_date).endOf('day'))
                          }
                        />
                      </div>
                      {
                        type === 'oldStudent' || details?.student_info_id ?
                          <div className="col-lg-3">
                            <FormItem
                              className="input-noborder"
                              label="Cơ sở dự kiến"
                              name="branch"
                              type={variables.INPUT}
                              placeholder="Cơ sở dự kiến"
                            />
                          </div>
                          :
                          <div className="col-lg-3">
                            <FormItem
                              className={
                                type === 'oldStudent'
                                  ? 'input-noborder'
                                  : ''
                              }
                              options={['branch_id_hrm', 'name']}
                              label="Cơ sở dự kiến"
                              name="branch_id"
                              data={branches}
                              type={variables.SELECT}
                              rules={[variables.RULES.EMPTY]}
                              onChange={onchangeBranches}
                            />
                          </div>

                      }
                      <div className="col-lg-3">
                        <FormItem
                          options={['classTypeCrmId', 'name']}
                          label="Lớp học dự kiến"
                          name="class_type_id"
                          data={classes}
                          type={variables.SELECT}
                          rules={[variables.RULES.EMPTY]}
                          onChange={(e) => loadTableFees(e, 'class_type_id')}
                        />
                      </div>
                      {type !== 'newStudent' || details?.student_info_id ? (
                        <>
                          <div className="col-lg-3">
                            <FormItem
                              className="input-noborder"
                              label="Họ tên Cha"
                              name="father_name"
                              type={variables.INPUT}
                              placeholder="Họ và tên"
                            />
                          </div>
                          <div className="col-lg-3">
                            <FormItem
                              className="input-noborder"
                              label="SĐT Cha"
                              name="father_phone"
                              type={variables.INPUT}
                              placeholder="Số điện thoại"
                            />
                          </div>
                          <div className="col-lg-3">
                            <FormItem
                              className="input-noborder"
                              label="Họ tên Mẹ"
                              name="mother_name"
                              type={variables.INPUT}
                              placeholder="Họ và tên"
                            />
                          </div>
                          <div className="col-lg-3">
                            <FormItem
                              className="input-noborder"
                              label="SĐT Mẹ"
                              name="mother_phone"
                              type={variables.INPUT}
                              placeholder="Số điện thoại"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="col-lg-3">
                            <FormItem
                              label="Họ tên Cha"
                              name="father_name"
                              rules={[variables.RULES.MAX_LENGTH_INPUT]}
                              type={variables.INPUT}
                            />
                          </div>
                          <div className="col-lg-3">
                            <FormItem
                              label="SĐT Cha"
                              name="father_phone"
                              rules={[variables.RULES.PHONE]}
                              type={variables.INPUT}
                            />
                          </div>
                          <div className="col-lg-3">
                            <FormItem
                              label="Họ tên Mẹ"
                              name="mother_name"
                              rules={[variables.RULES.MAX_LENGTH_INPUT]}
                              type={variables.INPUT}
                            />
                          </div>
                          <div className="col-lg-3">
                            <FormItem
                              label="SĐT Mẹ"
                              name="mother_phone"
                              rules={[variables.RULES.PHONE]}
                              type={variables.INPUT}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </Pane>
                </Loading>
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
                  loading={loading['CRMnewStudentAdd/ADD'] || loading['CRMnewStudentAdd/UPDATE']}
                >
                  Lưu
                </Button>
              </Pane>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
