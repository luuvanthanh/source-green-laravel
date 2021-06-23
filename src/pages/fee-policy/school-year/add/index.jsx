import { memo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Tabs } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import classnames  from 'classnames';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import styles from '@/assets/styles/Common/common.scss';

import { variables } from '@/utils';
import ParametersFixedComponent from './parametersFixed';
import ParametersChangeComponent from './parametersChange';

const { TabPane } = Tabs;

const tabs = [
  {
    id: 'parametersFixed',
    name: 'Tham số cố định'
  },
  {
    id: 'parametersChange',
    name: 'Tham số thay đổi theo thời điểm'
  }
];

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
  const [tab, setTab] = useState(tabs[0].id);
  const [showDetails, setShowDetails] = useState(false);
  const [paramChanges, setParamChanges] = useState([]);

  const onFinish = (values) => {
    const data = {
      ...values,
      rangeDate: undefined,
      startDate: values.rangeDate[0],
      endDate: values.rangeDate[1],
      changeParameter: paramChanges
    };
    dispatch({
      type: 'schoolyearAdd/ADD',
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

  const remove = () => {
    formRef?.current?.resetFields();
    setShowDetails(false);
    setParamChanges([]);
  };

  const changeTab = (value) => {
    setTab(value);
  };

  const renderTab = (tab) => {
    switch(tab) {
      case 'parametersFixed':
        return (
          <ParametersFixedComponent fees={fees.filter(item => item.type === 'CD')} />
        );
      default:
        return (
          <ParametersChangeComponent
            formRef={formRef}
            fees={fees.filter(item => item.type === 'TD')}
            paramChanges={paramChanges}
            setParamChanges={(values) => setParamChanges(values)}
          />
        );
    }
  };

  const getPaymentForm = () => {
    dispatch({
      type: 'paymentMethod/GET_DATA',
      payload: {
        limit: variables.PAGINATION.SIZEMAX,
        page: variables.PAGINATION.PAGE
      },
    });
  };

  const getDetail  = async () => {
    const { getFieldsValue } = formRef?.current;
    const { yearFrom, yearTo, rangeDate } = getFieldsValue();
    setParamChanges([]);
    if (yearFrom && yearTo && rangeDate) {
      setShowDetails(true);
      getPaymentForm();
    } else {
      setShowDetails(false);
    }
  };

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
            initialValues={{}}
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
                    {tabs.map(({ id, name }) => (
                      <TabPane tab={name} key={id} />
                    ))}
                  </Tabs>
                  {renderTab(tab)}
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
          </Form>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
