import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Modal, Form, List, Avatar, Radio, Upload } from 'antd';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import { isEmpty, get } from 'lodash';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import { UserOutlined } from '@ant-design/icons';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import variablesModules from '../utils/variables';
import PropTypes from 'prop-types';
import stylesAllocation from '@/assets/styles/Modules/Allocation/styles.module.scss';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Quill from '@/components/CommonComponent/Quill';
import stylesExchange from '@/assets/styles/Modules/Exchange/styles.module.scss';
import { Scrollbars } from 'react-custom-scrollbars';

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
const mapStateToProps = ({ exchangeAdd, loading, menu, user }) => ({
  user: user.user,
  loading,
  categories: exchangeAdd.categories,
  menuData: menu.menuLeftExchange,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
    } = props;
    this.state = {
      description: null,
      students: [],
      studentId: null,
      files: [],
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.loadStudents();
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

  /**
   * Function change editor
   * @param {string} description value of editor
   */
  onChangeEditor = (description) => {
    this.setState({
      description,
    });
  };

  /**
   * Function change radio
   * @param {string} description value of editor
   */
  onChangeRadio = (e, record) => {
    this.setStateData({
      studentId: record.id,
    });
  };

  /**
   * Function get list students
   */
  loadStudents = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'exchangeAdd/GET_STUDENTS',
      payload: {},
      callback: (response, error) => {
        if (response) {
          this.setStateData({
            students: response.items,
          });
        }
      },
    });
  };

  customRequest = ({ file }) => {
    this.props.dispatch({
      type: 'upload/UPLOAD',
      payload: file,
      callback: (res) => {
        if (res?.results && !isEmpty(res?.results)) {
          this.setState((prevState) => ({
            files: [get(res, 'results[0].fileInfo.url'), ...prevState.files],
          }));
        }
      },
    });
  };

  /**
   * Function submit form
   * @param {object} values values of form
   */
  onFinish = (values) => {
    const { description, studentId, files } = this.state;
    const { user } = this.props;
    this.props.dispatch({
      type: 'exchangeAdd/ADD',
      payload: {
        ...values,
        description,
        studentId,
        type: user.userName,
        files: files && JSON.stringify(files),
      },
      callback: (response) => {
        if (response) {
          history.goBack();
        }
      },
    });
  };

  render() {
    const {
      dispatch,
      categories,
      menuData,
      match: { params },
      loading: { effects },
    } = this.props;
    const { description, students, studentId, files } = this.state;
    const loading = effects['exchangeAdd/GET_DATA'];
    const loadingStudents = effects['exchangeAdd/GET_STUDENTS'];
    const loadingSubmit = effects['exchangeAdd/ADD'];
    const props = {
      beforeUpload: (file) => {
        return null;
      },
      customRequest: this.customRequest,
      showUploadList: false,
      fileList: [],
    };
    return (
      <Form
        layout="vertical"
        initialValues={{}}
        colon={false}
        ref={this.formRef}
        onFinish={this.onFinish}
      >
        <Helmet title="Chi tiết trao đổi" />
        <Breadcrumbs last="Tạo trao đổi" menu={menuData} />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* MAIN CONTAINER */}
          <div className={stylesAllocation['main-container']}>
            <div className={stylesAllocation['left-container']}>
              <div className={stylesAllocation['content']}>
                <div className={stylesAllocation['heading']}>
                  <Text color="dark" size="large-medium">
                    Thông tin trẻ
                  </Text>
                </div>
                <div className={stylesAllocation['content-form']}>
                  <div className="row mt-3">
                    <div className="col-lg-6">
                      <FormItem label="Cơ sở" name="position" type={variables.SELECT} />
                    </div>
                    <div className="col-lg-6">
                      <FormItem label="Lớp" name="class" type={variables.SELECT} />
                    </div>
                  </div>
                  <hr />
                </div>
                <Scrollbars autoHeight autoHeightMax={window.innerHeight - 333}>
                  <Radio.Group value={studentId}>
                    <List
                      className={stylesAllocation.list}
                      dataSource={students}
                      loading={loadingStudents}
                      renderItem={(item) => (
                        <List.Item key={item.id}>
                          <Radio
                            className={stylesAllocation.radio}
                            value={item.id}
                            onChange={(event) => this.onChangeRadio(event, item)}
                          />
                          <div className={stylesAllocation['group-info']}>
                            <Avatar shape="square" size={40} icon={<UserOutlined />} />
                            <div className={stylesAllocation['info']}>
                              <h3 className={stylesAllocation['title']}>{item.fullName}</h3>
                              <p className={stylesAllocation['norm']}>{item.age} tháng tuổi</p>
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Radio.Group>
                </Scrollbars>
              </div>
            </div>
            <div className={stylesAllocation['right-container']}>
              <div className={stylesAllocation['content']}>
                <div className={stylesAllocation['heading']}>
                  <Text color="dark" size="large-medium">
                    Chi tiết trao đổi
                  </Text>
                </div>
                <div className={stylesAllocation['content-form']}>
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      <FormItem
                        name="title"
                        label="Tiêu đề"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="ant-col ant-form-item-label">
                        <label>
                          <span>Nội dung</span>
                        </label>
                      </div>
                      <Quill onChange={this.onChangeEditor} value={description} />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      <div className="ant-col ant-form-item-label">
                        <label>
                          <span>Hình ảnh đính kèm</span>
                        </label>
                      </div>
                      <Upload {...props} className={stylesExchange['custom-upload']}>
                        <Button htmlType="button" icon="plusMain" />
                      </Upload>
                      <div
                        className={classnames(
                          stylesExchange['list-image'],
                          stylesExchange['list-image-large'],
                        )}
                      >
                        {files.map((item) => (
                          <div className={stylesExchange['image-item']} key={item}>
                            <img src={`${API_UPLOAD}${item}`} className={stylesExchange['image']} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={stylesAllocation['footer-content']}>
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <Button
                    color="success"
                    htmlType="submit"
                    size="large"
                    className="ml-auto"
                    loading={loadingSubmit}
                  >
                    Gửi trao đổi
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* MAIN CONTAINER */}
        </div>
      </Form>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
};

export default Index;
