import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

export class Medusa implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Medusa',
		name: 'medusa',
		icon: { light: 'file:medusa.svg', dark: 'file:medusa-dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Query your Medusa TV automation through its API',
		defaults: { name: 'Medusa' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'medusaApi', required: true }],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Config', value: 'getConfig', action: 'Get the configuration' },
					{ name: 'Get Series', value: 'getSeries', action: 'Get many series' },
					{ name: 'Get Stats', value: 'getStats', action: 'Get statistics' },
				],
				default: 'getSeries',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const URL_BY_OP: Record<string, string> = {
			getConfig: '/api/v2/config/main',
			getSeries: '/api/v2/series',
			getStats: '/api/v2/stats',
		};

		for (let i = 0; i < items.length; i++) {
			try {
				const credentials = await this.getCredentials('medusaApi', i);
				const baseURL = (credentials.baseUrl as string).replace(/\/+$/, '');
				const operation = this.getNodeParameter('operation', i) as string;

				const url = URL_BY_OP[operation];
				if (!url) {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`, {
						itemIndex: i,
					});
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'medusaApi', {
					method: 'GET' as IHttpRequestMethods,
					baseURL,
					url,
					json: true,
				} as IHttpRequestOptions);

				if (Array.isArray(response)) {
					for (const element of response) {
						returnData.push({ json: element as IDataObject, pairedItem: { item: i } });
					}
				} else {
					returnData.push({ json: response as IDataObject, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
