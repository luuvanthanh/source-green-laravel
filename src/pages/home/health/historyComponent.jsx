import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Form, Timeline } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';
import _ from 'lodash';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Pane from '@/components/CommonComponent/Pane';

import styles from '../index.scss';

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

@connect(({ user, loading }) => ({ user, loading }))
class HistoryComponent extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    setIsMounted(true);
  }

  componentDidMount() {
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
    return (
      <Pane>
        <Form>
          <div className="row">
            <div className="col-md-4">
              <FormItem
                className="mb20"
                name="time"
                type={variables.RANGE_PICKER}
              />
            </div>
          </div>
        </Form>
        <div className={styles['container-timeline']}>
          <Scrollbars autoHeight autoHeightMax={500}>
            <div className="p20">
              <h5 className="color-success mb20">Thứ 2 - 15/05/2021</h5>
                  <Timeline>
                    <Timeline.Item color="red">
                      <p className="color-blue font-weight-bold mb5">15:13:12</p>
                      <p className="mb0">Vào lớp</p>
                    </Timeline.Item>
                    <Timeline.Item color="red">
                      <p className="color-blue font-weight-bold mb5">14:23:54</p>
                      <p className="mb0">Giáo viên Nguyễn Thị Linh nhập pipi 1 lần, pupu 2 lần, lượng nước uống 3 lần</p>
                    </Timeline.Item>
                    <Timeline.Item color="red">
                      <p className="color-blue font-weight-bold mb5">14:23:54</p>
                      <p className="mb0">Giáo viên Nguyễn Thị Linh nhập ăn xế: Tốt</p>
                    </Timeline.Item>
                    <Timeline.Item color="red">
                      <p className="color-blue font-weight-bold mb5">11:30:12</p>
                      <p className="mb0">Giáo viên Ngô Thu Phương nhập ghi chú pupu: Đi phân lỏng</p>
                    </Timeline.Item>
                    <Timeline.Item color="red">
                      <p className="color-blue font-weight-bold mb5">10:43:21</p>
                      <p className="mb0">Giáo viên Ngô Thu Phương nhập pupu 1 lần</p>
                    </Timeline.Item>
                    <Timeline.Item color="red">
                      <p className="color-blue font-weight-bold mb5">09:00:15</p>
                      <p className="mb0">Giáo viên Nguyễn Thị Linh nhập lượng nước uống 1 bình</p>
                    </Timeline.Item>
                    <Timeline.Item color="red">
                      <p className="color-blue font-weight-bold mb5">08:32:23</p>
                      <p className="mb0">08:32:23</p>
                    </Timeline.Item>
                  </Timeline>
            </div>
          </ Scrollbars>
        </div>
      </Pane>
    );
  }
}

HistoryComponent.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

HistoryComponent.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default HistoryComponent ;
