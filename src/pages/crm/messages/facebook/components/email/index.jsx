import React, { PureComponent } from 'react';
import { Modal, Form } from 'antd';
import { connect } from 'umi';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Pane from '@/components/CommonComponent/Pane';
import Quill from '@/components/CommonComponent/Quill';

import stylesModule from '../../styles.module.scss';

const mapStateToProps = ({ crmSaleCheck, loading }) => ({
  loading,
  categories: crmSaleCheck.categories,
  details: crmSaleCheck.details,
  branches: crmSaleCheck.branches,
});
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
          <Button
            color="white"
            icon="addMail"
            size="normal"
            className={stylesModule['button-contact']}
            onClick={this.showModal}
          />
          <Modal
            title="Gửi email"
            className={stylesModule['wrapper-modal']}
            centered
            visible={isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={['50%']}
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
                      <Pane className="col-lg-12">
                        <FormItem
                          name="email"
                          label="Gửi từ địa chỉ"
                          mode="tags"
                          type={variables.SELECT_MUTILPLE}
                        />
                      </Pane>
                      <Pane className="col-lg-12">
                        <FormItem
                          mode="tags"
                          name="email"
                          label="Đến địa chỉ"
                          type={variables.SELECT_MUTILPLE}
                        />
                      </Pane>
                      <Pane className="col-lg-12">
                        <div className="ant-col ant-form-item-label">
                          <label>
                            <span>Nội dung</span>
                          </label>
                        </div>
                        <Quill />
                      </Pane>
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

export default Index;
