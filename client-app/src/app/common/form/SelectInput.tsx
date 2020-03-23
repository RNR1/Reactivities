import React, { FC } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label, Select } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string>, FormFieldProps {}

const SelectInput: FC<IProps> = props => {
	const { input, width, options, placeholder, meta } = props
	const { touched, error } = meta
	return (
		<Form.Field error={touched && !!error} width={width}>
			<Select
				value={input.value}
				onChange={(e, data) => input.onChange(data.value)}
				placeholder={placeholder}
				options={options}
			/>
			{touched && error && (
				<Label basic color='red'>
					{error}
				</Label>
			)}
		</Form.Field>
	)
}

export default SelectInput
