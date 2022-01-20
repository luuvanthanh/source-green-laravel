import { memo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Menu } from 'antd';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'dva';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from 'umi';
import ParentsForm from './forms/parents';
import StudentForm from './forms/student';
import PotentialForm from './forms/potential';
import MedicalForm from './forms/medical';
import ConsentForm from './forms/consent';
import TestInputForm from './forms/testInput';
import TuitionForm from './forms/tuition';
import FileForm from './forms/file';
import AddForm from './forms/add';
import ChildEvaluationForm from './forms/child-evaluation';

import { menu, defaultKey } from './menu';

const { Item: MenuItem } = Menu;

const forms = {
  student: <StudentForm />,
  parents: <ParentsForm />,
  potential: <PotentialForm />,
  medical: <MedicalForm />,
  consent: <ConsentForm />,
  testInput: <TestInputForm />,
  tuition: <TuitionForm />,
  file: <FileForm />,
  childEvaluation :<ChildEvaluationForm/>,
};

const Index = memo(({ match: { params }, location: { pathname, query } }) => {
  const [activeMenuItem] = useState(defaultKey);
  const dispatch = useDispatch();
  const [{ menuLeftCRM }, details] = useSelector(({ menu , crmSaleAdmissionAdd}) => [menu, crmSaleAdmissionAdd.details]);


  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);
  return (
    <div style={{ padding: 20 }}>
      <Helmet title="Tạo hồ sơ phụ huynh" />
      <Breadcrumbs className="pb20 pt0 pl0" last={params.id ? <>Cập nhập thông tin đăng ký nhập học - {details?.studentInfo?.full_name}</>  : 'thêm mới'} menu={menuLeftCRM} />
      {params.id ? (
        <div className="row">
          <div className="col-lg-3">
            <div className="card">
              <Scrollbars autoHeight autoHeightMax={window.innerHeight - 200}>
                <Menu selectedKeys={query.type || activeMenuItem} mode="inline">
                  {params.id &&
                    menu
                      .filter((item) => item.key)
                      .map(({ key, label }) => (
                        <MenuItem key={key}>
                          <Link to={`${pathname}?type=${key}`}>{label}</Link>
                        </MenuItem>
                      ))}
                </Menu>
              </Scrollbars>
            </div>
          </div>
          <div className="col-lg-9">{forms[query.type || defaultKey]}</div>
        </div>
      ) : (
        <div className="row">
           <div className="col-lg-10 offset-lg-1">
              <AddForm />
          </div>
        </div>
      )}
    </div>
  );
});

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  location: {},
};

export default Index;
