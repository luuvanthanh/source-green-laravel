import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Form, Input, Checkbox } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import { dataSource } from './data.json';

const mapStateToProps = ({ menu, settings }) => ({
  menuData: menu.menuLeftData,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMobileView: settings.isMobileView,
  isSettingsOpen: settings.isSettingsOpen,
  isLightTheme: settings.isLightTheme,
  isMobileMenuOpen: settings.isMobileMenuOpen,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  pagination = () => ({
    size: 'default',
    total: dataSource.length,
    pageSize: 10,
    defaultCurrent: 1,
    hideOnSinglePage: true,
    showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong ${total}`,
  });

  render() {
    const columns = [
      {
        title: 'STT',
        key: 'index',
        align: 'center',
        className: 'min-width-60',
        width: 60,
        render: (text, record, index) => index + 1,
      },
      {
        title: 'TÊN',
        key: 'ten',
        className: 'min-width-180',
        render: (record) => <Text size="normal">{record.ten}</Text>,
      },
      {
        title: 'SỬ DỤNG',
        key: 'suDUng',
        className: 'min-width-100',
        width: 100,
        align: 'center',
        render: (record) => <Checkbox checked={record.suDung} />,
      },
      {
        key: 'action',
        className: 'min-width-50',
        width: 50,
        render: () => (
          <div className={styles['list-button']}>
            <Button color="primary" icon="edit" />
          </div>
        ),
      },
    ];

    return (
      <>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark">QUẢN LÝ DANH MỤC</Text>
        </div>
        <div className={styles.search}>
          <Form layout="vertical" ref={this.formRef}>
            <div className="row">
              <div className="col-lg-10">
                <Form.Item label={<span>TÌM KIẾM</span>} name="title">
                  <Input placeholder="Nhập" />
                </Form.Item>
              </div>
              <div className="col-lg-2">
                <Form.Item label={<span />} name="button">
                  <Button color="success" icon="search">
                    Tìm kiếm
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
        <div className={styles['parent-table']}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark" size="large-medium">NHÓM NHÀ CUNG CẤP</Text>
            {/* <Button color="dash-success" icon="plus">
              Thêm mới
            </Button> */}
          </div>
          <div className={styles['block-table']}>
            <Table
              bordered
              columns={columns}
              dataSource={dataSource}
              loading={false}
              pagination={this.pagination()}
              params={{
                header: columns,
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
            />
          </div>
        </div>
        <div className={styles['parent-table']}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark" size="large-medium">LƯU TRÚ</Text>
            <Button color="dash-success" icon="plus">
              Thêm mới
            </Button>
          </div>
          <div className={styles['block-table']}>
            <Table
              bordered
              columns={columns}
              dataSource={dataSource}
              loading={false}
              pagination={this.pagination()}
              params={{
                header: columns,
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

Index.propTypes = {};

export default Index;
