import React from "react";
import { Text, View, Linking } from "react-native";

export const TermsOfUse = () => {
  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontWeight: "bold" }}>Effective Date:</Text>
      <Text> 15.10.2024</Text>

      <Text>
        <Text>Welcome to </Text>
        <Text style={{ fontWeight: "bold" }}>PetPals</Text>
        <Text>
          . By accessing or using our app, you agree to comply with and be bound
          by the following Terms of Use. Please read these terms carefully
          before using our services. If you do not agree with these terms, you
          should not register or use the app.
        </Text>
      </Text>

      <Text style={{ fontWeight: "bold", marginTop: 10 }}>
        1. Acceptance of Terms
      </Text>
      <Text>
        By registering for or using{" "}
        <Text style={{ fontWeight: "bold" }}>PetPals</Text>, you agree to be
        bound by these Terms of Use and our
        <Text style={{ fontWeight: "bold" }}> Privacy Policy</Text>. These terms
        may be updated from time to time, and you will be notified of any
        significant changes. Continued use of the app after such updates means
        you accept the new terms.
      </Text>

      <Text style={{ fontWeight: "bold", marginTop: 10 }}>2. Eligibility</Text>
      <Text>
        You must be at least 18 years of age to register or use the app. By
        using <Text style={{ fontWeight: "bold" }}>PetPals</Text>, you represent
        and warrant that:
      </Text>
      <View style={{ marginLeft: 20 }}>
        <Text>• You are at least 18 years old.</Text>
        <Text>
          • You are capable of entering into a legally binding contract.
        </Text>
        <Text>
          • All registration information you submit is truthful and accurate.
        </Text>
        <Text>• You will maintain the accuracy of such information.</Text>
      </View>

      <Text style={{ fontWeight: "bold", marginTop: 10 }}>
        3. User Responsibilities
      </Text>
      <Text>
        By using <Text style={{ fontWeight: "bold" }}>PetPals</Text>, you agree
        to:
      </Text>
      <View style={{ marginLeft: 20 }}>
        <Text>
          • Use the app in a responsible manner and in compliance with
          applicable laws.
        </Text>
        <Text>
          • Not use the app to engage in illegal activities or behavior that
          could harm others.
        </Text>
        <Text>
          • Be responsible for the care, safety, and control of your dog(s)
          during any activities arranged through the app.
        </Text>
        <Text>
          • Understand that PetPals does not control or supervise any user
          interactions, walks, or meetups arranged via the app. You agree to
          exercise caution and personal judgment when meeting other users.
        </Text>
      </View>

      <Text style={{ fontWeight: "bold", marginTop: 10 }}>
        4. Account and Security
      </Text>
      <Text>
        You are responsible for maintaining the confidentiality of your account
        login information and are fully responsible for all activities that
        occur under your account. You agree to notify us immediately of any
        unauthorized use of your account or any other breach of security.
        PetPals will not be liable for any loss or damage arising from your
        failure to comply with this security obligation.
      </Text>

      <Text style={{ fontWeight: "bold", marginTop: 10 }}>
        5. Walk Scheduling and Participation
      </Text>
      <Text>
        <Text style={{ fontWeight: "bold" }}>PetPals</Text> allows users to
        schedule, join, and participate in dog walks and events. By
        participating in these walks, you acknowledge and agree to the
        following:
      </Text>
      <View style={{ marginLeft: 20 }}>
        <Text>
          • You are solely responsible for the safety and behavior of your
          dog(s) during walks or meetups organized via the app.
        </Text>
        <Text>
          • You will not hold{" "}
          <Text style={{ fontWeight: "bold" }}>PetPals</Text>, its employees,
          affiliates, or partners liable for any harm, injury, or damages
          resulting from walks or interactions with other users.
        </Text>
        <Text>
          • <Text style={{ fontWeight: "bold" }}>PetPals</Text> does not conduct
          background checks on users, and it is your responsibility to assess
          the safety and compatibility of other users before engaging in any
          in-person meetups.
        </Text>
      </View>

      {/* Continue similarly for other sections */}

      <Text style={{ fontWeight: "bold", marginTop: 10 }}>
        Contact Information
      </Text>
      <Text>
        If you have any questions or concerns regarding these Terms of Use, you
        may contact us at:
      </Text>
      <Text
        style={{ color: "blue" }}
        onPress={() => Linking.openURL("mailto:262305@student.pwr.edu.pl")}
      >
        262305@student.pwr.edu.pl
      </Text>

      <Text style={{ fontWeight: "bold", marginTop: 10 }}>
        By registering for an account or using the app, you acknowledge that you
        have read, understood, and agree to these Terms of Use.
      </Text>
    </View>
  );
};

export default TermsOfUse;
