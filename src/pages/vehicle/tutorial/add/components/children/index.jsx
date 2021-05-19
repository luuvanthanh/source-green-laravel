import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { isEmpty, head, omit } from 'lodash';
import { Modal, Avatar } from 'antd';
import classnames from 'classnames';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import PropTypes from 'prop-types';
import TableTransfer from '@/components/CommonComponent/TableTransfer';
import Text from '@/components/CommonComponent/Text';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { variables, Helper } from '@/utils';

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
const mapStateToProps = ({ loading }) => ({
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      listId: props.listId,
      targetKeys: props.studentBusPlaces || [],
      dataSource: props.students.map((item) => ({
        ...item,
        key: item.id,
      })),
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

  handleCancel = () => {
    this.props.handleCancel();
  };

  onChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  onSubmit = () => {
    const { targetKeys, listId, dataSource } = this.state;
    const users = dataSource.filter(function (item) {
      return targetKeys.includes(item.key);
    });
    this.props.onSave(
      users.map((item) => ({ ...item })),
      listId,
    );
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
        key: 'name',
        className: 'min-width-200',
        render: (record) => {
          return (
            <AvatarTable
              fileImage={Helper.getPathAvatarJson(record.fileImage)}
              fullName={record.fullName}
            />
          );
        },
      },
      {
        title: 'ĐỊA CHỈ',
        key: 'address',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.address}</Text>,
      },
    ];
    return columns;
  };

  render() {
    const {
      students,
      loading: { effects },
    } = this.props;
    const { targetKeys, dataSource } = this.state;
    const loadingSubmit = effects['BOContract/ADD'] || effects['BOContract/UPDATE'];
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
          dataSource={dataSource}
          targetKeys={targetKeys}
          showSearch={true}
          onChange={this.onChange}
          filterOption={(inputValue, item) => item?.fullName?.indexOf(inputValue) !== -1}
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
  categories: {},
  match: {},
  dispatch: {},
  loading: {},
  objects: {},
  list: [],
  board: {},
};

export default withRouter(Index);
