import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import stylesModule from '@/assets/styles/Modules/Schedules/styles.module.scss';
import { DeleteOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { get, isEmpty } from 'lodash';
import Text from '@/components/CommonComponent/Text';
import Loading from '@/components/CommonComponent/Loading';
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
const mapStateToProps = ({ workDeclarationsAdd, loading, menu }) => ({
  dataStores: workDeclarationsAdd.dataStores,
  loading: loading,
  error: workDeclarationsAdd.error,
  details: workDeclarationsAdd.details,
  categories: workDeclarationsAdd.categories,
  menuData: menu.menuLeftHRM,
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
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (get(params, 'id')) {
      dispatch({
        type: 'workDeclarationsAdd/GET_DETAILS',
        payload: get(params, 'id'),
      });
    }
    this.loadCategories();
  }

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workDeclarationsAdd/GET_CATEGORIES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: params.id ? 'workDeclarationsAdd/UPDATE' : 'workDeclarationsAdd/ADD',
      payload: {
        employeeId: values.employeeId,
        date: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.date,
            targetValue: '23:59:59',
          }),
          isUTC: false,
        }),
        time: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.time,
            targetValue: '23:59:59',
          }),
          format: variables.DATE_FORMAT.TIME_FULL,
          isUTC: false,
        }),
        id: get(params, 'id'),
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

  onChangeTimePicker = (e) => {
    if (this.formRef.current) {
      this.formRef.current.setFieldsValue({
        time: e,
      });
    }
  };

  render() {
    const {
      error,
      menuData,
      categories,
      loading: { effects },
    } = this.props;
    const loading = effects['workDeclarationsAdd/GET_DETAILS'];
    const loadingSubmit =
      effects['workDeclarationsAdd/ADD'] || effects['workDeclarationsAdd/UPDATE'];
    return (
      <>
        <Helmet title="Tạo mới công bổ sung" />
        <Breadcrumbs last="Tạo mới công bổ sung" menu={menuData} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          initialValues={{}}
          colon={false}
          onFinish={this.onFinish}
          ref={this.formRef}
        >
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <div className={styles['content-form']}>
              <div className={classnames(styles['content-children'], 'mt10')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-12">
                    <FormItem
                      data={Helper.convertSelectUsers(categories.users)}
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
                      label="NGÀY"
                      name="date"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.DATE_PICKER}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      label="GIỜ"
                      name="time"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.TIME_PICKER}
                      onSelect={this.onChangeTimePicker}
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
                  loading={loadingSubmit || loading}
                >
                  HỦY
                </Button>
                <Button
                  color="green"
                  icon="save"
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit || loading}
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
