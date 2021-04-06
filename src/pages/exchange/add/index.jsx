import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Modal, Avatar, Input, Typography, Form, List, Radio, Upload } from 'antd';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import HelperModules from '../utils/Helper';
import PropTypes from 'prop-types';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { variables, Helper } from '@/utils';
import { UserOutlined } from '@ant-design/icons';
import stylesExchange from '@/assets/styles/Modules/Exchange/styles.module.scss';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';
import Quill from '@/components/CommonComponent/Quill';

const { Paragraph } = Typography;
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
const { confirm } = Modal;
const mapStateToProps = ({ exchangeAdd, loading, menu }) => ({
  loading,
  data: exchangeAdd.data,
  menuData: menu.menuLeftExchange,
  pagination: exchangeAdd.pagination,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      description: null,
    };
    setIsMounted(true);
  }

  componentDidMount() {}

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

  onFinish = (values) => {
    console.log(values)
    const {
      dispatch,
      match: { params },
    } = this.props;
  };

  render() {
    const { menuData } = this.props;
    const { description } = this.state;
    const props = {
      beforeUpload: (file) => {
        return file;
      },
      showUploadList: false,
      fileList: [],
    };
    return (
      <Form layout="vertical" ref={this.formRef} onFinish={this.onFinish}>
        <Helmet title="Chi tiết trao đổi" />
        <Breadcrumbs last="Tạo trao đổi" menu={menuData} />
        <div
          className={classnames(
            styles['content-form'],
            styles['content-form-children'],
            styles['content-form-details'],
          )}
        >
          {/* DETAILS CONTAINER */}
          <div className={classnames(stylesExchange['details-container'], 'mt-3')}>
            <div className={stylesExchange['left-container']}>
              <Text color="dark">Thông tin trẻ</Text>
              <div className="row">
                <div className="col-lg-6">
                  <FormItem name="user_id" label="Cơ sở" data={[]} type={variables.SELECT} />
                </div>
                <div className="col-lg-6">
                  <FormItem name="class_id" label="Lớp" data={[]} type={variables.SELECT} />
                </div>
              </div>
              <List
                className={stylesExchange.list}
                dataSource={[
                  { id: 1, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                  { id: 2, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                  { id: 3, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                  { id: 4, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                  { id: 5, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                  { id: 6, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                  { id: 7, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                  { id: 8, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                  { id: 9, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                  { id: 10, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                  { id: 11, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                  { id: 12, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                  { id: 13, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                  { id: 14, name: 'Trần Văn Phú', age: '30 tháng tuổi' },
                ]}
                renderItem={(item) => (
                  <List.Item key={item.id}>
                    <Radio className={stylesExchange.radio} />
                    <div className={stylesExchange['group-info']}>
                      <Avatar shape="square" size={40} icon={<UserOutlined />} />
                      <div className={stylesExchange['info']}>
                        <h3 className={stylesExchange['title']}>Su beo</h3>
                        <p className={stylesExchange['norm']}>32 tháng tuổi</p>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
            <div className={stylesExchange['right-container']}>
              <div className={stylesExchange['form-content']}>
                <Text color="dark">Chi tiết trao đổi</Text>
                <div className="row">
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
                    <div className={stylesExchange['list-image']}>
                      <div className={stylesExchange['image-item']}>
                        <img src="/images/slice/image_01.png" className={stylesExchange['image']} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={stylesExchange['form-footer']}>
                <Button htmlType="submit" color="success" size="large">
                  Gửi trao đổi
                </Button>
              </div>
            </div>
          </div>
          {/* DETAILS CONTAINER */}
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
