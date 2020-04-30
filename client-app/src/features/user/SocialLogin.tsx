import React, { FC } from 'react'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { Button, Icon } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'

interface IProps {
	fbCallback: (response: any) => void
	loading: boolean
}

const SocialLogin: FC<IProps> = ({ fbCallback, loading }) => {
	return (
		<div>
			<FacebookLogin
				appId='669387347210211'
				fields='name,email,picture'
				callback={fbCallback}
				render={(renderProps: any) => (
					<Button
						loading={loading}
						onClick={renderProps.onClick}
						type='button'
						fluid
						color='facebook'>
						<Icon name='facebook' />
						Login with Facebook
					</Button>
				)}
			/>
		</div>
	)
}

export default observer(SocialLogin)
