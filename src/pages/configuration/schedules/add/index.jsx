import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
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
  menuConfiguration: menu.menuConfiguration,
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

  onChange = () => {
    this.setStateData((prevState) => ({
      showDescription: !prevState.showDescription,
    }));
  };

  render() {
    const { menuConfiguration } = this.props;
    return (
      <>
        <Breadcrumbs last="Tạo môn học" menu={menuConfiguration} />
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
              <Text color="dark">THÊM MỚI LỊCH HỌC</Text>
            </div>
            <div className={styles['content-children']}>
              <Text color="dark" size="large-medium">
                THÔNG TIN CHUNG
              </Text>
              <div className="row mt-3">
                <div className="col-lg-6">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả' }]}
                    label="THỜI GIAN ÁP DỤNG"
                    name="config"
                    rules={[variables.RULES.MAX_LENGTH_INPUT]}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-6">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả' }]}
                    label="KHOẢNG THỜI GIAN"
                    name="time"
                    type={variables.RANGE_PICKER}
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
                                fieldKey={[field.fieldKey, 'time']}
                                label={`Mốc thời gian ${index + 1}`}
                                name={[field.name, 'time']}
                                type={variables.TIME_RANGE}
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
                                  {fieldsCriterias.map((fieldsCriteria, index) => (
                                    <div key={index} className="row">
                                      <div className="offset-lg-1 col-lg-6">
                                        <FormItem
                                          fieldKey={[fieldsCriteria.fieldKey, 'description']}
                                          label={`Nội dung ${index + 1}`}
                                          name={[fieldsCriteria.name, 'description']}
                                          rules={[variables.RULES.EMPTY_INPUT]}
                                          type={variables.INPUT}
                                          className="mb-2"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                  <div className="row">
                                    <div className="offset-lg-1 col-lg-6 d-flex justify-content-end">
                                      <Button
                                        color="success"
                                        icon="plus"
                                        onClick={() => {
                                          add();
                                        }}
                                      >
                                        THÊM NỘI DUNG
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Form.List>
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
                          THÊM MỐC THỜI GIAN
                        </Button>
                      </div>
                    </div>
                  )}
                </Form.List>
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
