import { memo } from 'react';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { head } from 'lodash';
import PropTypes from 'prop-types';
import FormDetail from '@/components/CommonComponent/FormDetail';
import { variables } from '@/utils';
import HelperModules from '../../utils/Helper';

const Index = memo(({ details }) => {
  const file = details?.file ? JSON.parse(details?.file) : [];
  return (
    <Pane className="card p20">
      <Heading type="form-title" className="mb15">
        Thông tin chung
      </Heading>
      <Pane className="row border-bottom">
        <Pane className="col-lg-3">
          <FormDetail name={details?.code} label="ID" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-9">
          <FormDetail name={details?.interviewName} label="Phỏng vấn" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail
            name={details?.candidateName}
            label="Tên ứng viên"
            type={variables.TYPE.TEXT}
          />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail
            name={details?.location}
            label="Vị trí ứng tuyển"
            type={variables.TYPE.TEXT}
          />
        </Pane>
      </Pane>
      <Pane className="row pt20">
        <Pane className="col-lg-3">
          <FormDetail name={details?.division?.name} label="Bộ phận" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail
            name={head(file)?.name}
            link={head(file)?.url}
            label="CV ứng viên"
            type={variables.TYPE.LINK}
          />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail
            name={details?.interviewConfiguration?.name}
            label="Cấu hình áp dụng"
            type={variables.TYPE.TEXT}
          />
        </Pane>
        <Pane className="col-lg-9">
          <FormDetail
            name={details?.interviewListEmployee}
            label="Người phụ trách"
            type={variables.TYPE.SELECT_TAGS}
          />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail
            name={`${details?.date}, ${details?.time}`}
            label="Thời gian"
            type={variables.TYPE.TEXT}
          />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name={`${details?.address}`} label="Địa điểm" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail label="Trạng thái" type={variables.TYPE.LABEL} />
          <>{HelperModules.tagStatus(details?.status)}</>
        </Pane>
      </Pane>
    </Pane>
  );
});

Index.propTypes = {
  details: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  details: {},
};

export default Index;
