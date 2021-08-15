import React, { PureComponent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import NoteComponent from './noteComponent';
import MecicalComponent from './medicalComponent';
import BusComponent from './busComponent';
import AttendanceComponent from './attendanceComponent';

class Overview extends PureComponent {
  render() {
    return (
      <Scrollbars autoHeight autoHeightMax="100%" autoHeightMin={window.innerHeight - 230}>
        <div className="d-flex my30">
          <AttendanceComponent {...this.props} />
          <NoteComponent {...this.props} />
          <MecicalComponent {...this.props} />
          <BusComponent {...this.props} />
        </div>
      </Scrollbars>
    );
  }
}

export default Overview;
