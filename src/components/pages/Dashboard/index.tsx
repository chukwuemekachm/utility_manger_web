import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, match, RouteProps } from 'react-router';
import { Location } from 'history';

import withSuspense from 'components/HOC/withSuspense';
import withDashboardContainer from 'components/containers/DashBoardContainer';
import { retrieveProfile } from 'store/actions/dashboard';
import DashBoardLayout from 'components/layouts/DashBoardLayout';

interface DashboardProps {
  profile: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    verified: string;
    imageURL: string;
  };
  retrieveProfile: () => void;
  match: match<{}>;
  location: Location;
}

function getDashBoardRoutes(path: string): RouteProps[] {
  return [
    {
      path: `${path}`,
      component: withSuspense({ page: 'MyOrganisations' }),
      exact: true,
    },
    {
      path: `${path}/profile`,
      component: withSuspense({ page: 'UpdateProfile' }),
      exact: true,
    },
    {
      path: `${path}/organisation`,
      component: withSuspense({ page: 'CreateOrganisation' }),
      exact: true,
    },
    {
      path: `${path}/password`,
      component: withSuspense({ page: 'UpdatePassword' }),
      exact: true,
    },
  ];
}

class Dashboard extends React.Component<DashboardProps, {}> {
  componentDidMount(): void {
    const { retrieveProfile } = this.props;
    retrieveProfile();
  }

  getPageTitle = (): string => {
    const {
      location: { pathname },
    } = this.props;

    switch (pathname) {
      case '/dashboard/profile':
      case '/dashboard/profile/':
        return 'Update Profile';
      case '/dashboard/organisation':
      case '/dashboard/organisation/':
        return 'Create New Organisation';
      case '/dashboard/password':
      case '/dashboard/password/':
        return 'Update Password';
      default:
        return 'My Organisations';
    }
  };

  render(): React.ReactElement<DashboardProps> {
    const {
      profile,
      match: { path },
    } = this.props;
    const pageTitle = this.getPageTitle();

    return (
      <DashBoardLayout pageTitle={pageTitle} {...profile}>
        {
          <Switch>
            {getDashBoardRoutes(path).map((route, index) => (
              <Route key={index} {...route} />
            ))}
          </Switch>
        }
      </DashBoardLayout>
    );
  }
}

const mapStateToProps = (state): Pick<DashboardProps, 'profile'> => ({
  profile: state.dashboard.data,
});

const mapDispatchToProps = (dispatch): Pick<DashboardProps, 'retrieveProfile'> => ({
  retrieveProfile: (): void => dispatch(retrieveProfile()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withDashboardContainer(Dashboard));
