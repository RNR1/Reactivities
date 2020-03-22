import React, { FC, useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import ActivityList from './ActivityList'
import { observer } from 'mobx-react-lite'
import ActivityStore from '../../../app/stores/activityStore'
import { Spinner } from '../../../app/layout/Spinner'

const ActivityDashboard: FC = () => {
	const activityStore = useContext(ActivityStore)
	const { loading } = activityStore

	useEffect(() => {
		activityStore.loadActivities()
	}, [activityStore])

	if (loading) return <Spinner content='Loading activities...' />
	return (
		<Grid>
			<Grid.Column width={10}>
				<ActivityList />
			</Grid.Column>
			<Grid.Column width={6}>
				<h2>Activity filters</h2>
			</Grid.Column>
		</Grid>
	)
}

export default observer(ActivityDashboard)
