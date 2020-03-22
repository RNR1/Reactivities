import React, { FC, Fragment } from 'react'
import { Container } from 'semantic-ui-react'
import Navbar from '../../features/nav/Navbar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import { observer } from 'mobx-react-lite'
import { Route, withRouter, RouteComponentProps, Switch } from 'react-router-dom'
import { Home } from '../../features/home/Home'
import ActivityForm from '../../features/activities/form/ActivityForm'
import ActivityDetails from '../../features/activities/details/ActivityDetails'
import NotFound from './NotFound'
import {ToastContainer} from 'react-toastify'

const App: FC<RouteComponentProps> = ({ location }) => (
	<Fragment>
		<ToastContainer position='bottom-right' />
		<Route exact path='/' component={Home} />
		<Route
			path={'/(.+)'}
			render={() => (
				<Fragment>
					<Navbar />
					<Container style={{ marginTop: '7em' }}>
						<Switch>
						<Route exact path='/activities' component={ActivityDashboard} />
						<Route path='/activities/:id' component={ActivityDetails} />
						<Route
							key={location.key}
							path={['/create-activity', '/manage/:id']}
							component={ActivityForm}
						/>
						<Route component={NotFound} />
						</Switch>
					</Container>
				</Fragment>
			)}
		/>
	</Fragment>
)

export default withRouter(observer(App))
