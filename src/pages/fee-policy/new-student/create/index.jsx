import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
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

import TypeFees from './typeFees';

const radios = [
  {
    value: 'newStudent',
    label: 'Học sinh mới'
  },
  {
    value: 'oldStudent',
    label: 'Học sinh có sẵn'
  }
];

const Index = memo(() => {
  const params = useParams();
  const {
    loading,
    menuLeftFeePolicy,
    yearsSchool,
    classes,
    students,
  } = useSelector(({ loading, menu, schoolYear, classType, newStudentAdd }) => ({
    loading: loading.effects,
    menuLeftFeePolicy: menu.menuLeftFeePolicy,
    yearsSchool: schoolYear.data,
    classes: classType.data,
    students: newStudentAdd.students
  }));

  const dispatch = useDispatch();

  const history = useHistory();
  const formRef = useRef();
  const type = formRef?.current?.getFieldValue('type');

  const [tuition, setTuition] = useState([]);
  const [errorTable, setErrorTable] = useState({
    tuition: false,
  });
  const [addFees, setAddFees] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'schoolYear/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    dispatch({
      type: 'classType/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    if (params.id) {
      dispatch({
        type: 'newStudentAdd/GET_DETAILS',
        payload: {
          ...params
        },
        callback: (res) => {
          if (res?.id) {
            formRef.current.setFieldsValue({
              ...res,
              dateOfBirth: moment(res.dateOfBirth, variables.DATE_FORMAT.YEAR_MONTH_DAY),
              dayAdmission: moment(res.dayAdmission, variables.DATE_FORMAT.YEAR_MONTH_DAY),
              type: 'newStudent'
            });
            setTuition(res?.tuition?.map(item => ({
              id: item.id,
              feeId: item.feeId || '',
              paymentFormId: item.paymentFormId || '',
              money: item.money || 0,
            })));
          }
        },
      });
    }
  }, []);

  const remove = () => {
    formRef.current.resetFields();
    setTuition([]);
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

  const onFinish = (values) => {
    const errorTuition = checkValidate(tuition, 'tuition');
    if(errorTuition) {
      return;
    }
    const payload = {
      ...values,
      dateOfBirth: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: moment(values.dateOfBirth, variables.DATE_FORMAT.DATE_AFTER),
        }),
        format: variables.DATE_FORMAT.DATE_TIME_UTC,
        isUTC: false,
      }),
      dayAdmission: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: moment(values.dayAdmission, variables.DATE_FORMAT.DATE_AFTER),
        }),
        format: variables.DATE_FORMAT.DATE_TIME_UTC,
        isUTC: false,
      }),
      tuition,
      id: params?.id || undefined,
    };
    dispatch({
      type: params?.id ? 'newStudentAdd/UPDATE' : 'newStudentAdd/ADD',
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

  const loadTableFees = () => {
    const { getFieldsValue } = formRef?.current;
    const { schoolYearId, classTypeId, dayAdmission } = getFieldsValue();
    if (schoolYearId && classTypeId && dayAdmission) {
      setAddFees(true);
    } else {
      setAddFees(false);
    }
    setTuition([]);
  };

  const changeDateOfBirth = (date) => {
    if (!date) {
      return;
    }
    const age = (Math.round( moment().diff(date, 'months', true) * 100 ) / 100).toFixed(0);
    dispatch({
      type: 'classType/GET_CLASS_BY_AGE',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE,
        age,
      },
      callback: (res) => {
        if (!_.isEmpty(res)) {
          formRef.current.setFieldsValue({
            classTypeId: res[0].id,
          });
          loadTableFees();
        }
      },
    });
    formRef.current.setFieldsValue({
      age,
    });
  };

  const changeTab = (e) => {
    formRef.current.resetFields();
    setTuition([]);
    const { value } = e.target;
    formRef.current.setFieldsValue({
      type: value,
    });
    dispatch({
      type: 'newStudentAdd/GET_STUDENTS',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
  };

  const selectStudent = (value) => {
    if (value && isEmpty(students)) {
      return;
    }
    const response = students.find(item => item.id === value);
    if (response?.id) {
      formRef.current.setFieldsValue({
        ...response,
        dateOfBirth: moment(response.dateOfBirth, variables.DATE_FORMAT.YEAR_MONTH_DAY),
        dayAdmission: moment(response.dayAdmission, variables.DATE_FORMAT.YEAR_MONTH_DAY),
        type,
      });
    }
  };

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title={params?.id ? 'Chi tiết' : 'Thêm mới'} />
      <Breadcrumbs className="pb30 pt0" last={`${params?.id ? 'Chi tiết' : 'Thêm mới'}`} menu={menuLeftFeePolicy} />
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
                <Heading type="form-title" className={!params?.id ? "mb20" : ''}>
                  Thông tin học sinh
                </Heading>
                {!params?.id && (
                  <FormItem
                    className="row-radio-auto mb0"
                    type={variables.RADIO}
                    data={radios}
                    rules={[variables.RULES.EMPTY]}
                    name="type"
                    onChange={changeTab}
                  />
                )}
              </Pane>
              <Pane className="p20 border-top">
                <div className="row">
                  <div className="col-lg-3">
                    {type === 'newStudent' ? (
                      <FormItem
                        label="Tên học sinh"
                        name="nameStudent"
                        rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                        type={variables.INPUT}
                      />
                    ) : (
                      <FormItem
                        className="mb-0"
                        label="Tên học sinh"
                        name="nameStudent"
                        type={variables.SELECT}
                        placeholder="Chọn học sinh"
                        allowClear={false}
                        data={students.map(item => ({ ...item, name: item?.nameStudent || '-' }))}
                        rules={[variables.RULES.EMPTY]}
                        onChange={selectStudent}
                      />
                    )}

                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      className="mb-0"
                      label="Năm học"
                      name="schoolYearId"
                      type={variables.SELECT}
                      placeholder="Chọn năm"
                      allowClear={false}
                      data={yearsSchool.map(item => ({ ...item, name: `${item?.yearFrom} - ${item?.yearTo}`}))}
                      rules={[variables.RULES.EMPTY]}
                      onChange={loadTableFees}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      className={type === 'oldStudent' ? 'input-noborder' : ''}
                      label="Ngày sinh"
                      name="dateOfBirth"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                      onChange={changeDateOfBirth}
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
                      className={type === 'oldStudent' ? 'input-noborder' : ''}
                      label="Ngày nhập học"
                      name="dayAdmission"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                      allowClear={false}
                      onChange={loadTableFees}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="Lớp học dự kiến"
                      name="classTypeId"
                      data={classes}
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY]}
                      onChange={loadTableFees}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="Họ tên Cha"
                      name="fatherName"
                      rules={[variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="SĐT Cha"
                      name="fatherPhoneNumber"
                      rules={[variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="Họ tên Mẹ"
                      name="motherName"
                      rules={[variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="SĐT Mẹ"
                      name="motherPhoneNumber"
                      rules={[variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                </div>
              </Pane>
            </Pane>
            <Pane className="card pb20">
              <Heading type="form-title" className="heading-tab p20">
                Các khoản học phí
              </Heading>
              <TypeFees
                tuition={tuition}
                setTuition={setTuition}
                error={errorTable?.tuition}
                checkValidate={checkValidate}
                addFees={addFees}
                formRef={formRef}
              />
            </Pane>
            <Pane className="p20 d-flex justify-content-between align-items-center">
              <p className="btn-delete" role="presentation" onClick={remove}>
                Hủy
              </p>
              <Button
                className="ml-auto px25"
                color="success"
                htmlType="submit"
                size="large"
                loading={loading['newStudentAdd/ADD'] || loading['newStudentAdd/UPDATE']}
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
