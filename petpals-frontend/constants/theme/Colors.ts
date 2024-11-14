const darkGreen = '#0A2421'
const lightGreen = '#1C302A'
const accentGreen = '#B4D779'
const accentTeal = '#52B8A3'
const cream = '#FAF7EA'

const primaryColor = accentGreen;
const secondaryColor = lightGreen;
const tertiaryColor = "#162521";
const accentColor = accentTeal;
const alarmColor = "#c54835";

const lightColor = lightGreen;
const lightGreyColor = "#d3dedc";
const greyColor = "#617c78";
const darkGreyColor = "#3b4e4a";
const darkColor = darkGreen;


export const ThemeColors = {
  light: {
    primary: primaryColor,
    secondary: secondaryColor,
    tertiary: tertiaryColor,
    accent: accentColor,
    background: lightColor,
    textField: lightGreyColor,
    border: greyColor,
    text: darkColor,
    textOnPrimary: darkColor,
    textOnSecondary: lightColor,
    title: primaryColor,
    link: accentColor,
    alarm: alarmColor,
    icon: secondaryColor,
    active: primaryColor,
    disabled: lightGreyColor,
    transparent: "#00000000",
  },
  dark: {
    primary: primaryColor,
    secondary: secondaryColor,
    tertiary: tertiaryColor,
    accent: accentColor,
    background: tertiaryColor,
    textField: darkGreyColor,
    border: greyColor,
    text: lightColor,
    textOnPrimary: darkColor,
    textOnSecondary: lightColor,
    title: primaryColor,
    link: accentColor,
    alarm: alarmColor,
    icon: secondaryColor,
    active: primaryColor,
    disabled: darkGreyColor,
    transparent: "#00000000",
  },
};
