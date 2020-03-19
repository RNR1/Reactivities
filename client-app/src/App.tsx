import React, { useState, useEffect, FC } from 'react'
import { Header, Icon, List } from 'semantic-ui-react'
import axios from 'axios'

const getValues = () => axios.get('http://localhost:5000/api/values')

const App: FC = () => {
	const [values, setValues] = useState([])

	useEffect(() => {
		getValues().then(({ data }) => {
			setValues(data)
		})
	}, [])

	return (
		<div>
			<Header as='h2'>
				<Icon name='users' />
				<Header.Content>Reactivities</Header.Content>
			</Header>
			<List>
				{values.map((v: any) => (
					<List.Item key={v.id}>{v.name}</List.Item>
				))}
			</List>
		</div>
	)
}

export default App
