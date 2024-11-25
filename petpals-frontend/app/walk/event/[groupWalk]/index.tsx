import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { Href, router, useNavigation, usePathname } from "expo-router";
import Comment from "@/components/display/Comment";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import CommentSection from "@/components/lists/CommentSection";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { testComments, testData, testParticipants } from "../testData";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import PetAvatar from "@/components/navigation/PetAvatar";
import { useWalks } from "@/hooks/useWalks";
import TagList from "@/components/lists/TagList";
import {
  CommentContent,
  GroupWalkTag,
  Participant,
} from "@/context/WalksContext";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { LocationMap } from "@/components/display/LocationMap";
import GroupWalkParticipationDialog from "@/components/dialogs/GroupWalkParticipationDialog";
import { useDog } from "@/context/DogContext";
import { useUser } from "@/hooks/useUser";

export default function GroupWalkScreen({ walkId }: { walkId: string }) {
  const [groupWalkInfo, setGroupWalkInfo] = useState(testData[4]);
  const [comments, setComments] = useState(testComments);
  const [participants, setParticipants] = useState(testParticipants);
  const [dogs, setDogs] = useState([
    {
      id: "1",
      name: "Alex",
      avatarURL:
        "http://images2.fanpop.com/image/photos/13800000/Cute-Dogs-dogs-13883179-2560-1931.jpg",
    } as Participant,
    {
      id: "2",
      name: "Boxer",
      avatarURL:
        "http://images2.fanpop.com/image/photos/13800000/Cute-Dogs-dogs-13883179-2560-1931.jpg",
    } as Participant,
    {
      id: "3",
      name: "Cutie",
      avatarURL:
        "http://images2.fanpop.com/image/photos/13800000/Cute-Dogs-dogs-13883179-2560-1931.jpg",
    } as Participant,
    {
      id: "4",
      name: "Anna",
      avatarURL:
        "http://images2.fanpop.com/image/photos/13800000/Cute-Dogs-dogs-13883179-2560-1931.jpg",
    } as Participant,
    {
      id: "5",
      name: "BIbi",
      avatarURL:
        "http://images2.fanpop.com/image/photos/13800000/Cute-Dogs-dogs-13883179-2560-1931.jpg",
    } as Participant,
  ]);
  const [dogsParticipating, setDogsParticipating] = useState(["4"]);
  const [joinDialogVisible, setJoinDialogVisible] = useState(false);
  const { isProcessing, getGroupWalkList, shouldRefresh, addGroupWalkComment } =
    useWalks();
  const { userId } = useAuth();
  const { getDogsByUserId } = useDog();
  const [joined, setJoined] = useState(groupWalkInfo.joinedWithPets.length > 0);

  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  const asyncAbortController = useRef<AbortController | undefined>();

  useEffect(() => {
    getData();

    return () => {
      asyncAbortController.current?.abort();
    };
  }, [shouldRefresh]);

  const getData = useCallback(async () => {
    asyncAbortController.current = new AbortController();
    let result = await getGroupWalkList(
      "all",
      [],
      asyncAbortController.current
    );

    if (result.success) {
      setGroupWalksData(result.returnValue);
    }
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
      <ThemedScrollView
        scrollEnabled={true}
        style={{
          height: heightPercentToDP(100),
          paddingTop: percentToDP(20),
          paddingHorizontal: percentToDP(5),
        }}
      >
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
        <ThemedText
          textStyleOptions={{ size: "veryBig", weight: "semibold" }}
          style={{ marginBottom: percentToDP(4) }}
        >
          {groupWalkInfo.title}
        </ThemedText>
        <HorizontalView style={{ marginBottom: percentToDP(6) }}>
          <HorizontalView justifyOption="flex-start">
            <UserAvatar
              userId={groupWalkInfo.creator.id}
              size={12}
              doLink={true}
            />
            <ThemedView>
              <ThemedText
                textStyleOptions={{ size: "small", weight: "bold" }}
                style={{ marginLeft: percentToDP(1) }}
              >
                {groupWalkInfo.creator.name}
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
            {groupWalkInfo.datetime.toLocaleTimeString(undefined, {
              timeStyle: "short",
            })}

            {" | "}
            {groupWalkInfo.datetime.toLocaleDateString(undefined, {
              dateStyle: "short",
            })}
          </ThemedText>
        </HorizontalView>
        <ThemedText
          textStyleOptions={{ weight: "semibold" }}
          style={{ marginBottom: percentToDP(2) }}
        >
          Description
        </ThemedText>
        <ThemedText style={{ marginBottom: percentToDP(7) }}>
          {groupWalkInfo.description}
        </ThemedText>

        <TagList
          tags={groupWalkInfo.tags}
          style={{ marginBottom: percentToDP(12) }}
        />

        <ThemedView style={{ marginBottom: percentToDP(8) }}>
          {groupWalkInfo.creator.id !== userId &&
            groupWalkInfo.creator.id !== "me" && (
              <ThemedButton
                label={joined ? "Joined" : "Join"}
                iconName={joined ? "checkmark-done" : "add"}
                iconSize={22}
                iconOnRight
                onPress={() => setJoinDialogVisible(true)}
              />
            )}
          {(groupWalkInfo.creator.id === userId ||
            groupWalkInfo.creator.id === "me") && (
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
              {participants.slice(0, 5).map((user) => (
                <UserAvatar
                  userId={user.id}
                  size={10}
                  doLink={true}
                  style={{ marginRight: percentToDP(-1) }}
                />
              ))}
              <ThemedText style={{ marginLeft: percentToDP(3) }}>
                {participants.length > 5
                  ? `+${participants.length - 5} more`
                  : ""}
              </ThemedText>
            </HorizontalView>
            <ThemedIcon
              colorName="text"
              name="chevron-forward-outline"
              onPress={() => {
                router.push("./participants/");
              }}
            />
          </HorizontalView>
        </ThemedView>
        <CommentSection
          commentsData={comments}
          addComment={async (content: string) => {
            asyncAbortController.current = new AbortController();
            return addGroupWalkComment(
              walkId,
              {} as CommentContent,
              asyncAbortController.current
            );
          }}
        />
      </ThemedScrollView>
      {joinDialogVisible && (
        <GroupWalkParticipationDialog
          walkId={walkId}
          joined={joined}
          dogs={dogs}
          dogsParticipating={groupWalkInfo.joinedWithPets.map(
            (elem) => elem.id
          )}
          onSave={(dogsParticipating) => {
            if (!joined) {
              setParticipants([
                { id: userId, name: "", avatarURL: "" } as Participant,
                ...participants,
              ]);
              setJoined(true);
            }
            setDogsParticipating(dogsParticipating);
          }}
          onLeave={() => {
            setJoined(false);
            setParticipants(participants.filter((elem) => elem.id !== userId));
            setDogsParticipating([]);
          }}
          onDismiss={() => setJoinDialogVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}
function setGroupWalksData(returnValue: any) {
  throw new Error("Function not implemented.");
}
