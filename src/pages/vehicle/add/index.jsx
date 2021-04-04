import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Input, DatePicker, Collapse, Upload } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Select from '@/components/CommonComponent/Select';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import ListUpload from '@/components/CommonComponent/ListUpload';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

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
const mapStateToProps = ({ menu }) => ({
  menuData: menu.menuLeftVehicel,
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

  render() {
    const { menuData } = this.props;
    const props = {
      beforeUpload: (file) => {
        return file;
      },
      showUploadList: false,
      fileList: [],
    };
    return (
      <>
        <Breadcrumbs last="Chi tiết xe" menu={menuData} />
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
              <div className="row mt-3">
                <div className="col-lg-12">
                  <Form.Item
                    label={<span>HÌNH ẢNH</span>}
                    name={'files'}
                    rules={[{ required: true, message: 'Vui lòng không được để trống trường này' }]}
                  >
                    <Upload {...props}>
                      <Button color="primary" icon="upload1">
                        Tải lên
                      </Button>
                    </Upload>
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <ListUpload data={[1, 2, 3, 4, 5]} />
                </div>
              </div>
              <hr />
              <Text color="dark" size="large-medium">
                THÔNG TIN XE
              </Text>
              <div className="row">
                <div className="col-lg-3">
                  <FormItem data={[]} label="HÃNG XE" name="manufacturer" type={variables.SELECT} />
                </div>
                <div className="col-lg-3">
                  <FormItem data={[]} label="MẪU XE" name="type" type={variables.SELECT} />
                </div>
                <div className="col-lg-3">
                  <FormItem data={[]} label="ĐỜI" name="life" type={variables.SELECT} />
                </div>
                <div className="col-lg-3">
                  <FormItem data={[]} label="TRUYỀN ĐỘNG" name="movement" type={variables.SELECT} />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3">
                  <FormItem data={[]} label="SỐ CHỔ NGỒI" name="seats" type={variables.SELECT} />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[]}
                    label="SỐ KHÁCH TỐI ĐA"
                    name="litmitSeat"
                    type={variables.SELECT}
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
      </>
    );
  }
}

Index.propTypes = {};

export default Index;
