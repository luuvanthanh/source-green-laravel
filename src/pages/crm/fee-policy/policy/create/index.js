import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import csx from 'classnames';
import moment from 'moment';
import { history, useParams } from 'umi';
import _ from 'lodash';

import Button from '@/components/CommonComponent/Button';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import FormItem from '@/components/CommonComponent/FormItem';
import commonStyles from '@/assets/styles/Common/common.scss';
import { variables, Helper } from '@/utils';

import TuitionTable from './tables/tuition';
import FoodTable from './tables/food';
import OtherTable from './tables/other';
import BusTable from './tables/bus';

const { TabPane } = Tabs;

const Index = memo(() => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const params = useParams();

  const { loading, menuLeftCRM, yearsSchool } = useSelector(
    ({ loading, menu, schoolYear }) => ({
      loading: loading.effects,
      menuLeftCRM: menu.menuLeftCRM,
      yearsSchool: schoolYear.data,
    }),
  );

  const [tab, setTab] = useState('tuition');
  const [showDetails, setShowDetails] = useState(false);
  const [feeDetail, setFeeDetail] = useState([]);
  const [moneyMeal, setMoneyMeal] = useState([]);
  const [moneyBus, setMoneyBus] = useState([]);
  const [otherMoneyDetail, setOtherMoneyDetail] = useState([]);
  const [errorTable, setErrorTable] = useState({
    tuition: false,
    food: false,
    other: false,
  });
  useEffect(() => {
    dispatch({
      type: 'schoolYear/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    if (params?.id) {
      setShowDetails(true);
      dispatch({
        type: 'CRMfeePolicyPolicyAdd/GET_DETAILS',
        payload: {
          id: params?.id,
          include: Helper.convertIncludes(['schoolYear']),
        },
        callback: (res) => {
          setFeeDetail(
            res?.feeDetail.map((item) => ({
              ...item,
              rangeDate: [moment(item?.applyStartTime), moment(item?.applyEndTime)],
            })),
          );
          setMoneyMeal(res?.moneyMeal);
          setMoneyBus(res?.moneyBus);
          setOtherMoneyDetail(res?.otherMoneyDetail);
          const timeToPay = [moment(res?.schoolYear?.startDate), moment(res?.schoolYear?.endDate)];
          formRef?.current?.setFieldsValue({
            schoolYearId: res?.schoolYearId,
            decisionDate: res?.decisionDate ? moment(res?.decisionDate) : null,
            decisionNumber: res?.decisionNumber,
            timeToPay,
          });
        },
      });
    }
  }, []);

  const changeTab = (key) => {
    setTab(key);
  };

  const onChange = async (e, name) => {
    if (name === 'schoolYearId') {
      const choolYearSelect = yearsSchool.find((item) => item?.id === e);
      await formRef?.current?.setFieldsValue({
        timeToPay: [moment(choolYearSelect?.startDate), moment(choolYearSelect?.endDate)],
      });
    }

    const { getFieldsValue } = formRef?.current;
    const { schoolYearId, decisionDate, decisionNumber, timeToPay } = getFieldsValue();
    if (schoolYearId && decisionDate && decisionNumber && timeToPay) {
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
      moneyBus,
    };
    const tuition = checkValidate(feeDetail, 'tuition');
    const food = checkValidate(moneyMeal, 'food');
    const other = checkValidate(otherMoneyDetail, 'other');
    const bus = checkValidate(moneyBus, 'bus');
    if (!!tuition || !!food || !!other || !!bus) {
      return;
    }
    dispatch({
      type: params?.id ? 'CRMfeePolicyPolicyAdd/UPDATE' : 'CRMfeePolicyPolicyAdd/ADD',
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
      name: 'Chi tiết tiền học phí của học sinh',
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
      name: 'Chi tiết tiền ăn của học sinh',
      component: (
        <FoodTable
          moneyMeal={moneyMeal}
          setMoneyMeal={setMoneyMeal}
          error={errorTable.food}
          checkValidate={checkValidate}
        />
      ),
    },
    {
      id: 'buss',
      name: 'Tiền xe bus',
      component: (
        <BusTable
          moneyMeal={moneyBus}
          setMoneyMeal={setMoneyBus}
          error={errorTable.food}
          checkValidate={checkValidate}
        />
      ),
    },
    {
      id: 'other',
      name: 'Chi tiết phí khác',
      component: (
        <OtherTable
          otherMoneyDetail={otherMoneyDetail}
          setOtherMoneyDetail={setOtherMoneyDetail}
          error={errorTable.other}
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
        menu={menuLeftCRM}
      />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Loading params={{ type: 'container', goBack: '/chinh-sach-phi/tien-dong' }}>
          <Helmet title={params?.id ? 'Chi tiết tiền đóng' : 'Thêm mới tiền đóng'} />

          <Pane className="card p20">
            <Heading type="form-title" className="mb10">
              Thông tin chung
            </Heading>

            <Pane className="row">
              <div className="col-lg-3">
                <FormItem
                  className="mb-0"
                  label="Năm học"
                  name="schoolYearId"
                  type={variables.SELECT}
                  placeholder="Chọn năm"
                  onChange={(e) => onChange(e, 'schoolYearId')}
                  allowClear={false}
                  data={yearsSchool.map((item) => ({
                    ...item,
                    name: `${item?.yearFrom} - ${item?.yearTo}`,
                  }))}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb0"
                  label="Ngày quyết định"
                  name="decisionDate"
                  onChange={(e) => onChange(e, 'decisionDate')}
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb0"
                  label="Số quyết định"
                  name="decisionNumber"
                  onChange={(e) => onChange(e, 'decisionNumber')}
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb0"
                  label="Thời gian hiệu lực"
                  name="timeToPay"
                  type={variables.RANGE_PICKER}
                  data={[]}
                  allowClear={false}
                  rules={[variables.RULES.EMPTY]}
                  disabled
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
              <Pane className="p20 d-flex justify-content-between align-items-center">
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={loading['classTypeAdd/GET_DETAILS']}
                >
                  Lưu
                </Button>
              </Pane>
            </>
          )}
        </Loading>
      </Pane>
    </Form>
  );
});

export default Index;
