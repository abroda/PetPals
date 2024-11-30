import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { router, useNavigation, usePathname } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ThemedTextField } from "@/components/inputs/ThemedTextField";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { DateTimePicker } from "react-native-ui-lib";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWalks } from "@/hooks/useWalks";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { GroupWalk, Participant } from "@/context/WalksContext";
import TagListInput from "@/components/inputs/TagListInput";
import { DogPicker } from "@/components/inputs/DogPicker";
import { LocationInput } from "@/components/inputs/LocationInput";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import ThemedToast from "@/components/popups/ThemedToast";

export default function EditGroupWalkScreen(props: { create?: boolean }) {
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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);

  const { userId } = useAuth();
  const creatorId = userId;
  const { createGroupWalk, getGroupWalk, updateGroupWalk, deleteGroupWalk } =
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
        userId: userId,
        username: "",
        imageURL: "",
        dogs: [],
      } as Participant,
      title: title,
      description: description,
      datetime: datetime,
      locationName: location,
      latitude: 0,
      longitude: 0,
      tags: tags,
      participantsCount: 0,
      petsCount: 0,
      participants: [],
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

  const deleteWalk = async () => {
    let result = await deleteGroupWalk(walkId, asyncAbortController.current);
    if (result.success) {
      router.dismiss();
      router.dismiss();
    } else {
      setErrorMessage(result.returnValue);
    }
  };

  const [dogsParticipating, setDogsParticipating] = useState([] as string[]);
  let dogs = [] as Participant[];

  return (
    <SafeAreaView>
      <ThemedToast
        visible={!isLoading && errorMessage.length > 0}
        message={errorMessage} // {"Check your internet connection."}
        preset="offline"
      />
      <ThemedScrollView
        scrollEnabled={true}
        style={{
          height: heightPercentToDP(100),
          paddingTop: percentToDP(20),
          paddingHorizontal: percentToDP(5),
        }}
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView
          colorName="transparent"
          style={{
            flex: 1,
            marginBottom: percentToDP(7),
          }}
        >
          <LocationInput
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
        <HorizontalView
          style={{
            marginBottom: percentToDP(6),
            paddingHorizontal: percentToDP(1.5),
          }}
        >
          <DateTimePicker
            label={"Date"}
            labelStyle={[
              useTextStyle({ weight: "semibold" }),
              { color: useThemeColor("text") },
            ]}
            style={[
              useTextStyle({ size: "medium", weight: "semibold" }),
              { color: useThemeColor("primary") },
            ]}
            themeVariant="dark"
            value={datetime}
            mode="date"
            dateTimeFormatter={(date) =>
              date.toLocaleDateString(undefined, {
                dateStyle: "short",
              })
            }
            minimumDate={new Date()}
            maximumDate={new Date(Date.now() + 3600000 * 24 * 366)}
          />
          <DateTimePicker
            label="Time"
            labelStyle={[
              useTextStyle({ weight: "semibold" }),
              {
                color: useThemeColor("text"),
              },
            ]}
            style={[
              useTextStyle({ size: "medium", weight: "semibold" }),
              {
                color: useThemeColor("primary"),
              },
            ]}
            themeVariant="light"
            value={datetime}
            onChange={(newDate) => setDatetime(newDate)}
            mode="time"
            dateTimeFormatter={(date) =>
              datetime.toLocaleTimeString(undefined, {
                timeStyle: "short",
              })
            }
            minimumDate={now}
            maximumDate={new Date(Date.now() + 3600000 * 24 * 366)}
          />
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

        <DogPicker
          header="Dogs attending"
          dogs={dogs}
          dogsParticipating={dogsParticipating}
          onToggle={(dogId: string) => {
            dogsParticipating.includes(dogId)
              ? setDogsParticipating(
                  dogsParticipating.filter((elem) => elem !== dogId)
                )
              : setDogsParticipating([dogId, ...dogsParticipating]);
          }}
        />

        <ThemedView
          style={{ marginTop: percentToDP(5), marginBottom: percentToDP(30) }}
        >
          <ThemedText textColorName="alarm">{errorMessage}</ThemedText>
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
            style={{ marginBottom: percentToDP(3) }}
          />
          {!props.create && (
            <ThemedButton
              shape="long"
              label="Delete"
              textColorName="text"
              backgroundColorName="alarm"
              iconSource={() => (
                <ThemedIcon
                  name="trash-outline"
                  size={20}
                  colorName="text"
                  style={{ marginLeft: percentToDP(2) }}
                />
              )}
              iconOnRight
              onPress={() => setDialogVisible(true)}
            />
          )}
        </ThemedView>
      </ThemedScrollView>
      {dialogVisible && (
        <DeleteDialog
          message={"Delete walk?"}
          onDismiss={() => setDialogVisible(false)}
          onSubmit={() => deleteGroupWalk(walkId, asyncAbortController.current)}
        />
      )}
    </SafeAreaView>
  );
}
