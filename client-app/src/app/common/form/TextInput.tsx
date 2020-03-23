import React, { FC } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string>, FormFieldProps {}

const TextInput: FC<IProps> = props => {
	const { input, width, type, placeholder, meta } = props
	const { touched, error } = meta
	return (
		<Form.Field error={touched && !!error} type={type} width={width}>
			<input {...input} placeholder={placeholder} />
			{touched && error && (
				<Label basic color='red'>
					{error}
				</Label>
			)}
		</Form.Field>
	)
}

export default TextInput
