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
const mapStateToProps = ({ menu, loading, criteriaGroupPropertiesAdd }) => ({
  menuData: menu.menuLeftCriteria,
  loading,
  details: criteriaGroupPropertiesAdd.details,
  criteriaGroups: criteriaGroupPropertiesAdd.criteriaGroups,
  criteriaDataTypes: criteriaGroupPropertiesAdd.criteriaDataTypes,
  error: criteriaGroupPropertiesAdd.error,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      type: null,
    };
    setIsMounted(true);
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'criteriaGroupPropertiesAdd/GET_DETAILS',
        payload: params,
      });
    }
    dispatch({
      type: 'criteriaGroupPropertiesAdd/GET_CRITERIA_GROUPS',
      payload: params,
    });
    dispatch({
      type: 'criteriaGroupPropertiesAdd/GET_CRITERIA_DATATYPES',
      payload: params,
    });
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
    const { type } = this.state;
    let payload = {
      ...values,
      id: get(params, 'id'),
    };
    dispatch({
      type: params?.id ? 'criteriaGroupPropertiesAdd/UPDATE' : 'criteriaGroupPropertiesAdd/ADD',
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
      menuData,
      dataSelect,
      criteriaGroups,
      criteriaDataTypes,
      loading: { effects },
    } = this.props;
    const { type } = this.state;
    const loadingSubmit =
      effects['criteriaGroupPropertiesAdd/ADD'] || effects['criteriaGroupPropertiesAdd/UPDATE'];
    const loading = effects['criteriaGroupPropertiesAdd/GET_DETAILS'];
    return (
      <>
        <Breadcrumbs last="Tạo thuộc nhóm tiêu chí" menu={menuData} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          colon={false}
          ref={this.formRef}
          onFinish={this.onFinish}
        >
          <Loading loading={loading} isError={error.isError} params={{ error, goBack: "/chuong-trinh-hoc/cau-hinh/thuoc-nhom-tieu-chi" }}>
            <div className={styles['content-form']}>
              <div className={classnames(styles['content-children'], 'mt10')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-12">
                    <FormItem
                      label="TÊN"
                      name="property"
                      rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <FormItem
                      data={criteriaDataTypes.map((item) => ({
                        id: item.id,
                        name: item.key,
                      }))}
                      label="KIỂU DỮ LIỆU"
                      name="criteriaDataTypeId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      data={criteriaGroups}
                      label="NHÓM TIÊU CHÍ"
                      name="criteriaGroupId"
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
