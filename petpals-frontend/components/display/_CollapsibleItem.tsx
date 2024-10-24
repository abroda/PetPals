// import Ionicons from "@expo/vector-icons/Ionicons";
// import { PropsWithChildren, useState } from "react";
// import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

// import { ThemedText } from "@/components/basic/ThemedText";
// import { ThemedView } from "@/components/basic/containers/ThemedView";
// import { ThemeColors } from "@/constants/theme/Colors";

// export function Collapsible({
//   children,
//   title,
// }: PropsWithChildren & { title: string }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const theme = useColorScheme() ?? "light";

//   return (
//     <ThemedView>
//       <TouchableOpacity
//         style={styles.heading}
//         onPress={() => setIsOpen((value) => !value)}
//         activeOpacity={0.8}
//       >
//         <Ionicons
//           name={isOpen ? "chevron-down" : "chevron-forward-outline"}
//           size={18}
//           color={
//             theme === "light" ? ThemeColors.light.icon : ThemeColors.dark.icon
//           }
//         />
//         <ThemedText textStyleName="defaultBold">{title}</ThemedText>
//       </TouchableOpacity>
//       {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   heading: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   content: {
//     marginTop: 6,
//     marginLeft: 24,
//   },
// });
