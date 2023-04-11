import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import { isEmpty, head } from 'lodash';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import PropTypes from 'prop-types';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

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
const mapStateToProps = ({ menu, loading, childDevelopSkillAdd }) => ({
  loading,
  menuData: menu.menuLeftChildDevelop,
  details: childDevelopSkillAdd.details,
  error: childDevelopSkillAdd.error,
  paramaterValues: childDevelopSkillAdd.paramaterValues,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {};
    setIsMounted(true);
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'childDevelopSkillAdd/GET_DETAILS',
        payload: params,
      });
    }
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
      name: values?.name,
      use: values?.use ? values.use : false,
      id: params.id,
    };
    dispatch({
      type: params.id ? 'childDevelopSkillAdd/UPDATE' : 'childDevelopSkillAdd/ADD',
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
    const loadingSubmit =
      effects['childDevelopSkillAdd/ADD'] || effects['childDevelopSkillAdd/UPDATE'];
    const loading = effects['childDevelopSkillAdd/GET_DETAILS'];
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
                          <FormItem
                            label="Mã kỹ năng"
                            name="code"
                            type={variables.INPUT}
                            placeholder={' '}
                            disabled
                          />
                        </Pane>
                        <Pane className="col-lg-12">
                          <FormItem
                            label="Tên kỹ năng"
                            name="name"
                            type={variables.INPUT}
                            rules={[variables.RULES.EMPTY]}
                          />
                        </Pane>
                        <Pane className="col-lg-6">
                          <FormItem
                            valuePropName="checked"
                            label="Sử dụng"
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
                        permission={
                          params?.id
                            ? `${FLATFORM.WEB}${permissions.SPTCT_DANHMUC_KYNANG}${ACTION.EDIT}`
                            : `${FLATFORM.WEB}${permissions.SPTCT_DANHMUC_KYNANG}${ACTION.CREATE}`
                        }
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
