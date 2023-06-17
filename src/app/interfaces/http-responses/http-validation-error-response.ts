import {HttpGeneralResponse} from './http-general-response';

export interface HttpValidationErrorResponse extends HttpGeneralResponse {
    message: string;
	errors: {
		[key: string]: Array<string>;
	};
}
