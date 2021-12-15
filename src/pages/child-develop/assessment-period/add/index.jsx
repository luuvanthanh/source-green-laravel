import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, DatePicker } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import { isEmpty, head } from 'lodash';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import PropTypes from 'prop-types';
import stylesModule from '../styles.module.scss';

const branches = [
  {
    id: 1,
    name: 'Nguyễn Văn Nam',
  },
  {
    id: 2,
    name: 'Nguyễn Văn',
  },
];

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
  paramaterValues: childDevelopAssessmentPeriodAdd.paramaterValues,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {};
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

  componentDidMount() {
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
      type: 'crmSaleParentsLead/GET_DATA',
      payload: {},
    });
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && params.id) {
      this.formRef.current.setFieldsValue({
        ...details,
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
    const {
      dispatch,
      match: { params },
    } = this.props;
    const payload = {
      ...values,
      id: params.id,
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

  render() {
    const {
      error,
      menuData,
      loading: { effects },
      match: { params },
    } = this.props;
    const loadingSubmit = effects['childDevelopAssessmentPeriodAdd/ADD'] || effects['childDevelopAssessmentPeriodAdd/UPDATE'];
    const loading = effects['childDevelopAssessmentPeriodAdd/GET_DETAILS'];
    return (
      <>
        <Breadcrumbs last={params.id ? 'Chỉnh sửa ' : 'Tạo mới'} menu={menuData} />
        <Pane className="col-lg-6 offset-lg-3">
          <Form
            className={styles['layout-form']}
            layout="vertical"
            colon={false}
            ref={this.formRef}
            onFinish={this.onFinish}
          >
            <Loading loading={loading} isError={error.isError} params={{ error }}>
              <div className={styles['content-form']}>
                <Pane className="pl20 pr20 mt20">
                  <Pane className="card">
                    <Pane className="p20">
                      <Heading type="form-title" className="mb20">
                        Thông tin thêm mới
                      </Heading>
                      <Pane className="row mt20">
                        <Pane className="col-lg-6">
                          <FormItem label="Mã kì đánh giá" name="code" type={variables.INPUT} placeholder={" "} disabled />
                        </Pane>
                        <Pane className="col-lg-12">
                          <FormItem label="Tên kì đánh giá" name="name" type={variables.INPUT} rules={[variables.RULES.EMPTY_INPUT]} />
                        </Pane>
                        <Pane className="col-lg-6">
                          <FormItem
                            options={['id', 'name']}
                            name=""
                            placeholder="Chọn"
                            type={variables.SELECT}
                            label="Năn học"
                            rules={[variables.RULES.EMPTY_INPUT]}
                          />
                        </Pane>
                        <Pane className="col-lg-6">
                          <div className={styles['form-item']}>
                            <label htmlFor="userId" className={stylesModule['wrapper-lable']}>Thời gian đánh giá</label>
                            <Form.Item name="selectDate" style={{ marginBottom: 0 }}>
                              <DatePicker.RangePicker
                                format={[variables.DATE_FORMAT.DATE, variables.DATE_FORMAT.DATE]}
                              />
                            </Form.Item>
                          </div>
                        </Pane>
                        <Pane className="col-lg-12">
                          <FormItem
                            name="facility"
                            data={branches}
                            mode="tags"
                            type={variables.SELECT_TAGS}
                            rules={[variables.RULES.EMPTY]}
                            label="Cơ sở áp dụng"
                          />
                        </Pane>
                        <Pane className="col-lg-12">
                          <FormItem
                            name="ddd"
                            data={branches}
                            mode="tags"
                            type={variables.SELECT_TAGS}
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
                      {params.id ? (
                        <p
                          className="btn-delete"
                          role="presentation"
                          loading={loadingSubmit}
                          onClick={() => this.cancel(params.id)}
                        >
                          Xóa
                        </p>
                      ) : (
                        <p
                          className="btn-delete"
                          role="presentation"
                          loading={loadingSubmit}
                          onClick={() => history.goBack()}
                        >
                          Hủy
                        </p>
                      )}
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
                  </Pane>
                </Pane>
              </div>
            </Loading>
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
  error: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  menuData: [],
  loading: {},
  dispatch: {},
  error: {},
  details: {},
};

export default Index;
