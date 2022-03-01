import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Tabs } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import classnames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import FormItem from '@/components/CommonComponent/FormItem';
import styles from '@/assets/styles/Common/common.scss';

import { variables, Helper } from '@/utils';
import ParametersFixedComponent from './parametersFixed';
import ParametersChangeComponent from './parametersChange';
import ScheduleComponent from './schedule';

const { TabPane } = Tabs;

const Index = memo(() => {
  const params = useParams();
  const { menuLeftCRM, fees } = useSelector(({ menu, paymentMethod }) => ({
    menuLeftCRM: menu.menuLeftCRM,
    fees: paymentMethod.data,
  }));
  const dispatch = useDispatch();

  const history = useHistory();
  const formRef = useRef();
  const isCopy = !!(history?.location?.query?.type === 'ban-sao');

  const [tab, setTab] = useState('fixedParameter');
  const [paramChanges, setParamChanges] = useState([]);
  const [errorTable, setErrorTable] = useState({
    fixedParameter: false,
    changeParameter: false,
  });

  const getPaymentForm = () => {
    dispatch({
      type: 'paymentMethod/GET_DATA',
      payload: {
        limit: variables.PAGINATION.SIZEMAX,
        page: variables.PAGINATION.PAGE,
      },
    });
  };

  useEffect(async () => {
    getPaymentForm();
    if (params?.id) {
      dispatch({
        type: 'CRMschoolyearAdd/GET_DETAILS',
        payload: {
          id: params?.id,
        },
        callback: (res) => {
          if (res) {
            const fixedParameter = !_.isEmpty(res?.fixedParameter)
              ? res?.fixedParameter.map((item) => ({ ...item, duaDate: moment(item.duaDate) }))
              : [];
            const values = {
              ...res,
              expirationDate: !_.isEmpty(res?.changeParameter)
                ? res?.changeParameter[0]?.duaDate
                : '',
              fee: !_.isEmpty(res?.changeParameter) ? res?.changeParameter[0]?.paymentForm?.id : '',
              fixedParameter,
              rangeDate: [moment(res.start_date), moment(res.end_date)],
              feeId: res?.changeParameter?.paymentFormId,
              duaDate: res?.changeParameter?.duaDate,
            };
            const newChangeParameter = !_.isEmpty(res?.changeParameter?.changeParameterDetail)
              ? res?.changeParameter?.changeParameterDetail?.map((item) => ({
                ...item,
                rangeDate: [moment(item.start_date), moment(item.end_date)],
                fee: res?.changeParameter?.paymentForm?.name || '',
                feeId: res?.changeParameter?.paymentForm?.id || '',
              }))
              : [];
            setParamChanges(newChangeParameter);
            formRef?.current?.setFieldsValue({ ...values });
          }
        },
      });
    }
  }, []);

  const checkIsEmpty = (datas = [], value = true, name = '') => {
    if (_.isEmpty(datas) && name) {
      setErrorTable((prev) => ({
        ...prev,
        [name]: value,
      }));
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
    const pass = !_.isEmpty(data) ? data.find((item) => !!checkProperties(item)) : true;
    setErrorTable((prev) => ({
      ...prev,
      [name]: !!pass,
    }));
    return !!pass;
  };

  const onFinish = (values) => {
    setErrorTable((prev) => ({
      ...prev,
      fixedParameter: !values?.fixedParameter,
    }));

    const errorParamChanges = checkValidate(paramChanges, 'changeParameter');
    if (!!errorParamChanges || !values?.fixedParameter) {
      return;
    }

    const data = {
      ...values,
      rangeDate: undefined,
      start_date: values.rangeDate[0],
      end_date: values.rangeDate[1],
      fixedParameter: values?.fixedParameter.map((item) => ({
        paymentFormId: item.paymentFormId,
        duaDate: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: moment(item.duaDate, variables.DATE_FORMAT.DATE_AFTER),
          }),
          format: variables.DATE_FORMAT.DATE_TIME_UTC,
          isUTC: false,
        }),
      })),
      changeParameter: {
        paymentFormId: _.get(paramChanges[0], 'feeId'),
        duaDate: _.get(paramChanges[0], 'duaDate')
          ? moment(paramChanges[0]?.duaDate, variables.DATE_FORMAT.YEAR_MONTH_DAY).format('DD')
          : values.duaDate,
        detail: paramChanges.map((item) => ({
          actualWeek: item.actualWeek,
          date: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: moment(item.date, variables.DATE_FORMAT.DATE_AFTER),
            }),
            format: variables.DATE_FORMAT.DATE_TIME_UTC,
            isUTC: false,
          }),
          duaDate: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: moment(item.duaDate, variables.DATE_FORMAT.DATE_AFTER),
            }),
            format: variables.DATE_FORMAT.DATE_TIME_UTC,
            isUTC: false,
          }),
          start_date: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: moment(item.rangeDate[0], variables.DATE_FORMAT.DATE_AFTER),
            }),
            format: variables.DATE_FORMAT.DATE_TIME_UTC,
            isUTC: false,
          }),
          end_date: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: moment(item.rangeDate[1], variables.DATE_FORMAT.DATE_AFTER),
            }),
            format: variables.DATE_FORMAT.DATE_TIME_UTC,
            isUTC: false,
          }),
          fullMonth: item.fullMonth,
          paymentFormId: item.paymentFormId,
          schoolDay: item.schoolDay,
        })),
      },
    };
    dispatch({
      type: params?.id && !isCopy ? 'CRMschoolyearAdd/UPDATE' : 'CRMschoolyearAdd/ADD',
      payload: {
        ...data,
        id: params?.id && !isCopy ? params?.id : undefined,
      },
      callback: (res) => {
        if (res) {
          history.goBack();
        }
      },
    });
  };

  const onFinishFailed = ({ errorFields }) => {
    checkValidate(paramChanges, 'changeParameter');
    if (errorFields) {
      checkIsEmpty([], true, 'fixedParameter');
    }
  };

  const changeTab = (value) => {
    setTab(value);
  };

  const renderData = (length, values, data = []) => {
    const datasTable = [];
    for (let i = 0; i < length; i += 1) {
      const startMonth = moment(values?.rangeDate[0])
        .add(i - 1, 'month')
        .set('date', values?.duaDate);
      const endMonth = moment(values?.rangeDate[0]).add(i, 'month').set('date', 1);
      const date = moment(values?.rangeDate[0])
        .add(i, 'month')
        .set('date', 1)
        .format(variables.DATE_FORMAT.DATE_AFTER);
      const duaDate =
        moment(startMonth).diff(endMonth, 'days') < 0
          ? moment(startMonth).format(variables.DATE_FORMAT.DATE_AFTER)
          : moment(startMonth)
            .add(-1, 'month')
            .endOf('month')
            .format(variables.DATE_FORMAT.DATE_AFTER);
      const response = data.find((item) => item.date === date && item.duaDate === duaDate);
      if (response) {
        datasTable.push({ ...response });
      } else {
        datasTable.push({
          id: uuidv4(),
          fee: [...fees].find((item) => item.id === values?.paymentFormId)?.code,
          date,
          duaDate,
          rangeDate: null,
          paymentFormId: null,
          schoolDay: '',
          fullMonth: null,
          actualWeek: '',
        });
      }
    }
    return datasTable;
  };

  const getDetail = (e, name) => {
    const { getFieldsValue } = formRef?.current;
    const { yearFrom, yearTo, rangeDate, duaDate, paymentFormId } = getFieldsValue();
    const newPaymentFormId = _.get(paramChanges[0], 'paymentFormId') || paymentFormId;
    const newDuaDate = _.get(paramChanges[0], 'duaDate')
      ? moment(paramChanges[0]?.duaDate, variables.DATE_FORMAT.YEAR_MONTH_DAY).format('DD')
      : duaDate;

    if (name === 'rangeDate' && newDuaDate && newPaymentFormId) {
      const start_date = moment(rangeDate[0]).startOf('month');
      const end_date = moment(rangeDate[1]).endOf('month');
      const length = moment(end_date).diff(moment(start_date), 'month') + 1;
      if (length) {
        const data = renderData(
          length,
          { duaDate: newDuaDate, paymentFormId: newPaymentFormId, rangeDate },
          paramChanges,
        );
        setParamChanges(data);
      }
    }
    if (yearFrom && yearTo && rangeDate) {
      getPaymentForm();
    }
  };

  const tabs = () => [
    {
      id: 'fixedParameter',
      name: 'Tham số cố định',
      component: (
        <ParametersFixedComponent
          formRef={formRef}
          fees={[...fees].filter((item) => item.type === 'CD')}
          error={errorTable.fixedParameter}
          checkValidate={() =>
            setErrorTable((prev) => ({
              ...prev,
              fixedParameter: false,
            }))
          }
        />
      ),
    },
    {
      id: 'changeParameter',
      name: 'Tham số thay đổi theo thời điểm',
      component: (
        <ParametersChangeComponent
          formRef={formRef}
          fees={fees}
          paramChanges={paramChanges}
          setParamChanges={setParamChanges}
          error={errorTable.changeParameter}
          checkValidate={checkValidate}
        />
      ),
    },
    {
      id: 'schedule',
      name: 'Lịch học',
      component: (
        <ScheduleComponent
          formRef={formRef}
          rangeDate={formRef?.current?.getFieldValue('rangeDate')}
        />
      ),
    },
  ];

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title={params?.id && !isCopy ? 'Chi tiết năm học' : 'Thêm mới năm học'} />
      <Breadcrumbs
        className="pb30 pt0"
        last={`${params?.id && !isCopy ? 'Chi tiết' : 'Thêm mới'}`}
        menu={menuLeftCRM}
      />
      <Pane className="row">
        <Pane className="col-12">
          <Form layout="vertical" ref={formRef} onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <Pane className="card px20 pt20">
              <Heading type="form-title" className="mb20">
                Thông tin chung
              </Heading>

              <Pane className={classnames('row')}>
                <Pane className="col-lg-3">
                  <FormItem
                    label="Từ năm"
                    name="year_from"
                    type={variables.INPUT_COUNT}
                    onChange={(e) => getDetail(e, 'year_from')}
                    rules={[
                      {
                        ...variables.RULES.EMPTY,
                      },
                      ({ getFieldValue, setFields }) => ({
                        validator(_, value) {
                          if (
                            value &&
                            getFieldValue('year_to') &&
                            value >= getFieldValue('yearTo')
                          ) {
                            return Promise.reject(new Error(variables.RULES.YEAR_FROM));
                          }
                          setFields([{ name: 'year_to', errors: '' }]);
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  />
                </Pane>

                <Pane className="col-lg-3">
                  <FormItem
                    label="Đến năm"
                    name="year_to"
                    type={variables.INPUT_COUNT}
                    onChange={(e) => getDetail(e, 'year_to')}
                    rules={[
                      {
                        ...variables.RULES.EMPTY,
                      },
                      ({ getFieldValue, setFields }) => ({
                        validator(_, value) {
                          if (
                            value &&
                            getFieldValue('year_from') &&
                            getFieldValue('year_from') >= value
                          ) {
                            return Promise.reject(new Error(variables.RULES.YEAR_TO));
                          }
                          setFields([{ name: 'year_from', errors: '' }]);
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  />
                </Pane>

                <Pane className="col-lg-4">
                  <FormItem
                    label="Thời gian hiệu lực"
                    name="rangeDate"
                    type={variables.RANGE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                    onChange={(e) => getDetail(e, 'rangeDate')}
                    disabledDate={(current) =>
                      Helper.disabledYear(current, formRef, { key: 'start_date', compare: '<' }) ||
                      Helper.disabledYear(current, formRef, { key: 'end_date' })
                    }
                  />
                </Pane>
              </Pane>
            </Pane>
            {/* <Pane className="card mb0">
              <Heading type="form-title" className="p20 border-bottom">
                Chi tiết
              </Heading>

              <Tabs
                onChange={changeTab}
                activeKey={tab}
                className={classnames(styles['tab-px20'], styles['tab-uppercase'])}
              >
                {(params?.id ? tabs() : _.initial(tabs())).map(({ id, name, component }) => (
                  <TabPane
                    tab={<span className={errorTable[id] ? 'text-danger' : ''}>{name}</span>}
                    key={id}
                  >
                    {component}
                  </TabPane>
                ))}
              </Tabs>
            </Pane> */}
            {/* <Pane className="p20 d-flex justify-content-between align-items-center">
              <Button
                className="ml-auto px25"
                color="success"
                htmlType="submit"
                size="large"
                loading={
                  loading['classTypeAdd/GET_DETAILS'] ||
                  loading['CRMschoolyearAdd/UPDATE'] ||
                  loading['classTypeAdd/ADD']
                }
              >
                Lưu
              </Button>
            </Pane> */}
          </Form>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
