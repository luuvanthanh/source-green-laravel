import { memo, useEffect, useRef } from 'react';
import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import PropTypes from 'prop-types';
import FormDetail from '@/components/CommonComponent/FormDetail';
import { variables } from '@/utils';

const Index = memo(({ details }) => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <Pane className="card p20">
      <Heading type="form-title" className="mb15">
        Đề xuất mức lương
      </Heading>
      <Pane className="row border-bottom">
        <Pane className="col-lg-3">
          <FormDetail
            name={details?.suggestedSalary}
            label="Mức lương đề xuất"
            type={variables.TYPE.TEXT}
          />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail label="CEO xử lý" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-6">
          <FormDetail label="Nội dung" type={variables.TYPE.TEXT} />
        </Pane>
      </Pane>
      <Pane className="row pt20">
        <Pane className="col-lg-3">
          <FormDetail label="Mức lương đề xuất lần 2" type={variables.TYPE.TEXT} />
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
