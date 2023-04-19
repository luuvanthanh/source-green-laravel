import { memo, useEffect, useRef } from 'react';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import FormDetail from '@/components/CommonComponent/FormDetail';
import PropTypes from 'prop-types';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import VariablesModules from '../../utils/variables';

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
      {details?.status === VariablesModules.STATUS.INTERVIEWED && (
        <Pane className="col-lg-3 P0">
          <FormItem
            name="suggestedSalary"
            placeholder="Nhập mức lương đề xuất"
            type={variables.INPUT_NUMBER}
            rules={[variables.RULES.EMPTY]}
            label="Mức lương đề xuất"
          />
        </Pane>
      )}
      {details?.status === VariablesModules.STATUS.NO_SALARY_APPROVAL && (
        <>
          <Pane className="row border-bottom">
            <Pane className="col-lg-3">
              <FormDetail
                name={details?.suggestedSalary}
                label="Mức lương đề xuất"
                type={variables.TYPE.TEXT}
              />
            </Pane>
            <Pane className="col-lg-3">
              <FormDetail
                name={VariablesModules.STATUS_NAME[details?.status]}
                label="CEO xử lý"
                type={variables.TYPE.TEXT}
              />
            </Pane>
            <Pane className="col-lg-6">
              <FormDetail name={details?.messages} label="Nội dung" type={variables.TYPE.TEXT} />
            </Pane>
          </Pane>
          <Pane className="row pt20">
            <Pane className="col-lg-3">
              <Pane className="col-lg-3 P0">
                <FormItem
                  name="suggestedSalary"
                  placeholder="Nhập mức lương đề xuất lần 2"
                  type={variables.INPUT_NUMBER}
                  rules={[variables.RULES.EMPTY]}
                  label="Mức lương đề xuất"
                />
              </Pane>
            </Pane>
          </Pane>
        </>
      )}
      {details?.status === VariablesModules.STATUS.PENDING ||
        (details?.status === VariablesModules.STATUS.DO_NOT_APPROVECANDIDATES && (
          <>
            <Pane className="row border-bottom">
              <Pane className="col-lg-3">
                <FormDetail
                  name={details?.suggestedSalary}
                  label="Mức lương đề xuất"
                  type={variables.TYPE.TEXT}
                />
              </Pane>
              <Pane className="col-lg-3">
                <FormDetail
                  name={VariablesModules.STATUS_NAME[details?.status]}
                  label="CEO xử lý"
                  type={variables.TYPE.TEXT}
                />
              </Pane>
              <Pane className="col-lg-6">
                <FormDetail name={details?.messages} label="Nội dung" type={variables.TYPE.TEXT} />
              </Pane>
            </Pane>
            <Pane className="row pt20">
              <Pane className="col-lg-3 P0">
                <FormDetail
                  name={details?.suggestedSalary}
                  label="Nhập mức lương đề xuất lần 2"
                  type={variables.TYPE.TEXT}
                />
              </Pane>
            </Pane>
          </>
        ))}
      {details?.status === VariablesModules.STATUS.APPROVED && (
        <Pane className="row border-bottom">
          <Pane className="col-lg-3">
            <FormDetail
              name={details?.suggestedSalary}
              label="Mức lương đề xuất"
              type={variables.TYPE.TEXT}
            />
          </Pane>
          <Pane className="col-lg-3">
            <FormDetail
              name={VariablesModules.STATUS_NAME[details?.status]}
              label="CEO xử lý"
              type={variables.TYPE.TEXT}
            />
          </Pane>
        </Pane>
      )}
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
