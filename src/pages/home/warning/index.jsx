import React, { PureComponent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import MecicalComponent from './components/medical';
import StudentCriteriasComponent from './components/student-criterias';
import NotesComponent from './components/notes';

class Overview extends PureComponent {
  render() {
    return (
      <Scrollbars autoHeight autoHeightMax="100%" autoHeightMin={window.innerHeight - 230}>
        <div className="d-flex my30">
          <StudentCriteriasComponent {...this.props} />
          <MecicalComponent {...this.props} />
          <NotesComponent {...this.props} />
        </div>
      </Scrollbars>
    );
  }
}

export default Overview;
