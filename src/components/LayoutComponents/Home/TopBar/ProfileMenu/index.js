import React from 'react';
import { connect } from 'umi';
import { Menu, Dropdown, Modal, Form } from 'antd';
import PropTypes from 'prop-types';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import classnames from 'classnames';

import { variables } from '@/utils';

import styles from './style.module.scss';

@connect(({ user }) => ({ user }))
class ProfileMenu extends React.Component {
  formCheck = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  logout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/LOGOUT',
    });
  };

  swichRole = (role) => {
    const { dispatch, user } = this.props;
    if (role?.name?.toUpperCase() === user?.user?.role?.toUpperCase()) {
      return;
    }
    dispatch({
      type: 'user/SWITCH_ACCOUNT',
      payload: {
        roleId: role?.id,
      },
    });
  };

  swichBranch = (branch) => {
    const { dispatch, user } = this.props;
    if (branch?.id === user?.user?.defaultBranch?.id) {
      return;
    }
    dispatch({
      type: 'user/SWITCH_BRANCHES',
      payload: {
        branchId: branch?.id,
        isReload: true,
      },
    });
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleOk = () => {
    const { dispatch } = this.props;
    this.formCheck.current.validateFields().then((values) => {
      if (values) {
        dispatch({
          type: 'user/CHANG_PASSWORK',
          payload: values,
        });
        this.setState({ isModalVisible: false });
        this.formCheck.current.setFieldsValue(
         {
          currentPassword: undefined,
          newPassword: undefined
         });
      }
    });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { user } = this.props;
    const { isModalVisible } = this.state;
    const menu = (
      <Menu selectable={false} className={styles.dropdownUser}>
        <Menu.Item>
          <span className="font-weight-bold">Hello {user?.user?.userName || 'Anonymous'}</span>
        </Menu.Item>
        {!user?.user?.isShowAllBranch && (
          <>
            <Menu.Divider />
            <Menu.Item>
              <p className="font-weight-bold mb0">Cơ sở</p>
              {(user?.user?.branchs).map((item, index) => (
                <p
                  key={index}
                  onClick={() => this.swichBranch(item)}
                  className={classnames(styles.role, 'mt5 mb5', {
                    [styles.active]: item.id === user?.user?.defaultBranch?.id,
                  })}
                  aria-hidden
                >
                  {item.name}
                </p>
              ))}
            </Menu.Item>
          </>
        )}
        <Menu.Divider />
        <Menu.Item>
          <p className="font-weight-bold mb0">Vai trò</p>
          {(user?.user?.roles || [{ name: user?.user?.role }]).map((item, index) => (
            <p
              key={index}
              onClick={() => this.swichRole(item)}
              className={classnames(
                styles.role,
                `${
                  user?.user?.role?.toUpperCase() === item?.name?.toUpperCase()
                    ? styles.actived
                    : ''
                }`,
                'mt5 mb5',
              )}
              aria-hidden
            >
              {variables.ROLES_NAME[item?.name?.toUpperCase()] || item.name || ''}
            </p>
          ))}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={this.logout}>
          <span className="d-flex align-items-center">
            <i className={`${styles.menuIcon} icon-exit`} />
            Logout
          </span>
        </Menu.Item>
        <Menu.Item onClick={this.showModal}>
          <span className="d-flex align-items-center">
            <i className={`${styles.menuIcon} icon-lock`} />
            Đổi mật khẩu
          </span>
        </Menu.Item>
        <Modal
          title="Đổi mật khẩu"
          centered
          className={styles['wrapper-modal-check']}
          visible={isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={400}
          footer={[
            <div key="back" className={styles['wrapper-modal-footer']}>
              <p
                key="back"
                role="presentation"
                onClick={this.handleCancel}
                className={styles['button-cancel']}
              >
                Hủy
              </p>
              <Button htmlType="submit" color="success" type="primary" onClick={this.handleOk}>
                Lưu
              </Button>
            </div>
          ]}
        >
          <div>
            <Form layout="vertical" ref={this.formCheck}>
              <Pane className="card">
                <Pane style={{ padding: 20 }}>
                  <Pane className="row">
                    <Pane className="col-lg-12">
                      <FormItem
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        type={variables.INPUT_PASSWORD}
                        rules={[variables.RULES.EMPTY_INPUT]}
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormItem
                        name="newPassword"
                        label="Mật khẩu mới"
                        type={variables.INPUT_PASSWORD}
                        rules={[variables.RULES.EMPTY_INPUT]}
                      />
                    </Pane>
                  </Pane>
                </Pane>
              </Pane>
            </Form>
          </div>
        </Modal>
      </Menu>
    );
    return (
      <Dropdown overlay={menu} trigger={['click']} arrow>
        <div className={styles.dropdown}>{user?.user?.userName}</div>
      </Dropdown>
    );
  }
}

ProfileMenu.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
};

ProfileMenu.defaultProps = {
  dispatch: {},
  user: {},
};

export default ProfileMenu;
