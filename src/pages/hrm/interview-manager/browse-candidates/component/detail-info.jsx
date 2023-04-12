import { memo, useEffect, useRef } from 'react';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';

import FormDetail from '@/components/CommonComponent/FormDetail';
import { variables } from '@/utils';

const Index = memo(() => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <Pane className="card p20">
      <Heading type="form-title" className="mb15">
        Thông tin chung
      </Heading>
      <Pane className="row">
        <Pane className="col-lg-3">
          <FormDetail name="PV0001" label="ID" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-9">
          <FormDetail name="Phỏng vấn kinh doanh" label="Phỏng vấn" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name="Nguyễn Thị H" label="Tên ứng viên" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name="Kinh doanh" label="Vị trí ứng tuyển" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail label="CV ứng viên" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name="Cấu hình kinh doanh" label="Cấu hình áp dụng" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-9">
          <FormDetail name=" " label="Người phụ trách" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name="15/01/2023, 10:00" label="Thời gian" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name="Cấu hình kinh doanh" label="Địa điểm" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name="" label="Trạng thái" type={variables.TYPE.TEXT} />
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;