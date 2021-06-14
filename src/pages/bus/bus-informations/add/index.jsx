import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Upload } from 'antd';
import PropTypes from 'prop-types';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { head, isEmpty } from 'lodash';
import { variables } from '@/utils';
import ListUpload from '@/components/CommonComponent/ListUpload';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Loading from '@/components/CommonComponent/Loading';

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
const mapStateToProps = ({ menu, loading, busAdd }) => ({
  loading,
  data: busAdd.data,
  error: busAdd.error,
  menuData: menu.menuLeftVehicel,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      fileImage: null,
    };
    setIsMounted(true);
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    if (params.id) {
      this.props.dispatch({
        type: 'busAdd/GET_DATA',
        payload: params,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (data !== prevProps.data && !isEmpty(data)) {
      this.formRef.current.setFieldsValue({
        ...data,
      });
      this.onSetFileImage(data.fileImage);
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

  onSetFileImage = (fileImage) => {
    this.setStateData({
      fileImage,
    });
  };

  onUploadFile = (file) => {
    this.props.dispatch({
      type: 'upload/UPLOAD',
      payload: file,
      callback: (response) => {
        if (response) {
          this.onSetFileImage(head(response.results)?.fileInfo?.url);
        }
      },
    });
  };

  remove = () => {
    this.setStateData({
      fileImage: null,
    });
  };

  onFinish = (values) => {
    const { fileImage } = this.state;
    const {
      data,
      dispatch,
      match: { params },
    } = this.props;
    dispatch({
      type: params?.id ? 'busAdd/UPDATE' : 'busAdd/ADD',
      payload: {
        ...data,
        ...values,
        fileImage,
      },
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
    } = this.props;
    const { fileImage } = this.state;
    const self = this;
    const props = {
      beforeUpload: () => null,
      customRequest({ file }) {
        self.onUploadFile(file);
      },
      showUploadList: false,
      fileList: [],
    };
    const loading = effects['busAdd/GET_DATA'];
    const loadingSubmit = effects['busAdd/ADD'] || effects['busAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs last="Chi tiết xe" menu={menuData} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          colon={false}
          ref={this.formRef}
          onFinish={this.onFinish}
        >
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <div className={styles['content-form']}>
              <div className={classnames(styles['content-children'], 'mt0')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                {!fileImage && (
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      <Form.Item
                        label={<span>HÌNH ẢNH</span>}
                        name="files"
                        rules={[
                          { required: true, message: 'Vui lòng không được để trống trường này' },
                        ]}
                      >
                        <Upload {...props}>
                          <Button color="primary" icon="upload1">
                            Tải lên
                          </Button>
                        </Upload>
                      </Form.Item>
                    </div>
                  </div>
                )}
                {fileImage && (
                  <div className="row">
                    <div className="col-lg-12">
                      <ListUpload data={[fileImage]} remove={this.remove} />
                    </div>
                  </div>
                )}
                <hr />
                <Text color="dark" size="large-medium">
                  THÔNG TIN XE
                </Text>
                <div className="row">
                  <div className="col-lg-3">
                    <FormItem
                      label="MÃ XE BUS"
                      name="code"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="HÃNG XE"
                      name="manufacturer"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="MẪU XE"
                      name="name"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="ĐỜI"
                      name="year"
                      type={variables.INPUT_COUNT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3">
                    <FormItem
                      label="TRUYỀN ĐỘNG"
                      name="transmission"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="SỐ CHỔ"
                      name="seats"
                      type={variables.INPUT_COUNT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="SỐ KHÁCH CHỞ TỐI ĐA"
                      name="maxPassenger"
                      type={variables.INPUT_COUNT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="GPSID"
                      name="gpsId"
                      type={variables.INPUT_COUNT}
                      rules={[variables.RULES.EMPTY]}
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
                  icon="save"
                  size="large"
                  htmlType="submit"
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
  user: PropTypes.objectOf(PropTypes.any),
  students: PropTypes.arrayOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  menuData: PropTypes.arrayOf(PropTypes.any),
  categories: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  user: {},
  students: [],
  error: {},
  menuData: [],
  categories: {},
  data: {},
};

export default Index;
