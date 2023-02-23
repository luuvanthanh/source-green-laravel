import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Pane from '@/components/CommonComponent/Pane';
import FormDetail from '@/components/CommonComponent/FormDetail';
import ImgDetail from '@/components/CommonComponent/imageDetail';
import { variables, Helper } from '@/utils';


import stylesModule from '../styles.module.scss';

import '@/assets/styles/Modules/TimeTables/styles.module.scss';

const Index = memo(({
  dataDetails,
  type
}) => {
  const detailSchoolYear = `${dataDetails?.information?.schoolYear?.yearFrom} - ${dataDetails?.information?.schoolYear?.yearTo}`;
  const marginProps = { style: { paddingTop: 12, paddingBottom: 20 } };
  const detailTeacher = `${dataDetails?.approvedEmployee?.fullName ? dataDetails?.approvedEmployee?.fullName : ""}  ${dataDetails?.approvedDate ? Helper.getDate(dataDetails?.approvedDate, variables.DATE_FORMAT.DATE_TIME) : ""}`;
  const detailTeacherManagement = `${dataDetails?.approvedEmployee?.fullName ? dataDetails?.approvedEmployee?.fullName : ""}  ${dataDetails?.approvedDate ? Helper.getDate(dataDetails?.approvedDate, variables.DATE_FORMAT.DATE_TIME) : ""}`;
  const detailTeacherManagementSend = `${dataDetails?.sentEmployee?.fullName ? dataDetails?.sentEmployee?.fullName : ""}  ${dataDetails?.sentDate ? Helper.getDate(dataDetails?.sentDate, variables.DATE_FORMAT.DATE_TIME) : ""}`;

  const formStatus = () => {
    if (type === "confirmed" || type === 'done-review') {
      return (
        <Pane className="col-lg-3">
          <FormDetail name={detailTeacher} label="Giáo viên đo lường" type="text" />
        </Pane>
      );
    }
    if (type === "done-confirmed" || type === "not-send") {
      return (
        <>
          <Pane className="col-lg-3">
            <FormDetail name={detailTeacher} label="Giáo viên đo lường" type="text" />
          </Pane>
          <Pane className="col-lg-3">
            <FormDetail name={detailTeacherManagement} label="Người duyệt" type="text" />
          </Pane>
        </>
      );
    }
    if (type === "done-send") {
      return (
        <>
          <Pane className="col-lg-3">
            <FormDetail name={detailTeacher} label="Teacher report" type="text" />
          </Pane>
          <Pane className="col-lg-3">
            <FormDetail name={detailTeacherManagement} label="Người duyệt" type="text" />
          </Pane>
          <Pane className="col-lg-3">
            <FormDetail name={detailTeacherManagementSend} label="Người gửi" type="text" />
          </Pane>
        </>
      );
    }
    return "";
  };

  return (
    <>
      <div className="row" {...marginProps} style={{ paddingLeft: 20, paddingRight: 20 }} >
        <div className={stylesModule['monthlyComment-header-img']}>
          <ImgDetail
            fileImage={dataDetails?.information?.student?.fileImage}
          />
          <div className='d-block ml20'>
            <h3 className={stylesModule['general-fullName']}>
              {dataDetails?.information?.student?.fullName}
            </h3>
            <p className={stylesModule['general-age']}>{dataDetails?.information?.student?.age} tháng tuổi</p>
          </div>
        </div>
      </div>
      <Pane className="row">
        <Pane className="col-lg-3">
          <FormDetail name={detailSchoolYear} label="School year" type="text" />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name={dataDetails?.information?.branch?.name} label="Center" type="text" />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name={dataDetails?.information?.class?.name} label="Class" type="text" />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name={dataDetails?.information?.assessmentPeriod?.name} label="Kỳ đo lường" type="text" />
        </Pane>
        {formStatus()}
      </Pane>
    </>
  );
});

Index.propTypes = {
  dataDetails: PropTypes.PropTypes.any,
  type: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  dataDetails: {},
  type: ""
};

export default Index;