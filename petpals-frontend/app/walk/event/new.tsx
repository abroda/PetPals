import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { Tag } from "@/components/display/Tag";
import LocationPicker from "@/components/inputs/LocationPicker";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { ThemedDatetimePicker } from "@/components/inputs/ThemedDatetimePicker";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWalks } from "@/hooks/useWalks";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { Href, router, useNavigation } from "expo-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateTimePicker } from "react-native-ui-lib";

export default function AddGroupWalkScreen() {
  const now = new Date();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(now);
  const [time, setTime] = useState(now);
  const [location, setLocation] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { isProcessing, createGroupWalk } = useWalks();

  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  const percentToPD = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Create a group walk",
      headerShown: true,
    });
  }, [navigation]);

  const asyncAbortController = useRef<AbortController | undefined>();

  useEffect(() => {
    getData();

    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  const getData = useCallback(async () => {
    console.log("Start loading");
    asyncAbortController.current = new AbortController();
    let result = await createGroupWalk(
      {
        id: "3",
        creator: {
          id: "1",
          name: "Halloween Spirit",
          avatarURL:
            "https://wiki.guildwars2.com/images/1/10/Pumpkin_Crown.jpg",
        },
        title: "Example walk title that's needlessly long",
        description:
          "Hello there, fellow Halloween enjoyers! Let's get celebrating and sow mischief in the neighbourhood! COSTUMES MANDATORY! (your dogs too!)",
        datetime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: "Promenady Wrocławskie",
        tags: [
          "halloween",
          "night walk",
          "all welcome",
          "long",
          "trick-or-treating",
        ],
        participantsCount: 3,
        petsCount: 4, // needed?
        joinedWithPets: [
          {
            id: "1",
            name: "Cutie",
            avatarURL:
              "https://wiki-de.guildwars2.com/images/4/47/Mini_Gesetzlosen-Welpe.jpg",
          },
        ],
      },
      asyncAbortController.current
    );
  }, []);

  return (
    <SafeAreaView>
      <ThemedScrollView
        style={{
          height: heightPercentToPD(100),
          paddingTop: percentToPD(15),
          paddingHorizontal: percentToPD(5),
          alignContent: "center",
        }}
      >
        <ThemedTextField
          label="Title"
          withValidation
          validate={["required", (value) => (value?.length ?? 0) < 5]}
          validationMessage={["Title is required", "Title is too short."]}
          maxLength={250}
        />

        <ThemedTextField
          label="Description"
          maxLength={500}
          multiline
        />

        <ThemedDatetimePicker />
        <LocationPicker />

        <ThemedTextField
          label="Tags"
          maxLength={250}
          onChangeText={(newText) => setCurrentTag(newText)}
          value={currentTag}
        />
        <ThemedButton
          iconSource={() => (
            <ThemedIcon
              name="add"
              colorName="textOnPrimary"
            />
          )}
          shape="round"
          onPress={() => {
            setTags([...tags, currentTag]);
            setCurrentTag("");
          }}
        />
        <HorizontalView
          justifyOption="flex-start"
          colorName="disabled"
          style={{
            flexWrap: "wrap",
            marginRight: percentToPD(-1),
            marginBottom: percentToPD(10),
          }}
        >
          {tags.map((tag) => (
            <Tag
              key={tag}
              label={tag}
            />
          ))}
        </HorizontalView>

        <ThemedButton
          shape="long"
          label="Save"
          style={{ alignSelf: "center" }}
          onPress={() => router.replace("/walk/event/xyz/" as Href<string>)}
        ></ThemedButton>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
