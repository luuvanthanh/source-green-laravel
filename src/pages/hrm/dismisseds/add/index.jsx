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
import Loading from '@/components/CommonComponent/Loading';
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
const mapStateToProps = ({ menu, dismissedsAdd, loading }) => ({
  loading,
  categories: dismissedsAdd.categories,
  branches: dismissedsAdd.branches,
  divisions: dismissedsAdd.divisions,
  positions: dismissedsAdd.positions,
  details: dismissedsAdd.details,
  error: dismissedsAdd.error,
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
        type: 'dismissedsAdd/GET_DETAILS',
        payload: params,
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
        ...head(details.dismissedDetails),
        decisionDate: details.decisionDate && moment(details.decisionDate),
        timeApply: details.timeApply && moment(details.timeApply),
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
      type: 'dismissedsAdd/GET_CATEGORIES',
      payload: {},
    });
    dispatch({
      type: 'dismissedsAdd/GET_BRANCHES',
      payload: {},
    });
    dispatch({
      type: 'dismissedsAdd/GET_DIVISIONS',
      payload: {},
    });
    dispatch({
      type: 'dismissedsAdd/GET_POSITIONS',
      payload: {},
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
      payload: { decisionDate: moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type: variablesModules?.STATUS_TYPE_DECISION?.DISMISSED },
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


  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { dataFormContarct } = this.state;
    dispatch({
      type: params.id ? 'dismissedsAdd/UPDATE' : 'dismissedsAdd/ADD',
      payload: {
        id: params.id,
        ordinalNumber: values.ordinalNumber,
        numberForm: head(dataFormContarct)?.numberForm,
        decisionNumberSampleId: head(dataFormContarct)?.id,
        type: variablesModules?.STATUS_TYPE_DECISION?.DISMISSED,
        decisionDate: values.decisionDate,
        timeApply: values.timeApply,
        reason: values.reason,
        data: [
          {
            employeeId: values.employeeId,
            branchId: values.branchId,
            divisionId: values.divisionId,
            positionId: values.positionId,
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

  render() {
    const {
      error,
      positions,
      branches,
      divisions,
      categories,
      menuData,
      loading: { effects },
      match: { params },
    } = this.props;
    const { dataFormContarct } = this.state;
    const loading =
      effects['dismissedsAdd/GET_CATEGORIES'] ||
      effects['dismissedsAdd/GET_BRANCHES'] ||
      effects['dismissedsAdd/GET_DIVISIONS'] ||
      effects['dismissedsAdd/GET_POSITIONS'];
    const loadingSubmit = effects['dismissedsAdd/ADD'] || effects['dismissedsAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs last={params.id ? 'Chỉnh sửa miễn nhiệm' : 'Tạo miễn nhiệm'} menu={menuData} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          ref={this.formRef}
          onFinish={this.onFinish}
        >
          <div className={styles['content-form']}>
            <Loading loading={loading} isError={error.isError} params={{ error, goBack: '/quan-ly-nhan-su/mien-nhiem' }}>
              <div className={classnames(styles['content-children'], 'mt10')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-6">
                    <FormItem
                      data={Helper.convertSelectUsers(categories?.users)}
                      label="NHÂN VIÊN"
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
                      disabledDate={Helper.disabledDate}
                      type={variables.DATE_PICKER}
                      onChange={this.onChangeNumber}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="Số quyết định"
                      name="ordinalNumber"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY,
                      variables.RULES.ONLY_TEXT_NUMBER,
                      variables.RULES.MAX_ONLY_TEXT_NUMBER,
                      variables.RULES.MIN_ONLY_TEXT_NUMBER]}
                      disabled={isEmpty(dataFormContarct)}
                    />
                  </div>
                  <div className="col-lg-3">
                    <p className="mb0 font-size-13 mt35 font-weight-bold">
                      {!isEmpty(dataFormContarct) ? `/${head(dataFormContarct)?.numberForm}` : ''}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <FormItem
                      label="Ngày áp dụng"
                      name="timeApply"
                      type={variables.DATE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      data={branches}
                      label="Cơ sở mới"
                      name="branchId"
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      data={divisions}
                      label="Bộ phận mới"
                      name="divisionId"
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      data={positions}
                      label="Chức vụ mới"
                      name="positionId"
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY]}
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
            </Loading>
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
  branches: PropTypes.arrayOf(PropTypes.any),
  categories: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  menuData: PropTypes.arrayOf(PropTypes.any),
  positions: PropTypes.arrayOf(PropTypes.any),
  divisions: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  details: {},
  loading: {},
  dispatch: {},
  branches: [],
  categories: {},
  error: {},
  menuData: [],
  positions: [],
  divisions: [],
};

export default Index;
