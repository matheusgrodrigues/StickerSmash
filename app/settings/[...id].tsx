import { Link } from "expo-router";
import { Text, View } from "react-native";
import Button from "../components/Button";

export default function Settings() {
   return (
      <>
         <View>
            <Text>[...Settings]</Text>

            <Link asChild href={"/"}>
               <Button theme="primary" label="Voltar" />
            </Link>
         </View>
      </>
   );
}
