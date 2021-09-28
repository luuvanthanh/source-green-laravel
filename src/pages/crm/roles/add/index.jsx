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

const mapStateToProps = ({ menu, crmRolesAdd, loading }) => ({
  loading,
  categories: crmRolesAdd.categories,
  details: crmRolesAdd.details,
  branches: crmRolesAdd.branches,
  menuData: menu.menuLeftCRM,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  render() {
    const { menuData } = this.props;
    return (
      <>
        <Breadcrumbs last="Thêm mới" menu={menuData} />
        <Pane className="row justify-content-center">
          <Pane className="col-lg-6">
            <Form className={styles['layout-form']} layout="vertical">
              <Pane className="pl20 pr20 mt20">
                <Pane className="card">
                  <Pane className="p20">
                    <Heading type="form-title" className="mb20">
                      Thông tin vai trò
                    </Heading>
                    <Pane className="row mt20">
                      <Pane className="col-lg-12">
                        <FormItem
                          label="Tên vai trò"
                          name="name"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                        />
                      </Pane>
                      <Pane className="col-lg-12">
                        <FormItem
                          label="Mô tả"
                          name="description"
                          rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                          type={variables.TEXTAREA}
                        />
                      </Pane>
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
              </Pane>
            </Form>
          </Pane>
        </Pane>
      </>
    );
  }
}

Index.propTypes = {
  menuData: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  menuData: [],
};

export default Index;
