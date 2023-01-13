import React, { memo } from 'react';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { head, debounce } from 'lodash';
import { Form } from 'antd';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'dva';
import PropTypes from 'prop-types';
import { Helper, variables } from '@/utils';
import '@/assets/styles/Modules/TimeTables/styles.module.scss';
import stylesModule from '../../styles.module.scss';

const Index = memo(({
  formRef,
  search,
  dataYears,
  checkEdit,
  setCheckEdit,
  handleSave,
  branches,
  defaultBranch,
  classes,
  loading,
  defaultBranchs,
  user,
  setSearch
}) => {
  const [
    { checkUse },
  ] = useSelector(({ englishStudyPlan }) => [
    englishStudyPlan,
  ]);

  const dispatch = useDispatch();

  const changeFilterDebouce = debounce((name, value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  }, 300);

  const changeBanchFilter = (name) => (value) => {
    const text = "Data has changed, do you want to delete the data?";
    if (checkUse?.check) {
      Helper.confirmDeleteEnglish({
        callback: () => {
          dispatch({
            type: 'englishStudyPlan/GET_CLASSES',
            payload: {
              branch: value,
            },
          });
          setSearch({
            ...search,
            classId: undefined,
          });
          formRef.setFieldsValue({
            classId: undefined,
          });
          dispatch({
            type: 'englishStudyPlan/CHECK_USE',
            payload: { check: false },
          });
        },
      }, text);
    } else {
      if (value) {
        dispatch({
          type: 'englishStudyPlan/GET_CLASSES',
          payload: {
            branch: value,
          },
        });
        setSearch({
          ...search,
          classId: undefined,
        });
        formRef.setFieldsValue({
          classId: undefined,
        });
      }
      changeFilterDebouce(name, value);
    }
  };

  const changeFilter = (name) => (value) => {
    changeFilterDebouce(name, value);
  };


  return (
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
          {!defaultBranch?.id && (
            <div className="col-lg-3">
              <FormItem
                className="ant-form-item-row"
                data={branches}
                label="CENTER"
                name="branchId"
                type={variables.SELECT}
                allowClear={false}
                onChange={(value) => changeBanchFilter('branchId')(value)}
              />
            </div>
          )}
          {defaultBranch?.id && (
            <div className="col-lg-3">
              <FormItem
                className="ant-form-item-row"
                data={defaultBranchs}
                label="CENTER"
                name="branchId"
                type={variables.SELECT}
                allowClear={false}
                onChange={(value) => changeBanchFilter('branchId')(value)}
              />
            </div>
          )}
          <div className="col-lg-3">
            <FormItem
              className="ant-form-item-row"
              data={user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER ? [...classes?.filter(i => i?.id === head(user?.objectInfo?.classTeachers)?.classId)] : [{ name: 'Chọn tất cả lớp', id: null }, ...classes]}
              label="CLASS"
              name="classId"
              onChange={(value) => changeFilter('classId')(value)}
              type={variables.SELECT}
              allowClear={false}
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
  );
});

Index.propTypes = {
  formRef: PropTypes.PropTypes.any,
  search: PropTypes.PropTypes.any,
  dataYears: PropTypes.PropTypes.any,
  checkEdit: PropTypes.PropTypes.any,
  setCheckEdit: PropTypes.PropTypes.any,
  handleSave: PropTypes.PropTypes.any,
  branches: PropTypes.PropTypes.any,
  defaultBranch: PropTypes.PropTypes.any,
  classes: PropTypes.PropTypes.any,
  loading: PropTypes.PropTypes.any,
  defaultBranchs: PropTypes.PropTypes.any,
  user: PropTypes.PropTypes.any,
  setSearch: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  formRef: () => { },
  search: {},
  dataYears: [],
  checkEdit: false,
  setCheckEdit: false,
  handleSave: () => { },
  branches: [],
  defaultBranch: {},
  classes: [],
  loading: () => { },
  defaultBranchs: [],
  user: {},
  setSearch: {},
};

export default Index;