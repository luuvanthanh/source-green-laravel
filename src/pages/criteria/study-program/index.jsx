import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Modal, Form, Tabs } from 'antd';
import classnames from 'classnames';
import { isEmpty, head, debounce } from 'lodash';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import variablesModules from './utils/variables';
import InprogressTable from './tables/inprogress';
import EndTable from './tables/end';
import Pane from '@/components/CommonComponent/Pane';
import csx from 'classnames';
import commonStyles from '@/assets/styles/Common/common.scss';

const { TabPane } = Tabs;

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
const { confirm } = Modal;

const mapStateToProps = ({ criteriaLearn, loading }) => ({
  pagination: criteriaLearn.pagination,
  loading,
});

@connect(mapStateToProps)

class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const { location: { query } } = props;
    this.state = {
      visible: false,
      search: {
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
      objects: {},
      tab: 'inprogress'
    };
    setIsMounted(true);
  }

  // componentDidMount() {
  //   this.onLoad();
  // }

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


  changeTab = (tab) => {
    this.setStateData({ tab })
  };

  renderComponent = (tab) => {
    const props = {
      ...this.props,
      ...this.state,
    }
    switch(tab) {
      case 'inprogress':
        return <InprogressTable {...props }/>
      default:
        return <EndTable {...props} />
    }
  }

  onChange = () => {}

  selectProgram = () => {}

  render() {
    const {
      loading: { effects },
      location: { pathname },
    } = this.props;
    const { tab } = this.state;
    const loading = effects['criteriaLearn/GET_DATA'];


    return (
      <>
        <Helmet title="Danh sách chương trình" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Danh sách chương trình</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/them-moi`)}>
              Thêm mới
            </Button>
          </div>
          <Pane className="card">
            <Pane className={csx(commonStyles['block-table'], commonStyles['block-table-tab-new'])}>
              <Tabs onChange={this.changeTab} activeKey={tab}>
                {variablesModules.TABS.map((item) => (
                  <TabPane tab={item.name} key={item.id} />
                ))}
              </Tabs>
              <Form
                layout="vertical"
                ref={this.formRef}
              >
                <div className="row">
                  <div className="col-lg-4">
                    <FormItem
                      className="p20 mb0"
                      name="keyWord"
                      onChange={(event) => this.onChange(event, 'keyWord')}
                      placeholder="Từ khóa tìm kiếm"
                      type={variables.INPUT_SEARCH}
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormItem
                      className="p20 mb0"
                      name="program"
                      type={variables.SELECT}
                      data={[]}
                      onChange={this.selectProgram}
                      allowClear={false}
                    />
                  </div>
                </div>
              </Form>
              {this.renderComponent(tab)}
            </Pane>
          </Pane>

        </div>
      </>
    );
  }
}

export default Index;
