import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';
import _ from 'lodash';

import NoteComponent from './noteComponent';
import MecicalComponent from './medicalComponent';
import BusComponent from './busComponent';
import AttendanceComponent from './attendanceComponent';

@connect(({ user, loading }) => ({ user, loading }))
class Overview extends PureComponent {
  render() {
    return (
      <div className="mt30">
        <Scrollbars autoHeight autoHeightMax={window.innerHeight - 230}>
          <div className="d-flex">
            <NoteComponent />
            <MecicalComponent />
            <BusComponent />
            <AttendanceComponent />
          </div>
        </Scrollbars>
      </div>
    );
  }
}

Overview.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Overview.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default Overview;
