import { Outlet } from 'react-router-dom';
import { AppConfigProvider } from '../providers/AppConfigProvider';

const AppConfigLayout = () => {
  return (
    <AppConfigProvider>
      <Outlet />
    </AppConfigProvider>
  );
};

export default AppConfigLayout;
