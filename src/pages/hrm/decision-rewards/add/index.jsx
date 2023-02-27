import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get, isEmpty, head } from 'lodash';
import moment from 'moment';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import PropTypes from 'prop-types';
import variablesModules from '../../utils/variables';


let isMounted = true;
/**
 * Set isMounted
 * @param {boolean} value
 * @returns {boolean} value of isMounted
 */
const setIsMounted = (value = true) => {
  isMounted = value;
  return isMounted;
};
/**
 * Get isMounted
 * @returns {boolean} value of isMounted
 */
const getIsMounted = () => isMounted;
const mapStateToProps = ({ menu, decisionRewardsAdd, loading }) => ({
  loading,
  categories: decisionRewardsAdd.categories,
  details: decisionRewardsAdd.details,
  menuData: menu.menuLeftHRM,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      dataFormContarct: {},
    };
    setIsMounted(true);
  }

  componentWillUnmount() {
    setIsMounted(false);
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'decisionRewardsAdd/GET_DETAILS',
        payload: {
          id: params.id,
        },
      });
    }
    this.loadCategories();
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && get(params, 'id')) {
      this.formRef.current.setFieldsValue({
        ...details,
        ...head(details.decisionRewardDetails),
        decisionDate: details.decisionDate && moment(details.decisionDate),
        timeApply:
          head(details.decisionRewardDetails)?.timeApply &&
          moment(head(details.decisionRewardDetails)?.timeApply),
        type: details.type,
      });
      this.setStateData({
        dataFormContarct: details?.numberForm && [details],
      });
    }
  }

  /**
   * Set state properties
   * @param {object} data the data input
   * @param {function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof setStateData
   */
  setStateData = (state, callback) => {
    if (!getIsMounted()) {
      return;
    }
    this.setState(state, callback);
  };

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'decisionRewardsAdd/GET_CATEGORIES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { dataFormContarct } = this.state;
    dispatch({
      type: params.id ? 'decisionRewardsAdd/UPDATE' : 'decisionRewardsAdd/ADD',
      payload: {
        id: params.id,
        typeDecisionNumberSample: variablesModules?.STATUS_TYPE_DECISION?.DISCIPLINE_REWARD,
        ordinalNumber: values.ordinalNumber,
        numberForm: head(dataFormContarct)?.numberForm,
        decisionNumberSampleId: head(dataFormContarct)?.id,
        decisionDate: values.decisionDate,
        type: values.type,
        reason: values.reason,
        data: [
          {
            employeeId: values.employeeId,
            money: values.money,
            timeApply: values.timeApply,
            note: values.note,
          },
        ],
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              this.formRef.current.setFields([
                {
                  name: get(item, 'source.pointer'),
                  errors: [get(item, 'detail')],
                },
              ]);
            });
          }
        }
      },
    });
  };

  converNumber = (input) => {
    const pad = input;
    if ((Number(input) + 1)?.toString().length < pad?.length) {
      return pad?.substring(0, pad?.length - (Number(input) + 1).toString()?.length) + (Number(input) + 1);
    }
    return input ? `${Number(input) + 1}` : "";
  };

  onChangeNumber = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'transfersAdd/GET_NUMBER_DECISION_DENOMINATOR',
      payload: { decisionDate: moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type: variablesModules?.STATUS_TYPE_DECISION?.DISCIPLINE_REWARD },
      callback: (response) => {
        this.setStateData({
          dataFormContarct: response?.parsePayload,
        });
        this.formRef.current.setFieldsValue({
          ordinalNumber: this.converNumber(head(response?.parsePayload)?.ordinalNumber),
        });
      }
    });
  };


  render() {
    const {
      categories,
      menuData,
      loading: { effects },
      match: { params },
    } = this.props;
    const { dataFormContarct } = this.state;
    const loadingSubmit = effects['decisionRewardsAdd/ADD'] || effects['decisionRewardsAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs
          last={params.id ? 'Chỉnh sửa QĐ Khen thưởng/ Kỷ luật' : 'Tạo QĐ Khen thưởng/ Kỷ luật'}
          menu={menuData}
        />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          ref={this.formRef}
          onFinish={this.onFinish}
        >
          <div className={styles['content-form']}>
            <div className={classnames(styles['content-children'], 'mt10')}>
              <Text color="dark" size="large-medium">
                THÔNG TIN CHUNG
              </Text>
              <div className="row mt-3">
                <div className="col-lg-6">
                  <FormItem
                    data={Helper.convertSelectUsers(categories?.users)}
                    label="Nhân viên"
                    name="employeeId"
                    rules={[variables.RULES.EMPTY]}
                    type={variables.SELECT}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <FormItem
                    label="Ngày quyết định"
                    name="decisionDate"
                    disabledDate={(current) => {
                      Helper.disabledDate(current);
                      Helper.disabledDateFrom(current, this.formRef, 'timeApply');
                    }}
                    onChange={this.onChangeNumber}
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    label="Số quyết định"
                    name="ordinalNumber"
                    type={variables.INPUT}
                    disabled={isEmpty(dataFormContarct)}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                  />
                </div>
                <div className="col-lg-3">
                  <p className="mb0 font-size-13 mt35 font-weight-bold">
                    {!isEmpty(dataFormContarct) ? `/${head(dataFormContarct)?.numberForm}` : ''}
                  </p>
                </div>
                <div className="col-lg-6">
                  <FormItem
                    label="Ngày áp dụng"
                    name="timeApply"
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                    disabledDate={(current) =>
                      Helper.disabledDateTo(current, this.formRef, 'decisionDate')
                    }
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <FormItem
                    label="Lý do"
                    name="reason"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <FormItem
                    data={[
                      { id: 'REWARD', name: 'Khen thưởng' },
                      { id: 'DISCIPLINE', name: 'Kỷ luật' },
                    ]}
                    label="Loại QĐ"
                    name="type"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
                <div className="col-lg-6">
                  <FormItem
                    label="Mức thưởng, mức phạt"
                    name="money"
                    type={variables.INPUT_NUMBER}
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
                <div className="col-lg-12">
                  <FormItem
                    label="Ghi chú"
                    name="note"
                    type={variables.TEXTAREA}
                    rules={[variables.RULES.MAX_LENGTH_INPUT]}
                  />
                </div>
              </div>
            </div>
            <div className={classnames('d-flex', 'justify-content-center', 'mt-4')}>
              <Button
                color="gray"
                icon="prev"
                onClick={() => history.goBack()}
                size="large"
                className="mr-3"
                loading={loadingSubmit}
              >
                HỦY
              </Button>
              <Button
                color="green"
                icon="save"
                htmlType="submit"
                size="large"
                loading={loadingSubmit}
              >
                LƯU
              </Button>
            </div>
          </div>
        </Form>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  categories: PropTypes.objectOf(PropTypes.any),
  menuData: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  details: {},
  loading: {},
  dispatch: {},
  categories: {},
  menuData: [],
};

export default Index;
