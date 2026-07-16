import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MedusaApi implements ICredentialType {
	name = 'medusaApi';

	displayName = 'Medusa API';

	icon = 'file:medusaApi.svg' as const;

	documentationUrl = 'https://github.com/pymedusa/Medusa/wiki';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://medusa:8081',
			required: true,
			description: 'Base URL of the Medusa instance (e.g. http://medusa:8081). No trailing slash.',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Medusa API key (Settings → General → Interface → API key)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Api-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v2/config/main',
		},
	};
}
