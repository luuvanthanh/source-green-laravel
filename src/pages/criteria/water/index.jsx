import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Input, DatePicker, Collapse } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Select from '@/components/CommonComponent/Select';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

const mapStateToProps = ({ menu, settings }) => ({
  menuData: menu.menuLeftCriteria,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  render() {
    const { menuData } = this.props;
    return (
      <>
        <Breadcrumbs last="Cấu hình lượng nước" menu={menuData} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          ref={this.formRef}
        >
          <div className={styles['content-form']}>
            <div className="d-flex justify-content-between">
              <Text color="dark">CẤU HÌNH LƯỢNG NƯỚC UỐNG</Text>
            </div>
            <div className={styles['content-children']}>
              <div className="row mt-3">
                <div className="col-lg-6">
                  <FormItem
                    data={[]}
                    label="Đơn vị tính lượng nước uống"
                    name="unit"
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                    type={variables.SELECT}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <FormItem
                    label="Số lượng mỗi lần cộng trừ"
                    name="total"
                    rules={[variables.RULES.MAX_LENGTH_INPUT]}
                    type={variables.INPUT}
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
