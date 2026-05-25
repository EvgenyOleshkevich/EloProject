import { gql, type TypedDocumentNode } from "@apollo/client";

export interface Character {
  id: string;
  name: string;
  element: string;
  rarity: number;
  image: string;
  constellation?: number;
  constellationCost?: number[];
}

export interface CreateCharacterInput {
  name: string;
  element: string;
  rarity: number;
  image: string;
  constellation?: number;
  constellationCost?: number[];
}

export interface UpdateCharacterInput {
  id: string;
  name?: string;
  element?: string;
  rarity?: number;
  image?: string;
  constellation?: number;
  constellationCost?: number[];
}

export interface Weapon {
  id: string;
  name: string;
  rarity: number;
  image: string;
  constellation?: number;
  constellationCost?: number[];
}

export interface CreateWeaponInput {
  name: string;
  rarity: number;
  image: string;
  constellation?: number;
  constellationCost?: number[];
}

export interface UpdateWeaponInput {
  id: string;
  name?: string;
  rarity?: number;
  image?: string;
  constellation?: number;
  constellationCost?: number[];
}

export type GetCharactersResponse = { characters: Character[] };
export type GetCharactersVariables = {};

export type GetCharacterResponse = { character: Character | null };
export type GetCharacterVariables = { id: string };

export type CreateCharacterResponse = { createCharacter: Character };
export type CreateCharacterVariables = { input: CreateCharacterInput };

export type UpdateCharacterResponse = { updateCharacter: Character };
export type UpdateCharacterVariables = { input: UpdateCharacterInput };

export type DeleteCharacterResponse = { deleteCharacter: boolean };
export type DeleteCharacterVariables = { id: string };

export const GET_CHARACTERS: TypedDocumentNode<
  GetCharactersResponse,
  GetCharactersVariables
> = gql`
  query GetCharacters {
    characters {
      id
      name
      element
      rarity
      image
      constellation
      constellationCost
    }
  }
`;

export const GET_CHARACTER: TypedDocumentNode<
  GetCharacterResponse,
  GetCharacterVariables
> = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      element
      rarity
      image
      constellation
      constellationCost
    }
  }
`;

export const CREATE_CHARACTER: TypedDocumentNode<
  CreateCharacterResponse,
  CreateCharacterVariables
> = gql`
  mutation CreateCharacter($input: CreateCharacterInput!) {
    createCharacter(input: $input) {
      id
      name
      element
      rarity
      image
      constellation
      constellationCost
    }
  }
`;

export const UPDATE_CHARACTER: TypedDocumentNode<
  UpdateCharacterResponse,
  UpdateCharacterVariables
> = gql`
  mutation UpdateCharacter($input: UpdateCharacterInput!) {
    updateCharacter(input: $input) {
      id
      name
      element
      rarity
      image
      constellation
      constellationCost
    }
  }
`;

export const DELETE_CHARACTER: TypedDocumentNode<
  DeleteCharacterResponse,
  DeleteCharacterVariables
> = gql`
  mutation DeleteCharacter($id: ID!) {
    deleteCharacter(id: $id)
  }
`;

export type GetWeaponsResponse = { weapons: Weapon[] };
export type GetWeaponsVariables = {};

export type GetWeaponResponse = { weapon: Weapon | null };
export type GetWeaponVariables = { id: string };

export type CreateWeaponResponse = { createWeapon: Weapon };
export type CreateWeaponVariables = { input: CreateWeaponInput };

export type UpdateWeaponResponse = { updateWeapon: Weapon };
export type UpdateWeaponVariables = { input: UpdateWeaponInput };

export type DeleteWeaponResponse = { deleteWeapon: boolean };
export type DeleteWeaponVariables = { id: string };

export const GET_WEAPONS: TypedDocumentNode<
  GetWeaponsResponse,
  GetWeaponsVariables
> = gql`
  query GetWeapons {
    weapons {
      id
      name
      rarity
      image
      constellation
      constellationCost
    }
  }
`;

export const GET_WEAPON: TypedDocumentNode<
  GetWeaponResponse,
  GetWeaponVariables
> = gql`
  query GetWeapon($id: ID!) {
    weapon(id: $id) {
      id
      name
      rarity
      image
      constellation
      constellationCost
    }
  }
`;

export const CREATE_WEAPON: TypedDocumentNode<
  CreateWeaponResponse,
  CreateWeaponVariables
> = gql`
  mutation CreateWeapon($input: CreateWeaponInput!) {
    createWeapon(input: $input) {
      id
      name
      rarity
      image
      constellation
      constellationCost
    }
  }
`;

export const UPDATE_WEAPON: TypedDocumentNode<
  UpdateWeaponResponse,
  UpdateWeaponVariables
> = gql`
  mutation UpdateWeapon($input: UpdateWeaponInput!) {
    updateWeapon(input: $input) {
      id
      name
      rarity
      image
      constellation
      constellationCost
    }
  }
`;

export const DELETE_WEAPON: TypedDocumentNode<
  DeleteWeaponResponse,
  DeleteWeaponVariables
> = gql`
  mutation DeleteWeapon($id: ID!) {
    deleteWeapon(id: $id)
  }
`;
