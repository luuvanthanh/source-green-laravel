import React, { PureComponent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import NoteComponent from './noteComponent';
import MecicalComponent from './medicalComponent';
import BusComponent from './busComponent';
import AttendanceComponent from './attendanceComponent';

class Overview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <Scrollbars autoHeight autoHeightMax="100%">
        <div className="d-flex my30">
          <NoteComponent />
          <MecicalComponent />
          <BusComponent />
          <AttendanceComponent />
        </div>
      </Scrollbars>
    );
  }
}

export default Overview;
