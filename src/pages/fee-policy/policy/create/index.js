import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, Form, message } from 'antd';
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

import variablesModules from './utils/variables';
import ScheduleTable from './tables/schedule';
import TuitionTable from './tables/tuition';
import FoodTable from './tables/food';
import OtherTable from './tables/other';

const { TabPane } = Tabs;

const Index = memo(() => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const params = useParams();

  const {
    loading,
    menuLeftFeePolicy,
    yearsSchool,
  } = useSelector(({ loading, menu, schoolYear }) => ({
    loading: loading.effects,
    menuLeftFeePolicy: menu.menuLeftFeePolicy,
    yearsSchool: schoolYear.data
  }));

  const [tab, setTab] = useState('schedule');
  const [showDetails, setShowDetails] = useState(false);
  const [schoolYearInformation, setSchoolYearInformation] = useState([]);
  const [feeDetail, setFeeDetail] = useState([]);
  const [moneyMeal, setMoneyMeal] = useState([]);
  const [otherMoneyDetail, setOtherMoneyDetail] = useState([]);

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
        type: 'feePolicyPolicyAdd/GET_DETAILS',
        payload: {
          id: params?.id,
          include: Helper.convertIncludes(['schoolYear']),
        },
        callback: (res) => {
          setSchoolYearInformation(res?.schoolYearInformation);
          setFeeDetail(res?.feeDetail);
          setMoneyMeal(res?.moneyMeal);
          setOtherMoneyDetail(res?.otherMoneyDetail);
          const timeToPay = [
            moment(res?.schoolYear?.startDate),
            moment(res?.schoolYear?.endDate)
          ];
          formRef?.current?.setFieldsValue({
            schoolYearId: res?.schoolYearId,
            decisionDate: res?.decisionDate ? moment(res?.decisionDate) : null,
            decisionNumber: res?.decisionNumber,
            timeToPay
          });
        },
      });
    }
  }, []);

  const changeTab = (key) => {
    setTab(key);
  };

  const remove = () => {
    formRef?.current.resetFields();
    setShowDetails(false);
  };

  const renderData = (length, timeToPay) => {
    const datasTable = [];
    for (let i = 0; i < length; i += 1) {
      let schedule = moment(timeToPay[0]).add(i, 'month');
      if (i === 0) {
        schedule = schedule.format(variables.DATE_FORMAT.DATE_VI);
      } else {
        schedule = schedule.startOf('month').format(variables.DATE_FORMAT.DATE_VI);
      }
      datasTable.push({
        id: i,
        paymentFormId: '',
        schedule,
        schoolDay: 0,
      });
    }
    return datasTable;
  };

  const getDetail  = async (e, name) => {
    if (name === 'schoolYearId') {
      const choolYearSelect = yearsSchool.find(item => item?.id === e);
      await formRef?.current?.setFieldsValue({ timeToPay: [moment(choolYearSelect?.startDate), moment(choolYearSelect?.endDate)] });
    }
    const { getFieldsValue } = formRef?.current;
    const { schoolYearId, decisionDate, decisionNumber, timeToPay } = getFieldsValue();
    if (schoolYearId && decisionDate && decisionNumber && timeToPay) {
      const result = moment(timeToPay[1]).diff(moment(timeToPay[0]), 'month') + 1;
      if (result) {
        const data = renderData(result, timeToPay);
        setSchoolYearInformation(data);
      }
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }
  };

  const renderTab = (tab) => {
    switch (tab) {
      case 'schedule':
        return <ScheduleTable schoolYearInformation={schoolYearInformation} setSchoolYearInformation={setSchoolYearInformation}/>;
      case 'tuition':
        return <TuitionTable feeDetail={feeDetail} setFeeDetail={setFeeDetail} />;
      case 'food':
        return <FoodTable moneyMeal={moneyMeal} setMoneyMeal={setMoneyMeal} />;
      case 'other':
        return <OtherTable otherMoneyDetail={otherMoneyDetail} setOtherMoneyDetail={setOtherMoneyDetail} />;
      default:
        return <ScheduleTable schoolYearInformation={schoolYearInformation} setSchoolYearInformation={setSchoolYearInformation}/>;
    }
  };

  const finishForm = async (values) => {
    const data = {
      ...values,
      schoolYearInformation,
      feeDetail: !_.isEmpty(feeDetail) ? feeDetail.map(item => ({
        ...item,
        applyStartTime: item?.rangeDate[0],
        applyEndTime: item?.rangeDate[1]
      })) : [],
      moneyMeal,
      otherMoneyDetail,
    };
    if (_.isEmpty(schoolYearInformation) || _.isEmpty(feeDetail) || _.isEmpty(moneyMeal)) {
      message.warning(`Vui lòng nhập ${_.isEmpty(schoolYearInformation) ? 'Lịch học, ' : ''}${_.isEmpty(feeDetail) ? 'Chi tiết tiền học phí của học sinh, ' : ''}${_.isEmpty(moneyMeal) ? 'Chi tiết tiền ăn' : ''}`);
      return;
    }
    dispatch({
      type: 'feePolicyPolicyAdd/ADD',
      payload: {
        ...data
      },
      callback: (res) => {
        if (res) {
          history.goBack();
        }
      },
    });
  };

  return (
    <Form layout="vertical" colon={false} ref={formRef} onFinish={finishForm}>
      <Breadcrumbs className="pb0" last={params?.id ? 'Chi tiết' : 'Thêm mới'} menu={menuLeftFeePolicy} />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Loading params={{ type: 'container' }}>
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
                  onChange={e => getDetail(e, 'schoolYearId')}
                  allowClear={false}
                  data={yearsSchool.map(item => ({ ...item, name: `${item?.yearTo} - ${item?.yearFrom}`}))}
                  rules={[variables.RULES.EMPTY]}
                  disabled={params?.id}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb0"
                  label="Ngày quyết định"
                  name="decisionDate"
                  onChange={e => getDetail(e, 'decisionDate')}
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                  disabled={params?.id}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb0"
                  label="Số quyết định"
                  name="decisionNumber"
                  onChange={e => getDetail(e, 'decisionNumber')}
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                  disabled={params?.id}
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
              <Pane className="card">
                <Pane className={csx(commonStyles['block-table'], commonStyles['block-table-tab-new'])}>
                  <Heading type="form-title" className="heading-tab">
                    Chi tiết
                  </Heading>
                  <Tabs onChange={changeTab} activeKey={tab} className="test">
                    {variablesModules.TABS.map((item) => (
                      <TabPane tab={item.name} key={item.id} className="test"/>
                    ))}
                  </Tabs>
                  {renderTab(tab)}
                </Pane>
              </Pane>

              {
                !params?.id && (
                  <Pane className="p20 d-flex justify-content-between align-items-center">
                    <p className="btn-delete" role="presentation" onClick={remove}>
                      Hủy
                    </p>
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
                )
              }
            </>
          )}

        </Loading>
      </Pane>
    </Form>
  );
});

export default Index;
