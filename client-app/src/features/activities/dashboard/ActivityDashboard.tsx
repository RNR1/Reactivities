import React, { FC, SyntheticEvent } from 'react'
import { Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import ActivityList from './ActivityList'
import { ActivityDetails } from '../details/ActivityDetails'
import { ActivityForm } from '../form/ActivityForm'

interface IProps {
	activities: IActivity[]
	selectActivity: (id: string) => void
	activity: IActivity | null
	editMode: boolean
	setEditMode: (editMode: boolean) => void
	setSelectedActivity: (activity: IActivity | null) => void
	createActivity: (activity: IActivity) => void
	editActivity: (activity: IActivity) => void
	deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void
	submitting: boolean,
	target: string
}

const ActivityDashboard: FC<IProps> = props => {
	const { activities, selectActivity, setSelectedActivity, activity } = props
	const { createActivity, editActivity, deleteActivity } = props
	const { editMode, setEditMode, submitting, target } = props
	return (
		<Grid>
			<Grid.Column width={10}>
				<ActivityList
					activities={activities}
					selectActivity={selectActivity}
					deleteActivity={deleteActivity}
					submitting={submitting}
					target={target}
				/>
			</Grid.Column>
			<Grid.Column width={6}>
				{activity && !editMode && (
					<ActivityDetails
						activity={activity}
						setEditMode={setEditMode}
						setSelectedActivity={setSelectedActivity}
					/>
				)}
				{editMode && (
					<ActivityForm
						setEditMode={setEditMode}
						activity={activity!}
						createActivity={createActivity}
						editActivity={editActivity}
						submitting={submitting}
					/>
				)}
			</Grid.Column>
		</Grid>
	)
}

export default ActivityDashboard
