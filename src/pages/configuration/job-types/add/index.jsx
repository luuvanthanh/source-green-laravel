import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { isEmpty, get, omit, head } from 'lodash';
import Loading from '@/components/CommonComponent/Loading';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

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
const mapStateToProps = ({ menu, loading, jobTypesAdd }) => ({
  menuConfiguration: menu.menuConfiguration,
  loading,
  details: jobTypesAdd.details,
  error: jobTypesAdd.error,
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
        type: 'jobTypesAdd/GET_DETAILS',
        payload: params,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && get(params, 'id')) {
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
      id: get(params, 'id'),
    };
    dispatch({
      type: params?.id ? 'jobTypesAdd/UPDATE' : 'jobTypesAdd/ADD',
      payload: params?.id ? payload : omit(payload, 'id'),
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
      menuConfiguration,
      loading: { effects },
    } = this.props;
    const loadingSubmit = effects['jobTypesAdd/ADD'] || effects['jobTypesAdd/UPDATE'];
    const loading = effects['jobTypesAdd/GET_DETAILS'];
    return (
      <>
        <Breadcrumbs last="Tạo loại công việc" menu={menuConfiguration} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          colon={false}
          ref={this.formRef}
          onFinish={this.onFinish}
        >
          <Loading loading={loading} isError={error.isError} params={{ error, goBack: '/cau-hinh/loai-cong-viec' }}>
            <div className={styles['content-form']}>
              <div className="d-flex justify-content-between">
                <Text color="dark">TẠO MỚI LOẠI CÔNG VIỆC</Text>
              </div>
              <div className={styles['content-children']}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-6">
                    <FormItem
                      label="MÃ"
                      name="code"
                      rules={[variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      label="TÊN"
                      name="name"
                      rules={[variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <FormItem
                      label="GHI CHÚ"
                      name="description"
                      rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                      type={variables.TEXTAREA}
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
                  htmlType="submit"
                  icon="save"
                  size="large"
                  loading={loadingSubmit}
                >
                  LƯU
                </Button>
              </div>
            </div>
          </Loading>
        </Form>
      </>
    );
  }
}

Index.propTypes = {};

export default Index;
