import { memo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Menu } from 'antd';
import PropTypes from 'prop-types';

import Heading from '@/components/CommonComponent/Heading';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from 'umi';
import GeneralForm from './forms/general';
import CertificateForm from './forms/certificate';
import ContactForm from './forms/contact';
import BankForm from './forms/bank';
import TimeworkForm from './forms/timework';
import TransfersForm from './forms/transfers';
import ContractForm from './forms/contract';
import ProbationaryContractForm from './forms/probationaryContract';
import InsurranceForm from './forms/insurrance';
import InsurranceHealthForm from './forms/InsurranceHealth';
import ChildrenForm from './forms/children';
import SalaryForm from './forms/salary';
import RewardForm from './forms/reward';
import MagneticCardsForm from './forms/magnetic-cards';
import AccountForm from './forms/account';
import DismissedsForm from './forms/dismisseds';
import AppointsForm from './forms/appoints';
import DecisionRewardsForm from './forms/decision-rewards';
import PositionLevels from './forms/position-levels';

import { menu, defaultKey } from './menu';

const { Item: MenuItem } = Menu;

const forms = {
  general: <GeneralForm />,
  certificate: <CertificateForm />,
  contact: <ContactForm />,
  bank: <BankForm />,
  timework: <TimeworkForm />,
  transfers: <TransfersForm />,
  contract: <ContractForm />,
  probationaryContract: <ProbationaryContractForm />,
  insurrances: <InsurranceForm />,
  healthInsurrance: <InsurranceHealthForm />,
  children: <ChildrenForm />,
  salary: <SalaryForm />,
  reward: <RewardForm />,
  magneticCards: <MagneticCardsForm />,
  account: <AccountForm />,
  dismisseds: <DismissedsForm />,
  appoints: <AppointsForm />,
  'position-levels': <PositionLevels />,
  'decision-rewards': <DecisionRewardsForm />,
};

const Index = memo(({ match: { params }, location: { pathname, query } }) => {
  const [activeMenuItem] = useState(defaultKey);
  return (
    <div style={{ padding: 20 }}>
      <Helmet title="Tạo hồ sơ nhân viên" />
      <div className="row" style={{ marginBottom: 20 }}>
        <div className="col">
          <Heading type="page-title">Tạo hồ sơ nhân viên</Heading>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3">
          <div className="card">
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 200}>
              <Menu selectedKeys={query.type || activeMenuItem} mode="inline">
                {params.id &&
                  menu.map(({ key, label }) => (
                    <MenuItem key={key}>
                      <Link to={`${pathname}?type=${key}`}>{label}</Link>
                    </MenuItem>
                  ))}
                {!params.id &&
                  menu
                    .filter((item) => item.key === 'general')
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
