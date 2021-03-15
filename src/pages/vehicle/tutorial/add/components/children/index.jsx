import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { isEmpty, head, omit } from 'lodash';
import { Modal, Form, Upload, Collapse, Avatar } from 'antd';
import classnames from 'classnames';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import PropTypes from 'prop-types';
import TableTransfer from '@/components/CommonComponent/TableTransfer';
import Text from '@/components/CommonComponent/Text';

const mockData = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 4 === 0,
  });
}

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
const mapStateToProps = ({ loading, BOContract }) => ({
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      businessObjectContractItems: [],
      paymentMethod: '',
      contractDate: null,
      targetKeys: ['2'],
    };
    setIsMounted(true);
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
   * Function save table cancel
   * @param {array} cancelPolicies values of table cancel
   */
  onSave = (items, businessObjectGroupId) => {
    const { businessObjectContractItems } = this.state;
    const businessItem = businessObjectContractItems.find(
      (item) => item.businessObjectGroupId === businessObjectGroupId,
    );
    if (!businessItem) {
      this.setStateData((prevState) => ({
        businessObjectContractItems: [
          ...prevState.businessObjectContractItems,
          {
            businessObjectGroupId,
            items,
          },
        ],
      }));
    } else {
      this.setStateData((prevState) => ({
        businessObjectContractItems: prevState.businessObjectContractItems.map((item) => ({
          ...item,
          items: item.businessObjectGroupId === businessObjectGroupId ? items : item.items,
        })),
      }));
    }
  };

  handleCancel = () => {
    this.props.handleCancel();
  };

  onChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  triggerDisable = (disabled) => {
    this.setState({ disabled });
  };

  triggerShowSearch = (showSearch) => {
    this.setState({ showSearch });
  };

  /**
   * Function header table
   */
  header = () => {
    let columns = [];
    columns = [
      {
        title: 'STT',
        key: 'index',
        className: 'min-width-60',
        width: 60,
        align: 'center',
        render: (text, record, index) => <Text size="normal">{index + 1}</Text>,
      },
      {
        title: 'HỌC SINH',
        key: 'children',
        width: 200,
        className: 'min-width-200',
        render: (record) => (
          <Text size="normal">
            <Avatar size={32} shape="circle" className="mr-2" />
            Nguyễn Văn A
          </Text>
        ),
      },
      {
        title: 'ĐỊA CHỈ',
        key: 'address',
        className: 'min-width-150',
        render: (record) => <Text size="normal">10 Hùng Vương </Text>,
      },
    ];
    return columns;
  };

  render() {
    const {
      loading: { effects },
    } = this.props;
    const { targetKeys } = this.state;
    const loadingSubmit = effects['BOContract/ADD'] || effects['BOContract/UPDATE'];
    const props = {
      beforeUpload: (file) => {
        return file;
      },
      showUploadList: false,
      fileList: [],
    };
    return (
      <Modal
        centered
        className={styles['modal-container']}
        footer={[
          <div className={classnames('d-flex', 'justify-content-end')} key="action">
            <Button
              color="white"
              icon="cross"
              loading={loadingSubmit}
              onClick={this.handleCancel}
              size="medium"
            >
              HỦY
            </Button>
            <Button
              color="green"
              icon="save"
              loading={loadingSubmit}
              onClick={this.onSubmit}
              size="medium"
            >
              LƯU
            </Button>
          </div>,
        ]}
        onCancel={this.handleCancel}
        title="CẬP NHẬT DANH SÁCH TRẺ"
        visible={this.props.visible}
      >
        <TableTransfer
          dataSource={mockData}
          targetKeys={targetKeys}
          showSearch={true}
          onChange={this.onChange}
          filterOption={(inputValue, item) => item.title.indexOf(inputValue) !== -1}
          leftColumns={this.header()}
          rightColumns={this.header()}
        />
      </Modal>
    );
  }
}

Index.propTypes = {
  visible: PropTypes.bool,
  handleCancel: PropTypes.func,
  onSave: PropTypes.func,
  categories: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  objects: PropTypes.objectOf(PropTypes.any),
  list: PropTypes.arrayOf(PropTypes.any),
  board: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  visible: false,
  handleCancel: () => {},
  onSave: () => {},
  categories: {},
  match: {},
  dispatch: {},
  loading: {},
  objects: {},
  list: [],
  board: {},
};

export default withRouter(Index);
