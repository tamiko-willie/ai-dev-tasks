import React, { useState } from 'react';

export type SearchField = 'firstName' | 'lastName' | 'displayName';

export interface UserLookupControlProps {
  /**
   * When true, search the project first and then fall back to the organisation.
   * When false the org search is performed before the project search.
   */
  projectFirst?: boolean;

  /**
   * When set to "org" only organisation search will be performed. Defaults to
   * "project" which will search the project first and then the organisation.
   */
  searchScope?: 'project' | 'org';

  /** Order of search fields within the project scope */
  projectSearchOrder?: SearchField[];

  /** Order of search fields within the organisation scope */
  orgSearchOrder?: SearchField[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
}

async function searchProjectUsersByFirstName(query: string): Promise<User[]> {
  // TODO: Replace with real API call to project scoped user search by first name
  console.log(`Searching project users by first name for ${query}`);
  return [];
}

async function searchProjectUsersByLastName(query: string): Promise<User[]> {
  // TODO: Replace with real API call to project scoped user search by last name
  console.log(`Searching project users by last name for ${query}`);
  return [];
}

async function searchProjectUsersByDisplayName(query: string): Promise<User[]> {
  // TODO: Replace with real API call to project scoped user search by display name
  console.log(`Searching project users by display name for ${query}`);
  return [];
}

async function searchOrgUsersByFirstName(query: string): Promise<User[]> {
  // TODO: Replace with real API call to organisation wide user search by first name
  console.log(`Searching org users by first name for ${query}`);
  return [];
}

async function searchOrgUsersByLastName(query: string): Promise<User[]> {
  // TODO: Replace with real API call to organisation wide user search by last name
  console.log(`Searching org users by last name for ${query}`);
  return [];
}

async function searchOrgUsersByDisplayName(query: string): Promise<User[]> {
  // TODO: Replace with real API call to organisation wide user search by display name
  console.log(`Searching org users by display name for ${query}`);
  return [];
}

export default function UserLookupControl({
  projectFirst = true,
  searchScope = 'project',
  projectSearchOrder = ['firstName', 'lastName', 'displayName'],
  orgSearchOrder = ['firstName', 'lastName', 'displayName'],
}: UserLookupControlProps): React.ReactElement {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);

  const handleSearch = async (): Promise<void> => {
    const searchProject = async (): Promise<User[]> => {
      for (const field of projectSearchOrder) {
        let u: User[] = [];
        if (field === 'firstName') u = await searchProjectUsersByFirstName(query);
        if (field === 'lastName') u = await searchProjectUsersByLastName(query);
        if (field === 'displayName') u = await searchProjectUsersByDisplayName(query);
        if (u.length > 0) return u;
      }
      return [];
    };

    const searchOrg = async (): Promise<User[]> => {
      for (const field of orgSearchOrder) {
        let u: User[] = [];
        if (field === 'firstName') u = await searchOrgUsersByFirstName(query);
        if (field === 'lastName') u = await searchOrgUsersByLastName(query);
        if (field === 'displayName') u = await searchOrgUsersByDisplayName(query);
        if (u.length > 0) return u;
      }
      return [];
    };

    let users: User[] = [];

    if (searchScope === 'org') {
      users = await searchOrg();
    } else if (projectFirst) {
      users = await searchProject();
      if (users.length === 0 && searchScope === 'project') {
        users = await searchOrg();
      }
    } else {
      users = await searchOrg();
      if (users.length === 0 && searchScope === 'project') {
        users = await searchProject();
      }
    }

    setResults(users);
  };

  return (
    <div>
      <label htmlFor="lookup-input">Lookup by first name:</label>
      <input
        id="lookup-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="button" onClick={handleSearch}>
        Search
      </button>
      <ul>
        {results.map((user) => (
          <li key={user.id}>{`${user.firstName} ${user.lastName}`}</li>
        ))}
      </ul>
    </div>
  );
}
