import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get, isEmpty } from 'lodash';
import Text from '@/components/CommonComponent/Text';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
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
const mapStateToProps = ({ absentReasonStudentAdd, loading, menu }) => ({
  loading,
  error: absentReasonStudentAdd.error,
  details: absentReasonStudentAdd.details,
  categories: absentReasonStudentAdd.categories,
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
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (get(params, 'id')) {
      dispatch({
        type: 'absentReasonStudentAdd/GET_DETAILS',
        payload: get(params, 'id'),
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
      });
    }
  }

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'absentReasonStudentAdd/GET_CATEGORIES',
      payload: {},
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: get(params, 'id') ? 'absentReasonStudentAdd/UPDATE' : 'absentReasonStudentAdd/ADD',
      payload: {
        ...values,
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

  render() {
    const {
      error,
      menuData,
      categories,
      loading: { effects },
      match: { params },
    } = this.props;
    const loading =
      effects['absentReasonStudentAdd/GET_DETAILS'] ||
      effects['absentReasonStudentAdd/GET_CATEGORIES'];
    const loadingSubmit =
      effects['absentReasonStudentAdd/ADD'] || effects['absentReasonStudentAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs last={params.id ? 'Chỉnh sửa lý do' : 'Tạo lý do'} menu={menuData} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          colon={false}
          onFinish={this.onFinish}
          ref={this.formRef}
        >
          <div className={styles['content-form']}>
            <Loading loading={loading} isError={error.isError} params={{ error, goBack: '/diem-danh/cau-hinh/ly-do-nghi-phep' }}>
              <div className={classnames(styles['content-children'], 'mt10')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-12">
                    <FormItem
                      label="TÊN"
                      name="name"
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <FormItem
                      data={categories?.absentTypes || []}
                      label="LOẠI NGHỈ PHÉP"
                      name="absentTypeId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
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
            </Loading>
          </div>
        </Form>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  menuData: PropTypes.arrayOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  categories: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  error: {},
  menuData: [],
  details: {},
  categories: {},
};

export default Index;
