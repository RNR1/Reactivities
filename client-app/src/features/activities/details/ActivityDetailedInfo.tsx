import React, { FC } from 'react'
import { Segment, Grid, Icon } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { format } from 'date-fns'

interface IProps {
	activity: IActivity
}

const ActivityDetailedInfo: FC<IProps> = ({ activity }) => {
	const { description, venue, city } = activity
	const date = format(activity.date!, 'eeee do MMMM')
	const time = format(activity.date!, 'h:mm a')
	return (
		<Segment.Group>
			<Segment attached='top'>
				<Grid>
					<Grid.Column width={1}>
						<Icon size='large' color='teal' name='info' />
					</Grid.Column>
					<Grid.Column width={15}>
						<p>{description}</p>
					</Grid.Column>
				</Grid>
			</Segment>
			<Segment attached>
				<Grid verticalAlign='middle'>
					<Grid.Column width={1}>
						<Icon name='calendar' size='large' color='teal' />
					</Grid.Column>
					<Grid.Column width={15}>
						<span>{date} at {time}</span>
					</Grid.Column>
				</Grid>
			</Segment>
			<Segment attached>
				<Grid verticalAlign='middle'>
					<Grid.Column width={1}>
						<Icon name='marker' size='large' color='teal' />
					</Grid.Column>
					<Grid.Column width={11}>
						<span>
							{venue}, {city}
						</span>
					</Grid.Column>
				</Grid>
			</Segment>
		</Segment.Group>
	)
}

export default ActivityDetailedInfo
