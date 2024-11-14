import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { Href, router, useNavigation, usePathname } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import AppLogo from "@/components/decorations/static/AppLogo";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import TermsOfUseDialog from "@/components/dialogs/TermsOfUseDialog";
import {
  Checkbox,
  KeyboardAwareScrollView,
  TextFieldRef,
} from "react-native-ui-lib";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWalks } from "@/hooks/useWalks";
import { testData } from "../testData";
import { isLoaded } from "expo-font";
import { LocationMap } from "@/components/display/LocationMap";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import TagList from "@/components/lists/TagList";
import { GroupWalk } from "@/context/WalksContext";
import TagListInput from "@/components/inputs/TagListInput";

export default function EditGroupWalkScreen(props: { create: boolean }) {
  const now = new Date();
  const path = usePathname();

  const walkId = props.create
    ? ""
    : path.slice(
        path.slice(0, path.length - 5).lastIndexOf("/"),
        path.length - 5
      );

  const [title, setTitle] = useState(" ");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState(now);
  const [location, setLocation] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const { userId } = useAuth();
  const { isProcessing, createGroupWalk, getGroupWalk, updateGroupWalk } =
    useWalks();

  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${props.create ? "Create a" : "Edit"} group walk`,
      headerShown: true,
    });
  }, [navigation]);

  const asyncAbortController = useRef<AbortController | undefined>();

  useEffect(() => {
    if (!props.create) {
      getData();
    }

    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  const getData = useCallback(async () => {
    console.log("Start loading");
    asyncAbortController.current = new AbortController();
    let result = await getGroupWalk(walkId, asyncAbortController.current);
  }, []);

  const submit = async () => {
    let data = {
      id: walkId,
      creator: {
        id: userId,
        name: "",
        avatarURL: "",
      },
      title: title,
      description: description,
      datetime: datetime,
      location: location,
      tags: tags,
      participantsCount: 0,
      petsCount: 0,
      joinedWithPets: [],
    } as GroupWalk;

    if (props.create) {
      let result = props.create
        ? await createGroupWalk(data, asyncAbortController.current)
        : await updateGroupWalk(walkId, data, asyncAbortController.current);
      if (result.success) {
        router.dismiss();
        router.push(
          `/walk/event/${props.create ? result.returnValue : walkId}`
        );
      } else {
        setErrorMessage(result.returnValue);
      }
    }
  };

  return (
    <SafeAreaView>
      {/* <ThemedScrollView
        style={{
          height: heightPercentToDP(100),
          paddingTop: percentToDP(15),
          paddingHorizontal: percentToDP(5),
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
            marginRight: percentToDP(-1),
            marginBottom: percentToDP(10),
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
      </ThemedScrollView> */}
      <ThemedScrollView
        scrollEnabled={true}
        style={{
          height: heightPercentToDP(100),
          paddingTop: percentToDP(20),
          paddingHorizontal: percentToDP(5),
        }}
      >
        <ThemedText textColorName="alarm">{errorMessage}</ThemedText>
        <ThemedView
          colorName="transparent"
          style={{
            flex: 1,
            marginBottom: percentToDP(7),
          }}
        >
          <LocationMap
            initialLocation={{ latitude: 51.1316313, longitude: 17.0417013 }}
            mapProps={{
              pitchEnabled: false,
              rotateEnabled: false,
            }}
            viewStyle={{
              height: heightPercentToDP(30),
              alignItems: "center",
              justifyContent: "center",
              marginBottom: percentToDP(3),
              borderRadius: percentToDP(7),
            }}
          />
        </ThemedView>
        <ThemedTextField
          label="Title"
          value={title}
          textStyleOptions={{ size: "big", weight: "semibold" }}
          onChangeText={(newText) => setTitle(newText)}
          withValidation
          validate={["required", (value) => (value?.length ?? 0) > 5]}
          validationMessage={["Title is required", "Title is too short."]}
          multiline={true}
          maxLength={60}
        />
        <HorizontalView style={{ marginBottom: percentToDP(6) }}>
          <ThemedText
            textStyleOptions={{ size: "medium", weight: "semibold" }}
            textColorName="primary"
          >
            {datetime.toLocaleDateString(undefined, {
              dateStyle: "medium",
            })}
            ,{" "}
            {datetime.toLocaleTimeString(undefined, {
              timeStyle: "short",
            })}
          </ThemedText>
        </HorizontalView>
        <ThemedTextField
          label="Description"
          value={description}
          onChangeText={(newText) => setDescription(newText)}
          withValidation
          validate={["required", (value) => (value?.length ?? 0) > 5]}
          validationMessage={["Title is required", "Title is too short."]}
          multiline={true}
          maxLength={500}
        />

        <TagListInput
          tags={tags}
          onAddTag={(tag) => setTags([...tags, tag])}
          onDeleteTag={(tag) => setTags(tags.filter((t) => t !== tag))}
        />

        <ThemedView
          style={{ marginTop: percentToDP(12), marginBottom: percentToDP(80) }}
        >
          <ThemedButton
            shape="long"
            label={props.create ? "Create" : "Save"}
            backgroundColorName="primary"
            iconSource={() => (
              <ThemedIcon
                name="checkmark"
                size={20}
                colorName="textOnPrimary"
                style={{ marginLeft: percentToDP(2) }}
              />
            )}
            iconOnRight
            onPress={submit}
          />
        </ThemedView>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
