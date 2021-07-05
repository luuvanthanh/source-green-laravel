import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Tabs } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import classnames  from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import styles from '@/assets/styles/Common/common.scss';

import { variables, Helper } from '@/utils';
import ParametersFixedComponent from './parametersFixed';
import ParametersChangeComponent from './parametersChange';

const { TabPane } = Tabs;

const Index = memo(() => {
  const params = useParams();
  const {
    loading,
    menuLeftFeePolicy,
    fees,
  } = useSelector(({ loading, menu, paymentMethod }) => ({
    loading: loading.effects,
    menuLeftFeePolicy: menu.menuLeftFeePolicy,
    fees: paymentMethod.data
  }));
  const dispatch = useDispatch();

  const history = useHistory();
  const formRef = useRef();
  const [tab, setTab] = useState('fixedParameter');
  const [showDetails, setShowDetails] = useState(false);
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
        page: variables.PAGINATION.PAGE
      },
    });
  };

  useEffect(async () => {
    getPaymentForm();
    if (params?.id) {
      setShowDetails(true);
      dispatch({
        type: 'schoolyearAdd/GET_DETAILS',
        payload: {
          id: params?.id
        },
        callback: (res) => {

          if (res) {
            const fixedParameter = !_.isEmpty(res?.fixedParameter)
              ? res?.fixedParameter.map(item => ({...item, duaDate: moment(item.duaDate)}))
              : [];
            const values = {
              ...res,
              expirationDate: !_.isEmpty(res?.changeParameter) ? res?.changeParameter[0]?.duaDate : '',
              fee: !_.isEmpty(res?.changeParameter) ? res?.changeParameter[0]?.paymentForm?.id : '',
              fixedParameter,
              rangeDate: [
                moment(res.startDate),
                moment(res.endDate),
              ],
              paymentFormId: res?.changeParameter?.paymentFormId,
              duaDate: res?.changeParameter?.duaDate,
            };
            const newChangeParameter = !_.isEmpty(res?.changeParameter?.changeParameterDetail) ? res?.changeParameter?.changeParameterDetail?.map(item => ({
              ...item,
              rangeDate: [moment(item.startDate), moment(item.endDate)],
              fee: res?.changeParameter?.paymentForm?.name || ''
            })) : [];
            setParamChanges(newChangeParameter);
            formRef?.current?.setFieldsValue({...values });
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
    return !!pass;
  };

  const onFinish = (values) => {
    setErrorTable((prev) => ({
      ...prev,
      fixedParameter: !values?.fixedParameter,
    }));

    const errorParamChanges = checkValidate(paramChanges, 'changeParameter');;
    if (!!(errorParamChanges) || !(values?.fixedParameter)) {
      return;
    }

    const data = {
      ...values,
      rangeDate: undefined,
      startDate: values.rangeDate[0],
      endDate: values.rangeDate[1],
      changeParameter: {
        paymentFormId: values.paymentFormId,
        duaDate: values.duaDate,
        detail: paramChanges.map(item => ({
          ...item,
          startDate: item.rangeDate[0],
          endDate: item?.rangeDate[1],
          rangeDate: undefined,
          id: undefined,
          fee: undefined,
          date: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: moment(item.date, 'MM/YYYY'),
            }),
            format: variables.DATE_FORMAT.DATE_TIME_UTC,
            isUTC: false,
          }),
          duaDate: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: moment(item.duaDate, 'DD/MM/YYYY'),
            }),
            format: variables.DATE_FORMAT.DATE_TIME_UTC,
            isUTC: false,
          }),
        }))
      }
    };

    dispatch({
      type: params?.id ? 'schoolyearAdd/UPDATE' : 'schoolyearAdd/ADD',
      payload: {
        ...data,
        id: params?.id || undefined
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

  const remove = () => {
    formRef?.current?.resetFields();
    setShowDetails(false);
    setParamChanges([]);
    setTab('fixedParameter');
  };

  const changeTab = (value) => {
    setTab(value);
  };

  const getDetail  = (e, name) => {
    const { getFieldsValue } = formRef?.current;
    const { yearFrom, yearTo, rangeDate } = getFieldsValue();
    if (name === 'rangeDate') {
      setParamChanges([]);
    }
    if (yearFrom && yearTo && rangeDate) {
      setShowDetails(true);
      getPaymentForm();
    } else {
      setShowDetails(false);
    }
  };

  const tabs = () => [
    {
      id: 'fixedParameter',
      name: 'Tham số cố định',
      component: <ParametersFixedComponent
        formRef={formRef}
        fees={[...fees].filter(item => item.type === 'CD')}
        error={errorTable.fixedParameter}
        checkValidate={() => setErrorTable((prev) => ({
          ...prev,
          fixedParameter: false,
        }))}
      />
    },
    {
      id: 'changeParameter',
      name: 'Tham số thay đổi theo thời điểm',
      component: <ParametersChangeComponent
        formRef={formRef}
        fees={fees}
        paramChanges={paramChanges}
        setParamChanges={setParamChanges}
        error={errorTable.changeParameter}
        checkValidate={checkValidate}
      />
    }
  ];

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title={params?.id ? 'Chi tiết năm học' : 'Thêm mới năm học'} />
      <Breadcrumbs className="pb30 pt0" last={`${params?.id ? 'Chi tiết' : 'Thêm mới'}`} menu={menuLeftFeePolicy} />
      <Pane className="row">
        <Pane className="col-12">
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Pane className="card px20 pt20">
              <Heading type="form-title" className="mb20">
                Thông tin chung
              </Heading>

              <Pane className={classnames('row')}>
                <Pane className="col-lg-2">
                  <FormItem
                    label="Từ năm"
                    name="yearFrom"
                    type={variables.INPUT_COUNT}
                    onChange={(e) => getDetail(e, 'yearFrom')}
                    rules={[
                      {
                        ...variables.RULES.EMPTY
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (value && getFieldValue('yearTo') && value >= getFieldValue('yearTo')) {
                            setShowDetails(false);
                            return Promise.reject(new Error(variables.RULES.YEAR_FROM));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  />
                </Pane>

                <Pane className="col-lg-2">
                  <FormItem
                    label="Đến năm"
                    name="yearTo"
                    type={variables.INPUT_COUNT}
                    onChange={(e) => getDetail(e, 'yearTo')}
                    rules={[
                      {
                        ...variables.RULES.EMPTY
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (value && getFieldValue('yearFrom') && getFieldValue('yearFrom') >= value) {
                            setShowDetails(false);
                            return Promise.reject(new Error(variables.RULES.YEAR_TO));
                          }
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
                    onChange={(e) => getDetail(e, 'rangeDate')}
                  />
                </Pane>
              </Pane>
            </Pane>
            {showDetails && (
              <>
                <Pane className="card mb0">
                  <Heading type="form-title" className="p20 border-bottom">
                    Chi tiết
                  </Heading>

                  <Tabs onChange={changeTab} activeKey={tab} className={classnames(styles['tab-px20'], styles['tab-uppercase'])}>
                    {tabs().map(({ id, name, component }) => (
                      <TabPane
                        tab={(
                          <span className={errorTable[id] ? 'text-danger' : ''}>{name}</span>
                        )}
                        key={id}
                      >
                        {component}
                      </TabPane>
                    ))}
                  </Tabs>
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
                    loading={loading['classTypeAdd/GET_DETAILS']}
                  >
                    Lưu
                  </Button>
                </Pane>
              </>
            )}
          </Form>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
