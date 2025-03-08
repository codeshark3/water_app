import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

export const checkConnectivity = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return Boolean(state.isConnected && state.isInternetReachable);
};
