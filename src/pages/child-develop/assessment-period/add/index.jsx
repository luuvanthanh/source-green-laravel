import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, DatePicker } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import { isEmpty, omit, last, head } from 'lodash';

import Button from '@/components/CommonComponent/Button';
import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import Loading from '@/components/CommonComponent/Loading';
import moment from 'moment';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import PropTypes from 'prop-types';
import stylesModule from '../styles.module.scss';
import variablesModules from '../utils/variables';


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
const mapStateToProps = ({ menu, loading, childDevelopAssessmentPeriodAdd }) => ({
  loading,
  menuData: menu.menuLeftChildDevelop,
  details: childDevelopAssessmentPeriodAdd.details,
  error: childDevelopAssessmentPeriodAdd.error,
  schoolYear: childDevelopAssessmentPeriodAdd.schoolYear,
  problems: childDevelopAssessmentPeriodAdd.problems,
  branches: childDevelopAssessmentPeriodAdd.branches,
  dataClass: childDevelopAssessmentPeriodAdd.dataClass,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      type: (variablesModules.TYPE.PERIODIC),
    };
    setIsMounted(true);
  }

  cancel = (id) => {
    const { dispatch } = this.props;
    return Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'childDevelopAssessmentPeriodAdd/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              history.goBack();
            }
          },
        });
      },
    });
  };

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'childDevelopAssessmentPeriodAdd/GET_SCHOOL_YEAR',
      payload: {},
    });
    dispatch({
      type: 'childDevelopAssessmentPeriodAdd/GET_BRANCHES',
      payload: {},
    });
    dispatch({
      type: 'childDevelopAssessmentPeriodAdd/GET_CLASS',
      payload: {},
    });
    dispatch({
      type: 'childDevelopAssessmentPeriodAdd/GET_PROBLEMS',
      payload: {},
    });
  };


  componentDidMount() {
    this.loadCategories();
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'childDevelopAssessmentPeriodAdd/GET_DETAILS',
        payload: params,
      });
    }
    dispatch({
      type: 'childDevelopAssessmentPeriodAdd/GET_DATA',
      payload: {},
    });
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && params.id) {
      this.setStateData({
        type: details?.periodic
          ? variablesModules.TYPE.PERIODIC
          : variablesModules.TYPE.INTRODUCTION,
      });
      this.formRef.current.setFieldsValue({
        ...details,
        branchId: details.branch.map((i) => i.id),
        classesId: details.classes.map((i) => i.id),
        selectDate: details?.startDate &&
          details?.endDate && [
            moment(details?.startDate),
            moment(details?.endDate),
          ],
      });
    }
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

  onFinish = (values) => {
    const { type } = this.state;
    const {
      dispatch,
      match: { params },
    } = this.props;
    const payload = {
      ...omit(values, 'selectDate'),
      startDate:
        head(values.selectDate) &&
        Helper.getDate(head(values.selectDate), variables.DATE_FORMAT.DATE_AFTER),
      endDate:
        last(values.selectDate) &&
        Helper.getDate(last(values.selectDate), variables.DATE_FORMAT.DATE_AFTER),
      ...values,
      id: params.id,
      periodic: type === 'PERIODIC' ? true : 'false',
      introduction: type === 'INTRODUCTION' ? true : 'false',
    };
    dispatch({
      type: params.id ? 'childDevelopAssessmentPeriodAdd/UPDATE' : 'childDevelopAssessmentPeriodAdd/ADD',
      payload,
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

  onChangeType = (event) => {
    this.setStateData({ type: event.target.value });
  };

  render() {
    const {

      menuData,
      dataClass,
      schoolYear,
      problems,
      branches,
      loading: { effects },
      match: { params },
    } = this.props;
    const loadingSubmit = effects['childDevelopAssessmentPeriodAdd/ADD'] || effects['childDevelopAssessmentPeriodAdd/UPDATE'];
    const loading = effects['childDevelopAssessmentPeriodAdd/GET_DETAILS'];

    return (
      <>
        <Breadcrumbs last={params.id ? 'Chỉnh sửa ' : 'Tạo mới'} menu={menuData} />
        <Pane className="col-lg-8 offset-lg-2">
          <Form
            className={styles['layout-form']}
            layout="vertical"
            colon={false}
            ref={this.formRef}
            onFinish={this.onFinish}
          >
            <div className={styles['content-form']}>
              <Pane className="pl20 pr20 mt20">
                <Pane className="card">
                  <Loading loading={loading} >
                    <Pane className="p20">
                      <Heading type="form-title" className="mb20">
                        Thông tin thêm mới
                      </Heading>
                      <Pane className="row mt20">
                        <Pane className="col-lg-6">
                          <FormItem label="Mã kỳ đánh giá" name="code" type={variables.INPUT} placeholder={" "} disabled />
                        </Pane>
                        <Pane className="col-lg-6">
                          <FormItem
                            name="nameAssessmentPeriodId"
                            data={problems}
                            placeholder="Chọn"
                            type={variables.SELECT}
                            label="Tên kỳ đánh giá"
                            rules={[variables.RULES.EMPTY_INPUT]}
                          />
                        </Pane>
                        <Pane className="col-lg-6">
                          <FormItem
                            name="schoolYearId"
                            data={schoolYear.map(item => ({ ...item, name: `${item?.yearFrom} - ${item?.yearTo}` }))}
                            placeholder="Chọn"
                            type={variables.SELECT}
                            label="Năm học"
                            rules={[variables.RULES.EMPTY_INPUT]}
                          />
                        </Pane>
                        <Pane className="col-lg-6">
                          <div className={styles['form-item']}>
                            <label htmlFor="userId" className={stylesModule['wrapper-lable']} >Thời gian đánh giá</label>
                            <Form.Item name="selectDate" style={{ marginBottom: 0 }} rules={[variables.RULES.EMPTY]}>
                              <DatePicker.RangePicker
                                format={[variables.DATE_FORMAT.DATE, variables.DATE_FORMAT.DATE]}
                              />
                            </Form.Item>
                          </div>
                        </Pane>
                        <Pane className="col-lg-12">
                          <FormItem
                            name="branchId"
                            data={branches}
                            type={variables.SELECT_MUTILPLE}
                            rules={[variables.RULES.EMPTY]}
                            label="Cơ sở áp dụng"
                          />
                        </Pane>
                        <Pane className="col-lg-12">
                          <FormItem
                            name="classesId"
                            data={dataClass}
                            type={variables.SELECT_MUTILPLE}
                            rules={[variables.RULES.EMPTY]}
                            label="Lớp áp dụng"
                          />
                        </Pane>
                        <Pane className="col-lg-6">
                          <FormItem
                            valuePropName="checked"
                            label="Áp dụng"
                            name="use"
                            type={variables.SWITCH}
                          />
                        </Pane>
                      </Pane>
                    </Pane>
                    <Pane className="p20 d-flex justify-content-between align-items-center border-top">
                      <p
                        className="btn-delete"
                        role="presentation"
                        loading={loadingSubmit}
                        onClick={() => history.goBack()}
                      >
                        Hủy
                      </p>
                      <Button
                        className="ml-auto px25"
                        color="success"
                        htmlType="submit"
                        size="large"
                        loading={loadingSubmit}
                      >
                        Lưu
                      </Button>
                    </Pane>
                  </Loading>
                </Pane>
              </Pane>
            </div>
          </Form>
        </Pane>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  menuData: PropTypes.arrayOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  schoolYear: PropTypes.arrayOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  dataClass: PropTypes.arrayOf(PropTypes.any),
  problems: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  menuData: [],
  loading: {},
  dispatch: {},
  details: {},
  schoolYear: [],
  branches: [],
  dataClass: [],
  problems: [],
};

export default Index;
