import { Attribute, Sprite, ZIndex } from '@bhoos/game-kit-ui';

export class Sprite2D implements Sprite {
  x = new Attribute(0);
  y = new Attribute(0);
  rotation = new Attribute(0);
  opacity = new Attribute(1);
  zIndex: ZIndex = new ZIndex();
  scale = new Attribute(1);

  reactComponent(props?: {}): JSX.Element {
    throw new Error('Subclasses must implement reactComponent method');
  }

  protected layoutStyles() {
    const angle = this.rotation.animated.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });

    const styles = {
      transform: [
        { translateX: this.x.animated },
        { translateY: this.y.animated },
        { rotate: angle },
        { scaleX: this.scale.animated },
        { scaleY: this.scale.animated },
      ],
      position: 'absolute' as 'absolute',
      opacity: this.opacity.animated,
    };

    return styles;
  }
}
