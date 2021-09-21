/* eslint-disable no-plusplus */
import React, { PureComponent } from 'react';
import { Form } from 'antd';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import { history } from 'umi';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';

const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    id: i,
    index: 'TTL01',
    name: 'Nguyễn Văn Nam',
    name_login: 'namnv',
    email: 'namnv@gmail.com',
    position: 'Sale man',
  });
}
class Index extends PureComponent {
  render() {
    const columns = [
      {
        title: 'Mã',
        key: 'index',
        dataIndex: 'index',
        className: 'min-width-70',
        width: 70,
        align: 'center',
      },
      {
        title: 'Họ và Tên',
        key: 'name',
        dataIndex: 'name',
        className: 'min-width-200',
        width: 200,
      },
      {
        title: 'Tên đăng nhập',
        key: 'name_login',
        dataIndex: 'name_login',
        className: 'min-width-150',
        width: 150,
      },
      {
        title: 'Email',
        key: 'email',
        dataIndex: 'email',
        className: 'min-width-150',
        width: 150,
      },
      {
        title: 'Vai trò',
        key: 'position',
        dataIndex: 'position',
        className: 'min-width-150',
        width: 150,
      },
      {
        key: 'action',
        className: 'min-width-100',
        width: 100,
        fixed: 'right',
        render: () => (
          <div className={styles['list-button']}>
            <Button color="success">Chi tiết</Button>
          </div>
        ),
      },
    ];
    return (
      <>
        <Helmet title="Người dùng" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Quản lý người dùng</Text>
            <Button
              color="success"
              icon="plus"
              onClick={() => history.push('/crm/quan-ly-he-thong/nguoi-dung/tao-moi')}
            >
              Thêm mới
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form layout="vertical" ref={this.formRef}>
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="fullName"
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
              </div>
            </Form>
            <Table
              columns={columns}
              dataSource={data}
              // params={{
              //   header: this.header(),
              //   type: 'table',
              // }}
              bordered={false}
              rowKey={(record) => record.id}
              scroll={{ x: '100%', y: '55vh' }}
            />
          </div>
        </div>
      </>
    );
  }
}

export default Index;
