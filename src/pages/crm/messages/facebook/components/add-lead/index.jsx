import React, { PureComponent } from 'react';
import { Modal, Form } from 'antd';
import { connect } from 'umi';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Pane from '@/components/CommonComponent/Pane';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';
import PropTypes from 'prop-types';

import stylesModule from '../../styles.module.scss';

const mapStateToProps = ({ crmSaleCheck, loading }) => ({
  loading,
  categories: crmSaleCheck.categories,
  details: crmSaleCheck.details,
  branches: crmSaleCheck.branches,
});
const marginProps = { style: { marginBottom: 12 } };
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleOk = () => {
    this.setState({ isModalVisible: false });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { isModalVisible } = this.state;
    return (
      <>
        <div>
          <Button color="success" icon="circle" onClick={this.showModal}>
            Thêm mới
          </Button>
          <Modal
            title="Thông tin phụ huynh Lead"
            className={stylesModule['wrapper-modal']}
            centered
            visible={isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={['85%']}
            footer={[
              <p
                key="back"
                role="presentation"
                onClick={this.handleCancel}
                className={stylesModule['button-cancel']}
              >
                Hủy
              </p>,
              <Button key="submit" color="success" type="primary" onClick={this.handleOk}>
                Lưu
              </Button>,
            ]}
          >
            <div>
              <Form className={styles['layout-form']} layout="vertical">
                <Pane>
                  <Pane>
                    <div className="row">
                      <div className="col">
                        <div className="ant-col ant-form-item-label">
                          <label className="ant-form-item-required">
                            <span>Hình ảnh phụ huynh</span>
                          </label>
                        </div>
                        <MultipleImageUpload />
                      </div>
                    </div>
                    <div className="row ">
                      <div className="col-lg-4">
                        <FormItem
                          name="fullName"
                          label="Họ và tên"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          name="dateOfBirth"
                          label="Ngày sinh"
                          type={variables.DATE_PICKER}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          name="gender"
                          label="Giới tính"
                          type={variables.SELECT}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          name="email"
                          label="Email"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY, variables.RULES.EMAIL]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          name="phoneNumber"
                          label="Số điện thoại"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          name="phoneNumber"
                          label="Số điện thoại Khác"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          name="address"
                          label="Địa chỉ"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY_INPUT]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          name="city"
                          label="Thành phố"
                          type={variables.SELECT}
                          rules={[variables.RULES.EMPTY_INPUT]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          name="district"
                          label="Quận"
                          type={variables.SELECT}
                          rules={[variables.RULES.EMPTY_INPUT]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          name="facebook"
                          label="Facebook"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY_INPUT]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          name="zalo"
                          label="Zalo"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY_INPUT]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          name="skype"
                          label="Skype"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY_INPUT]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          name="instagram"
                          label="Instagram"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY_INPUT]}
                        />
                      </div>
                    </div>
                    <div className="row" {...marginProps}>
                      <div className="col-lg-4">
                        <FormItem
                          name="company"
                          label="Tên công ty"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY_INPUT]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          name="addressCompany"
                          label="Địa chỉ công ty"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY_INPUT]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          name="phoneNumberCompany"
                          label="Số điện thoại"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
                        />
                      </div>
                    </div>
                  </Pane>
                </Pane>
              </Form>
            </div>
          </Modal>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  branches: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  branches: [],
};

export default Index;