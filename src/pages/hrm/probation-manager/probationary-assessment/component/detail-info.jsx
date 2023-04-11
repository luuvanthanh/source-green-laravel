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
      <Pane className="row border-bottom">
        <Pane className="col-lg-3">
          <FormDetail name="PV0001" label="ID" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name="Nội dung đánh giá" label="Nội dung đánh giá" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name="Nguyễn Thị H" label="Tên nhân sự" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name="Kinh doanh" label="Bộ phận" type={variables.TYPE.TEXT} />
        </Pane>
      </Pane>
      <Pane className="row pt20">
        <Pane className="col-lg-3">
          <FormDetail name="Kinh doanh" label="Thời gian" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name="Cấu hình kinh doanh" label="Tên cấu hình" type={variables.TYPE.TEXT} />
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;