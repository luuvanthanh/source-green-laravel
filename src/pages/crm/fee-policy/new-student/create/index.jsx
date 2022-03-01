import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Tabs } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import _, { isEmpty } from 'lodash';
import moment from 'moment';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';

import Loading from '@/components/CommonComponent/Loading';
import TypeFees from './typeFees';

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
  const { loading, menuLeftCRM, yearsSchool, classes, students } = useSelector(
    ({ loading, menu, CRMnewStudentAdd }) => ({
      loading: loading.effects,
      menuLeftCRM: menu.menuLeftCRM,
      yearsSchool: CRMnewStudentAdd.yearsSchool,
      classes: CRMnewStudentAdd.classes,
      students: CRMnewStudentAdd.students,
    }),
  );
  const [tab, setTab] = useState('tuition');
  const [details, setDetails] = useState();
  const dispatch = useDispatch();
  const history = useHistory();
  const formRef = useRef();
  const type = formRef?.current?.getFieldValue('type');

  const [tuition, setTuition] = useState([]);
  const [errorTable, setErrorTable] = useState({
    tuition: false,
  });
  const [addFees, setAddFees] = useState(false);
  const [disableday_admission, setDisableday_admission] = useState({
    start_date: null,
    end_date: null,
  });

  useEffect(() => {
    dispatch({
      type: 'CRMnewStudentAdd/GET_YEARS',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    dispatch({
      type: 'CRMnewStudentAdd/GET_CLASS',
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
    if (params.id) {
      dispatch({
        type: 'CRMnewStudentAdd/GET_DETAILS',
        payload: {
          ...params,
        },
        callback: (res) => {
          if (res?.id) {
            const pather = res?.admissionRegister?.parentInfo?.find(i => i.sex === "MALE");
            const mother = res?.admissionRegister?.parentInfo?.find(i => i.sex === "FEMALE");
            const range_date = Helper.getDateRank(
              res?.schoolYear?.start_date,
              res?.schoolYear?.end_date,
              variables.DATE_FORMAT.DATE_VI,
            );
            setDetails(res);
            // if(res?.studentInfo){
            //   formRef.current.setFieldsValue({
            //     ...res,
            //     range_date,
            //     date_of_birth: moment(res.date_of_birth, variables.DATE_FORMAT.YEAR_MONTH_DAY),
            //     day_admission: moment(res.day_admission, variables.DATE_FORMAT.YEAR_MONTH_DAY),
            //     type: 'newStudent',
            //   });
            // }
            formRef.current.setFieldsValue({
              ...res,
              range_date,
              age: res?.studentInfo?.age_month || res?.age,
              name_student: res?.studentInfo?.full_name || res?.name_student,
              date_of_birth: moment(res?.studentInfo?.birth_date || res?.date_of_birth, variables.DATE_FORMAT.YEAR_MONTH_DAY),
              day_admission: moment(res.day_admission, variables.DATE_FORMAT.YEAR_MONTH_DAY),
              father_name: pather?.full_name || res?.father_name,
              father_phone: pather?.phone || res?.father_phone,
              mother_name: mother?.full_name || res?.mother_name,
              mother_phone: mother?.phone || res?.mother_phone,
              type: 'newStudent',
            });
            setTuition(
              res?.tuition?.map((item) => ({
                id: item.id,
                fee_id: item.fee_id || '',
                payment_form_id: item.payment_form_id || '',
                money: item.money || 0,
              })),
            );
            setAddFees(true);
          }
        },
      });
    }
  }, []);

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
    const errorTuition = checkValidate(tuition, 'tuition');
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
      tuition,
      id: params?.id || undefined,
      student_info_id: response?.student_info_id,
    };
    dispatch({
      type: params?.id ? 'CRMnewStudentAdd/UPDATE' : 'CRMnewStudentAdd/ADD',
      payload,
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

  const getMoney = (school_year_id, class_type_id, day_admission, tuition) => {
    if (_.isEmpty(tuition)) {
      return;
    }
    const newTuition = [...tuition]
      .filter((obj) => obj?.payment_form_id && obj?.fee_id)
      .map((item) => ({
        id: item.id,
        money: item.money,
        fee_id: item.fee_id,
        payment_form_id: item.payment_form_id,
      }));
    dispatch({
      type: 'newStudentAdd/GET_MONEY_FEE_POLICIES',
      payload: {
        details: JSON.stringify(newTuition),
        class_type_id,
        school_year_id,
        day_admission: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: day_admission,
          }),
          format: variables.DATE_FORMAT.DATE_AFTER,
          isUTC: false,
        }),
        student: 'new',
      },
      callback: (res) => {
        if (!_.isEmpty(res)) {
          setTuition(res);
        }
      },
    });
  };

  const loadTableFees = (value, name) => {
    const { getFieldsValue, setFieldsValue } = formRef?.current;
    const { school_year_id, class_type_id, day_admission } = getFieldsValue();
    if (school_year_id && class_type_id && day_admission) {
      getMoney(school_year_id, class_type_id, day_admission, tuition);
      setAddFees(true);
    } else {
      setAddFees(false);
    }
    if (name === 'school_year_id') {
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
      setFieldsValue({ day_admission: '', range_date });
    }
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
    const pather = response?.parentInfo?.find(i => i?.sex === "MALE");
    const mother = response?.parentInfo?.find(i => i?.sex === "FEMALE");
    if (response?.id) {
      const range_date = Helper.getDateRank(
        response?.schoolYear?.start_date,
        response?.schoolYear?.end_date,
        variables.DATE_FORMAT.DATE_VI,
      );
      formRef.current.setFieldsValue({
        ...response,
        range_date,
        id: response.id,
        age: response.studentInfo?.age_month,
        father_name: pather?.full_name,
        father_phone: pather?.phone,
        mother_name: mother?.full_name,
        mother_phone: mother?.phone,
        date_of_birth: moment(response.studentInfo.birth_date, variables.DATE_FORMAT.YEAR_MONTH_DAY),
        // day_admission: moment(response.studentInfo.day_admission, variables.DATE_FORMAT.YEAR_MONTH_DAY),
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
          addFees={addFees}
          formRef={formRef}
        />
      ),
    },
    // {
    //   id: 'food',
    //   name: 'DỰ KIẾN PHẢI THU',
    //   component: (
    //     <Expected
    //       tuition={tuition}
    //       idYear={idYear}
    //       yearsSchool={yearsSchool}
    //       setTuition={setTuition}
    //       error={errorTable?.tuition}
    //       checkValidate={checkValidate}
    //       idRes={idRes}
    //       YearsDetail={YearsDetail}
    //     />
    //   ),
    // },
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
                        {
                          details?.student_info_id ?
                            <FormItem
                            className="input-noborder"
                            label="Họ tên học sinh"
                            name="name_student"
                            type={variables.INPUT}
                            placeholder="Họ và tên"
                            /> :
                            <>  {type === 'newStudent' ? (
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
                                  name: item?.studentInfo?.full_name || '-',
                                }))}
                                rules={[variables.RULES.EMPTY]}
                                onChange={selectStudent}
                              />
                            )} </>
                        }
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
                          className={type === 'oldStudent' ||  details?.student_info_id ? 'input-noborder' : ''}
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
                          label="Ngày nhập học"
                          name="day_admission"
                          type={variables.DATE_PICKER}
                          rules={[variables.RULES.EMPTY]}
                          allowClear={false}
                          onChange={loadTableFees}
                          disabledDate={(current) =>
                            (disableday_admission?.start_date &&
                              current < moment(disableday_admission?.start_date).startOf('day')) ||
                            (disableday_admission?.end_date &&
                              current >= moment(disableday_admission.end_date).endOf('day'))
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          label="Lớp học dự kiến"
                          name="class_type_id"
                          data={classes}
                          type={variables.SELECT}
                          rules={[variables.RULES.EMPTY]}
                          onChange={loadTableFees}
                        />
                      </div>
                      {
                        type !== 'newStudent' || details?.student_info_id ?

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
                          </> :
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
                      }
                    </div>
                  </Pane>
                </Loading>
              </Pane>
              <Pane className="card pb20">
                <Heading type="form-title" className="heading-tab p20">
                  Các khoản học phí <span className="text-danger">*</span>
                </Heading>
                {/* <TypeFees
                  tuition={tuition}
                  setTuition={setTuition}
                  error={errorTable?.tuition}
                  checkValidate={checkValidate}
                  addFees={addFees}
                  formRef={formRef}
                /> */}
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
