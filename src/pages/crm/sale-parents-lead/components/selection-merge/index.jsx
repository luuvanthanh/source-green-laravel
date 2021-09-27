import React, { PureComponent } from 'react';
import { Modal, Descriptions, Radio } from 'antd';
import { connect } from 'umi';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';

import Pane from '@/components/CommonComponent/Pane';

const mapStateToProps = ({ menu, crmSaleSelectionMerge, loading }) => ({
  loading,
  categories: crmSaleSelectionMerge.categories,
  details: crmSaleSelectionMerge.details,
  branches: crmSaleSelectionMerge.branches,
  menuData: menu.menuLeftCRM,
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
          <Button color="success" icon="shrink" className="ml-5" onClick={this.showModal}>
            Gộp dữ liệu
          </Button>
          <Modal
            className={styles['wrapper-modal']}
            centered
            visible={isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={900}
            footer={[
              <>
                <Button
                  color="yellow"
                  icon="arrowLeft2"
                  className="mr-5"
                  onClick={this.handleCancel}
                >
                  Quay lại
                </Button>
                <Button color="success" icon="shrink" className="ml-5" onClick={this.handleOk}>
                  Gộp dữ liệu
                </Button>
              </>,
            ]}
          >
            <div>
              <Pane className="row ">
                <Pane className="col-lg-12 d-block">
                  <Descriptions bordered layout="horizontal">
                    <Descriptions.Item label="Mã phụ huynh" span={3}>
                      <Radio />
                      PH20210001
                    </Descriptions.Item>
                    <Descriptions.Item label="Hình ảnh phụ huynh" span={3}>
                      <Radio /> Nguyễn Anh
                    </Descriptions.Item>
                    <Descriptions.Item label="Họ và tên" span={3}>
                      <Radio /> anhn@gmail.com
                    </Descriptions.Item>
                    <Descriptions.Item label="Giới tính" span={3}>
                      <Radio /> 0934900900
                    </Descriptions.Item>
                    <Descriptions.Item label="Email" span={3}>
                      <Radio /> 02363123123
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại" span={3}>
                      <Radio />
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại khác" span={3}>
                      <Radio />
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ" span={3}>
                      <Radio />
                    </Descriptions.Item>
                    <Descriptions.Item label="Quận Huyện" span={3}>
                      <Radio />
                    </Descriptions.Item>
                    <Descriptions.Item label="Tỉnh thành" span={3}>
                      <Radio />
                    </Descriptions.Item>
                  </Descriptions>
                  ,
                </Pane>
              </Pane>
            </div>
          </Modal>
        </div>
      </>
    );
  }
}

export default Index;
