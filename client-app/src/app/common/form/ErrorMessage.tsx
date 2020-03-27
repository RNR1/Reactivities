import React, { FC } from 'react'
import { AxiosResponse } from 'axios'
import { Message } from 'semantic-ui-react'

interface IProps {
	error: AxiosResponse
	text?: string
}

const ErrorMessage: FC<IProps> = ({ error, text }) => {
	return (
		<Message error>
			<Message.Header>{error.statusText}</Message.Header>
      {error.data && Object.keys(error.data.errors).length && (
        <Message.List>
          {Object.values(error.data.errors).flat().map((err, i) => (
            <Message.Item key={i}>{err}</Message.Item>
          ))}
        </Message.List>
      )}
			{error && <Message.Content content={text} />}
		</Message>
	)
}

export default ErrorMessage
