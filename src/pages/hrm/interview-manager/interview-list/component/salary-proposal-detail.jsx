import { memo, useEffect, useRef } from 'react';
import Pane from '@/components/CommonComponent/Pane';

import FormDetail from '@/components/CommonComponent/FormDetail';
import { variables } from '@/utils';

const Index = memo(() => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <>
      <Pane className="row border-bottom">
        <Pane className="col-lg-3">
          <FormDetail name="20.000.000 đ" label="Mức lương đề xuất" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name="Không duyệt lương" label="CEO xử lý" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-6">
          <FormDetail name="Lương đề xuất cao hơn mặt bằng chung. Xem xét lại" label="Nội dung" type={variables.TYPE.TEXT} />
        </Pane>
      </Pane>
      <Pane className="row pt20">
        <Pane className="col-lg-3">
          <FormDetail name="18.000.000 đ" label="Mức lương đề xuất lần 2" type={variables.TYPE.TEXT} />
        </Pane>
      </Pane>
    </>
  );
});

export default Index;