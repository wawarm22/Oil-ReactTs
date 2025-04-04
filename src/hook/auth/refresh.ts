import createRefresh from "react-auth-kit/createRefresh";
import { apiRefreshToken } from "../../utils/api/authenApi";
import { AuthSchema } from "../../types/schema/auth";

export const refresh = createRefresh<AuthSchema>({
  interval: 1,
  refreshApiCallback: async (params) => {
    const refreshToken = params.refreshToken;
    if (!refreshToken) {
      return {
        isSuccess: false,
        newAuthToken: params.authToken ?? "",
      };
    }

    const response = await apiRefreshToken(refreshToken);

    const authResponse = AuthSchema.parse(response.data);

    return {
      isSuccess: true,
      newAuthToken: authResponse.accessToken,
      newRefreshToken: authResponse.refreshToken,
      newAuthUserState: authResponse,
    };
  },
});
