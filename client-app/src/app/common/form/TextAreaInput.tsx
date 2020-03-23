import React, { FC } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string>, FormFieldProps {}

const TextAreaInput: FC<IProps> = props => {
	const { input, width, rows, placeholder, meta } = props
	const { touched, error } = meta
	return (
		<Form.Field error={touched && !!error} width={width}>
			<textarea rows={rows} {...input} placeholder={placeholder} />
			{touched && error && (
				<Label basic color='red'>
					{error}
				</Label>
			)}
		</Form.Field>
	)
}

export default TextAreaInput
