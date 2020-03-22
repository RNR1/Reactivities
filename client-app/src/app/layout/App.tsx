import React, { FC, Fragment } from 'react'
import { Container } from 'semantic-ui-react'
import Navbar from '../../features/nav/Navbar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import { observer } from 'mobx-react-lite'
import { Route, withRouter, RouteComponentProps } from 'react-router-dom'
import { Home } from '../../features/home/Home'
import ActivityForm from '../../features/activities/form/ActivityForm'
import ActivityDetails from '../../features/activities/details/ActivityDetails'

const App: FC<RouteComponentProps> = ({ location }) => (
	<Fragment>
		<Route exact path='/' component={Home} />
		<Route
			path={'/(.+)'}
			render={() => (
				<Fragment>
					<Navbar />
					<Container style={{ marginTop: '7em' }}>
						<Route exact path='/activities' component={ActivityDashboard} />
						<Route path='/activities/:id' component={ActivityDetails} />
						<Route
							key={location.key}
							path={['/create-activity', '/manage/:id']}
							component={ActivityForm}
						/>
					</Container>
				</Fragment>
			)}
		/>
	</Fragment>
)

export default withRouter(observer(App))
