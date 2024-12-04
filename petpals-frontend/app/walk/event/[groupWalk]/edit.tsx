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
import { DateTimePicker, TextFieldRef } from "react-native-ui-lib";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGroupWalks } from "@/hooks/useGroupWalks";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import {
  GroupWalk,
  GroupWalkTag,
  Participant,
} from "@/context/GroupWalksContext";
import TagListInput from "@/components/inputs/TagListInput";
import { DogPicker } from "@/components/inputs/DogPicker";
import { LocationInput } from "@/components/inputs/LocationInput";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import ThemedToast from "@/components/popups/ThemedToast";
import { RefreshControl } from "react-native-gesture-handler";
import { set } from "date-fns";
import { Dog, useDog } from "@/context/DogContext";

export default function EditGroupWalkScreen(props: { create?: boolean }) {
  let now = new Date();
  const walkId = usePathname().split("/")[3];

  const [groupWalk, setGroupWalk] = useState<GroupWalk | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState(now);

  //initial location = Wrocław city centre
  const [latitude, setLatitude] = useState(51.108592525);
  const [longitude, setLongitude] = useState(17.038330603);
  const [locationName, setLocationName] = useState(latitude + ", " + longitude);

  const [tags, setTags] = useState<GroupWalkTag[]>([]);
  const [dogs, setDogs] = useState([] as Dog[]);
  const [dogsParticipating, setDogsParticipating] = useState([] as string[]);

  const titleRef = useRef<TextFieldRef>(null);
  const descriptionRef = useRef<TextFieldRef>(null);

  const {
    createGroupWalk,
    getGroupWalk,
    updateGroupWalk,
    deleteGroupWalk,
    getUsersDogs,
  } = useGroupWalks();
  const { userId } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const asyncAbortController = useRef<AbortController | undefined>();

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

  useEffect(() => {
    getData();

    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  const getData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    asyncAbortController.current = new AbortController();

    let result = await getUsersDogs();

    if (result.success) {
      let dogs = result.returnValue as Dog[];
      setDogs(dogs);

      if (!props.create) {
        asyncAbortController.current = new AbortController();

        result = await getGroupWalk(walkId, asyncAbortController.current);

        if (result.success) {
          let walk = result.returnValue as GroupWalk;

          setTitle(walk.title);
          setDescription(walk.description);
          setDatetime(new Date(walk.datetime));
          setLocationName(walk.locationName);
          setLatitude(walk.latitude);
          setLongitude(walk.longitude);
          setTags(walk.tags);
          setDogsParticipating(
            walk.participants
              .filter((elem) => elem.userId === userId)
              .flatMap((elem) => elem.dogs!.map((dog) => dog.dogId))
          );
          setGroupWalk(walk);
        } else {
          setErrorMessage(result.returnValue);
        }
      }
    } else {
      setErrorMessage(result.returnValue);
    }

    now = new Date();
    setIsLoading(false);
  }, []);

  const validate = () => {
    let res = titleRef.current?.validate();
    res = descriptionRef.current?.validate() && res;

    if (datetime.valueOf() < now.valueOf() - 60 * 60 * 1000) {
      setValidationMessage("Date and time are further than 1hr into the past.");
      return false;
    }

    if (dogsParticipating.length === 0) {
      setValidationMessage("At least one dog needs to participate.");
      return false;
    }

    return res;
  };

  const submit = async () => {
    if (validate()) {
      setIsLoading(true);
      setErrorMessage("");

      let data = {
        creatorId: userId,
        title: title,
        description: description,
        datetime: datetime,
        locationName: locationName,
        latitude: latitude,
        longitude: longitude,
        tags: tags,
        participatingDogsIds: dogsParticipating,
      };

      //@ts-ignore
      let result = props.create
        ? await createGroupWalk(data, asyncAbortController.current)
        : await updateGroupWalk(walkId, data, asyncAbortController.current);

      if (result.success) {
        router.dismiss();
        if (props.create) {
          router.push(
            `/walk/event/${props.create ? result.returnValue.id : walkId}`
          );
        }
      } else {
        setErrorMessage(result.returnValue);
      }

      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <ThemedToast
        visible={!isLoading && errorMessage.length > 0}
        message={errorMessage} // {"Check your internet connection."}
        preset="failure"
      />
      <ThemedScrollView
        scrollEnabled={true}
        style={{
          height: heightPercentToDP(95),
          marginTop: percentToDP(10),
          paddingTop: percentToDP(10),
          paddingHorizontal: percentToDP(5),
        }}
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={props.create ? undefined : getData}
            colors={[useThemeColor("accent"), useThemeColor("text")]}
          />
        }
      >
        {!isLoading && groupWalk === null && !props.create && (
          <ThemedView
            style={{
              alignSelf: "center",
              alignItems: "center",
              alignContent: "center",
              marginTop: heightPercentToDP(35),
              margin: "auto",
            }}
          >
            <ThemedIcon
              name="alert-circle-outline"
              colorName="disabled"
              size={percentToDP(12)}
            />

            <ThemedText
              textStyleOptions={{ size: "big" }}
              textColorName="disabled"
              style={{ alignSelf: "center", marginTop: percentToDP(3) }}
            >
              Unable to load group walk content
            </ThemedText>
          </ThemedView>
        )}
        {(groupWalk !== null || props.create) && (
          <>
            <ThemedView
              colorName="transparent"
              style={{
                flex: 1,
                marginBottom: percentToDP(7),
              }}
            >
              <LocationInput
                initialLocationName={locationName}
                initialLatitude={latitude}
                initialLongitude={longitude}
                initialDelta={props.create ? 0.013 : undefined}
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
                onLocationChange={(name: string, lat: number, lng: number) => {
                  setLocationName(name);
                  setLatitude(lat);
                  setLongitude(lng);
                }}
                onError={(message: string) => setErrorMessage(message)}
              />
            </ThemedView>
            <ThemedTextField
              label="Title"
              ref={titleRef}
              value={title}
              textStyleOptions={{ size: "big", weight: "semibold" }}
              onChangeText={(newText) => setTitle(newText)}
              withValidation
              validate={["required", (value) => (value?.length ?? 0) > 4]}
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
                onChange={(newDate) => {
                  setDatetime(newDate);
                  setValidationMessage("");
                }}
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
                onChange={(newDate) => {
                  setDatetime(newDate);
                  setValidationMessage("");
                }}
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
              ref={descriptionRef}
              value={description}
              onChangeText={(newText) => setDescription(newText)}
              withValidation
              validate={["required"]}
              validationMessage={["Description is required"]}
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
                setValidationMessage("");
              }}
            />

            <ThemedText
              textColorName="alarm"
              textStyleOptions={{ size: "small" }}
              style={{ paddingLeft: percentToDP(1) }}
            >
              {validationMessage}
            </ThemedText>
            <ThemedView
              style={{
                marginTop: percentToDP(5),
                marginBottom: percentToDP(30),
              }}
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
          </>
        )}
      </ThemedScrollView>
      {dialogVisible && (
        <DeleteDialog
          message={"Are you sure you want to delete this group walk?"}
          onDismiss={() => setDialogVisible(false)}
          onSubmit={async (abortController: AbortController) => {
            let result = await deleteGroupWalk(walkId, abortController);
            if (result.success) {
              router.dismiss();
              router.dismiss();
            }
            return result;
          }}
        />
      )}
    </SafeAreaView>
  );
}
