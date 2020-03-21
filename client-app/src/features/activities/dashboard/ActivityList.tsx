import React, { FC, SyntheticEvent } from 'react'
import { Item, Button, Label, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'

interface IProps {
	activities: IActivity[]
	selectActivity: (id: string) => void
	deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void
	submitting: boolean
	target: string
}

const ActivityList: FC<IProps> = props => {
	const { activities, selectActivity, deleteActivity } = props
	const { submitting, target } = props
	return (
		<Segment>
			<Item.Group divided>
				{activities.map(activity => (
					<Item key={activity.id}>
						<Item.Content>
							<Item.Header as='a'>{activity.title}</Item.Header>
							<Item.Meta>{activity.date}</Item.Meta>
							<Item.Description>
								<div>{activity.description}</div>
								<div>
									{activity.city}, {activity.venue}
								</div>
							</Item.Description>
							<Item.Extra>
								<Button
									onClick={() => selectActivity(activity.id)}
									floated='right'
									content='View'
									color='blue'
								/>
								<Button
									name={activity.id}
									loading={target === activity.id && submitting}
									onClick={e => deleteActivity(e, activity.id)}
									floated='right'
									content='Delete'
									color='red'
								/>
								<Label basic content={activity.category} />
							</Item.Extra>
						</Item.Content>
					</Item>
				))}
			</Item.Group>
		</Segment>
	)
}

export default ActivityList
