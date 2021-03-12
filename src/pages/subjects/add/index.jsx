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
            <Text color="dark">TẠO MỚI MÔN HỌC, CHI NHÁNH</Text>
          </div>
          <div className={styles['content-children']}>
            <Text color="dark" size="large-medium">
              THÔNG TIN CHUNG
            </Text>
            <div className="row mt-3">
              <div className="col-lg-6">
                <FormItem
                  label="MÃ MÔN HỌC"
                  name="code"
                  rules={[variables.RULES.MAX_LENGTH_INPUT]}
                  type={variables.INPUT}
                />
              </div>
              <div className="col-lg-6">
                <FormItem
                  label="TÊN MÔN HỌC"
                  name="name"
                  rules={[variables.RULES.MAX_LENGTH_INPUT]}
                  type={variables.INPUT}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <FormItem data={[]} label="LOẠI" name="for" type={variables.SELECT} />
              </div>
              <div className="col-lg-6">
                <FormItem label="THỜI GIAN" name="time" type={variables.RANGE_PICKER} />
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
