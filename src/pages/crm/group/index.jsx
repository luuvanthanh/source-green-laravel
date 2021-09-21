/* eslint-disable no-plusplus */
import React, { PureComponent } from 'react';
import { Form } from 'antd';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import { history } from 'umi';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';

class Index extends PureComponent {
  render() {
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        index: 'TTL01',
        name: 'Namvv',
        group_name: 'Nguyễn Văn Nam',
      });
    }

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
        title: 'Tên nhóm',
        key: 'group_name',
        dataIndex: 'group_name',
        className: 'min-width-200',
        width: 200,
      },
      {
        title: 'Nhân viên quản lý',
        key: 'name',
        dataIndex: 'name',
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
            <Button
              color="success"
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    return (
      <>
        <Helmet title="Danh sách Nhóm" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Quản lý nhóm</Text>
            <Button
              color="success"
              icon="plus"
              onClick={() => history.push('/crm/quan-ly-he-thong/nhom/tao-moi')}
            >
              Thêm nhóm
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
