import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class BitgetExchangeApi implements ICredentialType {
	name = 'bitgetExchangeApi';
	displayName = 'Bitget Exchange API';
	documentationUrl = 'https://bitgetlimited.github.io/apidoc/en/spot/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Bitget API Key',
		},
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Bitget Secret Key',
		},
		{
			displayName: 'Passphrase',
			name: 'passphrase',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Bitget API Passphrase',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.bitget.com',
			required: true,
			description: 'The base URL for Bitget API',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
			],
			default: 'production',
			description: 'The environment to use',
		},
	];
}