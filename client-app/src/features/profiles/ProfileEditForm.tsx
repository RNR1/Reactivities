import React, { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { Form as FinalForm, Field } from 'react-final-form'
import { Form, Button } from 'semantic-ui-react'
import TextInput from '../../app/common/form/TextInput'
import TextAreaInput from '../../app/common/form/TextAreaInput'
import { validate } from './validate'
import { IProfile } from '../../app/models/profile'

interface IProps {
	onSubmit: (values: any) => void
	profile: IProfile
}

const ProfileEditForm: FC<IProps> = ({ onSubmit, profile }) => (
	<FinalForm
		initialValues={profile}
		onSubmit={onSubmit}
		validate={validate}
		render={({ handleSubmit, invalid, pristine, submitting }) => (
			<Form onSubmit={handleSubmit} error>
				<Field
					name='displayName'
					placeholder='Display Name'
					value={profile?.displayName}
					component={TextInput}
				/>
				<Field
					name='bio'
					placeholder='Bio'
					rows={3}
					value={profile?.bio}
					component={TextAreaInput}
				/>
				<Button
					loading={submitting}
					disabled={invalid || pristine}
					floated='right'
					positive
					type='submit'
					content='Submit'
				/>
			</Form>
		)}
	/>
)

export default observer(ProfileEditForm)
