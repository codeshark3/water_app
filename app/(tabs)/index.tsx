import { Link } from "expo-router";
import { Text, View } from "react-native";
import Screen from "@/components/ui/Screen";
export default function Index() {
  return (
    <Screen>
      <Text>Ehis screen.</Text>
      <Link href="/tests">
        <Text>Go to tests</Text>
      </Link>
    </Screen>
  );
}
