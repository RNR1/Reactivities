import React, { useEffect, FC, Fragment, useContext } from 'react'
import { Container } from 'semantic-ui-react'
import Navbar from '../../features/nav/Navbar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import { observer } from 'mobx-react-lite'
import { Spinner } from './Spinner'
import ActivityStore from '../stores/activityStore'

const App: FC = () => {
	const activityStore = useContext(ActivityStore)
	const { loading } = activityStore

	useEffect(() => {
		activityStore.loadActivities()
	}, [activityStore])

	if (loading) return <Spinner content='Loading activities...' />
	return (
		<Fragment>
			<Navbar />
			<Container style={{ marginTop: '7em' }}>
				<ActivityDashboard />
			</Container>
		</Fragment>
	)
}

export default observer(App)
