import React, { FC } from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

interface IProps {
	inverted?: boolean
	content?: string
}

export const Spinner: FC<IProps> = ({ inverted = true, content }) => (
	<Dimmer active inverted={inverted}>
		<Loader content={content} />
	</Dimmer>
)
