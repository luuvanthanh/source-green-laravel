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

  render() {
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
            <Text color="dark">TẠO MỚI BỘ TIÊU CHÍ - ĐÁNH GIÁ</Text>
          </div>
          <div className={styles['content-children']}>
            <Text color="dark" size="large-medium">
              THÔNG TIN CHUNG
            </Text>
            <div className="row mt-3">
              <div className="col-lg-4">
                <FormItem
                  label="TÊN MÔ TẢ"
                  name="name"
                  rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                  type={variables.INPUT}
                />
              </div>
              <div className="col-lg-4">
                <FormItem
                  data={[{ id: null, name: 'Tất cả' }]}
                  label="CẤU HÌNH LOẠI ÁP DỤNG"
                  name="config"
                  rules={[variables.RULES.MAX_LENGTH_INPUT]}
                  type={variables.SELECT}
                />
              </div>
              <div className="col-lg-4">
                <FormItem
                  data={[{ id: null, name: 'Tất cả' }]}
                  label="THỜI GIAN NHẬP"
                  name="time"
                  rules={[variables.RULES.MAX_LENGTH_INPUT]}
                  type={variables.SELECT}
                />
              </div>
            </div>
          </div>
          <div className={styles['content-children']}>
            <Text color="dark" size="large-medium">
              BỘ TIÊU CHÍ
            </Text>
            <div className="row mt-3">
              <Form.List name="criteria">
                {(fields, { add, remove }) => (
                  <div className="col-lg-12">
                    {fields.map((field, index) => (
                      <div key={index}>
                        <div className="row">
                          <div className="col-lg-6">
                            <FormItem
                              fieldKey={[field.fieldKey, 'criteria']}
                              label="Bộ tiêu chí cha"
                              name={[field.name, 'criteria']}
                              rules={[variables.RULES.EMPTY_INPUT]}
                              type={variables.INPUT}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-6">
                            <Form.List
                              name={[field.name, 'itemsCriterias']}
                              fieldKey={[field.fieldKey, 'itemsCriterias']}
                            >
                              {(fieldsCriterias, { add, remove }) => (
                                <div className="col-lg-12 ml-5">
                                  {fieldsCriterias.map((fieldsCriteria, index) => (
                                    <div key={index}>
                                      <div>
                                        <FormItem
                                          fieldKey={[fieldsCriteria.fieldKey, 'description']}
                                          label="Tên mô tả"
                                          name={[fieldsCriteria.name, 'description']}
                                          rules={[variables.RULES.EMPTY_INPUT]}
                                          type={variables.INPUT}
                                          className="mb-2"
                                        />
                                      </div>
                                      <div>
                                        <FormItem
                                          fieldKey={[fieldsCriteria.fieldKey, 'type']}
                                          label="Loại tính điểm"
                                          data={[]}
                                          name={[fieldsCriteria.name, 'type']}
                                          rules={[variables.RULES.EMPTY_INPUT]}
                                          type={variables.SELECT}
                                          className="mb-3"
                                        />
                                      </div>
                                      <Form.List
                                        name={[fieldsCriteria.name, 'children']}
                                        fieldKey={[fieldsCriteria.fieldKey, 'children']}
                                      >
                                        {(children, { add, remove }) => (
                                          <div className="ml-5">
                                            {children.map((itemChildren, index) => (
                                              <div key={index}>
                                                <div>
                                                  <FormItem
                                                    fieldKey={[itemChildren.fieldKey, 'children']}
                                                    label="Tiêu chí"
                                                    name={[itemChildren.name, 'children']}
                                                    type={variables.INPUT}
                                                    className="mb-2"
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                            <div className="d-flex justify-content-start mt-3 mb-3">
                                              <Button
                                                color="success"
                                                icon="plus"
                                                onClick={() => {
                                                  add();
                                                }}
                                              >
                                                THÊM TIÊU CHÍ
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </Form.List>
                                    </div>
                                  ))}
                                  <div className="d-flex justify-content-start mt-3 mb-3">
                                    <Button
                                      color="success"
                                      icon="plus"
                                      onClick={() => {
                                        add();
                                      }}
                                    >
                                      THÊM TIÊU CHÍ CON
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </Form.List>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="d-flex justify-content-start mt-3 mb-3">
                      <Button
                        color="success"
                        icon="plus"
                        onClick={() => {
                          add();
                        }}
                      >
                        THÊM BỘ
                      </Button>
                    </div>
                  </div>
                )}
              </Form.List>
            </div>
            <div className="row mt-3">
              <div className="col-lg-12">
                <FormItem
                  label="NHẬN XÉT"
                  name="comment"
                  valuePropName="checked"
                  type={variables.SWITCH}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={classnames(styles['footer-content'], 'd-flex', 'justify-content-center')}>
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
      </Form>
    );
  }
}

Index.propTypes = {};

export default Index;
