import React, { PureComponent } from 'react';
import { connect } from 'umi';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Form } from 'antd';

import { variables } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import styles from './index.scss';
import variablesModules from './variables';

@connect(({ user, loading }) => ({ user, loading }))

class Student extends PureComponent {
  constructor(props, context) {
    super(props, context);
    const { user } = props;
  }

  onChange = (e, name) => {

  }

  render() {
    const {
      loading: { effects },
      user: { user }
    } = this.props;

    return (
      <div className={classnames(styles['items-container'])}>
        <Form>
          <FormItem
            className={classnames('mt20', 'mb5', styles['input-search'])}
            name="fullName"
            onChange={(event) => this.onChange(event, 'fullName')}
            placeholder="Nhập từ khóa tìm kiếm"
            type={variables.INPUT_SEARCH}
          />
        </Form>
        <div className="row">
          {
            variablesModules.STUDENTS.map((item, index) => (
              <div className={styles['block-student']} key={index}>
                <div className={styles['content-student']}>
                  <AvatarTable
                    // fileImage={Helper.getPathAvatarJson(fileImage)}
                    // fullName={item?.name}
                    size={90}
                  />
                  <p className="font-size-14 mb0 mt5">{item?.name}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

Student.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Student.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default Student;
