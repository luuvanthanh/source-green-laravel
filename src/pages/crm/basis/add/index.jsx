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
        <Breadcrumbs last="Thêm mới" menu={menuData} />
        <Pane className="col-lg-8 offset-lg-2">
          <Form className={styles['layout-form']} layout="vertical">
            <Pane className="pl20 pr20 mt20">
              <Pane className="card">
                <Pane className="p20">
                  <Heading type="form-title" className="mb20">
                    Thông tin thêm mới
                  </Heading>
                  <Pane className="row mt20">
                    <Pane className="col-lg-12">
                      <FormItem
                        label="Tên cơ sở"
                        name="nameBasis"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      />
                    </Pane>

                    <Pane className="col-lg-6">
                      <FormItem
                        label="Tỉnh thành"
                        name="city"
                        data={branches}
                        type={variables.SELECT}
                        allowClear={false}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>

                    <Pane className="col-lg-6">
                      <FormItem
                        label="Quận Huyện"
                        name="district"
                        data={branches}
                        type={variables.SELECT_MUTILPLE}
                        allowClear={false}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>

                    <Pane className="col-lg-12">
                      <FormItem
                        label="Địa chỉ"
                        name="address"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY]}
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
