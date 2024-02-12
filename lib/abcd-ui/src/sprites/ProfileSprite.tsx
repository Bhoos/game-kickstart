import { Attribute, Reference, Sprite, ZIndex, setLayout } from '@bhoos/game-kit-ui';
import { getAvatarById } from '../assets/avatars';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const defaultAvatar = require('../assets/avatars/default.png');

export type ProfileSpriteProfile = {
  name: string;
  picture: string;
};

export class ProfileSprite implements Sprite {
  readonly profile: Reference<ProfileSpriteProfile>;
  readonly color: Reference<string> = new Reference<string>('blue');

  x = new Attribute(0);
  y = new Attribute(0);
  zIndex: ZIndex = new ZIndex();
  scale = new Attribute(1);

  readonly opacity: Attribute = new Attribute(1);

  constructor() {
    this.profile = new Reference<ProfileSpriteProfile>({
      name: 'default',
      picture: '0',
    });
  }

  reactComponent(props: {}): JSX.Element {
    const profile = Reference.use(this.profile);
    const image = getAvatarById(profile.picture) || defaultAvatar;
    const color = Reference.use(this.color);
    return (
      <Animated.View ref={this.zIndex.ref} {...props} style={this.layoutStyles()}>
        <View style={styles.container}>
          <Animated.Image
            source={image}
            style={[
              styles.profilePicture,
              {
                borderColor: color,
                opacity: this.opacity.animated,
              },
            ]}
          />
        </View>
        <Text style={[styles.playerName, { backgroundColor: color }]} ellipsizeMode="clip" numberOfLines={1}>
          {profile.name}
        </Text>
      </Animated.View>
    );
  }

  private layoutStyles() {
    const styles = {
      transform: [
        { translateX: this.x.animated },
        { translateY: this.y.animated },
        { scaleX: this.scale.animated },
        { scaleY: this.scale.animated },
      ],
      position: 'absolute' as 'absolute',
    };

    return styles;
  }
}

const styles = StyleSheet.create({
  playerName: {
    textAlign: 'center',
    fontWeight: 'bold',
    width: 64,
    height: 18,
    fontSize: 12,
    borderRadius: 4,
    textAlignVertical: 'center',
    paddingTop: 2,
    overflow: 'hidden',
    color: 'white',
    transform: [{ translateY: -8 }],
  },
  profilePicture: {
    height: 64,
    width: 64,
    borderRadius: 34,
    borderWidth: 4,
  },
  container: {
    width: 64,
    height: 64,
  },
});
