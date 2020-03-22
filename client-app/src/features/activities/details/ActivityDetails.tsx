import React, { FC, useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'
import { Spinner } from '../../../app/layout/Spinner'
import ActivityDetailedHeader from './ActivityDetailedHeader'
import ActivityDetailedInfo from './ActivityDetailedInfo'
import ActivityDetailedChat from './ActivityDetailedChat'
import ActivityDetailedSidebar from './ActivityDetailedSidebar'

interface IParams {
	id: string
}

const ActivityDetails: FC<RouteComponentProps<IParams>> = props => {
	const activityStore = useContext(ActivityStore)
	const { activity, loadActivity, loading } = activityStore
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
				<ActivityDetailedSidebar />
			</Grid.Column>
		</Grid>
	)
}

export default observer(ActivityDetails)
