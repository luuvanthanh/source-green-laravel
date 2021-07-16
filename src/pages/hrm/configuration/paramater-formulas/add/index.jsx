import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
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
const mapStateToProps = ({ menu, loading, paramaterFormulasAdd }) => ({
  menuData: menu.menuLeftHRM,
  loading,
  details: paramaterFormulasAdd.details,
  error: paramaterFormulasAdd.error,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      dataRecipe: [],
      code: '',
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
        type: 'paramaterFormulasAdd/GET_DETAILS',
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
      type: params.id ? 'paramaterFormulasAdd/UPDATE' : 'paramaterFormulasAdd/ADD',
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

  render() {
    const {
      error,
      menuData,
      loading: { effects },
      match: { params },
    } = this.props;
    const { dataRecipe, code } = this.state;
    const loadingSubmit =
      effects['paramaterFormulasAdd/ADD'] || effects['paramaterFormulasAdd/UPDATE'];
    const loading = effects['paramaterFormulasAdd/GET_DETAILS'];
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
                      onChange={this.onChangeCode}
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
                <Text color="dark" size="large-medium">
                  CÔNG THỨC
                </Text>
                {code && (
                  <div className="mt10">
                    <Text color="dark" size="large-medium">
                      {code} = {this.renderCalulator(Helper.nest(dataRecipe))}
                    </Text>
                  </div>
                )}
                <RecipeComponent data={dataRecipe} onSaveData={this.onSaveData} />
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
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  error: {},
  menuData: [],
  details: {},
};

export default Index;
