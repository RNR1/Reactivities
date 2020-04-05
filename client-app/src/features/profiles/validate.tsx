import { combineValidators, isRequired } from 'revalidate'
export const validate = combineValidators({
	displayName: isRequired({ message: 'Display name is required' })
})
