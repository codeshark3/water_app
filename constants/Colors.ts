/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    primary: "090C9B",
    secondary: "9E0031",
    text: "#11181C",
    background: "FFFFFA",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    white: "#FFFFFF",
    tabIconSelected: tintColorLight,
  },
  dark: {
    primary: "090C9B",
    secondary: "9E0031",
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    white: "#FFFFFF",
  },
};
