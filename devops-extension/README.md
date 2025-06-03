# DevOps User Lookup Extension

This extension provides a custom user lookup control for Azure DevOps work item forms. The control first searches users scoped to the current project and then falls back to an organization-wide search.

## Installation

1. Build the extension assets.
2. Upload the extension to your Azure DevOps organization.
3. Add the `User Lookup Control` contribution to your work item forms.

## Configuration

The control accepts the following configuration options:

- `searchScope` – Set to `"org"` to search only the organisation. When omitted the project is searched first and then the organisation.
- `projectFirst` – When `true` (default) the project is searched before the organisation. Set to `false` to search org users first.
- `projectSearchOrder` – Array describing the search order within the project. Valid values are `"firstName"`, `"lastName"` and `"displayName"`.
- `orgSearchOrder` – Array describing the search order within the organisation.

Configuration options can be supplied via the extension's contribution properties or passed as props when used in a React application.

## Development

Source code is located in `src/`. Implement the API calls for the various `searchProjectUsersBy*` and `searchOrgUsersBy*` functions to integrate with your user directory.
