
import {User} from 'app/interfaces/entities/user';
import {HttpGeneralResponse} from 'app/interfaces/http-responses/http-general-response';

export interface SignInSuccessResponse extends HttpGeneralResponse {
	data: {
		accessToken: string;
		tokenType: string;
		expiresIn: string;
		user: User;
	};
}
