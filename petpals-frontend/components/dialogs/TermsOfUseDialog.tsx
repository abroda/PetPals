import { ThemedView } from "../basic/containers/ThemedView";
import { ThemedText } from "../basic/ThemedText";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";
import ThemedDialog from "./ThemedDialog";
import { ThemedButton } from "../inputs/ThemedButton";
import { Dimensions } from "react-native";
import React from "react";
import { Text, View, Linking } from "react-native";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTextStyle } from "@/hooks/theme/useTextStyle";

export default function TermsOfUseDialog({ onDismiss = () => {} }) {
  return (
    <ThemedDialog onDismiss={onDismiss}>
      <ThemedView
        style={{
          padding: "3%",
          borderRadius: 30,
        }}
      >
        <ThemedText
          textStyleName="bigBold"
          style={{ marginBottom: "5%" }}
        >
          Terms of Use
        </ThemedText>
        <ThemedScrollView
          scrollEnabled
          style={{
            maxHeight: Dimensions.get("window").height * 0.5,
            marginBottom: "7%",
          }}
        >
          <ThemedText>
            <TermsOfUse />
          </ThemedText>
        </ThemedScrollView>
        <ThemedButton
          label="Close"
          textColorName="textOnPrimary"
          style={{ width: "50%", marginHorizontal: "25%" }}
          onPress={onDismiss}
        />
      </ThemedView>
    </ThemedDialog>
  );
}

export const TermsOfUse = () => {
  const linkColor = useThemeColor("link");
  const welcomeColor = useThemeColor("primary");
  const warningColor = useThemeColor("alarm");
  const smallTheme = useTextStyle("small");
  const smallBoldTheme = useTextStyle("smallBold");
  const boldTheme = useTextStyle("defaultBold");
  const bigTheme = useTextStyle("big");
  const bigBoldTheme = useTextStyle("bigBold");

  return (
    <ThemedView style={{ paddingVertical: 10 }}>
      <ThemedText style={[smallBoldTheme, { marginBottom: 20 }]}>
        <ThemedText style={smallTheme}>Effective Date: </ThemedText>
        15.10.2024{" "}
      </ThemedText>

      <ThemedText style={[bigTheme, { marginBottom: 10, color: welcomeColor }]}>
        Welcome to
        <ThemedText style={[bigBoldTheme, { color: welcomeColor }]}>
          {" "}
          PetPals.
        </ThemedText>
      </ThemedText>
      <ThemedText style={{ marginBottom: 10 }}>
        By accessing or using our app, you agree to comply with and be bound by
        the following Terms of Use. Please read these terms carefully before
        using our services. If you do not agree with these terms, you should not
        register or use the app.
      </ThemedText>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        1. Acceptance of Terms
      </ThemedText>
      <ThemedText>
        By registering for or using
        <ThemedText style={boldTheme}> PetPals</ThemedText>, you agree to be
        bound by these Terms of Use and our
        <ThemedText style={[boldTheme, { color: linkColor }]}>
          {" "}
          Privacy Policy
        </ThemedText>
        . These terms may be updated from time to time, and you will be notified
        of any significant changes. Continued use of the app after such updates
        means you accept the new terms.
      </ThemedText>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        2. Eligibility
      </ThemedText>
      <ThemedText style={{ marginBottom: 3 }}>
        You must be at least 18 years of age to register or use the app. By
        using <ThemedText style={boldTheme}>PetPals</ThemedText>, you represent
        and warrant that:
      </ThemedText>
      <ThemedView style={{ marginLeft: 20 }}>
        <ThemedText>• You are at least 18 years old. </ThemedText>
        <ThemedText>
          • You are capable of entering into a legally binding contract.
        </ThemedText>
        <ThemedText>
          • All registration information you submit is truthful and accurate.
        </ThemedText>
        <ThemedText>
          • You will maintain the accuracy of such information.{" "}
        </ThemedText>
      </ThemedView>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        3. User Responsibilities
      </ThemedText>
      <ThemedText style={{ marginBottom: 3 }}>
        By using <ThemedText style={boldTheme}>PetPals</ThemedText>, you agree
        to:
      </ThemedText>
      <ThemedView style={{ marginLeft: 20 }}>
        <ThemedText>
          • Use the app in a responsible manner and in compliance with
          applicable laws.
        </ThemedText>
        <ThemedText>
          • Not use the app to engage in illegal activities or behavior that
          could harm others.
        </ThemedText>
        <ThemedText>
          • Be responsible for the care, safety, and control of your dog(s)
          during any activities arranged through the app.
        </ThemedText>
        <ThemedText>
          • Understand that PetPals does not control or supervise any user
          interactions, walks, or meetups arranged via the app. You agree to
          exercise caution and personal judgment when meeting other users.
        </ThemedText>
      </ThemedView>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        4. Account and Security
      </ThemedText>
      <ThemedText>
        You are responsible for maintaining the confidentiality of your account
        login information and are fully responsible for all activities that
        occur under your account. You agree to notify us immediately of any
        unauthorized use of your account or any other breach of security.
        PetPals will not be liable for any loss or damage arising from your
        failure to comply with this security obligation.
      </ThemedText>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        5. Walk Scheduling and Participation
      </ThemedText>
      <ThemedText style={{ marginBottom: 3 }}>
        <ThemedText style={boldTheme}>PetPals</ThemedText> allows users to
        schedule, join, and participate in dog walks and events. By
        participating in these walks, you acknowledge and agree to the
        following:
      </ThemedText>
      <ThemedView style={{ marginLeft: 20 }}>
        <ThemedText>
          • You are solely responsible for the safety and behavior of your
          dog(s) during walks or meetups organized via the app.
        </ThemedText>
        <ThemedText>
          • You will not hold <ThemedText style={boldTheme}>PetPals</ThemedText>
          , its employees, affiliates, or partners liable for any harm, injury,
          or damages resulting from walks or interactions with other users.
        </ThemedText>
        <ThemedText>
          • <ThemedText style={boldTheme}>PetPals</ThemedText> does not conduct
          background checks on users, and it is your responsibility to assess
          the safety and compatibility of other users before engaging in any
          in-person meetups.
        </ThemedText>
      </ThemedView>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        6. User Conduct
      </ThemedText>
      <ThemedText style={{ marginBottom: 3 }}>
        You agreed not to use <ThemedText style={boldTheme}>PetPals</ThemedText>{" "}
        to:
      </ThemedText>
      <ThemedView style={{ marginLeft: 20 }}>
        <ThemedText>
          • Post or transmit any content that is illegal, offensive, harmful, or
          otherwise objectionable.
        </ThemedText>
        <ThemedText>
          • Harass, abuse, or harm other users of the app.
        </ThemedText>
        <ThemedText>
          • Misrepresent yourself, your identity, or your affiliation with
          others.
        </ThemedText>
        <ThemedText>
          • Violate any local, state, national, or international laws or
          regulations.
        </ThemedText>
        <ThemedText>
          • Attempt to hack or interfere with the app, or otherwise use the app
          in a manner that could damage, disable, or impair the functionality of
          the app or other users' experiences.
        </ThemedText>
      </ThemedView>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        7. Privacy
      </ThemedText>
      <ThemedText>
        Your privacy is important to us. By using PetPals, you consent to the
        collection and use of your personal information as outlined in our
        <ThemedText style={boldTheme}> Privacy Policy</ThemedText>. We do not
        share your personal data with third parties without your consent, except
        as required by law.
      </ThemedText>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        8. Third-Party Services
      </ThemedText>
      <ThemedText style={{ marginBottom: 3 }}>
        <ThemedText style={boldTheme}>PetPals</ThemedText> may integrate with
        third-party services (such as Google Maps, etc.). Your interactions with
        such third-party services are governed by their respective terms and
        conditions.
        <ThemedText style={boldTheme}> PetPals</ThemedText> is not responsible
        for the accuracy, reliability, or performance of third-party services.
      </ThemedText>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        9. Intellectual Property
      </ThemedText>
      <ThemedText>
        All content, features, and functionality available through
        <ThemedText style={boldTheme}> PetPals</ThemedText>, including but not
        limited to text, graphics, logos, and software, are the property of
        <ThemedText style={boldTheme}> PetPals</ThemedText> or its licensors and
        are protected by copyright, trademark, and other intellectual property
        laws. You may not modify, distribute, or use this content without
        explicit written permission from us.
      </ThemedText>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        10. Termination
      </ThemedText>
      <ThemedText>
        We reserve the right to terminate or suspend your account or access to
        the app at any time, without notice or liability, for any reason,
        including but not limited to a violation of these Terms of Use. Upon
        termination, your right to use the app will immediately cease.
      </ThemedText>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        11. Disclaimers and Limitation of Liability
      </ThemedText>
      <ThemedText>
        We reserve the right to terminate or suspend your account or access to
        the app at any time, without notice or liability, for any reason,
        including but not limited to a violation of these Terms of Use. Upon
        termination, your right to use the app will immediately cease.
        <ThemedText style={boldTheme}> PetPals</ThemedText> shall not be liable
        for any damages, direct or indirect, arising out of your use of the app,
        including but not limited to personal injury, damage to property, or
        loss of data.
      </ThemedText>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        12. Indemnification
      </ThemedText>
      <ThemedText>
        You agree to indemnify, defend, and hold harmless{" "}
        <ThemedText style={boldTheme}>PetPals</ThemedText>, its affiliates,
        officers, employees, and partners from any claims, damages, losses, or
        liabilities arising out of your use of the app, violation of these
        terms, or any activity related to your account.
      </ThemedText>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        13. Governing Law
      </ThemedText>
      <ThemedText>
        These Terms of Use and your use of{" "}
        <ThemedText style={boldTheme}>PetPals</ThemedText> shall be governed by
        and construed in accordance with the laws of Republic of Poland. Any
        disputes arising under these terms shall be subject to the exclusive
        jurisdiction of the courts of Republic of Poland.
      </ThemedText>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        14. Modifications of Terms
      </ThemedText>
      <ThemedText>
        We reserve the right to modify or update these Terms of Use at any time.
        If we make significant changes, we will notify you by email or through
        the app. By continuing to use the app after any changes, you accept the
        updated terms.
      </ThemedText>

      <ThemedText style={[bigBoldTheme, { marginVertical: 10 }]}>
        15. Contact Information
      </ThemedText>
      <ThemedText>
        If you have any questions or concerns regarding these Terms of Use, you
        may contact us at{"  "}
        <ThemedText
          style={{ color: linkColor }}
          onPress={() => Linking.openURL("mailto:262305@student.pwr.edu.pl")}
        >
          262305@student.pwr.edu.pl
        </ThemedText>
        .
      </ThemedText>

      <ThemedText>-</ThemedText>

      <ThemedText
        style={[smallBoldTheme, { color: warningColor, marginTop: 10 }]}
      >
        By registering for an account or using the app, you acknowledge that you
        have read, understood, and agree to these Terms of Use.
      </ThemedText>
    </ThemedView>
  );
};
