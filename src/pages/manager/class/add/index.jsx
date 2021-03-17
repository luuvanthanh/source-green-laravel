import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Input, DatePicker, Collapse, Upload, Avatar } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Select from '@/components/CommonComponent/Select';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import ListUpload from '@/components/CommonComponent/ListUpload';
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
const mapStateToProps = ({ menu, settings }) => ({});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
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
   * Function edit list
   * @param {uid} id id of items
   */
  onChangeModal = () => {
    this.setStateData((prevState) => ({
      visible: !prevState.visible,
    }));
  };

  /**
   * Function save table cancel
   * @param {array} cancelPolicies values of table cancel
   */
  onSave = (items, listId) => {};

  /**
   * Function header table
   */
  header = (type) => {
    let columns = [];
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
        title: 'NGÀY SINH',
        key: 'birthday',
        className: 'min-width-150',
        render: (record) => <Text size="normal">15/09/2020</Text>,
      },
    ];
    return columns;
  };

  render() {
    const { visible } = this.state;
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
        initialValues={{}}
        colon={false}
        ref={this.formRef}
      >
        {visible && (
          <Children visible={visible} onSave={this.onSave} handleCancel={this.onChangeModal} />
        )}
        <div className={styles['content-form']}>
          <div className="d-flex justify-content-between">
            <Text color="dark">CHI TIẾT XE</Text>
          </div>
          <div className={styles['content-children']}>
            <Text color="dark" size="large-medium">
              THÔNG TIN LỚP
            </Text>
            <div className="row">
              <div className="col-lg-3">
                <FormItem data={[]} label="MÃ LỚP" name="code" type={variables.INPUT} />
              </div>
              <div className="col-lg-3">
                <FormItem data={[]} label="TÊN LỚP" name="name" type={variables.INPUT} />
              </div>
              <div className="col-lg-3">
                <FormItem data={[]} label="CƠ SỞ" name="life" type={variables.SELECT} />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[]}
                  label="SỐ LƯỢNG HỌC SINH"
                  name="totla"
                  type={variables.INPUT_COUNT}
                />
              </div>
            </div>
          </div>
          <div className={styles['content-children']}>
            <div className="d-flex justify-content-between items align-items-center mb-3">
              <Text color="dark" size="large-medium">
                DANH SÁCH GIÁO VIÊN CỦA LỚP
              </Text>
              <Button color="success" icon="plus">
                Cập nhật danh sách giáo viên
              </Button>
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
          </div>
          <div className={styles['content-children']}>
            <div className="d-flex justify-content-between items align-items-center mb-3">
              <Text color="dark" size="large-medium">
                DANH SÁCH TRẺ XẾP LỚP
              </Text>
              <div className="d-flex justify-content-end items align-items-center">
                <Button color="success" icon="send" className="mr-2" onClick={this.onChangeModal}>
                  Chuyển lớp
                </Button>
                <Button color="success" icon="plus">
                  Cập nhật danh sách trẻ
                </Button>
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
