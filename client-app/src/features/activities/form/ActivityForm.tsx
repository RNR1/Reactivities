import React, { FC, useState, FormEvent } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import {v4 as uuid} from 'uuid' 

interface IProps {
	setEditMode: (editMode: boolean) => void
	activity: IActivity
	createActivity: (activity: IActivity) => void
	editActivity: (activity: IActivity) => void
	submitting: boolean
}

export const ActivityForm: FC<IProps> = props => {
	const { setEditMode, activity: initialFormState } = props
	const { createActivity, editActivity, submitting } = props
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
					onClick={() => setEditMode(false)}
					floated='right'
					type='button'
					content='Cancel'
				/>
			</Form>
		</Segment>
	)
}
