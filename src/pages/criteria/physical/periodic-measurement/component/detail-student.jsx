import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Pane from '@/components/CommonComponent/Pane';
import FormDetail from '@/components/CommonComponent/FormDetail';
import ImgDetail from '@/components/CommonComponent/imageDetail';


import stylesModule from '../styles.module.scss';

import '@/assets/styles/Modules/TimeTables/styles.module.scss';

const Index = memo(({
  dataDetails,
}) => {
  const detailSchoolYear = `${dataDetails?.information?.schoolYear?.yearFrom} - ${dataDetails?.information?.schoolYear?.yearTo}`;
  const marginProps = { style: { paddingTop: 12, paddingBottom: 20 } };
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
          <FormDetail name={dataDetails?.information?.assessmentPeriod?.name} label="Monthly comment" type="text" />
        </Pane>
      </Pane>
    </>
  );
});

Index.propTypes = {
  dataDetails: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  dataDetails: {},
};

export default Index;