import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Collapse } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
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
const mapStateToProps = ({ menu, settings }) => ({
  menuData: menu.menuLeftCriteria,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      showDescription: false,
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

  onChange = () => {
    this.setStateData((prevState) => ({
      showDescription: !prevState.showDescription,
    }));
  };

  render() {
    const { showDescription } = this.state;
    const { menuData } = this.props;
    return (
      <>
        <Breadcrumbs last="Tạo mới đánh giá học tập" menu={menuData} />
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
                <div className="col-lg-6">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả' }]}
                    label="CẤU HÌNH LOẠI ÁP DỤNG"
                    name="config"
                    rules={[variables.RULES.MAX_LENGTH_INPUT]}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-6">
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
              <Form.List name="criteria">
                {(fields, { add, remove }) => (
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      <Collapse
                        className={styles.collapse}
                        defaultActiveKey={[0, 1, 2, 3, 4, 5, 6]}
                      >
                        {fields.map((field, index) => (
                          <Collapse.Panel
                            extra={
                              <div>
                                {fields.length > 1 && (
                                  <span
                                    className={classnames('icon-remove', styles['icon-remove'])}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      remove(field.name);
                                    }}
                                  />
                                )}
                              </div>
                            }
                            header={`Bộ tiêu chí ${index + 1}`}
                            key={index}
                          >
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
                              <div className="col-lg-6">
                                <FormItem
                                  fieldKey={[field.fieldKey, 'description']}
                                  label="Tên mô tả"
                                  name={[field.name, 'description']}
                                  rules={[variables.RULES.EMPTY_INPUT]}
                                  type={variables.INPUT}
                                />
                              </div>
                            </div>
                            <div className="row">
                              <Form.List
                                name={[field.name, 'itemsCriterias']}
                                fieldKey={[field.fieldKey, 'itemsCriterias']}
                              >
                                {(fieldsCriterias, { add, remove }) => (
                                  <div className="col-lg-12">
                                    <Collapse
                                      className={classnames(
                                        styles.collapse,
                                        styles['collapse-children'],
                                      )}
                                      defaultActiveKey={[0, 1, 2, 3, 4, 5, 6]}
                                    >
                                      {fieldsCriterias.map((fieldsCriteria, index) => (
                                        <Collapse.Panel
                                          extra={
                                            <div>
                                              {fieldsCriterias.length > 1 && (
                                                <span
                                                  className={classnames(
                                                    'icon-remove',
                                                    styles['icon-remove'],
                                                  )}
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    remove(fieldsCriteria.name);
                                                  }}
                                                />
                                              )}
                                            </div>
                                          }
                                          header={`Tiêu chí ${index + 1}`}
                                          key={index}
                                        >
                                          <div key={index} className="row">
                                            <div className="col-lg-6">
                                              <FormItem
                                                fieldKey={[fieldsCriteria.fieldKey, 'description']}
                                                label="Tiêu chí"
                                                name={[fieldsCriteria.name, 'description']}
                                                rules={[variables.RULES.EMPTY_INPUT]}
                                                type={variables.INPUT}
                                                className="mb-2"
                                              />
                                            </div>
                                            <div className="col-lg-6">
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
                                          </div>
                                        </Collapse.Panel>
                                      ))}
                                    </Collapse>
                                    <div className="row">
                                      <div className="offset-lg-2 col-lg-10 d-flex justify-content-end">
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
                                  </div>
                                )}
                              </Form.List>
                            </div>
                          </Collapse.Panel>
                        ))}
                      </Collapse>
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
                  </div>
                )}
              </Form.List>
              <div className="row mt-3">
                <div className="col-lg-12">
                  <FormItem
                    label="NHẬN XÉT"
                    name="comment"
                    valuePropName="checked"
                    type={variables.SWITCH}
                    onChange={this.onChange}
                  />
                </div>
              </div>
              {showDescription && (
                <div className="row">
                  <div className="col-lg-12">
                    <FormItem
                      label="NHẬN XÉT"
                      name="description"
                      rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                      type={variables.TEXTAREA}
                    />
                  </div>
                </div>
              )}
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
