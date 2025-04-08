import createRefresh from "react-auth-kit/createRefresh";
import { apiRefreshToken } from "../../utils/api/authenApi";
import { AuthSchema } from "../../types/schema/auth";

const REFRESH_MARGIN_SECONDS = 60;

function calculateInterval(expiresUnix: number): number {
  const currentUnix = Math.floor(Date.now() / 1000);
  const remainingSeconds = expiresUnix - currentUnix - REFRESH_MARGIN_SECONDS;
  return remainingSeconds > 0 ? remainingSeconds * 1000 : 0;
}

const initialAccessTokenExpiresIn = parseInt(localStorage.getItem("accessTokenExpiresIn") || "0", 10);

export const refresh = createRefresh<AuthSchema>({
  interval: calculateInterval(initialAccessTokenExpiresIn),
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
    const newInterval = calculateInterval(authResponse.accessTokenExpiresIn);

    return {
      isSuccess: true,
      newAuthToken: authResponse.accessToken,
      newRefreshToken: authResponse.refreshToken,
      newAuthUserState: authResponse,
      expiresIn: newInterval,
    };
  },
});
