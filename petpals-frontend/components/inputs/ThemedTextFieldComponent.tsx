// import React, { Component } from "react";
// import { ScrollView, ActivityIndicator } from "react-native";
// import {
//   Assets,
//   Colors,
//   Spacings,
//   View,
//   Text,
//   Button,
//   Keyboard,
//   TextField,
//   TextFieldRef,
//   FieldContextType,
//   TextFieldProps,
//   SegmentedControl,
//   Icon,
// } from "react-native-ui-lib";
// import { ThemedView } from "../basic/containers/ThemedView";
// const { KeyboardAwareInsetsView } = Keyboard;

// const priceFormatter = Intl.NumberFormat("en-US");

// export default class ThemedTextFieldComponent extends Component {
//   input = React.createRef<TextFieldRef>();
//   input2 = React.createRef<TextFieldRef>();
//   input3 = React.createRef<TextFieldRef>();
//   inputWithValidation = React.createRef<TextFieldRef>();

//   state = {
//     errorPosition: TextField.validationMessagePositions.BOTTOM,
//     isDisabled: false,
//     isReadonly: false,
//     value: "Initial Value",
//     isSearching: false,
//     preset: undefined,
//     price: "",
//     editable: false,
//     textColorName: "text",
//   textThemedColor: undefined,
//   backgroundColorName: "textField",
//   backgroundThemedColor: undefined,
//   textStyleName: "default",
//   withValidation: undefined,
//   validate: undefined,
//   validationMessage: undefined,
//   isSecret: undefined,
//   label: undefined
//   };

//   componentDidMount() {
//     this.input.current?.focus();
//   }

//   render() {
//     const { errorPosition, preset, value } = this.state;

//     return (
//       <>
//       <ThemedView style={{ marginBottom: "3%" }}>
//       <TextField
//         label={label}
//         labelColor={textColor}
//         labelStyle={useTextStyle(textStyleName)}
//         style={[
//           {
//             color: textColor,
//             backgroundColor: backgroundColor,
//             borderRadius: 30,
//             borderColor: textColor,
//             paddingHorizontal: 10,
//             paddingVertical: "4%",
//             height: "100%",
//           },
//           useTextStyle(textStyleName),
//           rest.style,
//         ]}
//         secureTextEntry={isSecret}
//         validationMessagePosition="bottom"
//         enableErrors={withValidation}
//         validateOnBlur={withValidation}
//         validateOnChange={withValidation}
//         validationMessageStyle={[
//           { color: alarmColor, marginTop: "2%" },
//           useTextStyle("small"),
//         ]}
//         validate={validate}
//         validationMessage={validationMessage}
//         {...rest}
//       />
//         <View>
//           <Text
//             h3
//             marginB-s1
//           >
//             Validation
//           </Text>
//           <View
//             row
//             centerV
//           >
//             <Text
//               marginR-s4
//               $textPrimary
//             >
//               Error Position:
//             </Text>
//             <SegmentedControl
//               segments={[{ label: "Bottom" }, { label: "Top" }]}
//               onChangeIndex={this.onChangeIndexValidation}
//             />
//           </View>
//         </View>

//         <TextField
//           value={value}
//           onChangeText={(value) => this.setState({ value })}
//           label="Email"
//           placeholder="Enter email"
//           enableErrors
//           validationMessage={["Email is required", "Email is invalid"]}
//           // validationMessageStyle={Typography.text90R}
//           validationMessagePosition={errorPosition}
//           validate={["required", "email"]}
//           onChangeValidity={(isValid: boolean) =>
//             console.warn("validity changed:", isValid, Date.now())
//           }
//           validateOnChange
//           // validateOnStart
//           // validateOnBlur
//           preset={preset}
//         />
//         <View
//           row
//           spread
//           center
//           marginT-20
//         >
//           <TextField
//             ref={this.inputWithValidation}
//             label="Name"
//             placeholder="Enter full name"
//             validate="required"
//             validationMessage="This field is required. That means you have to enter some value"
//             containerStyle={{ flex: 1 }}
//             validateOnChange
//             validationMessagePosition={errorPosition}
//             helperText={"Enter first and last name"}
//             validationIcon={{
//               source: Assets.icons.demo.exclamation,
//               style: { marginTop: 1 },
//             }}
//             topTrailingAccessory={
//               <Icon
//                 source={Assets.icons.demo.info}
//                 size={16}
//               />
//             }
//             preset={preset}
//             maxLength={20}
//             showCharCounter
//           />
//           <Button
//             outline
//             marginL-s5
//             label="Validate"
//             size={Button.sizes.xSmall}
//             onPress={() => {
//               this.inputWithValidation.current?.validate?.();
//             }}
//           />
//         </View>
//       </>
//     );
//   }
// }
