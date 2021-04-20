import { memo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Menu } from 'antd';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import GeneralForm from './forms/general';
import CuratorForm from './forms/curator';
import LevelForm from './forms/level';
import CertificateForm from './forms/certificate';
import HistoryForm from './forms/history';
import ContactForm from './forms/contact';
import HealthForm from './forms/health';
import BankForm from './forms/bank';
import TimeworkForm from './forms/timework';
import TransfersForm from './forms/transfers';
import ContractForm from './forms/contract';
import ProbationaryContractForm from '././forms/probationaryContract';
import InsurranceForm from './forms/insurrance';
import InsurranceHealthForm from './forms/InsurranceHealth';
import DaysOffForm from './forms/daysOff';
import ChildrenForm from './forms/children';
import SalaryForm from './forms/salary';
import RewardForm from './forms/reward';
import MagneticCardsForm from './forms/magnetic-cards';
import AccountForm from './forms/account';
import DismissedsForm from './forms/dismisseds';
import AppointsForm from './forms/appoints';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from 'umi';

import { menu, defaultKey } from './menu';

const { Item: MenuItem } = Menu;

const forms = {
  general: <GeneralForm />,
  curator: <CuratorForm />,
  level: <LevelForm />,
  certificate: <CertificateForm />,
  history: <HistoryForm />,
  contact: <ContactForm />,
  health: <HealthForm />,
  bank: <BankForm />,
  timework: <TimeworkForm />,
  transfers: <TransfersForm />,
  contract: <ContractForm />,
  probationaryContract: <ProbationaryContractForm />,
  insurrance: <InsurranceForm />,
  healthInsurrance: <InsurranceHealthForm />,
  daysOff: <DaysOffForm />,
  children: <ChildrenForm />,
  salary: <SalaryForm />,
  reward: <RewardForm />,
  magneticCards: <MagneticCardsForm />,
  account: <AccountForm />,
  dismisseds: <DismissedsForm />,
  appoints: <AppointsForm />,
};

const Index = memo(({ match: { params }, location: { pathname, query } }) => {
  const [activeMenuItem, setActiveMenuItem] = useState(defaultKey);
  return (
    <Pane style={{ padding: 20 }}>
      <Helmet title="Tạo hồ sơ nhân viên" />
      <Pane className="row" style={{ marginBottom: 20 }}>
        <Pane className="col">
          <Heading type="page-title">Tạo hồ sơ nhân viên</Heading>
        </Pane>
      </Pane>
      <Pane className="row">
        <Pane className="col-lg-3">
          <Pane className="card">
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
          </Pane>
        </Pane>
        <Pane className="col-lg-9">{forms[query.type || defaultKey]}</Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
