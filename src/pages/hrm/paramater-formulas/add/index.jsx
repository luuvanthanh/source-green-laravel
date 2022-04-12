import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Mentions } from 'antd';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { isEmpty, get, isInteger } from 'lodash';
import Loading from '@/components/CommonComponent/Loading';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

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
const mapStateToProps = ({ menu, loading, paramaterFormulasAdd }) => ({
  menuData: menu.menuLeftSalary,
  loading,
  details: paramaterFormulasAdd.details,
  error: paramaterFormulasAdd.error,
  paramaterValues: paramaterFormulasAdd.paramaterValues,
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
        type: 'paramaterFormulasAdd/GET_DETAILS',
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
        applyDate: details.applyDate && moment(details.applyDate),
        recipe: this.renderCalulator(details.recipe),
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

  loadCategories = () => {
    this.props.dispatch({
      type: 'paramaterFormulasAdd/GET_PARAMTER_VAUES',
      payload: {},
    });
  };

  getVariable = (value) => {
    if (value) return `@${value}`;
    return null;
  };

  renderCalulator = (items) =>
    items
      .map((item) => {
        if (!isEmpty(item.formular)) {
          return `${item.operator || ''} (${this.renderCalulator(item.formular)})`;
        }
        return `${item.operator || ''} ${
          item.value || this.getVariable(item.variable) || ''
        }${this.renderCalulator(item.formular)}`;
      })
      .join(' ');

  reverseData = (items, parentId = null, level = 1) =>
    items.map((item) => {
      const uID = uuidv4();
      return {
        ...item,
        key: uID,
        id: uID,
        parentId,
        level,
        children: this.reverseData(item.formular, uID, level + 1),
      };
    });

  onChangeCode = (e) => {
    this.setStateData({
      code: e.target.value,
    });
  };

  covertDataRecipe = (items) =>
    items.map((item) => {
      if (item.value) {
        return {
          type: 'value',
          variable: item.variable,
          value: item.value,
          operator: item.operator,
          formular: this.covertDataRecipe(item.children),
        };
      }
      return {
        type: !isEmpty(item.children) ? 'formular' : 'variable',
        variable: item.variable,
        value: item.value,
        operator: item.operator,
        formular: this.covertDataRecipe(item.children),
      };
    });

  addSpaceString = (string) => {
    const stringNotSpace = string.replace(/\s/g, '');
    return stringNotSpace
      .replaceAll('+', ' + ')
      .replaceAll('-', ' - ')
      .replaceAll('/', ' / ')
      .replaceAll('*', ' * ')
      .replaceAll(')', ')')
      .replaceAll('(', '(');
  };

  removeItemRedundant = (items) =>
    items
      .filter((item) => item.enum)
      .map((item) => ({ ...item, children: item?.children?.filter((item) => item.enum) }));

  recipeRecursive = (items) =>
    items.map((item) => {
      if (isInteger(item.enum)) {
        return {
          variable: null,
          type: 'value',
          value: item.enum,
          operator: item.recipe,
          formular: item.children ? this.recipeRecursive(item.children) : [],
        };
      }
      return {
        variable: !isEmpty(item.children) ? 'formular' : item.enum.replaceAll('@', ''),
        type: !isEmpty(item.children) ? 'formular' : 'variable',
        value: null,
        operator: item.recipe,
        formular: item.children ? this.recipeRecursive(item.children) : [],
      };
    });

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: params.id ? 'paramaterFormulasAdd/UPDATE' : 'paramaterFormulasAdd/ADD',
      payload: {
        ...values,
        id: params.id,
        recipe: this.recipeRecursive(
          this.removeItemRedundant(Helper.splitString(this.addSpaceString(values.recipe))),
        ),
        applyDate: Helper.getDate(values.applyDate, variables.DATE_FORMAT.DATE_AFTER),
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

  onSaveData = (dataRecipe) => {
    this.setStateData({
      dataRecipe,
    });
  };

  render() {
    const {
      error,
      menuData,
      loading: { effects },
      match: { params },
      paramaterValues,
    } = this.props;
    const loadingSubmit =
      effects['paramaterFormulasAdd/ADD'] || effects['paramaterFormulasAdd/UPDATE'];
    const loading = effects['paramaterFormulasAdd/GET_DETAILS'];
    const MOCK_DATA = {
      '@': [...new Set(paramaterValues.map((item) => item.code))],
    };

    return (
      <>
        <Breadcrumbs
          last={params.id ? 'Chỉnh sửa tham số công thức' : 'Tạo tham số công thức'}
          menu={menuData}
        />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          colon={false}
          ref={this.formRef}
          onFinish={this.onFinish}
        >
          <Loading
            loading={loading}
            isError={error.isError}
            params={{ error, goBack: '/quan-ly-nhan-su/cau-hinh/tham-so-cong-thuc' }}
          >
            <div className={styles['content-form']}>
              <div className={classnames(styles['content-children'], 'mt10')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-6">
                    <FormItem
                      label="MÃ"
                      name="code"
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                      disabled={params?.id}
                    />
                  </div>
                  <div className="col-lg-6">
                    <FormItem
                      label="TÊN"
                      name="name"
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <FormItem
                      label="NGÀY ÁP DỤNG"
                      name="applyDate"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.DATE_PICKER}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <Form.Item label="CÔNG THỨC" name="recipe" rules={[variables.RULES.EMPTY]}>
                      <Mentions
                        rows={5}
                        style={{ width: '100%' }}
                        placeholder="Nhập công thức, @ là mã giá trị tham số"
                        prefix={['@']}
                      >
                        {(MOCK_DATA['@'] || []).map((value) => (
                          <Mentions.Option key={value} value={value}>
                            {value}
                          </Mentions.Option>
                        ))}
                      </Mentions>
                    </Form.Item>
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

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  menuData: PropTypes.arrayOf(PropTypes.any),
  paramaterValues: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  error: {},
  menuData: [],
  details: {},
  paramaterValues: [],
};

export default Index;
