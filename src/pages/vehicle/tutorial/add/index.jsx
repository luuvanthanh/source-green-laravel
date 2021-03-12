import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Avatar } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Select from '@/components/CommonComponent/Select';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Table from '@/components/CommonComponent/Table';

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

  constructor(props, context) {
    super(props, context);
    this.state = {};
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
   * Function header table
   */
  header = () => {
    const columns = [
      {
        title: 'MÃ SỐ',
        key: 'code',
        className: 'min-width-150',
        render: (record) => <Text size="normal">0001</Text>,
      },
      {
        title: 'HÃNG',
        key: 'manufacturer',
        className: 'min-width-150',
        render: (record) => <Text size="normal">Hyundai</Text>,
      },
      {
        title: 'SỐ CHỔ NGỒI',
        key: 'seats',
        className: 'min-width-150',
        render: (record) => <Text size="normal">45 chỗ</Text>,
      },
      {
        title: 'XE',
        key: 'vehicle',
        className: 'min-width-150',
        render: (record) => (
          <Text size="normal">
            <Avatar size={32} shape="circle" className="mr-2" />
            Hyundai Universe
          </Text>
        ),
      },
      {
        title: 'ĐỜI',
        key: 'life',
        className: 'min-width-150',
        render: (record) => <Text size="normal">2018</Text>,
      },
      {
        title: 'TRUYỀN ĐỘNG',
        key: 'movement',
        className: 'min-width-150',
        render: (record) => <Text size="normal">Số tự động</Text>,
      },
    ];
    return columns;
  };

  render() {
    const props = {
      beforeUpload: (file) => {
        return file;
      },
      showUploadList: false,
      fileList: [],
    };
    return (
      <Form
        className={styles['layout-form']}
        layout="vertical"
        initialValues={{
          criteria: [
            {
              itemsCriterias: [
                {
                  children: [{}],
                },
              ],
            },
          ],
        }}
        colon={false}
        ref={this.formRef}
      >
        <div className={styles['content-form']}>
          <div className="d-flex justify-content-between">
            <Text color="dark">CHI TIẾT XE</Text>
          </div>
          <div className={styles['content-children']}>
            <Text color="dark" size="large-medium">
              THÔNG TIN CHUNG
            </Text>
            <div className="row">
              <div className="col-lg-9">
                <FormItem data={[]} label="TÊN LỘ TRÌNH" name="name" type={variables.INPUT} />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[]}
                  label="ĐIỂM XUẤT PHÁT"
                  name="location"
                  type={variables.SELECT}
                />
              </div>
            </div>
          </div>
          <div className={styles['content-children']}>
            <Text color="dark" size="large-medium">
              THÔNG TIN XE
            </Text>
            <div className="row">
              <div className="col-lg-3">
                <FormItem data={[]} label="CHỌN XE" name="vehicle" type={variables.SELECT} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <Table
                  bordered
                  columns={this.header()}
                  dataSource={[{ id: 1 }]}
                  pagination={false}
                  params={{
                    header: this.header(),
                    type: 'table',
                  }}
                  rowKey={(record) => record.id}
                  scroll={{ x: '100%' }}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-3">
                <FormItem
                  data={[]}
                  label="THỜI KHÓA BIỂU XE HOẠT ĐỘNG"
                  name="schedules"
                  type={variables.SELECT}
                />
              </div>
            </div>
            <hr />
            <Text color="dark" size="large-medium">
              THÔNG TIN BẢO MẪU
            </Text>
            <div className="row">
              <div className="col-lg-3">
                <FormItem data={[]} label="BẢO MẪU" name="nanny" type={variables.SELECT} />
              </div>
            </div>
          </div>
          <div className={classnames('d-flex', 'justify-content-center', 'mt-4')}>
            <Button
              color="gray"
              icon="prev"
              onClick={() => history.goBack()}
              size="large"
              className="mr-3"
            >
              HỦY
            </Button>
            <Button color="green" icon="save" size="large">
              LƯU
            </Button>
          </div>
        </div>
      </Form>
    );
  }
}

Index.propTypes = {};

export default Index;
