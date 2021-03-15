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
import Children from './components/children';

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
const mapStateToProps = ({}) => ({});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      list: [{}],
      visible: false,
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

  /**
   * Function save table cancel
   * @param {array} cancelPolicies values of table cancel
   */
  onSave = (items, businessObjectGroupId) => {};

  /**
   * Function save table cancel
   * @param {object} record values of item table
   */
  collapsed = (record) => {
    this.setStateData((prevState) => ({
      list: prevState.list.map((item) => {
        if (item.id === record.id) {
          return {
            ...item,
            collapsed: !item.collapsed,
          };
        }
        return item;
      }),
    }));
  };

  /**
   * Function edit list
   * @param {uid} id id of items
   */
  onEditList = (id) => {
    this.setStateData({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setStateData({
      visible: false,
    });
  };

  /**
   * Function save table cancel
   */
  addList = () => {
    this.setStateData((prevState) => ({
      list: [...prevState.list, { id: Math.random().toString(36).substr(2, 9) }],
    }));
  };

  onRemove = (id) => {
    const self = this;
    confirm({
      title: 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content: 'Dữ liệu này đang được sử dụng, nếu xóa dữ liệu này sẽ ảnh hưởng tới dữ liệu khác?',
      onOk() {
        self.setStateData((prevState) => ({
          list: prevState.list.filter((item) => item.id !== id),
        }));
      },
      onCancel() {},
    });
  };

  /**
   * Function header table
   */
  header = (type) => {
    let columns = [];
    if (type === 'CHILDREN') {
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
          key: 'children',
          width: 200,
          className: 'min-width-200',
          render: (record) => (
            <Text size="normal">
              <Avatar size={32} shape="circle" className="mr-2" />
              Nguyễn Văn A
            </Text>
          ),
        },
        {
          title: 'ĐỊA CHỈ',
          key: 'address',
          className: 'min-width-150',
          render: (record) => <Text size="normal">10 Hùng Vương </Text>,
        },
        {
          key: 'action',
          className: 'min-width-80',
          width: 80,
          render: (record) => (
            <div className={styles['list-button']}>
              <Button color="primary" icon="edit" onClick={() => this.onEdit(record)} />
              <Button color="danger" icon="remove" onClick={() => this.onRemove(record.id)} />
            </div>
          ),
        },
      ];
    } else {
      columns = [
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
    }

    return columns;
  };

  render() {
    const { list, visible } = this.state;
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
        <Children visible={visible} handleCancel={this.handleCancel} />
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
          <div className={classnames(styles['list-info'], 'mt-5')}>
            {list.map((item, index) => (
              <div
                className={classnames(styles.item, { [`${styles.collapsed}`]: item.collapsed })}
                key={index}
              >
                <div
                  className={classnames(
                    styles.heading,
                    'd-flex',
                    'justify-content-between',
                    'align-items-center',
                  )}
                >
                  <Text color="dark" size="large">
                    ĐIỂM ĐÓN SỐ {index + 1}
                  </Text>
                  <div className="d-flex justify-content-end">
                    <div className={styles['list-button']}>
                      <Button color="danger" icon="remove" onClick={() => this.onRemove(item.id)} />
                      <Button color="dark" icon="up" onClick={() => this.collapsed(item)} />
                    </div>
                  </div>
                </div>
                <div className={styles['content-block']}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Text color="dark" size="large-medium">
                      DS TRẺ TẠI ĐIỂM ĐÓN
                    </Text>
                    <Button color="success" icon="edit" onClick={() => this.onEditList(item.id)}>
                      Cập nhật danh sách
                    </Button>
                  </div>
                  <Table
                    bordered
                    columns={this.header('CHILDREN')}
                    dataSource={[]}
                    className="table-edit"
                    pagination={false}
                    isEmpty
                    params={{
                      header: this.header('CHILDREN'),
                      type: 'table',
                    }}
                    rowKey={(record) => record.id}
                    scroll={{ x: '100%' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-4" color="success" icon="plus" onClick={this.addList}>
            Thêm điểm đón
          </Button>
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
