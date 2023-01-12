import React, { memo } from 'react';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import { Form } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import '@/assets/styles/Modules/TimeTables/styles.module.scss';
import stylesModule from '../../styles.module.scss';


const Index = memo(({ formRef, search, dataYears, changeFilter, changeBanchFilter, checkEdit, setCheckEdit, handleSave, branches, defaultBranch, classes, loading }) => (
  <div className={classnames(styles.search, 'pt20', 'pb20')}>
    <Form layout="vertical" form={formRef} initialValues={{ ...search }}>
      <div className="row">
        <div className="col-lg-3 m0">
          <FormItem
            className="ant-form-item-row"
            data={dataYears}
            label="SHOOL YEAR"
            name="schoolYearId"
            type={variables.SELECT}
            allowClear={false}
            onChange={(value) => changeFilter('schoolYearId')(value)}
          />
        </div>
        <div className="col-lg-3">
          <FormItem
            className="ant-form-item-row"
            data={branches}
            label="CENTER"
            name="branchId"
            type={variables.SELECT}
            allowClear={false}
            onChange={(value) => changeBanchFilter('branchId')(value)}
            disabled={!!defaultBranch?.id}
          />
        </div>
        <div className="col-lg-3">
          <FormItem
            className="ant-form-item-row"
            data={classes}
            label="CLASS"
            name="classId"
            onChange={(value) => changeFilter('classId')(value)}
            type={variables.SELECT}
            allowClear={false}
            disabled={!!defaultBranch?.id}
          />
        </div>
        <div className={classnames(stylesModule['header-btn'], 'col-lg-3', 'd-flex align-items-center')}>
          {
            checkEdit && (
              <p
                className="btn-delete ml20 mr20"
                role="presentation"
                onClick={() => setCheckEdit(false)}
              >
                Cancel
              </p>
            )
          }
          {
            !checkEdit ? <Button
              key="submit"
              color="success"
              type="primary"
              onClick={() => setCheckEdit(true)}
              loading={loading['englishStudyPlan/ADD_STUDY_PLAN']}
            >
              Edit
            </Button> :
              <Button
                key="submit"
                color="success"
                type="primary"
                onClick={() => handleSave()}
                loading={loading['englishStudyPlan/ADD_STUDY_PLAN']}
              >
                Save
              </Button>
          }
        </div>
      </div>
    </Form>
  </div>
));

Index.propTypes = {
  formRef: PropTypes.PropTypes.any,
  search: PropTypes.PropTypes.any,
  dataYears: PropTypes.PropTypes.any,
  changeFilter: PropTypes.PropTypes.any,
  changeBanchFilter: PropTypes.PropTypes.any,
  checkEdit: PropTypes.PropTypes.any,
  setCheckEdit: PropTypes.PropTypes.any,
  handleSave: PropTypes.PropTypes.any,
  branches: PropTypes.PropTypes.any,
  defaultBranch: PropTypes.PropTypes.any,
  classes: PropTypes.PropTypes.any,
  loading: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  formRef: () => { },
  search: {},
  dataYears: [],
  changeFilter: () => { },
  changeBanchFilter: () => { },
  checkEdit: false,
  setCheckEdit: false,
  handleSave: () => { },
  branches: [],
  defaultBranch: {},
  classes: [],
  loading: () => { },
};

export default Index;