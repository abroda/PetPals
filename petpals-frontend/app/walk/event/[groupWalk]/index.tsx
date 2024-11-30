import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { Href, router, useNavigation, usePathname } from "expo-router";
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
import { useWalks } from "@/hooks/useWalks";
import TagList from "@/components/lists/TagList";
import { CommentContent, GroupWalk, Participant } from "@/context/WalksContext";
import { LocationMap } from "@/components/display/LocationMap";
import GroupWalkParticipationDialog from "@/components/dialogs/GroupWalkParticipationDialog";
import { useDog } from "@/context/DogContext";
import ThemedToast from "@/components/popups/ThemedToast";
import { RefreshControl } from "react-native-gesture-handler";

export default function GroupWalkScreen() {
  const walkId = usePathname().split("/")[3];
  const [groupWalk, setGroupWalk] = useState<GroupWalk | null>(null);

  const [joined, setJoined] = useState(
    groupWalk?.participants.some((elem) => elem.userId === userId)
  );
  const [dialogVisible, setDialogVisible] = useState(false);
  const { userId } = useAuth();
  const { getDogsByUserId } = useDog();

  const [comments, setComments] = useState([] as CommentContent[]);
  const { getGroupWalk, addGroupWalkComment } = useWalks();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const asyncAbortController = useRef<AbortController | undefined>();

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

  const getData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    asyncAbortController.current = new AbortController();

    let result = await getGroupWalk(walkId, asyncAbortController.current);

    if (result.success) {
      setGroupWalk(result.returnValue);
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
          height: heightPercentToDP(100),
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
        {!isLoading && groupWalk !== null && (
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
                    # dogs | # friends
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
              <HorizontalView>
                <HorizontalView justifyOption="flex-start">
                  {(groupWalk?.participants ?? []).length == 0 && (
                    <ThemedText textColorName={"disabled"}>
                      No participants yet
                    </ThemedText>
                  )}
                  {(groupWalk?.participants ?? [])
                    .slice(0, 5)
                    .map((user: Participant) => (
                      <UserAvatar
                        userId={user.userId}
                        imageUrl={user.imageURL}
                        size={10}
                        doLink={true}
                        style={{ marginRight: percentToDP(-1) }}
                      />
                    ))}
                  {(groupWalk?.participants ?? []).length > 5 && (
                    <ThemedText style={{ marginLeft: percentToDP(3) }}>
                      {`+${(groupWalk?.participants ?? []).length - 5} more`}
                    </ThemedText>
                  )}
                </HorizontalView>
                {(groupWalk?.participants ?? []).length > 5 && (
                  <ThemedIcon
                    colorName="text"
                    name="chevron-forward-outline"
                    onPress={() => {
                      router.push("./participants/");
                    }}
                  />
                )}
              </HorizontalView>
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
        <GroupWalkParticipationDialog
          walkId={groupWalk?.id ?? ""}
          joined={joined ?? false}
          dogs={
            [] //get user's dogs
          }
          dogsParticipating={[]}
          onSave={(dogsParticipating) => {
            if (!joined) {
              //   setParticipants([
              //     { id: userId, name: "", imageURL: "" } as Entity,
              //     ...participants,
              //   ]);
              setJoined(true);
            }
            // setDogsParticipating(dogsParticipating);
          }}
          onLeave={() => {
            setJoined(false);
            // setParticipants(participants.filter((elem) => elem.id !== userId));
            // setDogsParticipating([]);
          }}
          onDismiss={() => setDialogVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}
function setGroupWalksData(returnValue: any) {
  throw new Error("Function not implemented.");
}
