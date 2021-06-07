import React, { PureComponent } from 'react';
import { connect, history, withRouter } from 'umi';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty, head } from 'lodash';
import moment from 'moment';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import variablesModules from '../../../utils/variables';

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
const mapStateToProps = ({ tutorialAddV2, loading, menu }) => ({
  loading,
  error: tutorialAddV2.error,
  details: tutorialAddV2.details,
  branches: tutorialAddV2.branches,
  menuData: menu.menuLeftSchedules,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {};
    setIsMounted(true);
  }

  componentWillUnmount() {
    setIsMounted(false);
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

  componentDidMount() {
    this.loadCategories();
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && params?.id) {
      this.formRef.current.setFieldsValue({
        ...details,
      });
    }
  }

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tutorialAddV2/GET_BRANCHES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: params?.id ? 'tutorialAddV2/UPDATE' : 'tutorialAddV2/ADD',
      payload: {
        ...values,
        busRouteShedules: values.busRouteShedules.map((item) => ({
          dayOfWeek: item,
        })),
        id: params?.id,
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              this.formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
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
      details,
      branches,
      loading: { effects },
    } = this.props;
    const loading = effects['tutorialAddV2/GET_DETAILS'] || effects['tutorialAddV2/GET_BRANCHES'];
    const loadingSubmit = effects['tutorialAddV2/ADD'] || effects['tutorialAddV2/UPDATE'];
    return (
      <Form
        layout="vertical"
        ref={this.formRef}
        initialValues={{
          ...details,
          busRouteShedules: details?.busRouteShedules?.map((item) => item.dayOfWeek),
          startDate: details?.startDate && moment(details?.startDate),
          endDate: details?.startDate && moment(details?.endDate),
        }}
        onFinish={this.onFinish}
      >
        <div className="card">
          <Loading loading={loading} isError={error.isError} params={{ error, type: 'container' }}>
            <div style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Thông tin chung
              </Heading>
              <div className="row">
                <div className="col-lg-8">
                  <FormItem
                    name="name"
                    label="Tên lộ trình"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    data={branches}
                    name="startedPlace"
                    label="Điểm xuất phát"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <FormItem
                    data={variablesModules.DAYS}
                    label="Thời gian lặp lại của lộ trình"
                    name="busRouteShedules"
                    type={variables.SELECT_MUTILPLE}
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <FormItem
                    label="THỜI GIAN BẮT ĐẦU"
                    name="startDate"
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                    disabledDate={(current) => Helper.disabledDateFrom(current, this.formRef)}
                  />
                </div>
                <div className="col-lg-6">
                  <FormItem
                    label="THỜI GIAN KẾT THÚC"
                    name="endDate"
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                    disabledDate={(current) => Helper.disabledDateTo(current, this.formRef)}
                  />
                </div>
              </div>
            </div>

            <div className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
              <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
                Lưu
              </Button>
            </div>
          </Loading>
        </div>
      </Form>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  error: {},
  details: {},
  branches: [],
};

export default withRouter(Index);
