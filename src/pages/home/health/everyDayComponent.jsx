import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs, Form } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import variablesModules from '../variables';
import styles from '../index.scss';

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

@connect(({ user, loading }) => ({ user, loading }))
class EveryDayComponent extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    const { user } = props;
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
      <div>
        <Form>
          <div className="row">
            <div className="col-md-4">
              <FormItem
                className="mb0"
                name="time"
                type={variables.DATE_PICKER}
              />
            </div>
          </div>
        </Form>
        <div className="row py10">
            {
              variablesModules.HEALTHS.map((item, index) => (
                <div className="col-md-6 col-lg-4 my10" key={index}>
                  <div className={classnames(styles['item-health'], 'd-flex', 'justify-content-between', `${!item.description ? 'align-items-center' : ''}`)}>
                    <AvatarTable
                      // fileImage={Helper.getPathAvatarJson(fileImage)}
                      fullName={item.name}
                      description={item.description || ''}
                      size={32}
                    />
                    {item.status && (
                      <p className="font-weight-bold mt0 mb0 ml10 color-success">{item.status}</p>
                    )}
                  </div>
                </div>
              ))
            }
        </div>
      </div>
    );
  }
}

EveryDayComponent.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

EveryDayComponent.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default EveryDayComponent ;
