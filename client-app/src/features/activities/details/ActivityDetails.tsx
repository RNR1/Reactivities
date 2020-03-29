import React, { FC, useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'
import { Spinner } from '../../../app/layout/Spinner'
import ActivityDetailedHeader from './ActivityDetailedHeader'
import ActivityDetailedInfo from './ActivityDetailedInfo'
import ActivityDetailedChat from './ActivityDetailedChat'
import ActivityDetailedSidebar from './ActivityDetailedSidebar'
import { RootStoreContext } from '../../../app/stores/rootStore'

interface IParams {
	id: string
}

const ActivityDetails: FC<RouteComponentProps<IParams>> = props => {
	const rootStore = useContext(RootStoreContext)
	const { activity, loadActivity, loading } = rootStore.activityStore
	const { id } = props.match.params

	useEffect(() => {
		loadActivity(id)
	}, [loadActivity, id])

	if (loading) return <Spinner content={'Loading activity...'} />
	if (!activity) return <h2>Activity not found.</h2>
	return (
		<Grid>
			<Grid.Column width={10}>
				<ActivityDetailedHeader activity={activity} />
				<ActivityDetailedInfo activity={activity} />
				<ActivityDetailedChat />
			</Grid.Column>
			<Grid.Column width={6}>
				<ActivityDetailedSidebar attendees={activity.attendees} />
			</Grid.Column>
		</Grid>
	)
}

export default observer(ActivityDetails)
