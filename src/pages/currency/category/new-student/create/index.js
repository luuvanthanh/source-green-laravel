import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, Form, Radio } from 'antd';
import { useSelector, useDispatch } from 'dva';
import csx from 'classnames';
import moment from 'moment';
import { history, useParams } from 'umi';
import _ from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import FormItem from '@/components/CommonComponent/FormItem';
import commonStyles from '@/assets/styles/Common/common.scss';
import { variables, Helper } from '@/utils';
import variablesModules from '../utils/variables';

import TuitionTable from './tables/tuition';
import ExpectedTable from './tables/expected';

const { TabPane } = Tabs;

const { Item: FormItemAntd } = Form;
const { Group: RadioGroup } = Radio;

const Index = memo(() => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const params = useParams();

  const { menuLeftCurrency, yearsSchool } = useSelector(
    ({ loading, menu, currencyOldStudentAdd }) => ({
      loading: loading.effects,
      menuLeftCurrency: menu.menuLeftCurrency,
      yearsSchool: currencyOldStudentAdd?.data,
    }),
  );

  const [tab, setTab] = useState('tuition');
  const [showDetails, setShowDetails] = useState(false);
  const [feeDetail, setFeeDetail] = useState([
    {
      classTypeId: 'Tiền học phí',
      paymentFormId: 'NĂM',
    },
  ]);
  const [moneyMeal, setMoneyMeal] = useState([
    {
      id: 1,
      month: '08/2021',
      Tuition: '101.000.000',
      money: '12.605.000',
      english: '3.000.000',
      bus: '3.000.000',
      outTime: '-',
      Unless: '-',
      Total: '117.605.000',
    },
    {
      id: 2,
      month: '08/2021',
      Tuition: '101.000.000',
      money: '12.605.000',
      english: '3.000.000',
      bus: '3.000.000',
      outTime: '-',
      Unless: '-',
      Total: '117.605.000',
    },
    {
      id: 3,
      month: '08/2021',
      Tuition: '101.000.000',
      money: '12.605.000',
      english: '3.000.000',
      bus: '3.000.000',
      outTime: '-',
      Unless: '-',
      Total: '117.605.000',
    },
  ]);
  const [otherMoneyDetail] = useState([]);
  const [errorTable, setErrorTable] = useState({
    tuition: false,
    food: false,
    other: false,
  });

  useEffect(() => {
    dispatch({
      type: 'currencyOldStudentAdd/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    if (params?.id) {
      setShowDetails(true);
      dispatch({
        type: 'feePolicyPolicyAdd/GET_DETAILS',
        payload: {
          id: params?.id,
          include: Helper.convertIncludes(['currencyOldStudentAdd']),
        },
        callback: () => {
          // setFeeDetail(res?.feeDetail.map(item => ({...item, rangeDate: [moment(item?.applyStartTime), moment(item?.applyEndTime)]})));
          // setMoneyMeal(res?.moneyMeal);
          // (res?.otherMoneyDetail);
          // const timeToPay = [
          //   moment(res?.currencyOldStudentAdd?.startDate),
          //   moment(res?.currencyOldStudentAdd?.endDate)
          // ];
          // formRef?.current?.setFieldsValue({
          //   currencyOldStudentAddId: res?.currencyOldStudentAddId,
          //   decisionDate: res?.decisionDate ? moment(res?.decisionDate) : null,
          //   decisionNumber: res?.decisionNumber,
          //   timeToPay
          // });
        },
      });
    }
  }, []);

  const changeTab = (key) => {
    setTab(key);
  };

  const onChange = async (e, name) => {
    if (name === 'currencyOldStudentAddId') {
      const choolYearSelect = yearsSchool.find((item) => item?.id === e);
      await formRef?.current?.setFieldsValue({
        timeToPay: [moment(choolYearSelect?.startDate), moment(choolYearSelect?.endDate)],
      });
    }

    const { getFieldsValue } = formRef?.current;
    const { currencyOldStudentAddId, decisionDate, decisionNumber, timeToPay } = getFieldsValue();
    if (currencyOldStudentAddId && decisionDate && decisionNumber && timeToPay) {
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }
  };

  const checkProperties = (object) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in object) {
      if (object[key] === '' || object[key] === null) return true;
    }
    return false;
  };

  const checkValidate = (data, name) => {
    let pass = !_.isEmpty(data) ? data.find((item) => !!checkProperties(item)) : true;
    if (name === 'other') {
      pass = !_.isEmpty(data) ? data.find((item) => !!checkProperties(item)) : false;
    }
    setErrorTable((prev) => ({
      ...prev,
      [name]: !!pass,
    }));
    return !!pass;
  };

  const finishForm = async (values) => {
    const data = {
      ...values,
      feeDetail: !_.isEmpty(feeDetail)
        ? feeDetail.map((item) => ({
            ...item,
            applyStartTime: Helper.getDateTime({
              value: Helper.setDate({
                ...variables.setDateData,
                originValue: item?.rangeDate[0],
              }),
              isUTC: false,
            }),
            applyEndTime: Helper.getDateTime({
              value: Helper.setDate({
                ...variables.setDateData,
                originValue: item?.rangeDate[1],
              }),
              isUTC: false,
            }),
          }))
        : [],
      moneyMeal,
      otherMoneyDetail,
    };
    const tuition = checkValidate(feeDetail, 'tuition');
    const food = checkValidate(moneyMeal, 'food');
    const other = checkValidate(otherMoneyDetail, 'other');
    if (!!tuition || !!food || !!other) {
      return;
    }
    dispatch({
      type: params?.id ? 'feePolicyPolicyAdd/UPDATE' : 'feePolicyPolicyAdd/ADD',
      payload: {
        ...data,
        decisionDate: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: data.decisionDate,
          }),
          isUTC: false,
        }),
        id: params?.id || undefined,
      },
      callback: (res) => {
        if (res) {
          history.goBack();
        }
      },
    });
  };

  const tabs = () => [
    {
      id: 'tuition',
      name: 'Các khoản học phí',
      component: (
        <TuitionTable
          feeDetail={feeDetail}
          setFeeDetail={setFeeDetail}
          error={errorTable.tuition}
          checkValidate={checkValidate}
        />
      ),
    },
    {
      id: 'food',
      name: 'Dự kiến phải thu',
      component: (
        <ExpectedTable
          moneyMeal={moneyMeal}
          setMoneyMeal={setMoneyMeal}
          error={errorTable.food}
          checkValidate={checkValidate}
        />
      ),
    },
  ];

  return (
    <Form layout="vertical" colon={false} ref={formRef} onFinish={finishForm}>
      <Breadcrumbs
        className="pb0"
        last={params?.id ? 'Chi tiết' : 'Thêm mới'}
        menu={menuLeftCurrency}
      />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Loading params={{ type: 'container', goBack: '/chinh-sach-phi/tien-dong' }}>
          <Helmet title={params?.id ? 'Chi tiết tiền đóng' : 'Thêm mới tiền đóng'} />

          <Pane className="card p20">
            <Heading type="form-title" className="mb10">
              Thông tin học sinh
            </Heading>
            <Pane className="row">
              <div className="col-lg-12 border-bottom">
                <FormItemAntd>
                  <RadioGroup
                    options={variablesModules.TYPES}
                    // value={type}
                    // onChange={onChangeType}
                  />
                </FormItemAntd>
              </div>
            </Pane>
            <Pane className="row pt20">
              <div className="col-lg-3">
                <FormItem
                  className="mb-2"
                  label="Tên học sinh"
                  name="currencyOldStudentAddId"
                  type={variables.SELECT}
                  placeholder="Chọn năm"
                  onChange={(e) => onChange(e, 'currencyOldStudentAddId')}
                  allowClear={false}
                  data={yearsSchool?.map((item) => ({
                    ...item,
                    name: `${item?.yearFrom} - ${item?.yearTo}`,
                  }))}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb-2"
                  label="Năm học"
                  name="currencyOldStudentAddId"
                  type={variables.SELECT}
                  placeholder="Chọn năm"
                  onChange={(e) => onChange(e, 'currencyOldStudentAddId')}
                  allowClear={false}
                  data={yearsSchool?.map((item) => ({
                    ...item,
                    name: `${item?.yearFrom} - ${item?.yearTo}`,
                  }))}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb-2"
                  label="Ngày sinh"
                  name="currencyOldStudentAddId"
                  type={variables.DATE_PICKER}
                  onChange={(e) => onChange(e, 'currencyOldStudentAddId')}
                  allowClear={false}
                  data={yearsSchool?.map((item) => ({
                    ...item,
                    name: `${item?.yearFrom} - ${item?.yearTo}`,
                  }))}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb-2"
                  label="Tuổi (tháng)"
                  name="currencyOldStudentAddId"
                  type={variables.INPUT}
                  placeholder="Chọn năm"
                  onChange={(e) => onChange(e, 'currencyOldStudentAddId')}
                  allowClear={false}  
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb-2"
                  label="Ngày nhập học"
                  name="currencyOldStudentAddId"
                  type={variables.DATE_PICKER}
                  onChange={(e) => onChange(e, 'currencyOldStudentAddId')}
                  allowClear={false}
                  data={yearsSchool?.map((item) => ({
                    ...item,
                    name: `${item?.yearFrom} - ${item?.yearTo}`,
                  }))}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb-0"
                  label="Lớp học dự kiến"
                  name="currencyOldStudentAddId"
                  type={variables.SELECT}
                  placeholder="Chọn năm"
                  onChange={(e) => onChange(e, 'currencyOldStudentAddId')}
                  allowClear={false}
                  data={yearsSchool?.map((item) => ({
                    ...item,
                    name: `${item?.yearFrom} - ${item?.yearTo}`,
                  }))}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb-2"
                  label="Họ tên Cha"
                  name="currencyOldStudentAddId"
                  type={variables.INPUT}
                  placeholder="Chọn năm"
                  onChange={(e) => onChange(e, 'currencyOldStudentAddId')}
                  allowClear={false}  
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb-2"
                  label="SĐT Cha"
                  name="currencyOldStudentAddId"
                  type={variables.INPUT}
                  placeholder="Chọn năm"
                  onChange={(e) => onChange(e, 'currencyOldStudentAddId')}
                  allowClear={false}  
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb-2"
                  label="Họ tên Mẹ"
                  name="currencyOldStudentAddId"
                  type={variables.INPUT}
                  placeholder="Chọn năm"
                  onChange={(e) => onChange(e, 'currencyOldStudentAddId')}
                  allowClear={false}  
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb-2"
                  label="SĐT Mẹ"
                  name="currencyOldStudentAddId"
                  type={variables.INPUT}
                  placeholder="Chọn năm"
                  onChange={(e) => onChange(e, 'currencyOldStudentAddId')}
                  allowClear={false}  
                />
              </div>
            </Pane>
          </Pane>
          {showDetails && (
            <>
              <Pane className="card mb0">
                <Pane
                  className={csx(commonStyles['block-table'], commonStyles['block-table-tab-new'])}
                >
                  <Heading type="form-title" className="heading-tab">
                    Chi tiết
                  </Heading>
                  <Tabs onChange={changeTab} activeKey={tab} className="test-12">
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
              </Pane>
            </>
          )}
        </Loading>
      </Pane>
    </Form>
  );
});

export default Index;
