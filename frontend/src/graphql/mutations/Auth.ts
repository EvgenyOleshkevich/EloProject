import { gql, type TypedDocumentNode } from '@apollo/client';

export interface AuthInput {
  email: string;
  password: string;
}

export type LoginInput = AuthInput;
export type RegisterInput = AuthInput;

export interface AuthPayload {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export type LoginVariables = { input: LoginInput };
export type CreateUserVariables = { input: RegisterInput };

export interface LoginResponse {
  login: AuthPayload;
}

export interface CreateUserResponse {
  createUser: AuthPayload;
}

export const LOGIN_USER: TypedDocumentNode<LoginResponse, LoginVariables> = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
      }
    }
  }
`;

export const CREATE_USER: TypedDocumentNode<CreateUserResponse, CreateUserVariables> = gql`
  mutation CreateUser($input: RegisterInput!) {
    createUser(input: $input) {
      token
      user {
        id
        email
      }
    }
  }
`;