import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import {
  Href,
  router,
  useFocusEffect,
  useNavigation,
  usePathname,
} from "expo-router";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import CommentSection from "@/components/lists/CommentSection";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { useGroupWalks } from "@/hooks/useGroupWalks";
import TagList from "@/components/lists/TagList";
import {
  CommentContent,
  GroupWalk,
  Participant,
} from "@/context/GroupWalksContext";
import { LocationMap } from "@/components/display/LocationMap";
import JoinDialog from "@/components/dialogs/JoinDialog";
import { Dog, useDog } from "@/context/DogContext";
import ThemedToast from "@/components/popups/ThemedToast";
import { RefreshControl } from "react-native-gesture-handler";
import { countToString } from "@/helpers/countToString";
import ParticipantsDialog from "@/components/dialogs/ParticipantsDialog";
import { TouchableOpacity } from "react-native-ui-lib";
import React from "react";

export default function GroupWalkScreen() {
  const walkId = usePathname().split("/")[3];

  const [groupWalk, setGroupWalk] = useState<GroupWalk | null>(null);
  const [participants, setParticipants] = useState([] as Participant[]);
  const [dogs, setDogs] = useState([] as Dog[]);
  const [dogsParticipating, setDogsParticipating] = useState([] as string[]);

  const [joined, setJoined] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const { userId } = useAuth();

  const [comments, setComments] = useState([] as CommentContent[]);
  const { getGroupWalk, addGroupWalkComment, getUsersDogs } = useGroupWalks();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const asyncAbortController = useRef<AbortController | undefined>();

  const [refreshOnFocus, setRefreshOnFocus] = useState(false);

  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  useEffect(() => {
    getData();

    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  useFocusEffect(() => {
    if (refreshOnFocus && !isLoading) {
      getData();
      setRefreshOnFocus(false);
    }

    return () => {
      setRefreshOnFocus(!isLoading);
    };
  });

  const getData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    asyncAbortController.current = new AbortController();

    let result = await getGroupWalk(walkId, asyncAbortController.current);

    if (result.success) {
      let walk = result.returnValue as GroupWalk;
      result = await getUsersDogs();

      if (result.success) {
        setDogs(result.returnValue as Dog[]);
        setDogsParticipating(
          walk.participants
            .filter((elem) => elem.userId === userId)
            .flatMap((elem) => elem.dogs!.map((dog) => dog.dogId))
        );
        setJoined(walk.participants.some((elem) => elem.userId === userId));
        setParticipants(walk.participants);
        setGroupWalk(walk);
      } else {
        setErrorMessage(result.returnValue);
      }
    } else {
      setErrorMessage(result.returnValue);
    }
    setIsLoading(false);
  }, []);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Group walk details",
      headerShown: true,
    });
  }, [navigation]);

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
          height: heightPercentToDP(95),
          marginTop: percentToDP(10),
          paddingTop: percentToDP(10),
          paddingHorizontal: percentToDP(5),
        }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={getData}
            colors={[useThemeColor("accent"), useThemeColor("text")]}
          />
        }
      >
        {!isLoading && groupWalk === null && (
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
        {groupWalk !== null && (
          <>
            <ThemedView
              colorName="transparent"
              style={{
                flex: 1,
                marginBottom: percentToDP(7),
              }}
            >
              <LocationMap
                locationName={groupWalk.locationName}
                initialLocation={{
                  latitude: groupWalk.latitude,
                  longitude: groupWalk.longitude,
                }}
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
            <ThemedText
              textStyleOptions={{ size: "veryBig", weight: "semibold" }}
              style={{ marginBottom: percentToDP(4) }}
            >
              {groupWalk.title}
            </ThemedText>
            <HorizontalView style={{ marginBottom: percentToDP(6) }}>
              <HorizontalView justifyOption="flex-start">
                <UserAvatar
                  userId={groupWalk?.creator.userId ?? ""}
                  size={12}
                  doLink={true}
                />
                <ThemedView>
                  <ThemedText
                    textStyleOptions={{ size: "small", weight: "bold" }}
                    style={{ marginLeft: percentToDP(1) }}
                  >
                    {groupWalk?.creator.username ?? ""}
                  </ThemedText>
                  <ThemedText
                    textStyleOptions={{ size: "tiny" }}
                    style={{ marginLeft: percentToDP(1) }}
                  >
                    {`${countToString(
                      groupWalk.creator.dogsCount ?? 0
                    )} dogs | ${countToString(
                      groupWalk.creator.friendsCount ?? 0
                    )} friends`}
                  </ThemedText>
                </ThemedView>
              </HorizontalView>
              <ThemedText
                textStyleOptions={{ size: "medium", weight: "semibold" }}
                textColorName="primary"
              >
                {new Date(groupWalk?.datetime ?? "").toLocaleDateString(
                  undefined,
                  {
                    dateStyle: "short",
                  }
                )}
                {" @ "}
                {new Date(groupWalk?.datetime ?? "").toLocaleTimeString(
                  undefined,
                  {
                    timeStyle: "short",
                  }
                )}
              </ThemedText>
            </HorizontalView>
            <ThemedText
              textStyleOptions={{ weight: "semibold" }}
              style={{ marginBottom: percentToDP(2) }}
            >
              Description
            </ThemedText>
            <ThemedText style={{ marginBottom: percentToDP(7) }}>
              {groupWalk?.description}
            </ThemedText>

            <TagList
              tags={groupWalk?.tags ?? []}
              style={{
                marginBottom: percentToDP(12),
              }}
            />

            <ThemedView style={{ marginBottom: percentToDP(8) }}>
              {groupWalk?.creator.userId !== userId &&
                groupWalk?.creator.userId !== "me" && (
                  <ThemedButton
                    label={joined ? "Joined" : "Join"}
                    iconName={joined ? "checkmark-done" : "add"}
                    iconSize={22}
                    iconOnRight
                    onPress={() => setDialogVisible(true)}
                  />
                )}
              {(groupWalk?.creator.userId === userId ||
                groupWalk?.creator.userId === "me") && (
                <ThemedButton
                  label="Edit"
                  backgroundColorName="primary"
                  iconName="pencil"
                  iconSize={22}
                  iconOnRight
                  onPress={() => router.push("./edit/" as Href<string>)}
                />
              )}
            </ThemedView>
            <ThemedView style={{ marginBottom: percentToDP(8) }}>
              <ThemedText
                textStyleOptions={{ weight: "semibold" }}
                style={{ marginBottom: percentToDP(3) }}
              >
                Partcipants
              </ThemedText>
              <TouchableOpacity
                onPress={() => {
                  setParticipantsOpen(true);
                }}
              >
                <HorizontalView>
                  <HorizontalView justifyOption="flex-start">
                    {participants.length == 0 && (
                      <ThemedText textColorName={"disabled"}>
                        No participants yet
                      </ThemedText>
                    )}
                    {participants.slice(0, 5).map((user: Participant) => (
                      <UserAvatar
                        key={user.userId}
                        userId={user.userId}
                        imageUrl={user.imageURL}
                        size={10}
                        doLink={true}
                        style={{ marginRight: percentToDP(-1) }}
                      />
                    ))}
                    {participants.length > 5 && (
                      <ThemedText style={{ marginLeft: percentToDP(3) }}>
                        {`+${(groupWalk?.participants ?? []).length - 5} more`}
                      </ThemedText>
                    )}
                  </HorizontalView>
                  <ThemedIcon
                    colorName="text"
                    name="chevron-forward-outline"
                  />
                </HorizontalView>
              </TouchableOpacity>
            </ThemedView>
            <CommentSection
              commentsData={comments}
              addComment={async (content: string) => {
                asyncAbortController.current = new AbortController();
                return addGroupWalkComment(
                  groupWalk?.id ?? "",
                  {} as CommentContent,
                  asyncAbortController.current
                );
              }}
            />
          </>
        )}
      </ThemedScrollView>
      {dialogVisible && (
        <JoinDialog
          walkId={groupWalk?.id ?? ""}
          joined={joined ?? false}
          dogs={dogs}
          dogsParticipating={dogsParticipating}
          onSave={(chosenDogs) => {
            setRefreshOnFocus(true);
          }}
          onLeave={() => {
            setRefreshOnFocus(true);
          }}
          onDismiss={() => setDialogVisible(false)}
        />
      )}
      {participantsOpen && (
        <ParticipantsDialog
          onDismiss={() => setParticipantsOpen(false)}
          participantsWithDogs={groupWalk!.participants.filter(
            (elem) => elem.userId !== groupWalk?.creator.userId
          )}
          creator={
            groupWalk!.participants.find(
              (elem) => elem.userId === groupWalk?.creator.userId
            )!
          }
        />
      )}
    </SafeAreaView>
  );
}
