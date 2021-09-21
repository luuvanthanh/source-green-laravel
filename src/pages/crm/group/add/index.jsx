import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { Helmet } from 'react-helmet';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Select from '@/components/CommonComponent/Select';
import styles from '@/assets/styles/Common/common.scss';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';

const data = [
  {
    id: 1,
    name: 'Nguyễn Văn Nam',
  },
  {
    id: 2,
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

                    <Pane className="row">
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Tên nhóm"
                          name="name"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                        />
                      </Pane>

                      <Pane className="col-lg-6">
                        <Form.Item
                          label="Nhân viên quản lý"
                          name="name_manage"
                          type={variables.SELECT}
                        >
                          <Select dataSet={data} placeholder="Chọn" />
                        </Form.Item>
                      </Pane>

                      <Pane className="col-lg-12">
                        <Form.Item
                          name="group"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY]}
                          label={
                            <span className={styles['required-asterisk']}>
                              Nhân viên thuộc nhóm
                            </span>
                          }
                        >
                          <Select
                            mode="tags"
                            placeholder="Chọn"
                            dataSet={data}
                            itemValue={(item) => item?.fullName || undefined}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Pane>

                      <Pane className="col-lg-12">
                        <Form.Item
                          name="facility"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY]}
                          label={<span className={styles['required-asterisk']}>Cơ sở quản lý</span>}
                        >
                          <Select
                            mode="tags"
                            placeholder="Chọn"
                            dataSet={data}
                            itemValue={(item) => item?.fullName || undefined}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Pane>

                      <Pane className="col-lg-12">
                        <Form.Item
                          label={
                            <span className={styles['required-asterisk']}>Khu vực quản lý</span>
                          }
                        >
                          <Pane className="row">
                            <Pane className="col-lg-6">
                              <Form.Item
                                label="Tỉnh thành"
                                name="city"
                                type={variables.INPUT}
                                rules={[variables.RULES.EMPTY]}
                              >
                                <Select dataSet={data} placeholder="Chọn" />
                              </Form.Item>
                            </Pane>

                            <Pane className="col-lg-6">
                              <Form.Item
                                name="district"
                                type={variables.INPUT}
                                label={
                                  <span className={styles['required-asterisk']}>Quận/Huyện</span>
                                }
                                rules={[variables.RULES.EMPTY]}
                              >
                                <Select
                                  mode="tags"
                                  placeholder="Chọn"
                                  dataSet={data}
                                  itemValue={(item) => item?.fullName || undefined}
                                  style={{ width: '100%' }}
                                />
                              </Form.Item>
                            </Pane>
                          </Pane>
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
