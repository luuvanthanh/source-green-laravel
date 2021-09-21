/* eslint-disable no-plusplus */
import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { Helmet } from 'react-helmet';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';

class Index extends PureComponent {
  render() {
    return (
      <>
        <Pane style={{ padding: 20, paddingBottom: 0 }}>
          <Helmet title="Thêm mới" />
          <Breadcrumbs className="pb30 pt0" last="Thêm mới" />
          <Pane className="row justify-content-center">
            <Pane className="col-lg-6">
              <Pane className="card">
                <Form layout="vertical">
                  <Pane className="px20 pt20">
                    <Heading type="form-title" className="mb20">
                      Thông tin vai trò
                    </Heading>

                    <Pane className="row">
                      <Pane className="col-lg-12">
                        <FormItem
                          label="Tên vai trò"
                          name="name"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                        />
                      </Pane>

                      <Pane className="col-lg-12">
                        <FormItem label="Mô tả" name="name" type={variables.INPUT} />
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
