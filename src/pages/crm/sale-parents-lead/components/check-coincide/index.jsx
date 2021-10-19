import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import { connect, history } from 'umi';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Pane from '@/components/CommonComponent/Pane';
import PropTypes from 'prop-types';

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
    history.push('/crm/sale/ph-lead/trung');
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { isModalVisible } = this.state;
    const { branches } = this.props;
    return (
      <>
        <div>
          <Button color="danger" icon="shrink" className="ml-2" onClick={this.showModal}>
            Check trùng
          </Button>
          <Modal
            title="Tìm kiếm phụ huynh trùng"
            className={stylesModule['wrapper-modal']}
            centered
            visible={isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={900}
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
                Tìm trùng
              </Button>,
            ]}
          >
            <div>
              <Pane className="row ">
                <Pane className="col-lg-12 d-block">
                  <div className="ant-col ant-form-item-label">
                    <label>
                      <span>Các điều kiện tìm kiếm trùng</span>
                    </label>
                  </div>
                  <FormItem
                    className="mt-2"
                    name="name"
                    data={branches}
                    mode="tags"
                    type={variables.SELECT_MUTILPLE}
                  />
                </Pane>
              </Pane>
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
