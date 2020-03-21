import React, { FC, useState, FormEvent, useContext } from 'react'
import ActivityStore from '../../../app/stores/activityStore'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import {v4 as uuid} from 'uuid'
import { observer } from 'mobx-react-lite'

interface IProps {
	activity: IActivity
}

const ActivityForm: FC<IProps> = props => {
	const initialFormState = props.activity
	const activityStore = useContext(ActivityStore)
	const { cancelFormOpen, submitting } = activityStore
	const { createActivity, editActivity } = activityStore
	const initializeForm = () => {
		if (initialFormState) {
			return initialFormState
		} else {
			return {
				id: '',
				title: '',
				category: '',
				description: '',
				date: '',
				city: '',
				venue: ''
			}
		}
	}

	const [activity, setActivity] = useState<IActivity>(initializeForm)

	const onChange = (
		event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.currentTarget
		setActivity({ ...activity, [name]: value })
	}

	const onSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity, id: uuid()
      }
      createActivity(newActivity)
    } else {
      editActivity(activity)
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
					onClick={cancelFormOpen}
					floated='right'
					type='button'
					content='Cancel'
				/>
			</Form>
		</Segment>
	)
}

export default observer(ActivityForm)