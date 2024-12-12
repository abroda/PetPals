import {Image, Text, TouchableOpacity, View} from "react-native";
import React, {useContext} from "react";
import { ColorName } from "react-native-ui-lib";
import themeContext from "@react-navigation/native/src/theming/ThemeContext";
import {useWindowDimension} from "@/hooks/theme/useWindowDimension";
import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";
import UserAvatar from "@/components/navigation/UserAvatar";
import {ThemedText} from "@/components/basic/ThemedText";
import {router} from "expo-router";

const PostCard = ({ post }) => {

  // Styling
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  // Colours
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

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
          <ThemedText textColorName={"textOnSecondary"} textStyleOptions={{size: "tiny"}}>
            {new Date(post.createdAt).toLocaleDateString()}
          </ThemedText>
        </View>

      </View>


      {/* Post Image */}
      {post.imageUrl ? (
        <Image
          source={{ uri: post.imageUrl }}
          style={{
            width: percentToDP(90),
            height: percentToDP(90),
          }}
        />) : (
          <View style={{
            width: percentToDP(90),
            height: percentToDP(90),
            backgroundColor: themeColors.transparent,
            justifyContent: 'center',
            borderWidth: 1,
            // borderTopLeftRadius: percentToDP(5),
            // borderTopRightRadius: percentToDP(5),
            borderColor: themeColors.tertiary,
          }}>
            <ThemedText
              textColorName={"primary"}
              backgroundColorName={"transparent"}
              style={{
              textAlign: 'center',
              textAlignVertical: 'center'
            }}>
              Image Unavailable
            </ThemedText>
          </View>

      )}


      <View style={{
        backgroundColor: themeColors.tertiary,
        width: percentToDP(90),
      }}>
        {/* Post Title */}
        <ThemedText textColorName={"textOnSecondary"} backgroundColorName={"tertiary"} textStyleOptions={{size: "big"}}>
          {post.title}
        </ThemedText>

        {/* Post Description */}
        {post.description ? (
          <ThemedText textColorName={"textOnSecondary"} style={{
            paddingVertical: percentToDP(2),
          }}>
            {post.description}
          </ThemedText>
        ) : (
          <ThemedText backgroundColorName={"transparent"} textColorName={"primary"} style={{
            paddingVertical: percentToDP(2),
          }}>
            Description Unavailable
          </ThemedText>
        )}
      </View>

      <View style={{
        flexDirection: 'row',
        backgroundColor: themeColors.tertiary,
      }}>

        <ThemedText textColorName={"textOnSecondary"}>
          {post.likes.length} Likes
        </ThemedText>

        <ThemedText textColorName={"textOnSecondary"}>
          {post.comments.length} Comments
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;