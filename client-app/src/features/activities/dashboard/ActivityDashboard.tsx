import React, { FC, useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import ActivityList from './ActivityList'
import { observer } from 'mobx-react-lite'
import { Spinner } from '../../../app/layout/Spinner'
import {RootStoreContext} from '../../../app/stores/rootStore'

const ActivityDashboard: FC = () => {
	const rootStore = useContext(RootStoreContext)
	const { loading, loadActivities } = rootStore.activityStore

	useEffect(() => {
		loadActivities()
	}, [loadActivities])

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
