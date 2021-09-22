import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import PropTypes from 'prop-types';

const mapStateToProps = ({ menu, crmGroupAdd, loading }) => ({
  loading,
  categories: crmGroupAdd.categories,
  details: crmGroupAdd.details,
  branches: crmGroupAdd.branches,
  menuData: menu.menuLeftCRM,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  render() {
    const { menuData, branches } = this.props;
    return (
      <>
        <Breadcrumbs last="tạo mới" menu={menuData} />
        <Pane className="row justify-content-center">
          <Pane className="col-lg-12">
            <Pane className="card">
              <Form className={styles['layout-form']} layout="vertical">
                <Pane className="px20 pt20">
                  <Heading type="form-title" className="mb20">
                    Thông tin người dùng
                  </Heading>

                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <FormItem
                        label="Họ và tên"
                        name="name"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      />
                    </Pane>

                    <Pane className="col-lg-6">
                      <FormItem label="Email" name="email" type={variables.INPUT} />
                    </Pane>

                    <Pane className="col-lg-6">
                      <FormItem
                        label="Tên đăng nhập"
                        name="from"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>

                    <Pane className="col-lg-6">
                      <FormItem
                        label="Mật khẩu"
                        name="pass"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>

                    <Pane className="col-lg-6">
                      <FormItem
                        label="vai trò"
                        name="roleId"
                        data={branches}
                        type={variables.SELECT}
                        allowClear={false}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="p20 d-flex justify-content-between align-items-center border-top">
                  <p className="btn-delete" role="presentation">
                    Hủy
                  </p>
                  <Button className="ml-auto px25" color="success" htmlType="submit" size="large">
                    Lưu
                  </Button>
                </Pane>
              </Form>
            </Pane>
          </Pane>
        </Pane>
      </>
    );
  }
}

Index.propTypes = {
  menuData: PropTypes.arrayOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  menuData: [],
  branches: [],
};

export default Index;
