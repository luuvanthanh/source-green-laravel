import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Mentions } from 'antd';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { isEmpty, get } from 'lodash';
import Loading from '@/components/CommonComponent/Loading';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import RecipeComponent from './components/Recipe';

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
const mapStateToProps = ({ menu, loading, salaryParamaterFormulasAdd }) => ({
  menuData: menu.menuLeftSalary,
  loading,
  details: salaryParamaterFormulasAdd.details,
  error: salaryParamaterFormulasAdd.error,
  paramaterValues: salaryParamaterFormulasAdd.paramaterValues,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      dataRecipe: [],
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
        type: 'salaryParamaterFormulasAdd/GET_DETAILS',
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
      });
      this.onSetRecipe(details.recipe);
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
      type: 'salaryParamaterFormulasAdd/GET_PARAMTER_VAUES',
      payload: {},
    });
  };

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

  onSetRecipe = (recipe) => {
    if (!isEmpty(recipe)) {
      this.setStateData({
        dataRecipe: Helper.flatten(this.reverseData(recipe)),
      });
    }
  };

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

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { dataRecipe } = this.state;
    const recipe = this.covertDataRecipe(Helper.nest(dataRecipe));
    dispatch({
      type: params.id ? 'salaryParamaterFormulasAdd/UPDATE' : 'salaryParamaterFormulasAdd/ADD',
      payload: {
        ...values,
        id: params.id,
        recipe,
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

  renderCalulator = (items) =>
    items
      .map((item) => {
        if (!isEmpty(item.children)) {
          return `${item.operator || ''} (${this.renderCalulator(item.children)})`;
        }
        return `${item.operator || ''} (${item.value || item.variable || ''}${this.renderCalulator(
          item.children,
        )})`;
      })
      .join(' ');

  stringToSplit = (value) => {
    if (!/^\S*$/.test(value.trim())) {
      const keywords = value.match(/\\?.|^$/g).reduce(
        (p, c) => {
          console.log(p, c);
          if (c === '(' || c === ')') {
            p.quote ^= 1;
          } else if (!p.quote && c === ' ') {
            p.a.push('');
          } else {
            p.a[p.a.length - 1] += c.replace(/\\(.)/, '$1');
          }
          return p;
        },
        { a: [''] },
      ).a;
      return keywords.filter(Boolean);
    }
    return [];
  };

  covertTreeString = (value) => {
    const items = this.stringToSplit(value);
    return items.map((item) => {
      if (!/^\S*$/.test(item.trim())) {
        return { code: item, children: this.covertTreeString(item) };
      }
      return { code: item };
    });
  };

  onChangMentions = (value) => {
    const splitters = ['+', '-', '*', '/'];
    const values = splitters.reduce((old, c) => old.map((v) => v.split(c)).flat(), [value]);
    console.log(value, values);
    // let items = [];
    // let splitter = null;
    // values.filter(Boolean).forEach((item) => {
    //   if (['+', '-', '/', '*'].includes(item)) {
    //     splitter = item;
    //   } else {
    //     items = [
    //       ...items,
    //       {
    //         variable: item.replace('@', ''),
    //         type: 'variable',
    //         value: null,
    //         operator: splitter,
    //         formular: [],
    //       },
    //     ];
    //     splitter = null;
    //   }
    // });
    // console.log('items', items);
  };

  render() {
    const {
      error,
      menuData,
      loading: { effects },
      match: { params },
      paramaterValues,
    } = this.props;
    const { dataRecipe } = this.state;
    const loadingSubmit =
      effects['salaryParamaterFormulasAdd/ADD'] || effects['salaryParamaterFormulasAdd/UPDATE'];
    const loading = effects['salaryParamaterFormulasAdd/GET_DETAILS'];
    const MOCK_DATA = {
      '@': paramaterValues.map((item) => item.code),
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
                    <Form.Item label="CÔNG THỨC" name="dataRecipe" rules={[variables.RULES.EMPTY]}>
                      <Mentions
                        rows={3}
                        style={{ width: '100%' }}
                        placeholder="input @ to mention people, # to mention tag"
                        prefix={['@', '#']}
                        onChange={this.onChangMentions}
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
                {/* <Text color="dark" size="large-medium">
                  CÔNG THỨC
                </Text>
                {code && (
                  <div className="mt10">
                    <Text color="dark" size="large-medium">
                      {code} = {this.renderCalulator(Helper.nest(dataRecipe))}
                    </Text>
                  </div>
                )}
                <RecipeComponent data={dataRecipe} onSaveData={this.onSaveData} /> */}
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
                  disabled={isEmpty(dataRecipe)}
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
