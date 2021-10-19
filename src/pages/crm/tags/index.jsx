import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Form, Tag } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import { isEmpty, head } from 'lodash';
import classnames from 'classnames';
import Loading from '@/components/CommonComponent/Loading';
import Text from '@/components/CommonComponent/Text';
import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import stylesModule from './styles.module.scss';

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
const mapStateToProps = ({ menu, loading, crmTags }) => ({
  loading,
  menuData: menu.menuLeftCRM,
  details: crmTags.details,
  error: crmTags.error,
  tags: crmTags.tags,
  paramaterValues: crmTags.paramaterValues,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      inputVisible: false,
    };
  }

  showInput = () => {
    this.setState({ inputVisible: true });
  };

  onLoad = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: 'crmTags/GET_TAGS',
      payload: params,
    });
    if (params.id) {
      dispatch({
        type: 'crmTags/GET_DETAILS',
        payload: params,
      });
    }
  };

  delete = (id) => {
    const { dispatch } = this.props;
    const self = this;
    return Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'crmTags/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) self.onLoad();
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
    dispatch({
      type: 'crmTags/GET_TAGS',
      payload: params,
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
      type: params.id ? 'crmTags/UPDATE' : 'crmTags/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          dispatch({
            type: 'crmTags/GET_TAGS',
            payload: params,
          });
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
      tags,
      loading: { effects },
    } = this.props;
    const loadingSubmit = effects['crmTags/ADD'] || effects['crmTags/UPDATE'];
    const loading = effects['crmTags/GET_TAGS'];
    const { inputVisible } = this.state;
    return (
      <>
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Tags</Text>
          </div>
          <Form
            className={styles['layout-form']}
            layout="vertical"
            colon={false}
            ref={this.formRef}
            onFinish={this.onFinish}
          >
            <Loading loading={loading} isError={error.isError} params={{ error }}>
              <Pane className="card">
                <Pane className="p20">
                  <Heading type="form-title" className="mb20">
                    Thông tin tags
                  </Heading>
                  <div className={stylesModule['wrapper-tag']}>
                    <div className={stylesModule['container-tag']}>
                      {tags.map((item,index) => (
                        <div className={stylesModule['model-tag']}>
                          <Tag color="#27a600" className={stylesModule.tag} key={index}>
                            {item.name}{' '}
                            <p
                              className={classnames(stylesModule['btn-cancel'], 'icon-cancel')}
                              role="presentation"
                              onClick={() => this.delete(item.id)}
                            />
                          </Tag>
                        </div>
                      ))}
                    </div>

                    {inputVisible && (
                      <FormItem
                        loading={loadingSubmit}
                        name="name"
                        type={variables.INPUT}
                        size="small"
                        style={{ width: 78 }}
                      />
                    )}
                    {!inputVisible && (
                      <Tag onClick={this.showInput} className={styles['site-tag-plus']}>
                        <span className="icon-plus" size="small" /> New Tag
                      </Tag>
                    )}
                  </div>
                </Pane>
              </Pane>
            </Loading>
          </Form>
        </div>
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
  tags: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  error: {},
  details: {},
  tags: [],
};

export default Index;
