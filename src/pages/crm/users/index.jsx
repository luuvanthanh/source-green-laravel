import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';

const mapStateToProps = ({ crmUsers, loading }) => ({
  data: crmUsers.data,
  error: crmUsers.error,
  pagination: crmUsers.pagination,
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  pagination = (pagination) => {
    const {
      location: { query },
    } = this.props;
    return Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        this.changePagination(response);
      },
    });
  };

  header = () => {
    const columns = [
      {
        title: 'Mã ',
        key: 'code',
        className: 'min-width-150',
        render: (record) => record?.code || '',
      },
      {
        title: 'Họ tên',
        key: 'name',
        className: 'min-width-250',
        render: (record) => record?.name || '',
      },
      {
        title: 'Tên đăng nhập',
        key: 'name-login',
        className: 'min-width-250',
        render: (record) => record?.name_login || '',
      },
      {
        title: 'Email',
        key: 'email',
        className: 'min-width-250',
        render: (record) => record?.email || '',
      },
      {
        title: 'Vai trò',
        key: 'name',
        className: 'min-width-250',
        render: (record) => record?.name || '',
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        fixed: 'right',
        render: () => (
          <div className={styles['list-button']}>
            <Button
              color="success"
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    return columns;
  };

  render() {
    const {
      match: { params },
      pagination,
      location: { pathname },
      data,
    } = this.props;
    return (
      <>
        <Helmet title="Quản lý người dùng" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Quản lý người dùng</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Thêm Mới
            </Button>
          </div>
          <div className={styles['block-table']}>
            <Form layout="vertical" ref={this.formRef}>
              <div className="row">
                <div className="col-lg-4">
                  <FormItem name="key" placeholder="Nhập từ khóa" type={variables.INPUT_SEARCH} />
                </div>
              </div>
            </Form>
            <Table
              bordered={false}
              columns={this.header(params)}
              dataSource={data}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
            />
          </div>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  pagination: {},
  location: {},
  data: [],
};

export default Index;
