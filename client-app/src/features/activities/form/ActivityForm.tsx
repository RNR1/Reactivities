import React, { FC, useState, FormEvent, useContext, useEffect } from 'react'
import ActivityStore from '../../../app/stores/activityStore'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { v4 as uuid } from 'uuid'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'

interface IParams {
	id: string
}

const ActivityForm: FC<RouteComponentProps<IParams>> = props => {
	const activityStore = useContext(ActivityStore)
	const { submitting } = activityStore
	const { createActivity, editActivity, loadActivity } = activityStore
	const { activity: initialFormState, clearActivity } = activityStore
	const { match, history } = props
	const { id } = match.params

	const [activity, setActivity] = useState<IActivity>({
		id: '',
		title: '',
		category: '',
		description: '',
		date: '',
		city: '',
		venue: ''
	})

	useEffect(() => {
		if (id && !activity.id.length) {
			loadActivity(id).then(
				() => initialFormState && setActivity(initialFormState)
			)
			return () => {
				clearActivity()
			}
		}
	}, [loadActivity, initialFormState, clearActivity, id, activity.id.length])

	const onChange = (
		event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.currentTarget
		setActivity({ ...activity, [name]: value })
	}

	const onSubmit = () => {
		if (activity.id.length === 0) {
			let newActivity = {
				...activity,
				id: uuid()
			}
			createActivity(newActivity).then(() =>
				history.push('/activities/' + newActivity.id)
			)
		} else {
			editActivity(activity).then(() =>
				history.push('/activities/' + activity.id)
			)
		}
	}

	return (
		<Segment clearing>
			<Form onSubmit={onSubmit}>
				<Form.Input
					name='title'
					onChange={onChange}
					placeholder='Title'
					value={activity.title}
				/>
				<Form.TextArea
					name='description'
					rows={2}
					onChange={onChange}
					placeholder='Description'
					value={activity.description}
				/>
				<Form.Input
					name='category'
					onChange={onChange}
					placeholder='Category'
					value={activity.category}
				/>
				<Form.Input
					name='date'
					onChange={onChange}
					type='datetime-local'
					placeholder='Date'
					value={activity.date}
				/>
				<Form.Input
					name='city'
					onChange={onChange}
					placeholder='City'
					value={activity.city}
				/>
				<Form.Input
					name='venue'
					onChange={onChange}
					placeholder='Venue'
					value={activity.venue}
				/>
				<Button
					loading={submitting}
					floated='right'
					positive
					onChange={onChange}
					type='submit'
					content='Submit'
				/>
				<Button
					onClick={() => history.push('/activities')}
					floated='right'
					type='button'
					content='Cancel'
				/>
			</Form>
		</Segment>
	)
}

export default observer(ActivityForm)
