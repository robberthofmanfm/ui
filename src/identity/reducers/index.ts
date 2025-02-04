// Libraries
import produce from 'immer'

import {CurrentIdentity} from '../apis/auth'
import {RemoteDataState} from 'src/types'

// Actions
import {
  Actions,
  SET_QUARTZ_IDENTITY,
  SET_QUARTZ_IDENTITY_STATUS,
  SET_CURRENT_BILLING_PROVIDER,
  SET_CURRENT_ORG_DETAILS,
} from 'src/identity/actions/creators'

export const initialState: CurrentIdentity = {
  user: {
    accountCount: 0,
    email: '',
    firstName: '',
    id: '',
    lastName: '',
    operatorRole: null,
    orgCount: 0,
  },
  org: {
    clusterHost: '',
    id: '',
    name: '',
  },
  account: {
    id: 0,
    name: '',
    type: 'free',
    accountCreatedAt: '',
    paygCreditStartDate: '',
  },
  status: RemoteDataState.NotStarted,
}

export default (state = initialState, action: Actions): CurrentIdentity =>
  produce(state, draftState => {
    switch (action.type) {
      case SET_QUARTZ_IDENTITY: {
        const {account, org, user} = action.identity

        // Store account information from /identity in state.
        draftState.account.accountCreatedAt = account.accountCreatedAt
        draftState.account.id = account.id
        draftState.account.name = account.name
        draftState.account.paygCreditStartDate = account.paygCreditStartDate
        draftState.account.type = account.type

        // Store org information from /identity in state.
        draftState.org.clusterHost = org.clusterHost
        draftState.org.id = org.id
        draftState.org.name = org.name

        // Store user information from /identity in state.
        draftState.user.accountCount = user.accountCount
        draftState.user.email = user.email
        draftState.user.firstName = user.firstName
        draftState.user.id = user.id
        draftState.user.lastName = user.lastName
        draftState.user.operatorRole = user.operatorRole
        draftState.user.orgCount = user.orgCount

        draftState = action.identity
        draftState.status = RemoteDataState.Done
        return
      }
      case SET_QUARTZ_IDENTITY_STATUS: {
        draftState.status = action.status
        return
      }
      case SET_CURRENT_BILLING_PROVIDER: {
        draftState.account.billingProvider = action.billingProvider
        return
      }
      case SET_CURRENT_ORG_DETAILS: {
        draftState.org = action.org
        return
      }
    }
  })
