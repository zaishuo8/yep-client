export const UpdateUserType = 'UpdateUserType';

export interface UserState {
  id: number;
  phone: string;
  name: string;
  avatars: string;
}

const initialState: UserState = {
  id: 0,
  phone: '',
  name: '',
  avatars: '',
};

export function userReducer(
  state: UserState = initialState,
  action: {type: string; user: UserState},
): UserState {
  switch (action.type) {
    case UpdateUserType:
      return action.user;
    default:
      return state;
  }
}
