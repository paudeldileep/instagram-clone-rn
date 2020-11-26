import { combineReducers } from 'redux'
import { user } from './user'
import { users } from './users'

const Reducers = combineReducers({
    userState: user,
    
})

export default Reducers