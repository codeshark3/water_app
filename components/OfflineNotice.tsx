import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";
const OfflineNotice = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!(state.isConnected && state.isInternetReachable));
    });

    return () => unsubscribe();
  }, []);

  if (!isOffline) return null;

  return (
    <View
      style={{
        backgroundColor: "red",
        padding: 10,
        position: "absolute",
        width: "100%",
        top: Constants.statusBarHeight,
        zIndex: 1,
        marginBottom: 10,
      }}
    >
      <Text
        style={{
          color: "white",
          textAlign: "center",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        No internet connection!
      </Text>
    </View>
  );
};

export default OfflineNotice;
