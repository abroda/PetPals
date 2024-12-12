import {ActivityIndicator, Image, Text, TouchableOpacity, View} from "react-native";
import React, {useContext, useState} from "react";
import { ColorName } from "react-native-ui-lib";
import themeContext from "@react-navigation/native/src/theming/ThemeContext";
import {useWindowDimension} from "@/hooks/theme/useWindowDimension";
import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";
import UserAvatar from "@/components/navigation/UserAvatar";
import {ThemedText} from "@/components/basic/ThemedText";
import {router} from "expo-router";
import {Post} from "@/context/PostContext";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import {widthPercentageToDP} from "react-native-responsive-screen";


interface PostCardProps {
  post: Post;
}


const PostCard = React.FC<PostCardProps> = ({ post }) => {

  // Styling
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");
  const colorScheme = useColorScheme();
  const themeColors = ThemeColors[colorScheme];


  const [isImageLoading, setImageLoading] = useState(true);


  const handlePress = () => {
    router.push(`/user/${post.author.userId}/post/${post.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{
      flex: 1,
      marginVertical: percentToDP(4),

    }}>
      <View style={{
        flex: 1,
        width: percentToDP(90),
        backgroundColor: themeColors.tertiary,
        borderTopRightRadius: percentToDP(5),
        borderTopLeftRadius: percentToDP(5),
      }}>

        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: percentToDP(3),
          paddingVertical: percentToDP(2),
        }}>
          <View style={{
            backgroundColor: themeColors.transparent,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            {/* Author Avatar */}
            {post.author.imageUrl ? (
              <UserAvatar
                userId={post.author.imageUrl}
                imageUrl={post.author.imageUrl}
                doLink={true}
                size={10}
              />
            ) : (
              <ThemedText
                textColorName={"textOnSecondary"}
              >
                User Avatar Unavailable
              </ThemedText>
            )}

            {/* Author Username */}
            <ThemedText
              textColorName={"textOnSecondary"}
              style={{
                marginLeft: percentToDP(2),
              }}
            >
              {post.author.username}
            </ThemedText>

          </View>

          {/* Creation Date */}
          <ThemedText textColorName={"textOnSecondary"} textStyleOptions={{size: "tiny"}} backgroundColorName={"transparent"} style={{
            marginRight: percentToDP(1),
          }}>
            {new Date(post.createdAt).toLocaleDateString()}
          </ThemedText>
        </View>

      </View>



      {/* Post Image & Loading indicator*/}
      {post.imageUrl ? (
        <View
          style={{
            width: percentToDP(90),
            height: percentToDP(90),
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: themeColors.transparent,
          }}
        >
          {isImageLoading && <ActivityIndicator size="small" color={themeColors.primary} />}
          <Image
            source={{ uri: post.imageUrl }}
            style={{
              width: "100%",
              height: "100%",
              display: isImageLoading ? "none" : "flex",
            }}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </View>
      ) : (
        <View
          style={{
            width: percentToDP(90),
            height: percentToDP(30),
            backgroundColor: themeColors.transparent,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: themeColors.tertiary,
          }}
        >
          <ThemedText
            textColorName={"primary"}
            backgroundColorName={"transparent"}
            style={{
              textAlign: "center",
            }}
          >
            No Image
          </ThemedText>
        </View>
      )}
      {/*{post.imageUrl ? (*/}

      {/*  <Image*/}
      {/*    source={{ uri: post.imageUrl }}*/}
      {/*    style={{*/}
      {/*      width: percentToDP(90),*/}
      {/*      height: percentToDP(90),*/}
      {/*    }}*/}
      {/*    onLoadEnd={() => setImageLoading(false)}*/}
      {/*    onError={() => setImageLoading(false)}*/}
      {/*  />) : (*/}
      {/*    <View style={{*/}
      {/*      width: percentToDP(90),*/}
      {/*      height: percentToDP(30),*/}
      {/*      backgroundColor: themeColors.transparent,*/}
      {/*      justifyContent: 'center',*/}
      {/*      borderWidth: 1,*/}
      {/*      // borderTopLeftRadius: percentToDP(5),*/}
      {/*      // borderTopRightRadius: percentToDP(5),*/}
      {/*      borderColor: themeColors.tertiary,*/}
      {/*    }}>*/}
      {/*      <ThemedText*/}
      {/*        textColorName={"primary"}*/}
      {/*        backgroundColorName={"transparent"}*/}
      {/*        style={{*/}
      {/*        textAlign: 'center',*/}
      {/*        textAlignVertical: 'center'*/}
      {/*      }}>*/}
      {/*        No Image*/}
      {/*      </ThemedText>*/}
      {/*    </View>*/}

      {/*)}*/}


      <View style={{
        backgroundColor: themeColors.tertiary,
        width: percentToDP(90),
        padding: percentToDP(3),
      }}>
        {/* Post Title */}
        <ThemedText textColorName={"textOnSecondary"} backgroundColorName={"transparent"} textStyleOptions={{size: "medium", weight: 'bold'}}>
          {post.title}
        </ThemedText>

        {/* Post Description */}
        {post.description ? (
          <ThemedText
            textColorName={"textOnSecondary"}
            backgroundColorName={"transparent"}
            textStyleOptions={{size: "small"}}
            style={{
              paddingVertical: percentToDP(2),
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {post.description}
          </ThemedText>
        ) : (
          <ThemedText textColorName={"placeholderText"} backgroundColorName={"transparent"} textStyleOptions={{size: "small"}} style={{
            paddingVertical: percentToDP(2),
          }}>
            No description
          </ThemedText>
        )}
      </View>

      <View style={{
        flexDirection: 'row',
        backgroundColor: themeColors.tertiary,
        padding: percentToDP(3),
        borderBottomLeftRadius: percentToDP(5),
        borderBottomRightRadius: percentToDP(5),
      }}>
        <HorizontalView style={{}}>
          <ThemedIcon
            size={25}
            name={"heart-outline"}
            style={{ marginRight: percentToDP(1) }}
          />
          <ThemedText textColorName={"textOnSecondary"}>
            {post.likes.length} Likes
          </ThemedText>

          <ThemedIcon
            size={25}
            name={"chatbox-outline"}
            style={{ marginRight: percentToDP(1), marginLeft: percentToDP(6), }}
          />
          <ThemedText textColorName={"textOnSecondary"}>
            {post.comments.length} Comments
          </ThemedText>
        </HorizontalView>

      </View>
    </TouchableOpacity>
  );
};

export default PostCard;