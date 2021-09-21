import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { Helmet } from 'react-helmet';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Select from '@/components/CommonComponent/Select';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';

const data = [
  {
    key: 1,
    name: 'Nguyễn Văn Nam',
  },
  {
    key: 2,
    name: 'Nguyễn Văn',
  },
];
class Index extends PureComponent {
  render() {
    return (
      <>
       <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title="Thêm mới" />
      <Breadcrumbs className="pb30 pt0" last="Thêm mới" />
      <Pane className="row justify-content-center">
        <Pane className="col-lg-12">
          <Pane className="card">
            <Form layout="vertical">
              <Pane className="px20 pt20">
                <Heading type="form-title" className="mb20">
                  Thông tin người dùng
                </Heading>

                <Pane className='row'>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Họ và tên"
                      name="name"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                    />
                  </Pane>

                  <Pane className="col-lg-6">
                    <FormItem label="Email" name="email" type={variables.INPUT} />
                  </Pane>

                  <Pane className="col-lg-6">
                    <FormItem
                      label="Tên đăng nhập"
                      name="from"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-6">
                    <FormItem
                      label="Mật khẩu"
                      name="pass"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-6">
                    <Form.Item
                      label="vai trò"
                      name="description"
                      type={variables.INPUT}
                      rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                    >
                      <Select dataSet={data} placeholder="Chọn" />
                    </Form.Item>
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
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
      </>
    );
  }
}

export default Index;
